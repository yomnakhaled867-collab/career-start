const assert = require('node:assert/strict');
const { analyze, normalize, extractJson } = require('../api/_cv-engine');
const { improve } = require('../js/cv-local-improve');
const good = 'Email: graduate@example.com\nSummary: junior developer\nSkills: JavaScript, SQL, Git\nExperience: Developed a dashboard and increased usage by 25%\nEducation: Bachelor\nProjects: portfolio';
const arabic = 'البريد: sara@example.com\nملخص: خريجة تصميم\nمهارات: Figma، أبحاث المستخدم\nخبرة: صممت واجهة وحسنت الاستخدام بنسبة 20٪\nتعليم: بكالوريوس\nمشاريع: تطبيق حجز';
for (const sample of [good, 'bad', '', arabic]) {
  const result = analyze(sample, sample === arabic ? 'UI-UX' : 'Programming');
  assert.equal(typeof result.score, 'number'); assert.ok(result.score >= 0 && result.score <= 10);
  for (const key of ['ats_score','field_fit','summary','strengths','weaknesses','missing_skills','improvements']) assert.ok(key in result);
}
assert.equal(extractJson('```json\n{"score":8}\n```').score, 8);
assert.throws(() => extractJson('not json'));
assert.equal(normalize({ score: 100 }).score, 10);
assert.equal(improve('', 'summary', 'ar'), '');
assert.match(improve('  صممت   واجهة واجهة  للمستخدمين  ', 'experience', 'ar'), /^صممت واجهة للمستخدمين$/);
assert.match(improve('  built   built dashboard   for users ', 'experience', 'en'), /^Built dashboard for users$/);
assert.equal(improve('   Led   team  \n\n  created created  app ', 'project', 'en'), 'Led team\nCreated app');
async function invoke(handler, ip, text = good) {
  const req = { method: 'POST', headers: {'content-type':'application/json'}, body: {field:'Programming',text}, socket: {remoteAddress:ip} };
  const res = { setHeader(){}, status(n){this.statusCode=n;return this}, json(data){this.data=data;return data} };
  await handler(req,res); return res;
}
async function fallbackWhenProviderFails() {
  const handler = require('../api/analyze-cv'); const originalFetch = global.fetch, originalKey = process.env.GEMINI_API_KEY;
  try {
    delete process.env.GEMINI_API_KEY;
    const missing = await invoke(handler,'no-key');
    assert.equal(missing.statusCode,200); assert.equal(missing.data.source,'local'); assert.equal(missing.data.reason,'missing_key'); assert.equal(typeof missing.data.analysis.score,'number');
    const empty = await invoke(handler,'empty','   ');
    assert.equal(empty.statusCode,400); assert.equal(empty.data.error,'text_too_short');
    process.env.GEMINI_API_KEY = 'invalid-test-key';
    global.fetch = async () => ({ ok:false, status:429, headers:{get(){return null}} });
    const limited = await invoke(handler,'provider-429');
    assert.equal(limited.data.source,'local'); assert.equal(limited.data.reason,'provider_429');
    global.fetch = async () => ({ ok:true, status:200, json:async()=>({candidates:[{content:{parts:[{text:'not json'}]}}]}) });
    const malformed = await invoke(handler,'bad-json');
    assert.equal(malformed.data.source,'local'); assert.equal(malformed.data.reason,'bad_json');
    global.fetch = async (url, options) => {
      assert.match(url, /generativelanguage\.googleapis\.com\/v1beta\/models\/gemini-3\.5-flash-lite:generateContent$/);
      assert.equal(options.headers['x-goog-api-key'], 'invalid-test-key');
      const result = {score:8,ats_score:7,field_fit:8,summary:'تحليل خاص بهذه السيرة',strengths:['مشروع لوحة بيانات'],weaknesses:['إضافة تفاصيل أكثر'],missing_skills:['اختبار الوحدات'],improvements:['وضح أثر المشروع']};
      return {ok:true,status:200,json:async()=>({candidates:[{content:{parts:[{text:JSON.stringify(result)}]}}]})};
    };
    const success = await invoke(handler,'provider-success');
    assert.equal(success.data.source,'ai'); assert.equal(success.data.ok,true); assert.equal(success.data.analysis.summary,'تحليل خاص بهذه السيرة');
    global.fetch = async () => { const error = new Error('simulated timeout'); error.name = 'AbortError'; throw error; };
    const timeout = await invoke(handler,'timeout');
    assert.equal(timeout.data.reason,'timeout');
  } finally {
    global.fetch = originalFetch; if(originalKey===undefined) delete process.env.GEMINI_API_KEY; else process.env.GEMINI_API_KEY=originalKey;
  }
}
fallbackWhenProviderFails().then(()=>console.log('CV resilience tests passed')).catch(error=>{console.error(error);process.exitCode=1;});

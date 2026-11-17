document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cvAnalyzerForm');
  if (!form) return;
  const textInput = document.getElementById('cvTextInput'), fileInput = document.getElementById('cvFileInput');
  const button = document.getElementById('analyzeCvBtn'), message = document.getElementById('cvFormMessage'), result = document.getElementById('cvAnalysisResult');
  const count = document.getElementById('cvCharCount'); let chosenFile = null, controller = null;
  const cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'cv-cancel-button'; cancel.textContent = 'إلغاء التحليل'; cancel.hidden = true; button.after(cancel);
  const say = (value, kind = '') => { message.textContent = value; message.className = `cv-form-message ${kind}`; message.hidden = !value; };
  const escape = value => String(value || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  textInput.maxLength = 6000;
  textInput.addEventListener('input', () => { count.textContent = `${textInput.value.length} / 6000`; });
  const allowed = /\.(pdf|docx|txt)$/i;
  fileInput.accept = '.pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain';
  const uploadArea = document.getElementById('cvUploadArea'), selectedBox = document.getElementById('cvSelectedFile');
  const fileDetails = document.getElementById('cvFileDetails');
  const setFile = file => {
    if (!file) return;
    if (!allowed.test(file.name)) { chosenFile = null; say('اختر ملف PDF أو DOCX أو TXT.','error'); return; }
    if (file.size === 0 || file.size > 3 * 1024 * 1024) { chosenFile = null; say(file.size ? 'حجم الملف أكبر من 3 ميجابايت.' : 'الملف فارغ. اختر ملفاً آخر.','error'); return; }
    chosenFile = file; say('', '');
    if (selectedBox && fileDetails) { fileDetails.textContent = `${file.name} — ${(file.size / 1024).toFixed(1)} كيلوبايت`; selectedBox.hidden = false; }
  };
  fileInput.addEventListener('change', () => setFile(fileInput.files[0] || null));
  document.getElementById('cvChooseFile')?.addEventListener('click', () => fileInput.click());
  uploadArea?.addEventListener('click', event => { if (!event.target.closest('button')) fileInput.click(); });
  uploadArea?.addEventListener('keydown', event => { if (event.target === uploadArea && ['Enter',' '].includes(event.key)) { event.preventDefault(); fileInput.click(); } });
  document.getElementById('cvRemoveFile')?.addEventListener('click', () => { chosenFile = null; fileInput.value = ''; if (selectedBox) selectedBox.hidden = true; if (fileDetails) fileDetails.textContent = ''; });
  uploadArea?.addEventListener('dragover', event => { event.preventDefault(); uploadArea.classList.add('is-dragging'); });
  uploadArea?.addEventListener('dragleave', () => uploadArea.classList.remove('is-dragging'));
  uploadArea?.addEventListener('drop', event => { event.preventDefault(); uploadArea.classList.remove('is-dragging'); setFile(event.dataTransfer.files[0]); });
  const loadScript = src => new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = src; script.onload = resolve; script.onerror = reject; document.head.append(script); });
  async function extract(file) {
    if (/\.txt$/i.test(file.name)) return file.text();
    if (/\.docx$/i.test(file.name)) {
      if (!window.mammoth) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js');
      const data = await file.arrayBuffer(); return (await window.mammoth.extractRawText({ arrayBuffer: data })).value;
    }
    if (/\.pdf$/i.test(file.name)) {
      if (!window.pdfjsLib) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const doc = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise; let lines = [];
      for (let page = 1; page <= Math.min(doc.numPages, 20); page++) { const content = await (await doc.getPage(page)).getTextContent(); lines.push(content.items.map(x => x.str).join(' ')); }
      return lines.join('\n');
    }
    throw new Error('unsupported');
  }
  const local = (text, field) => {
    const lower = text.toLowerCase(), keywords = { Programming:['javascript','python','java','sql','api','github','برمجة','تطوير'], 'UI-UX':['figma','wireframe','prototype','usability','ux','ui','تصميم','واجهة'], 'Graphic Design':['photoshop','illustrator','branding','typography','design','تصميم','هوية'] }[field];
    const tests = [
      ['معلومات التواصل واضحة.', /@|\+?\d[\d\s()-]{7,}/.test(text)], ['ملخص مهني مذكور.', /summary|profile|ملخص|نبذة/i.test(text)], ['قسم المهارات موجود.', /skills|مهارات/i.test(text)],
      ['خبرة أو تدريب مع أفعال مباشرة.', /experience|خبرة|تدريب/i.test(text) && /built|led|created|developed|managed|طورت|أنشأت|أدرت|صممت/i.test(text)], ['التعليم مذكور.', /education|university|تعليم|جامعة|بكالوريوس/i.test(text)], ['مشاريع مذكورة.', /projects|project|مشروع/i.test(text)],
      ['نتائج قابلة للقياس موجودة.', /\d+\s*%|\d+\s*(users|clients|مستخدم|عميل|مشروع)|٪/.test(text)], ['لا تظهر إشارات تنسيق تعيق ATS.', !/[�□]|\|{2,}|<table/i.test(text)], ['كلمات المجال المستهدف موجودة.', keywords.some(k => lower.includes(k))], ['لا توجد كلمات مكررة أو عناوين كلها أحرف كبيرة.', !/(\b[\p{L}]{3,}\b)(?:\s+\1){2,}/iu.test(text) && !/\b[A-Z]{8,}\b/.test(text)]
    ];
    const score = tests.filter(([,ok]) => ok).length, strengths = tests.filter(([,ok]) => ok).map(([s]) => s), weaknesses = tests.filter(([,ok]) => !ok).map(([s]) => s);
    const fieldFit = keywords.filter(k => lower.includes(k)).length * 2;
    return { score, ats_score: tests.slice(0,8).filter(([,ok])=>ok).length, field_fit: Math.min(10, fieldFit), summary:`تحققت ${score} من 10 مؤشرات أساسية. هذا تحليل محلي أولي يساعدك على تحسين السيرة.`, strengths: strengths.length ? strengths : ['أضف معلومات التواصل والتعليم والمشاريع لتطوير السيرة.'], weaknesses: weaknesses.length ? weaknesses : ['لم تظهر فجوات أساسية في الفحوصات الأولية.'], missing_skills: keywords.filter(k=>!lower.includes(k)).slice(0,5), improvements: weaknesses.map(s=>`راجع: ${s}`).slice(0,6) };
  };
  const render = (data, source) => {
    const fields = [['نقاط القوة','strengths'],['نقاط تحتاج إلى تحسين','weaknesses'],['مهارات لإبرازها','missing_skills'],['خطوات مقترحة','improvements']];
    result.innerHTML = `<p class="cv-source-badge">${source === 'ai' ? 'AI' : 'تحليل ذكي محلي'}</p><h3>نتيجة التقييم: ${Number(data.score).toFixed(1)}/10</h3><p>${escape(data.summary)}</p><p>ملاءمة ATS: ${Number(data.ats_score).toFixed(1)}/10 · توافق المجال: ${Number(data.field_fit).toFixed(1)}/10</p><div class="cv-result-grid">${fields.map(([title,key])=>`<article class="cv-result-card"><h4>${title}</h4><ul>${(data[key]||[]).map(item=>`<li>${escape(item)}</li>`).join('')}</ul></article>`).join('')}</div>`;
    result.hidden = false;
  };
  const cacheKey = 'careerStartCvAnalysis';
  //try { const cached = JSON.parse(localStorage.getItem(cacheKey)); if (cached?.data) render(cached.data, cached.source); } catch (_) { /* storage may be disabled */ }
  cancel.addEventListener('click', () => controller?.abort());
  form.addEventListener('submit', async event => {
    event.preventDefault(); let cv = textInput.value.trim();
    if (!cv && chosenFile) { if (chosenFile.size > 3 * 1024 * 1024) return say('حجم الملف أكبر من 3 ميجابايت.', 'error'); if (!allowed.test(chosenFile.name)) return say('اختر ملف PDF أو DOCX أو TXT.', 'error'); say('جارٍ استخراج النص من الملف…','loading'); try { cv = (await extract(chosenFile)).trim(); } catch (_) { return say('تعذر استخراج النص. الصق محتوى السيرة في الحقل وحاول مجدداً.','error'); } }
    if (cv.length < 40) return say('أضف نصاً أطول (40 حرفاً على الأقل) أو اختر ملفاً يحتوي على نص.','error');
    if (cv.length > 6000) return say('النص طويل جداً. اختصره إلى 6,000 حرف.','error');
    const field = document.getElementById('cvTargetField').value; button.disabled = true; cancel.hidden = false; result.hidden = true; form.classList.add('is-loading'); say('جارٍ تحليل السيرة الذاتية…','loading');
    controller = new AbortController();
    try {
      const apiPath = location.pathname.includes('/pages/') ? '../api/analyze-cv' : 'api/analyze-cv';
      const response = await fetch(apiPath, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ field, text:cv }), signal:controller.signal });
      const payload = await response.json(); if (!response.ok || !payload.ok || !payload.analysis || !['ai', 'local'].includes(payload.source)) throw new Error('invalid response');
      render(payload.analysis, payload.source); try { localStorage.setItem(cacheKey, JSON.stringify({ data:payload.analysis, source:payload.source })); } catch (_) { }
      if (payload.source === 'local') say('خدمة AI غير متاحة الآن: عُرض التحليل الذكي المحلي', 'success');
      else say('اكتمل التحليل بالذكاء الاصطناعي.', 'success');
    } catch (_) {
      if (controller.signal.aborted) { say('أُلغي التحليل. يمكنك المحاولة مرة أخرى.'); return; }
      const data = local(cv, field); render(data, 'local'); try { localStorage.setItem(cacheKey, JSON.stringify({data,source:'local'})); } catch (_) { }
      say('تعذر الاتصال بالخدمة؛ أُنجز التحليل محلياً على جهازك.','success');
    } finally { controller = null; button.disabled = false; cancel.hidden = true; form.classList.remove('is-loading'); }
  });
});

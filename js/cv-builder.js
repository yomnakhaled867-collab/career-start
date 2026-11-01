(() => {
  'use strict';
  const STORAGE_KEY = 'careerStartCvBuilderV1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const form = $('#cvForm');
  const preview = $('#cvPreview');
  const errorBox = $('#formError');
  const labels = {
    ar: {sections:{personal:'المعلومات الشخصية',summary:'الملخص المهني',education:'التعليم',experience:'الخبرة والتدريب والتطوع',projects:'المشاريع',skills:'المهارات',languages:'اللغات',certificates:'الدورات والشهادات'},name:'الاسم الكامل',jobTitle:'المسمى الوظيفي',email:'البريد الإلكتروني',phone:'الهاتف',city:'المدينة / المحافظة',linkedin:'LinkedIn',portfolio:'GitHub / Behance / رابط الأعمال',technical:'مهارات تقنية',soft:'مهارات شخصية',university:'الجامعة',degree:'الدرجة العلمية',field:'التخصص',years:'السنوات',gpa:'المعدل (اختياري)',role:'المسمى / الدور',company:'الجهة',dates:'التواريخ',description:'نقاط الإنجاز (كل نقطة في سطر)',projectName:'اسم المشروع',tech:'التقنيات المستخدمة',link:'رابط المشروع',language:'اللغة',level:'المستوى',course:'اسم الدورة / الشهادة',issuer:'الجهة المانحة',remove:'حذف',empty:'أضف بياناتك لعرض هذا القسم.',evalError:'أدخل الاسم والمسمى الوظيفي وبريداً إلكترونياً صحيحاً أولاً.'},
    en: {sections:{personal:'Personal information',summary:'Professional Summary',education:'Education',experience:'Experience, Internships & Volunteering',projects:'Projects',skills:'Skills',languages:'Languages',certificates:'Courses & Certificates'},name:'Full name',jobTitle:'Job title',email:'Email',phone:'Phone',city:'City / Governorate',linkedin:'LinkedIn',portfolio:'GitHub / Behance / Portfolio',technical:'Technical skills',soft:'Soft skills',university:'University',degree:'Degree',field:'Field of study',years:'Years',gpa:'GPA (optional)',role:'Role / Title',company:'Organization',dates:'Dates',description:'Achievement bullets (one per line)',projectName:'Project name',tech:'Technologies',link:'Project link',language:'Language',level:'Proficiency',course:'Course / certificate',issuer:'Issuer',remove:'Remove',empty:'Add details to show this section.',evalError:'Enter your name, job title, and a valid email first.'}
  };
  const schemas = {
    education:[['university','text'],['degree','text'],['field','text'],['years','text'],['gpa','text']],
    experience:[['role','text'],['company','text'],['dates','text'],['description','textarea']],
    projects:[['projectName','text'],['description','textarea'],['tech','text'],['link','url']],
    languages:[['language','text'],['level','text']],
    certificates:[['course','text'],['issuer','text'],['years','text']]
  };
  const lists = Object.fromEntries(Object.keys(schemas).map(key => [key, document.getElementById(`${key}List`)]));
  let state = {language:'ar',template:'modern',personal:{},summary:'',technicalSkills:'',softSkills:'',education:[],experience:[],projects:[],languages:[],certificates:[]};
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeUrl = value => { try { const url = new URL(value); return ['http:','https:','mailto:','tel:'].includes(url.protocol) ? url.href : ''; } catch (_) { return ''; } };
  const splitTags = value => String(value || '').split(/[,،\n]/).map(item => item.trim()).filter(Boolean);
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* Storage may be disabled or full. */ } }
  function readForm() {
    state.language = $('#languageSelect').value; state.template = $('#templateSelect').value;
    state.personal = Object.fromEntries(['name','jobTitle','email','phone','city','linkedin','portfolio'].map(key => [key, form.elements[key].value.trim()]));
    state.summary = $('#summary').value.trim(); state.technicalSkills = $('#technicalSkills').value; state.softSkills = $('#softSkills').value;
    for (const key of Object.keys(schemas)) state[key] = $$('.repeat-entry', lists[key]).map(card => Object.fromEntries($$('[data-field]', card).map(input => [input.dataset.field, input.value.trim()])));
  }
  function renderList(key, entries = []) {
    const container = lists[key], words = labels[state.language];
    container.replaceChildren();
    entries.forEach(entry => {
      const card = document.createElement('div'); card.className = 'repeat-entry';
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'remove-button'; remove.textContent = `× ${words.remove}`; remove.addEventListener('click', () => { card.remove(); changed(); }); card.append(remove);
      const grid = document.createElement('div'); grid.className = 'repeat-grid';
      schemas[key].forEach(([field, type]) => {
        const label = document.createElement('label'); label.textContent = words[field]; if (field === 'description') label.classList.add('wide');
        const input = document.createElement(type === 'textarea' ? 'textarea' : 'input'); if (type !== 'textarea') input.type = type; input.dataset.field = field;
        input.value = entry[field] || ''; if (type === 'textarea') input.rows = 3; input.addEventListener('input', changed); label.append(input); grid.append(label);
      });
      card.append(grid);
      if (key === 'experience' || key === 'projects') {
        const row = document.createElement('div'); row.className = 'ai-row'; const button = document.createElement('button'); button.type='button'; button.className='button ai-button'; button.textContent=state.language==='ar'?'حسّن باستخدام AI':'Improve with AI'; button.addEventListener('click', () => improve(button, key, card)); const status=document.createElement('span');status.className='status';status.setAttribute('role','status');row.append(button,status);card.append(row);
        const suggestion=document.createElement('div');suggestion.className='suggestion';suggestion.hidden=true;card.append(suggestion);
      }
      container.append(card);
    });
  }
  function block(title, inner) { return inner ? `<section class="cv-block"><h2>${esc(title)}</h2>${inner}</section>` : ''; }
  function entry(title, meta, body) { return `<article class="cv-entry"><div class="cv-entry-heading"><span>${esc(title)}</span><span class="cv-entry-meta">${esc(meta)}</span></div>${body || ''}</article>`; }
  function renderPreview() {
    const w=labels[state.language], p=state.personal; preview.dir=state.language==='ar'?'rtl':'ltr'; preview.lang=state.language; preview.className=`cv-paper ${state.template}`;
    const contact = [p.email,p.phone,p.city,p.linkedin,p.portfolio].filter(Boolean).map(value => { const href=safeUrl(value) || (value.includes('@') ? `mailto:${value}` : ''); return href?`<a href="${esc(href)}">${esc(value)}</a>`:esc(value); }).join('<span aria-hidden="true">•</span>');
    const education=state.education.map(item=>entry(item.university, [item.degree,item.field,item.years,item.gpa&&`GPA: ${item.gpa}`].filter(Boolean).join(' · '), '')).join('');
    const experience=state.experience.map(item=>entry(item.role,item.company&&`${item.company}${item.dates?` · ${item.dates}`:''}`, item.description?`<ul>${item.description.split(/\n+/).filter(Boolean).map(line=>`<li>${esc(line.replace(/^[-•]\s*/,''))}</li>`).join('')}</ul>`:'')).join('');
    const projects=state.projects.map(item=>{const link=safeUrl(item.link);return entry(item.projectName,item.tech,`${item.description?`<p>${esc(item.description)}</p>`:''}${link?`<p><a href="${esc(link)}">${esc(item.link)}</a></p>`:''}`)}).join('');
    const lang=state.languages.map(item=>entry(item.language,item.level,'')).join('');
    const cert=state.certificates.map(item=>entry(item.course,[item.issuer,item.years].filter(Boolean).join(' · '),'')).join('');
    const skills=[...(splitTags(state.technicalSkills).length?[[w.technical,splitTags(state.technicalSkills)]]:[]),...(splitTags(state.softSkills).length?[[w.soft,splitTags(state.softSkills)]]:[])].map(([title,items])=>`<p class="skill-line"><strong>${esc(title)}:</strong> ${items.map(esc).join(' · ')}</p>`).join('');
    preview.innerHTML=`<header><h1>${esc(p.name|| (state.language==='ar'?'اسمك الكامل':'Your Full Name'))}</h1><p class="cv-job">${esc(p.jobTitle||'')}</p><div class="cv-contact">${contact}</div></header>${block(w.sections.summary,state.summary?`<p>${esc(state.summary)}</p>`:'')}${block(w.sections.experience,experience)}${block(w.sections.projects,projects)}${block(w.sections.education,education)}${block(w.sections.skills,skills)}${block(w.sections.languages,lang)}${block(w.sections.certificates,cert)}`;
  }
  function changed() { readForm(); renderPreview(); save(); }
  function applyState(next) {
    state={...state,...next,personal:{...(next.personal||{})}}; $('#languageSelect').value=state.language;$('#templateSelect').value=state.template;
    for(const key of ['name','jobTitle','email','phone','city','linkedin','portfolio']) form.elements[key].value=state.personal[key]||'';
    $('#summary').value=state.summary||'';$('#technicalSkills').value=state.technicalSkills||'';$('#softSkills').value=state.softSkills||'';
    for(const key of Object.keys(schemas)) renderList(key,state[key]||[]);
    translate();renderPreview();
  }
  function translate() {
    const w=labels[state.language];document.documentElement.lang=state.language;document.documentElement.dir=state.language==='ar'?'rtl':'ltr';
    $$('[data-section]').forEach(node=>node.textContent=w.sections[node.dataset.section]);$$('[data-label]').forEach(node=>{const input=$('input',node);if(input)node.childNodes[0].textContent=w[node.dataset.label];});
  }
  async function improve(button, section, card) {
    const words=labels[state.language], status=$('.status',button.parentElement), suggestion=section==='summary'?$('#summarySuggestion'):$('.suggestion',card); const text=section==='summary'?$('#summary').value.trim():$('[data-field="description"]',card).value.trim(); const apiSection=section==='projects'?'project':section;
    if(!text){status.textContent=state.language==='ar'?'أضف نصاً أولاً لتحسينه.':'Add some text to improve first.';return;}
    button.disabled=true;status.textContent=state.language==='ar'?'جارٍ إعداد الاقتراح…':'Generating suggestion…';
    try { const response=await fetch('../api/improve-cv',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({section:apiSection,text,jobTitle:state.personal.jobTitle||'',language:state.language})});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'Could not improve this text.');
      const improved=Array.isArray(data.improved)?data.improved.join('\n'):data.improved;if(typeof improved!=='string'||!improved.trim())throw new Error('The suggestion was empty.');
      suggestion.replaceChildren();const copy=document.createElement('div');copy.textContent=improved;suggestion.append(copy);const actions=document.createElement('div');actions.className='suggestion-actions';for(const [text,accept] of [[state.language==='ar'?'قبول':'Accept',true],[state.language==='ar'?'رفض':'Reject',false]]){const action=document.createElement('button');action.type='button';action.className=`button ${accept?'primary':'secondary'}`;action.textContent=text;action.addEventListener('click',()=>{if(accept){if(section==='summary')$('#summary').value=improved;else $('[data-field="description"]',card).value=improved;changed();}suggestion.hidden=true;});actions.append(action);}suggestion.append(actions);suggestion.hidden=false;status.textContent='';
    } catch(error){status.textContent=error.message|| (state.language==='ar'?'تعذر التحسين الآن. حاول مجدداً.':'Could not improve this text. Try again.');} finally{button.disabled=false;}
  }
  $('#summary').addEventListener('input',changed);$('#technicalSkills').addEventListener('input',changed);$('#softSkills').addEventListener('input',changed);form.addEventListener('input',event=>{if(event.target.matches('input[name],input[type="email"]'))changed();});
  $('#languageSelect').addEventListener('change',()=>{readForm();for(const key of Object.keys(schemas))renderList(key,state[key]);translate();renderPreview();save();});$('#templateSelect').addEventListener('change',changed);
  $$('[data-add]').forEach(button=>button.addEventListener('click',()=>{readForm();state[button.dataset.add].push({});renderList(button.dataset.add,state[button.dataset.add]);renderPreview();save();}));
  $$('[data-ai="summary"]').forEach(button=>button.addEventListener('click',()=>improve(button,'summary')));
  $('#printBtn').addEventListener('click',()=>window.print());
  $('#evaluateBtn').addEventListener('click',()=>{readForm();const p=state.personal;if(!p.name||!p.jobTitle||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)){errorBox.textContent=labels[state.language].evalError;errorBox.hidden=false;form.elements[!p.name?'name':!p.jobTitle?'jobTitle':'email'].focus();return;}errorBox.hidden=true;const text=$('#cvPreview').innerText.trim();if(text.length>6000){errorBox.textContent=state.language==='ar'?'اختصر السيرة إلى 6000 حرف قبل التقييم.':'Shorten the CV to 6000 characters before evaluation.';errorBox.hidden=false;return;}try{sessionStorage.setItem('careerStartBuilderCv',text);location.href='../index.html#cv-builder';}catch(_){errorBox.textContent=state.language==='ar'?'تعذر نقل النص. انسخه إلى مقيّم السيرة يدوياً.':'Could not transfer the CV. Copy it into the analyzer manually.';errorBox.hidden=false;}});
  $('#clearBtn').addEventListener('click',()=>{if(!window.confirm(state.language==='ar'?'هل تريد مسح كل البيانات المحفوظة؟':'Clear all saved CV data?'))return;try{localStorage.removeItem(STORAGE_KEY);}catch(_){}applyState({language:'ar',template:'modern',personal:{},summary:'',technicalSkills:'',softSkills:'',education:[],experience:[],projects:[],languages:[],certificates:[]});});
  $('#sampleBtn').addEventListener('click',()=>{const ar=state.language==='ar';applyState({language:state.language,template:state.template,personal:ar?{name:'مريم أحمد حسن',jobTitle:'مصممة UI/UX مبتدئة',email:'maryam.hassan@example.com',phone:'+20 10 1234 5678',city:'القاهرة، مصر',linkedin:'https://linkedin.com/in/maryamhassan',portfolio:'https://behance.net/maryamhassan'}:{name:'Maryam Ahmed Hassan',jobTitle:'Junior UI/UX Designer',email:'maryam.hassan@example.com',phone:'+20 10 1234 5678',city:'Cairo, Egypt',linkedin:'https://linkedin.com/in/maryamhassan',portfolio:'https://behance.net/maryamhassan'},summary:ar?'مصممة واجهات وتجارب مستخدم حديثة التخرج، أستمتع بتحويل احتياجات المستخدمين إلى تجارب رقمية واضحة وسهلة. أنجزت مشاريع أكاديمية وتطوعية باستخدام البحث والتصميم التفاعلي والنماذج الأولية.':'Recent UI/UX design graduate who turns user needs into clear, accessible digital experiences. Built academic and volunteer projects using user research, interaction design, and rapid prototyping.',technicalSkills:ar?'Figma، تصميم واجهات، نماذج أولية، أبحاث المستخدم':'Figma, UI design, Prototyping, User research',softSkills:ar?'التواصل، العمل الجماعي، حل المشكلات':'Communication, Teamwork, Problem solving',education:[{university:ar?'جامعة القاهرة':'Cairo University',degree:ar?'بكالوريوس':'BSc',field:ar?'نظم المعلومات':'Information Systems',years:'2022 – 2026',gpa:ar?'3.6 / 4':'3.6 / 4'}],experience:[{role:ar?'متدربة تصميم تجربة المستخدم':'UX Design Intern',company:ar?'ستوديو ديجيتال':'Digital Studio',dates:ar?'يونيو – أغسطس 2025':'Jun – Aug 2025',description:ar?'أجريت مقابلات مع 8 مستخدمين لتحديد نقاط الاحتكاك.\nصممت نموذجاً أولياً تفاعلياً للوحة متابعة ساعد الفريق على اختبار 3 مسارات أساسية.':'Interviewed 8 users to identify key friction points.\nDesigned an interactive dashboard prototype that helped the team test 3 core user flows.'}],projects:[{projectName:ar?'رفيق — تطبيق متابعة الدراسة':'Rafiq — Study Planner App',description:ar?'تطبيق جوال يساعد الطلاب على تنظيم جلسات المذاكرة ومتابعة تقدمهم الأسبوعي.':'A mobile app concept that helps students plan study sessions and track weekly progress.',tech:'Figma, FigJam',link:'https://behance.net'}],languages:[{language:ar?'العربية':'Arabic',level:ar?'اللغة الأم':'Native'},{language:ar?'الإنجليزية':'English',level:ar?'متقدم':'Advanced'}],certificates:[{course:ar?'مبادئ تصميم تجربة المستخدم':'Google UX Design Foundations',issuer:ar?'Coursera':'Coursera',years:'2025'}]});});
  try{const saved=localStorage.getItem(STORAGE_KEY);if(saved)applyState(JSON.parse(saved));else applyState(state);}catch(_){applyState(state);}
})();

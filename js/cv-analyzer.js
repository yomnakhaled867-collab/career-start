// Local CV review: runs in the browser and does not upload CV content.
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('cvAnalyzerForm');
    if (!form) return;

    const cvInput = document.getElementById('cvTextInput');
    const targetInput = document.getElementById('cvTargetField');
    const count = document.getElementById('cvCharCount');
    const button = document.getElementById('analyzeCvBtn');
    const message = document.getElementById('cvFormMessage');
    const result = document.getElementById('cvAnalysisResult');
    const cvFileInput = document.getElementById('cvFileInput');
    const maxChars = 6000;
    const builderHref = location.pathname.includes('/pages/') ? 'cv-builder.html' : 'pages/cv-builder.html';

    // Keep the existing builder hand-off, when browser storage is available.
    try {
        const builderCv = sessionStorage.getItem('careerStartBuilderCv');
        if (builderCv) {
            cvInput.value = builderCv;
            sessionStorage.removeItem('careerStartBuilderCv');
        }
    } catch (_) { /* Storage may be unavailable in private browsing. */ }
    count.textContent = `${cvInput.value.length} / ${maxChars}`;

    const showMessage = (text, kind) => {
        message.textContent = text;
        message.className = `cv-form-message ${kind || ''}`;
        message.hidden = !text;
    };
    cvInput.addEventListener('input', () => { count.textContent = `${cvInput.value.length} / ${maxChars}`; });

    const normalize = text => text.toLowerCase()
        .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
        .replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي')
        .replace(/[^\p{L}\p{N}+#.]/gu, ' ').replace(/\s+/g, ' ').trim();
    const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    const hasAny = (text, terms) => terms.some(term => text.includes(normalize(term)));
    const words = text => text.split(/\s+/).filter(Boolean);

    const fieldInfo = {
        programming: {
            label: 'البرمجة', skills: ['javascript', 'typescript', 'python', 'java', 'c++', 'html', 'css', 'react', 'node', 'sql', 'git', 'api', 'اختبار', 'برمجة'],
            missing: ['Git وGitHub', 'اختبارات آلية', 'توثيق وروابط المشاريع'],
            terms: ['مشروع', 'github', 'git', 'api', 'database', 'قاعدة بيانات', 'اختبار']
        },
        uiux: {
            label: 'تصميم UI/UX', skills: ['figma', 'adobe xd', 'wireframe', 'prototype', 'user research', 'usability', 'ui', 'ux', 'تصميم', 'تجربة المستخدم'],
            missing: ['بحث المستخدمين', 'اختبار قابلية الاستخدام', 'دراسات حالة للتصميم'],
            terms: ['figma', 'prototype', 'wireframe', 'user', 'مستخدم', 'case study', 'دراسة حالة']
        },
        graphic: {
            label: 'التصميم الجرافيكي', skills: ['photoshop', 'illustrator', 'indesign', 'branding', 'typography', 'هوية بصرية', 'فوتوشوب', 'اليستريتور', 'تصميم جرافيك'],
            missing: ['ملف أعمال متنوع', 'شرح قرارات التصميم', 'أساسيات الطباعة والألوان'],
            terms: ['portfolio', 'ملف اعمال', 'هوية', 'branding', 'illustrator', 'photoshop', 'حملة']
        }
    };
    const sectionTerms = {
        contact: ['email', 'البريد', 'هاتف', 'phone', 'linkedin', 'github', 'contact'],
        education: ['education', 'التعليم', 'بكالوريوس', 'جامعة', 'كلية', 'graduation', 'gpa'],
        experience: ['experience', 'خبرة', 'تدريب', 'intern', 'عمل', 'وظيفة', 'employment'],
        projects: ['projects', 'مشاريع', 'project', 'مشروع', 'portfolio', 'اعمال'],
        skills: ['skills', 'مهارات', 'technologies', 'الأدوات', 'tools']
    };

    function evaluate(raw, fieldKey) {
        const text = normalize(raw);
        const info = fieldInfo[fieldKey] || fieldInfo.programming;
        const sections = Object.fromEntries(Object.entries(sectionTerms).map(([key, terms]) => [key, hasAny(text, terms)]));
        const skillMatches = info.skills.filter(skill => text.includes(normalize(skill)));
        const wordCount = words(text).length;
        const numbers = (raw.match(/\b\d+(?:[.,]\d+)?%?\b/g) || []).length;
        const actionTerms = ['built', 'created', 'developed', 'designed', 'improved', 'managed', 'نفذت', 'طورت', 'صممت', 'انشأت', 'قدت', 'حسنت'];
        const actionCount = actionTerms.filter(term => text.includes(normalize(term))).length;
        const presentSections = Object.values(sections).filter(Boolean).length;
        const fieldMatches = info.terms.filter(term => text.includes(normalize(term))).length;

        const score = Math.max(1, Math.min(10, Math.round((
            Math.min(wordCount / 260, 1) * 1.5 +
            (presentSections / 5) * 2.5 +
            Math.min(skillMatches.length / 5, 1) * 2 +
            Math.min(numbers / 3, 1) * 1.5 +
            Math.min(actionCount / 3, 1) * 1.25 +
            Math.min(fieldMatches / 4, 1) * 1.25
        ) * 10) / 10));
        const ats = Math.max(1, Math.min(10, Math.round((
            (sections.contact ? 2 : 0) + (sections.education ? 1.5 : 0) +
            (sections.experience ? 1.5 : 0) + (sections.projects ? 1.5 : 0) +
            (sections.skills ? 1.5 : 0) + (wordCount >= 80 && wordCount <= 900 ? 1 : 0) +
            (numbers ? 1 : 0)
        ) * 10) / 10));
        const fieldFit = Math.max(1, Math.min(10, Math.round((Math.min(fieldMatches / 4, 1) * 6 + Math.min(skillMatches.length / 4, 1) * 4) * 10) / 10));

        const strengths = [];
        if (sections.education) strengths.push('معلومات التعليم واضحة وموجودة في السيرة.');
        if (sections.projects) strengths.push('ذكرت مشاريع يمكن استخدامها لإظهار خبرتك العملية.');
        if (skillMatches.length) strengths.push(`ظهرت مهارات مرتبطة بـ${info.label}: ${skillMatches.slice(0, 5).join('، ')}.`);
        if (numbers) strengths.push('توجد أرقام أو نتائج قابلة للقياس في النص.');
        if (actionCount) strengths.push('استخدمت أفعالاً تصف ما أنجزته أو نفذته.');
        if (!strengths.length) strengths.push('أدخلت نص السيرة، ويمكن تحسين النتيجة بإضافة أقسام ومهارات محددة.');

        const weaknesses = [];
        if (!sections.contact) weaknesses.push('أضف وسيلة تواصل مهنية مثل البريد الإلكتروني أو LinkedIn.');
        if (!sections.education) weaknesses.push('أضف قسم التعليم والدرجة العلمية وسنة التخرج.');
        if (!sections.experience) weaknesses.push('أضف الخبرات أو التدريب، حتى لو كانت خبرة تطوعية أو جامعية.');
        if (!sections.projects) weaknesses.push('أضف مشاريعك ودورك المحدد في كل مشروع.');
        if (!numbers) weaknesses.push('ادعم إنجازاتك بنتائج أو أرقام حقيقية حيثما أمكن.');
        if (wordCount < 80) weaknesses.push('النص قصير؛ أضف تفاصيل كافية عن التعليم والمهارات والمشاريع.');
        if (wordCount > 900) weaknesses.push('النص طويل؛ اختصر التكرار واحتفظ بالمعلومات المرتبطة بالوظيفة.');

        const missingSkills = info.missing.filter(skill => !text.includes(normalize(skill.split(' و')[0]))).slice(0, 3);
        const improvements = [
            'خصص الملخص والمهارات لتناسب الوظيفة المستهدفة، مع الالتزام بمعلوماتك الحقيقية.',
            'اكتب نقاط الخبرة بصيغة: فعل واضح + ما أنجزته + نتيجة أو أثر إن توفر.',
            `أضف أمثلة عملية مرتبطة بمجال ${info.label} وروابطها إن كانت متاحة.`
        ];
        return {
            score, ats_score: ats, field_fit: fieldFit,
            summary: `تقييم محلي إرشادي لسيرة تستهدف ${info.label}. الدرجة مبنية على طول النص، والأقسام، والمهارات والكلمات المفتاحية الظاهرة؛ راجع النقاط المقترحة وعدّل سيرتك وفق خبرتك الفعلية.`,
            strengths, weaknesses, missing_skills: missingSkills.length ? missingSkills : info.missing.slice(0, 2), improvements
        };
    }

    const listCard = (title, entries, icon) => `<article class="cv-result-card"><h4><span>${icon}</span>${title}</h4>${entries.length ? `<ul>${entries.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '<p class="cv-empty-list">لا توجد نقاط محددة.</p>'}</article>`;
    const renderResult = data => {
        const score = data.score;
        const pct = Math.round(score * 10);
        const meter = (label, value) => `<div class="cv-score-meter"><div><span>${label}</span><strong>${value}/10</strong></div><div class="cv-meter-track"><span style="width:${value * 10}%"></span></div></div>`;
        result.innerHTML = `<div class="cv-mock-banner" role="status">تقييم محلي إرشادي: يعمل على هذا الجهاز فقط، ولا يرسل نص سيرتك إلى أي خادم.</div><div class="cv-result-top"><div><span class="cv-eyebrow">نتيجة المراجعة</span><h3>ملخص سيرتك الذاتية</h3><p>${escapeHtml(data.summary)}</p></div><div class="cv-score" role="img" aria-label="التقييم ${score} من 10" style="--score:${pct}%"><strong>${score}<small>/10</small></strong></div></div><div class="cv-score-meters">${meter('توافق السيرة مع المجال', data.field_fit)}${meter('وضوح الأقسام لـ ATS', data.ats_score)}</div><div class="cv-result-grid">${listCard('نقاط القوة', data.strengths, '✦')}${listCard('نقاط تحتاج إلى تحسين', data.weaknesses, '↗')}${listCard('مهارات أو أدلة ناقصة', data.missing_skills, '＋')}${listCard('خطوات مقترحة', data.improvements, '✓')}</div><a class="cv-build-link" href="${builderHref}">أنشئ سيرة محسّنة ←</a>`;
        result.hidden = false;
    };

    // Local analysis needs selectable text; browsers do not provide PDF/image OCR without a library or API.
    if (cvFileInput) cvFileInput.addEventListener('change', () => {
        if (cvFileInput.files.length) showMessage('التحليل المحلي لا يقرأ PDF أو الصور تلقائياً. انسخ نص السيرة والصقه في المربع لتحليله.', 'error');
    });
    form.addEventListener('submit', event => {
        event.preventDefault();
        const cvText = cvInput.value.trim();
        if (!cvText) { showMessage('الصق نص السيرة الذاتية أولاً. التحليل المحلي يحتاج إلى نص قابل للقراءة.', 'error'); cvInput.focus(); return; }
        if (cvText.length > maxChars) { showMessage(`الحد الأقصى ${maxChars} حرف. اختصر النص ثم أعد المحاولة.`, 'error'); return; }
        showMessage('جارٍ مراجعة السيرة على جهازك…', 'loading');
        result.hidden = true;
        button.disabled = true;
        form.classList.add('is-loading');
        // Let the loading state paint before the quick local calculation.
        window.setTimeout(() => {
            try {
                renderResult(evaluate(cvText, targetInput.value));
                showMessage('اكتملت المراجعة. النتيجة إرشادية وتعتمد على الكلمات الموجودة في النص.', 'success');
            } catch (_) {
                showMessage('تعذر تحليل النص. راجع محتوى السيرة وحاول مرة أخرى.', 'error');
            } finally {
                button.disabled = false;
                form.classList.remove('is-loading');
            }
        }, 80);
    });
});

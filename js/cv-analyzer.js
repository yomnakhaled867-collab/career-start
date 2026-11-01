// أداة توليد ملخص الـ CV
document.addEventListener('DOMContentLoaded', function () {
    const generateSummaryBtn = document.getElementById('generateSummaryBtn');
    const cvSkillInput = document.getElementById('cvSkillInput');
    const cvSummaryResult = document.getElementById('cvSummaryResult');

    if (generateSummaryBtn) {
        generateSummaryBtn.addEventListener('click', function () {
            const skillText = cvSkillInput.value.trim();

            if (skillText === "") {
                alert("يرجى كتابة تخصصك أو مهاراتك أولاً!");
                return;
            }

            // نص تجريبي احترافي يتم توليده
            const generatedText = `خريج حديث طموح يمتلك شغفاً كبيراً بمجال (${skillText}). يسعى لاستغلال مهاراته الأكاديمية والتطبيقية في بناء مشاريع مبتكرة وتقديم قيمة مضافة للفريق، مع الحرص المستمر على التعلم والتطور المهني.`;

            cvSummaryResult.innerText = generatedText;
            cvSummaryResult.style.display = 'block';
        });
    }
});
// مقيّم السيرة الذاتية
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('cvAnalyzerForm');
    if (!form) return;

    const cvInput = document.getElementById('cvTextInput');
    const fileInput = document.getElementById('cvFileInput');
    const uploadArea = document.getElementById('cvUploadArea');
    const selectedFile = document.getElementById('cvSelectedFile');
    const fileDetails = document.getElementById('cvFileDetails');
    let selectedUpload = null;
    const targetInput = document.getElementById('cvTargetField');
    const count = document.getElementById('cvCharCount');
    const button = document.getElementById('analyzeCvBtn');
    const message = document.getElementById('cvFormMessage');
    const result = document.getElementById('cvAnalysisResult');

    try {
        const builderCv = sessionStorage.getItem('careerStartBuilderCv');
        if (builderCv) {
            cvInput.value = builderCv;
            count.textContent = `${builderCv.length} / 6000`;
            sessionStorage.removeItem('careerStartBuilderCv');
        }
    } catch (_) { /* Storage may be unavailable in private browsing. */ }

    const showMessage = (text, kind) => {
        message.textContent = text;
        message.className = `cv-form-message ${kind || ''}`;
        message.hidden = !text;
    };
    cvInput.addEventListener('input', () => { count.textContent = `${cvInput.value.length} / 6000`; });

    const maxFileBytes = 3 * 1024 * 1024;
    const allowedTypes = new Set(['application/pdf', 'image/png', 'image/jpeg']);
    const allowedExtensions = /\.(pdf|png|jpe?g)$/i;
    const mimeFromName = name => name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
    const chooseFile = () => fileInput.click();
    const setFile = file => {
        if (!file) return;
        const extensionIsAllowed = allowedExtensions.test(file.name);
        const typeIsUnknown = !file.type || file.type === 'application/octet-stream';
        if ((!allowedTypes.has(file.type) && !typeIsUnknown) || (!allowedTypes.has(file.type) && !extensionIsAllowed)) { showMessage('نوع الملف غير مدعوم. اختر ملف PDF أو PNG أو JPG.', 'error'); fileInput.value = ''; return; }
        if (file.size > maxFileBytes) { showMessage('حجم الملف أكبر من 3 ميجابايت. اختر ملفاً أصغر.', 'error'); fileInput.value = ''; return; }
        if (file.size === 0) { showMessage('الملف فارغ. اختر ملفاً آخر.', 'error'); fileInput.value = ''; return; }
        selectedUpload = file;
        const size = file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(1)} كيلوبايت` : `${(file.size / (1024 * 1024)).toFixed(2)} ميجابايت`;
        fileDetails.textContent = `${file.name} — ${size}`;
        selectedFile.hidden = false;
        showMessage('', '');
    };
    document.getElementById('cvChooseFile').addEventListener('click', chooseFile);
    uploadArea.addEventListener('click', event => { if (!event.target.closest('button')) chooseFile(); });
    uploadArea.addEventListener('keydown', event => { if (event.target === uploadArea && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); chooseFile(); } });
    fileInput.addEventListener('change', () => setFile(fileInput.files[0]));
    document.getElementById('cvRemoveFile').addEventListener('click', () => { selectedUpload = null; fileInput.value = ''; selectedFile.hidden = true; fileDetails.textContent = ''; });
    ['dragenter', 'dragover'].forEach(type => uploadArea.addEventListener(type, event => { event.preventDefault(); uploadArea.classList.add('is-dragging'); }));
    ['dragleave', 'drop'].forEach(type => uploadArea.addEventListener(type, event => { event.preventDefault(); uploadArea.classList.remove('is-dragging'); }));
    uploadArea.addEventListener('drop', event => setFile(event.dataTransfer.files[0]));

    const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    const listCard = (title, entries, icon) => `<article class="cv-result-card"><h4><span>${icon}</span>${title}</h4>${entries.length ? `<ul>${entries.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '<p class="cv-empty-list">لا توجد نقاط محددة.</p>'}</article>`;
    const localEvaluate = (text, field) => {
        const normalized = text.toLowerCase();
        const fieldTerms = {
            Programming: ['javascript', 'python', 'java', 'sql', 'api', 'github', 'برمجة', 'مشروع'],
            'UI-UX': ['figma', 'wireframe', 'prototype', 'usability', 'ux', 'ui', 'تصميم', 'واجهة'],
            'Graphic Design': ['photoshop', 'illustrator', 'branding', 'typography', 'design', 'تصميم', 'هوية', 'ألوان']
        }[field] || [];
        const sectionTerms = ['experience', 'education', 'project', 'skill', 'خبرة', 'تعليم', 'مشروع', 'مهارات'];
        const quantified = /\b\d+\s*%|\b\d+\s*(?:users|clients|projects|months|years|مستخدم|عميل|مشروع|شهر|سنة)/i.test(text);
        const fieldMatches = fieldTerms.filter(term => normalized.includes(term));
        const sectionMatches = sectionTerms.filter(term => normalized.includes(term));
        const score = Math.min(9, Math.max(2, 3 + Math.min(3, sectionMatches.length) + Math.min(2, fieldMatches.length) + (quantified ? 1 : 0)));
        const strengths = [];
        if (fieldMatches.length) strengths.push(`يتضمن النص إشارات مرتبطة بمجال ${field} مثل: ${fieldMatches.slice(0, 4).join('، ')}.`);
        if (sectionMatches.length) strengths.push(`يذكر أقساماً مهمة للسيرة مثل: ${sectionMatches.slice(0, 4).join('، ')}.`);
        if (quantified) strengths.push('يحتوي على نتائج أو أرقام تساعد على توضيح أثر العمل.');
        if (!strengths.length) strengths.push('يتوفر نص يمكن البدء منه في تطوير السيرة الذاتية.');
        const improvements = [];
        if (!quantified) improvements.push('أضف أرقاماً أو نتائج قابلة للقياس إلى وصف المشاريع والخبرات.');
        if (!normalized.includes('project') && !normalized.includes('مشروع')) improvements.push('أضف مشروعاً أو أكثر مع توضيح دورك والأدوات والنتيجة.');
        if (!normalized.includes('education') && !normalized.includes('تعليم')) improvements.push('أضف قسم التعليم واسم الدرجة أو التخصص.');
        if (!improvements.length) improvements.push('خصص الملخص والمهارات لتتوافق مع إعلان الوظيفة المستهدفة.');
        return {
            score,
            ats_score: Math.min(9, Math.max(3, 4 + Math.min(3, sectionMatches.length) + (normalized.includes('@') ? 1 : 0))),
            field_fit: Math.min(9, Math.max(2, 3 + Math.min(6, fieldMatches.length * 2))),
            summary: `تقييم محلي أولي لسيرتك في مجال ${field} اعتماداً على النص الملصق فقط. هذه النتيجة إرشادية ولا تستخدم خدمة الذكاء الاصطناعي.`,
            strengths,
            weaknesses: improvements.slice(0, 3),
            missing_skills: fieldMatches.length ? [`أضف أمثلة أو مشاريع تثبت مهارات ${field}.`] : [`أضف مهارات وأدوات مرتبطة بمجال ${field}.`],
            improvements
        };
    };

    const renderResult = (data, local = false) => {
        const score = Math.max(0, Math.min(10, Number(data.score)));
        const pct = Math.round(score * 10);
        const meter = (label, value) => { const safe = Math.max(0, Math.min(10, Number(value) || 0)); return `<div class="cv-score-meter"><div><span>${label}</span><strong>${safe}/10</strong></div><div class="cv-meter-track"><span style="width:${safe * 10}%"></span></div></div>`; };
        result.innerHTML = `${local ? '<div class="cv-mock-banner" role="status">تقييم محلي (خدمة الذكاء الاصطناعي غير متاحة)</div>' : ''}<div class="cv-result-top"><div><span class="cv-eyebrow">نتيجة التقييم</span><h3>ملخص سيرتك الذاتية</h3><p>${escapeHtml(data.summary)}</p></div><div class="cv-score" role="img" aria-label="التقييم ${score} من 10" style="--score:${pct}%"><strong>${score}<small>/10</small></strong></div></div><div class="cv-score-meters">${meter('توافق السيرة مع المجال', data.field_fit)}${meter('ملاءمة أنظمة ATS', data.ats_score)}</div><div class="cv-result-grid">${listCard('نقاط القوة', data.strengths, '✦')}${listCard('نقاط تحتاج إلى تحسين', data.weaknesses, '↗')}${listCard('مهارات ناقصة', data.missing_skills, '＋')}${listCard('خطوات مقترحة', data.improvements, '✓')}</div><a class="cv-build-link" href="pages/cv-builder.html">أنشئ سيرة محسّنة ←</a>`;
        result.hidden = false;
    };

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const cvText = cvInput.value.trim();
        if (!cvText && !selectedUpload) { showMessage('الصق نص السيرة الذاتية أو ارفع ملفاً أولاً.', 'error'); cvInput.focus(); return; }
        if (cvText.length > 6000) { showMessage('الحد الأقصى 6000 حرف. اختصر النص ثم أعد المحاولة.', 'error'); return; }
        showMessage('جارٍ تحليل سيرتك الذاتية، قد يستغرق ذلك بضع ثوانٍ…', 'loading');
        result.hidden = true;
        button.disabled = true;
        form.classList.add('is-loading');
        let requestTimeout;
        try {
            const requestBody = { field: targetInput.value };
            if (cvText) requestBody.text = cvText;
            if (selectedUpload) {
                const dataUrl = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('تعذر قراءة الملف. اختره مرة أخرى وحاول.')); reader.readAsDataURL(selectedUpload); });
                requestBody.file = { mimeType: allowedTypes.has(selectedUpload.type) ? selectedUpload.type : mimeFromName(selectedUpload.name), data: String(dataUrl).split(',')[1] };
            }
            const controller = new AbortController();
            requestTimeout = setTimeout(() => controller.abort(), 20000);
            const response = await fetch('/api/analyze-cv', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody), signal: controller.signal });
            const payload = await response.json().catch(() => ({}));
            clearTimeout(requestTimeout);
            if (!response.ok) throw new Error(payload.error || (response.status === 429 ? 'تم تجاوز عدد المحاولات. انتظر قليلاً ثم أعد المحاولة.' : 'تعذر إكمال التقييم الآن. حاول مرة أخرى.'));
            if (payload.mock === true) {
                if (!cvText) throw new Error('الخدمة غير متاحة. الصق نص سيرتك الذاتية للحصول على تقييم محلي؛ الملف ما زال محدداً ويمكنك إعادة المحاولة لاحقاً.');
                renderResult(localEvaluate(cvText, targetInput.value), true);
                showMessage('اكتمل التقييم المحلي للنص الملصق. الملف ما زال محدداً.', 'success');
                return;
            }
            renderResult(payload);
            showMessage('اكتمل التقييم. استخدم الاقتراحات لتطوير سيرتك.', 'success');
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'TypeError' || error.message === 'Failed to fetch') {
                if (cvText) {
                    renderResult(localEvaluate(cvText, targetInput.value), true);
                    showMessage('تعذر الوصول إلى خدمة الذكاء الاصطناعي. عُرض تقييم محلي للنص الملصق.', 'success');
                } else {
                    showMessage('تعذر الوصول إلى خدمة الذكاء الاصطناعي. الصق نص سيرتك الذاتية للحصول على تقييم محلي؛ الملف ما زال محدداً ويمكنك إعادة المحاولة لاحقاً.', 'error');
                }
            } else if (error.message.startsWith('الخدمة غير متاحة.')) {
                showMessage(error.message, 'error');
            } else if (cvText) {
                renderResult(localEvaluate(cvText, targetInput.value), true);
                showMessage('تعذر إكمال تقييم الذكاء الاصطناعي. عُرض تقييم محلي للنص الملصق.', 'success');
            } else if (selectedUpload) {
                showMessage('تعذر إكمال تقييم الملف حالياً. الصق نص سيرتك الذاتية للحصول على تقييم محلي؛ الملف ما زال محدداً ويمكنك إعادة المحاولة لاحقاً.', 'error');
            } else {
                showMessage(error.message || 'حدث خطأ أثناء تحليل السيرة. حاول مرة أخرى.', 'error');
            }
        } finally {
            clearTimeout(requestTimeout);
            button.disabled = false;
            form.classList.remove('is-loading');
        }
    });
});

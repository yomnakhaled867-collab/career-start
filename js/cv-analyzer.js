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
    const renderResult = data => {
        const score = Math.max(0, Math.min(10, Number(data.score)));
        const pct = Math.round(score * 10);
        const meter = (label, value) => { const safe = Math.max(0, Math.min(10, Number(value) || 0)); return `<div class="cv-score-meter"><div><span>${label}</span><strong>${safe}/10</strong></div><div class="cv-meter-track"><span style="width:${safe * 10}%"></span></div></div>`; };
        result.innerHTML = `${data.mock === true ? '<div class="cv-mock-banner" role="status">نتيجة تجريبية: لم يتم الاتصال بـ Gemini. أضف GEMINI_API_KEY إلى إعدادات الخادم لتفعيل التقييم الحقيقي.</div>' : ''}<div class="cv-result-top"><div><span class="cv-eyebrow">نتيجة التقييم</span><h3>ملخص سيرتك الذاتية</h3><p>${escapeHtml(data.summary)}</p></div><div class="cv-score" role="img" aria-label="التقييم ${score} من 10" style="--score:${pct}%"><strong>${score}<small>/10</small></strong></div></div><div class="cv-score-meters">${meter('توافق السيرة مع المجال', data.field_fit)}${meter('ملاءمة أنظمة ATS', data.ats_score)}</div><div class="cv-result-grid">${listCard('نقاط القوة', data.strengths, '✦')}${listCard('نقاط تحتاج إلى تحسين', data.weaknesses, '↗')}${listCard('مهارات ناقصة', data.missing_skills, '＋')}${listCard('خطوات مقترحة', data.improvements, '✓')}</div><a class="cv-build-link" href="pages/cv-builder.html">أنشئ سيرة محسّنة ←</a>`;
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
        try {
            const requestBody = { field: targetInput.value };
            if (cvText) requestBody.text = cvText;
            if (selectedUpload) {
                const dataUrl = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('تعذر قراءة الملف. اختره مرة أخرى وحاول.')); reader.readAsDataURL(selectedUpload); });
                requestBody.file = { mimeType: allowedTypes.has(selectedUpload.type) ? selectedUpload.type : mimeFromName(selectedUpload.name), data: String(dataUrl).split(',')[1] };
            }
            const response = await fetch('/api/analyze-cv', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(payload.error || (response.status === 429 ? 'تم تجاوز عدد المحاولات. انتظر قليلاً ثم أعد المحاولة.' : 'تعذر إكمال التقييم الآن. حاول مرة أخرى.'));
            renderResult(payload);
            showMessage('اكتمل التقييم. استخدم الاقتراحات لتطوير سيرتك.', 'success');
        } catch (error) {
            showMessage(error.message === 'Failed to fetch' ? 'تعذر الاتصال بالخادم. تحقق من اتصالك وشغّل المشروع عبر Vercel محلياً.' : error.message || 'حدث خطأ أثناء تحليل السيرة. حاول مرة أخرى.', 'error');
        } finally {
            button.disabled = false;
            form.classList.remove('is-loading');
        }
    });
});

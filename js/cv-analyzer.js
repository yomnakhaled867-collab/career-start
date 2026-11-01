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
    const targetInput = document.getElementById('cvTargetField');
    const count = document.getElementById('cvCharCount');
    const button = document.getElementById('analyzeCvBtn');
    const message = document.getElementById('cvFormMessage');
    const result = document.getElementById('cvAnalysisResult');

    const showMessage = (text, kind) => {
        message.textContent = text;
        message.className = `cv-form-message ${kind || ''}`;
        message.hidden = !text;
    };
    cvInput.addEventListener('input', () => { count.textContent = `${cvInput.value.length} / 6000`; });

    const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
    const listCard = (title, entries, icon) => `<article class="cv-result-card"><h4><span>${icon}</span>${title}</h4>${entries.length ? `<ul>${entries.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '<p class="cv-empty-list">لا توجد نقاط محددة.</p>'}</article>`;
    const renderResult = data => {
        const score = Math.max(0, Math.min(10, Number(data.score)));
        const pct = Math.round(score * 10);
        result.innerHTML = `<div class="cv-result-top"><div><span class="cv-eyebrow">نتيجة التقييم</span><h3>ملخص سيرتك الذاتية</h3><p>${escapeHtml(data.summary)}</p></div><div class="cv-score" role="img" aria-label="التقييم ${score} من 10" style="--score:${pct}%"><strong>${score}<small>/10</small></strong></div></div><div class="cv-result-grid">${listCard('نقاط القوة', data.strengths, '✦')}${listCard('نقاط تحتاج إلى تحسين', data.weaknesses, '↗')}${listCard('مهارات ناقصة', data.missing_skills, '＋')}${listCard('خطوات مقترحة', data.improvements, '✓')}</div>`;
        result.hidden = false;
    };

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const cvText = cvInput.value.trim();
        if (!cvText) { showMessage('اكتب نص السيرة الذاتية أولاً لبدء التقييم.', 'error'); cvInput.focus(); return; }
        if (cvText.length > 6000) { showMessage('الحد الأقصى 6000 حرف. اختصر النص ثم أعد المحاولة.', 'error'); return; }
        showMessage('جارٍ تحليل سيرتك الذاتية، قد يستغرق ذلك بضع ثوانٍ…', 'loading');
        result.hidden = true;
        button.disabled = true;
        form.classList.add('is-loading');
        try {
            const response = await fetch('/api/analyze-cv', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cvText, targetField: targetInput.value }) });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(payload.error || (response.status === 429 ? 'تم تجاوز عدد المحاولات. انتظر قليلاً ثم أعد المحاولة.' : 'تعذر إكمال التقييم الآن. حاول مرة أخرى.'));
            renderResult(payload);
            showMessage(payload.mock ? 'عرض تجريبي: أضف مفتاح Gemini في إعدادات الخادم لتفعيل التحليل الفعلي.' : 'اكتمل التقييم. استخدم الاقتراحات لتطوير سيرتك.', payload.mock ? 'notice' : 'success');
        } catch (error) {
            showMessage(error.message === 'Failed to fetch' ? 'تعذر الاتصال بالخادم. تحقق من اتصالك وشغّل المشروع عبر Vercel محلياً.' : error.message || 'حدث خطأ أثناء تحليل السيرة. حاول مرة أخرى.', 'error');
        } finally {
            button.disabled = false;
            form.classList.remove('is-loading');
        }
    });
});
// التبديل بين أقسام أسئلة الإنترفيو
function showInterviewCategory(category) {
    const hrQuestions = document.getElementById('hr-questions');
    const techQuestions = document.getElementById('tech-questions');
    const buttons = document.querySelectorAll('.tab-btn');

    buttons.forEach(btn => btn.classList.remove('active'));

    if (category === 'hr') {
        hrQuestions.style.display = 'block';
        techQuestions.style.display = 'none';
        buttons[0].classList.add('active');
    } else {
        hrQuestions.style.display = 'none';
        techQuestions.style.display = 'block';
        buttons[1].classList.add('active');
    }
}
let currentRating = 0;

function setRating(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('.stars-rating .star');
    
    stars.forEach(star => {
        const starValue = parseInt(star.getAttribute('data-value'));
        if (starValue <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitFeedback() {
    const feedbackText = document.getElementById('feedbackText').value;
    
    if (currentRating === 0) {
        alert('من فضلك اختاري عدد النجوم للتقييم أولاً ✨');
        return;
    }
    
    alert(`شكراً لكِ على تقييمك (${currentRating} نجوم)! تم استلام رأيك بنجاح ❤️`);
    
    document.getElementById('feedbackText').value = '';
    setRating(0);
}

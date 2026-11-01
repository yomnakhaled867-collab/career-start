// الانتظار لحين تحميل عناصر الصفحة
document.addEventListener('DOMContentLoaded', function () {
    const careerForm = document.getElementById('careerForm');
    const resultsContainer = document.getElementById('results');
    const recommendationsOutput = document.getElementById('recommendationsOutput');

    // عند الضغط على زرار "عرض التوصيات"
    careerForm.addEventListener('submit', function (e) {
        e.preventDefault(); // منع إعادة تحميل الصفحة

        // قراءة البيانات من الفورم
        const name = document.getElementById('fullName').value;
        const governorate = document.getElementById('governorate').value;
        const workEnv = document.getElementById('workEnv').value;
        const jobType = document.getElementById('jobType').value;
        const interest = document.getElementById('interest').value;

        // توليد التوصيات بناءً على المدخلات
        let recommendationHTML = generateRecommendations(name, governorate, workEnv, jobType, interest);

        // عرض النتيجة في الصفحة
        recommendationsOutput.innerHTML = recommendationHTML;
        resultsContainer.style.display = 'block';

        // التمرير السلس لنزول الشاشة عند النتيجة
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    });
});

// دالة تحليل البيانات وتوليد التوصيات المخصصة
function generateRecommendations(name, governorate, workEnv, jobType, interest) {
    let interestTitle = "";
    let courses = [];
    let platforms = [];
    let tips = "";

    // 1. تحديد تفاصيل المجال المختارات
    if (interest === 'ui-ux') {
        interestTitle = "تصميم واجهات وتجربة المستخدم (UI/UX Design)";
        courses = [
            "كورس Google UI/UX Professional Certificate (على Coursera)",
            "دورة أساسيات تصميم الواجهات بـ Figma على يوتيوب",
            "كورس UX Design Foundations من Interaction Design Foundation"
        ];
    } else if (interest === 'programming') {
        interestTitle = "تطوير البرمجيات والويب (Software Development)";
        courses = [
            "مسار JavaScript & Frontend Development (FreeCodeCamp)",
            "دورة بناء وتطوير المواقع الكاملة Full-Stack",
            "أساسيات البرمجيات وقواعد البيانات من CS50"
        ];
    } else if (interest === 'graphic') {
        interestTitle = "التصميم الجرافيكي الهوية البصرية (Graphic Design)";
        courses = [
            "أساسيات الفوتوشوب والـ Illustrator للمبتدئين",
            "كورس بناء الهوية البصرية وشعارات الشركات",
            "تعلم تصميم إعلانات السوشيال ميديا المحترفة"
        ];
    } else if (interest === 'qa') {
        interestTitle = "اختبار وجودة البرمجيات (Software QA Manual Testing)";
        courses = [
            "أساسيات Software Testing و ISTQB Foundation Level",
            "دورة كتابة الـ Test Cases وتتبع الأخطاء (Bugs)",
            "تطبيقات عمل على اختبار واجهات المستخدم والمواقع"
        ];
    }

    // 2. تحديد المنصات حسب بيئة العمل
    if (workEnv === 'remote' || jobType === 'freelance') {
        platforms = ["مستقل (Mostaql)", "خمسات (Khamsat)", "Upwork", "Behance (لعرض أعمالك)"];
        tips = "بما إنك تفضل العمل الحر/عن بُعد، ركز جداً على بناء بورتفوليو (Portfolio) قوي يعرض مشاريعك حتى لو كانت مشاريع تدريبية، وسجل في منصات الفريلانس ببروفايل احترافي.";
    } else {
        platforms = ["LinkedIn Jobs", "Wuzzuf (وظف)", "Forasna (فرصنا)", "صفحات التوظيف المباشرة للشركات"];
        tips = `بما إنك تفضل العمل من مقر الشركة في (${governorate}) أو المحافظات القريبة، احرص على تحسين حسابك على LinkedIn، والتواصل مع مسؤولي التوظيف (HR/Recruiters) مباشرة.`;
    }

    // 3. بناء الهيكل النهائي للنتيجة
    return `
        <div style="line-height: 1.8;">
            <p><strong>أهلاً بك يا ${name} 👋</strong></p>
            <p>بناءً على اهتمامك بمجال <strong>${interestTitle}</strong> ورغبتك في نمط عمل <strong>(${jobType === 'full-time' ? 'دوام كامل' : jobType === 'part-time' ? 'دوام جزئي' : 'عمل حر'})</strong>:</p>
            
            <hr style="margin: 1rem 0; border: 0; border-top: 1px solid #cbd5e1;">

            <h4 style="color: #1e40af; margin-bottom: 0.5rem;">📚 الكورسات والمسارات الموصى بها لك:</h4>
            <ul>
                ${courses.map(course => `<li>${course}</li>`).join('')}
            </ul>

            <h4 style="color: #1e40af; margin: 1rem 0 0.5rem 0;">💼 أفضل المنصات للبحث عن فرص مناسبة لظروفك:</h4>
            <ul>
                ${platforms.map(platform => `<li>${platform}</li>`).join('')}
            </ul>

            <h4 style="color: #1e40af; margin: 1rem 0 0.5rem 0;">💡 نصيحة مسارك الذهبية:</h4>
            <p style="background: #ffffff; padding: 0.8rem; border-right: 4px solid #2563eb; border-radius: 4px;">${tips}</p>
        </div>
    `;
}
// مقيّم السيرة الذاتية
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('cvAnalyzerForm');
    if (!form) return;

    const cvInput = document.getElementById('cvTextInput');
    try {
        const builderCv = sessionStorage.getItem('careerStartBuilderCv');
        if (builderCv) {
            cvInput.value = builderCv;
            sessionStorage.removeItem('careerStartBuilderCv');
            document.getElementById('cvCharCount').textContent = `${builderCv.length} / 6000`;
        }
    } catch (_) { /* Storage may be unavailable in private browsing. */ }
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

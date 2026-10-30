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
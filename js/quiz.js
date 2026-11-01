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

    if (interest === 'ui-ux') {
        interestTitle = "تصميم واجهات وتجربة المستخدم (UI/UX Design)";
        courses = [
            "كورس Google UI/UX Professional Certificate (على Coursera)",
            "دورة أساسيات تصميم الواجهات بـ Figma على يوتيوب",
            "كورس UX Design Foundations من Interaction Design Foundation",
            '🎬 <strong>ننصحك بمشاهدة هذا المحتوى:</strong> <a href="https://youtube.com/playlist?list=PL-WVrM0m80DiwYy-AMIWaodyDGCvrSvqH&si=DmjOdZdQ-xmoJOFw" target="_blank" style="color: #ff0000; text-decoration: underline;">اضغط هنا لمشاهدة دورة UI/UX الكاملة</a>'
        ];
    } else if (interest === 'programming') {
        interestTitle = "تطوير البرمجيات والويب (Software Development)";
        courses = [
            "مسار JavaScript & Frontend Development (FreeCodeCamp)",
            "دورة بناء وتطوير المواقع الكاملة Full-Stack",
            "أساسيات البرمجيات وقواعد البيانات من CS50",
            '🎬 <strong>ننصحك بمشاهدة هذا المحتوى:</strong> <a href="https://youtu.be/ij6qQQlGKtE?si=S1keYJYLezkr9uF2" target="_blank" style="color: #ff0000; font-weight: bold; text-decoration: underline;">البداية مع بايثون.</a>'
        ];
    } else if (interest === 'graphic') {
        interestTitle = "التصميم الجرافيكي والهوية البصرية (Graphic Design)";
        courses = [
            "أساسيات الفوتوشوب والـ Illustrator للمبتدئين",
            "كورس بناء الهوية البصرية وشعارات الشركات",
            "تعلم تصميم إعلانات السوشيال ميديا الاحترافية",
            '🎬 <strong>ننصحك بمشاهدة هذا المحتوى:</strong> <a href="https://youtube.com/playlist?list=PLs-hceiryD_gbo46gGM7Gz3yJVAHu-CP7&si=3pI0uAFDJjqr964c" target="_blank" style="color: #ff0000; text-decoration: underline;">اضغط هنا لمشاهدة دورة الجرافيك الكاملة</a>'
        ];
    } else if (interest === 'qa') {
        interestTitle = "اختبار وجودة البرمجيات (Software QA Manual Testing)";
        courses = [
            "أساسيات Software Testing و ISTQB Foundation Level",
            "دورة كتابة Test Cases وتتبع الأخطاء (Bugs)",
            "تطبيقات عمل على اختبار واجهات المستخدم والمواقع",
            '🎬 <strong>ننصحك بمشاهدة هذا المحتوى:</strong> <a href="https://youtube.com/playlist?list=PLQUxWr2rTswl1D4f8Tkw3RvCD-ZB6LpgJ&si=jETL9o8mlNTrBHA9" target="_blank" style="color: #ff0000; text-decoration: underline;">اضغط هنا لمشاهدة دورة الـ QA الكاملة</a>'
        ];
    } else {
        interestTitle = "المجال المختار";
        courses = ["دورة أساسيات المجال المختار"];
    }

    let platforms = [];
    let tips = "";

    if (workEnv === 'remote' || jobType === 'freelance') {
        platforms = ["مستقل (Mostaql)", "خمسات (Khamsat)", "Upwork", "Behance (لعرض أعمالك)"];
        tips = `بما إنك تفضل العمل الحر/عن بُعد، ركز جداً على بناء بورتفوليو (Portfolio) قوي يعرض مشاريعك حتى لو كانت مشاريع تدريبية، وسجل في منصات الفريلانس ببروفايل احترافي.`;
    } else {
        platforms = ["LinkedIn Jobs", "Wuzzuf (وظف)", "Forasna (فرصنا)", "التوظيف المباشر للشركات"];
        tips = `احرص على تحسين حسابك على LinkedIn بما إنك تفضل العمل من مقر الشركة في ${governorate}.`;
    }

    return `
        <div style="line-height: 1.8;">
            <p><strong>أهلاً بك يا ${name} 👋</strong></p>
            <p>بناءً على اهتمامك بمجال <strong>${interestTitle}</strong> ورغبتك في نمط عمل (دوام كامل)، إليك التوصيات:</p>
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
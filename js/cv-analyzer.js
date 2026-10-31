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

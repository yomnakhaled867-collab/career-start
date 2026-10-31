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

(() => {
    const FIELD_ORDER = ['programming', 'uiux', 'graphic'];
    const FIELD_NAMES = {
        programming: 'البرمجة وتطوير الويب',
        uiux: 'تصميم UI/UX',
        graphic: 'التصميم الجرافيكي'
    };

    function calculateResult(questions, answers) {
        const scores = Object.fromEntries(FIELD_ORDER.map(field => [field, 0]));
        questions.forEach((question, index) => {
            const option = question.options[answers[index]];
            if (option && Object.hasOwn(scores, option.field)) scores[option.field] += option.weight;
        });
        const highest = Math.max(...Object.values(scores));
        const tied = FIELD_ORDER.filter(field => scores[field] === highest);
        const lastOption = questions.length ? questions.at(-1).options[answers.at(-1)] : null;
        const field = tied.length === 1 ? tied[0] : (lastOption && tied.includes(lastOption.field) ? lastOption.field : tied[0]);
        const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
        const percentages = Object.fromEntries(FIELD_ORDER.map(name => [name, total ? Math.round((scores[name] / total) * 100) : 0]));
        return { field, scores, percentages };
    }

    globalThis.QuizScoring = { calculateResult };

    document.addEventListener('DOMContentLoaded', () => {
        const status = document.getElementById('quizStatus');
        const content = document.getElementById('quizContent');
        const resultPanel = document.getElementById('quizResult');
        const questionText = document.getElementById('questionText');
        const answerList = document.getElementById('answerList');
        const progressBar = document.getElementById('progressBar');
        const progress = document.querySelector('.quiz-progress');
        const progressLabel = document.getElementById('progressLabel');
        const progressPercent = document.getElementById('progressPercent');
        const backButton = document.getElementById('backButton');
        const nextButton = document.getElementById('nextButton');
        let questions = [];
        let fields = FIELD_NAMES;
        let answers = [];
        let current = 0;

        function renderQuestion() {
            const question = questions[current];
            questionText.textContent = question.text;
            answerList.replaceChildren();
            question.options.forEach((option, index) => {
                const label = document.createElement('label');
                label.className = 'answer-option';
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'quizAnswer';
                input.value = String(index);
                input.checked = answers[current] === index;
                input.addEventListener('change', () => {
                    answers[current] = index;
                    nextButton.disabled = false;
                });
                const text = document.createElement('span');
                text.textContent = option.text;
                label.append(input, text);
                answerList.append(label);
            });
            const percent = current * 10;
            progressBar.style.width = `${percent}%`;
            progress.setAttribute('aria-valuenow', String(percent));
            progressLabel.textContent = `السؤال ${current + 1} من ${questions.length}`;
            progressPercent.textContent = `${percent}%`;
            backButton.disabled = current === 0;
            nextButton.disabled = !Number.isInteger(answers[current]);
            nextButton.textContent = current === questions.length - 1 ? 'عرض النتيجة' : 'التالي';
        }

        function showResult() {
            const outcome = calculateResult(questions, answers);
            const explanation = `تُظهر إجاباتك ميلاً أكبر إلى مجال ${fields[outcome.field]}، حيث تلتقي اهتماماتك ومهاراتك في هذا المسار.`;
            let storageError = false;
            try {
                localStorage.setItem('cs_field', outcome.field);
                localStorage.setItem('cs_scores', JSON.stringify(outcome));
                status.textContent = '';
            } catch (_) {
                storageError = true;
                status.textContent = 'تعذّر حفظ النتيجة على هذا الجهاز، لكن يمكنك متابعة استكشاف مسارك.';
                status.classList.add('error');
            }
            resultPanel.replaceChildren();
            const head = document.createElement('div');
            head.className = 'result-head';
            const eyebrow = document.createElement('span');
            eyebrow.className = 'quiz-eyebrow';
            eyebrow.textContent = 'نتيجتك';
            const title = document.createElement('h2');
            title.textContent = 'المجال الموصى به لك';
            const field = document.createElement('p');
            field.className = 'result-field';
            field.textContent = fields[outcome.field];
            const why = document.createElement('p');
            why.textContent = explanation;
            head.append(eyebrow, title, field, why);
            const scoreList = document.createElement('div');
            scoreList.className = 'score-list';
            FIELD_ORDER.forEach(name => {
                const item = document.createElement('div');
                const label = document.createElement('div');
                label.className = 'score-label';
                const nameSpan = document.createElement('span');
                nameSpan.textContent = fields[name];
                const value = document.createElement('strong');
                value.textContent = `${outcome.percentages[name]}%`;
                label.append(nameSpan, value);
                const track = document.createElement('div');
                track.className = 'score-track';
                track.setAttribute('role', 'img');
                track.setAttribute('aria-label', `${fields[name]}: ${outcome.percentages[name]}%`);
                const bar = document.createElement('span');
                bar.style.width = `${outcome.percentages[name]}%`;
                track.append(bar);
                item.append(label, track);
                scoreList.append(item);
            });
            const actions = document.createElement('div');
            actions.className = 'result-actions';
            actions.innerHTML = '<a href="roadmaps.html">افتح خريطة التعلّم</a><a class="secondary-link" href="interview.html">تدرّب على أسئلة المقابلات</a>';
            const retake = document.createElement('button');
            retake.type = 'button';
            retake.className = 'retake-button';
            retake.textContent = 'أعد الاختبار';
            retake.addEventListener('click', resetQuiz);
            resultPanel.append(head, scoreList, actions, retake);
            content.hidden = true;
            resultPanel.hidden = false;
            if (!storageError) status.textContent = '';
        }

        function resetQuiz() {
            answers = [];
            current = 0;
            resultPanel.hidden = true;
            content.hidden = false;
            renderQuestion();
        }

        backButton.addEventListener('click', () => {
            if (current > 0) { current -= 1; renderQuestion(); }
        });
        nextButton.addEventListener('click', () => {
            if (!Number.isInteger(answers[current])) return;
            if (current === questions.length - 1) showResult();
            else { current += 1; renderQuestion(); }
        });

        fetch('../data/quiz.json')
            .then(response => {
                if (!response.ok) throw new Error('Unable to load quiz data');
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data.questions) || data.questions.length < 10 || data.questions.length > 12) throw new Error('Invalid quiz data');
                questions = data.questions;
                fields = data.fields || FIELD_NAMES;
                status.textContent = '';
                content.hidden = false;
                renderQuestion();
            })
            .catch(() => {
                status.classList.add('error');
                status.textContent = 'تعذّر تحميل أسئلة الاختبار. حدّث الصفحة وحاول مرة أخرى.';
            });
    });
})();

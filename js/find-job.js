document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('careerForm');
  const result = document.getElementById('results');
  const output = document.getElementById('recommendationsOutput');
  const dataError = document.getElementById('dataError');
  const inputs = ['fullName', 'governorate', 'workEnv', 'jobType', 'interest'];
  const storageKey = 'career-start-recommendation-preferences';
  let governors;
  let places;

  const escapeHTML = escapeRecommendationText;
  const option = (value, label) => `<option value="${escapeHTML(value)}">${escapeHTML(label)}</option>`;
  const loadJSON = async path => {
    const response = await fetch(path);
    if (!response.ok) throw new Error('تعذر تحميل البيانات');
    return response.json();
  };

  try {
    [governors, places] = await Promise.all([loadJSON('../data/governorates.json'), loadJSON('../data/places.json')]);
    window.PLACES_DATA = places;
    const governorate = document.getElementById('governorate');
    governorate.insertAdjacentHTML('beforeend', governors.map(name => option(name, name)).join(''));
    const interest = document.getElementById('interest');
    Object.entries(FIELD_DATA).forEach(([key, field]) => interest.insertAdjacentHTML('beforeend', option(key, field.title)));

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      inputs.forEach(id => { 
        if (id !== 'governorate' && saved[id] && document.getElementById(id).querySelector(`option[value="${CSS.escape(saved[id])}"]`)) {
          document.getElementById(id).value = saved[id]; 
        }
      });
    } catch (_) {
      // Storage may be disabled; the form remains usable.
    }
  } catch (_) {
    form.querySelectorAll('button').forEach(button => { button.disabled = true; });
    dataError.hidden = false;
    return;
  }

  inputs.forEach(id => {
    const control = document.getElementById(id);
    control.addEventListener('input', () => clearError(control));
    control.addEventListener('change', () => clearError(control));
  });

  form.addEventListener('reset', () => {
    setTimeout(() => {
      inputs.forEach(id => clearError(document.getElementById(id)));
      result.hidden = true;
      output.replaceChildren();
      try { localStorage.removeItem(storageKey); } catch (_) { /* Ignore disabled storage. */ }
    }, 0);
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const values = Object.fromEntries(inputs.map(id => [id, document.getElementById(id).value.trim()]));
    let valid = true;
    inputs.forEach(id => {
      const control = document.getElementById(id);
      if (!values[id]) {
        showError(control, `يرجى إدخال ${control.labels[0].textContent.replace(':', '')}.`);
        if (valid) control.focus();
        valid = false;
      } else clearError(control);
    });
    if (!valid) return;

    try { localStorage.setItem(storageKey, JSON.stringify(values)); } catch (_) { /* Persistence is optional. */ }
    result.hidden = false;
    result.setAttribute('aria-busy', 'true');
    output.innerHTML = '<div class="recommendation-skeleton" aria-label="جارٍ إعداد التوصيات"><span></span><span></span><span></span></div>';
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    await new Promise(resolve => setTimeout(resolve, 400));
    try {
      const recommendations = getRecommendations({ field: values.interest, workType: values.workEnv, schedule: values.jobType, governorate: values.governorate });
      const firstName = values.fullName.split(/\s+/u)[0];
      output.innerHTML = renderRecommendations(recommendations, firstName);
      result.setAttribute('aria-busy', 'false');
      result.focus({ preventScroll: true });
    } catch (_) {
      output.innerHTML = '<p class="inline-error" role="alert">تعذر إعداد التوصيات. راجع اختياراتك وحاول مرة أخرى.</p>';
      result.setAttribute('aria-busy', 'false');
    }
  });

  function showError(control, message) {
    control.setAttribute('aria-invalid', 'true');
    document.getElementById(`${control.id}-error`).textContent = message;
  }
  function clearError(control) {
    control.removeAttribute('aria-invalid');
    document.getElementById(`${control.id}-error`).textContent = '';
  }
  function renderRecommendations(data, name) {
    const workLabels = { remote: 'عن بُعد', onsite: 'من مقر العمل', hybrid: 'هجين' };
    const scheduleLabels = { 'full-time': 'دوام كامل', 'part-time': 'دوام جزئي', internship: 'تدريب', freelance: 'عمل حر' };
    const links = list => list.map(item => `<li><a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.name || item[1])}</a>${item[1] ? ` — ${escapeHTML(item[1])}` : ''}</li>`).join('');
    const placeCards = data.places.map(place => `<article class="recommendation-card place-card"><span class="card-type">${escapeHTML(place.type)}</span><h5>${escapeHTML(place.name)}</h5><p>${escapeHTML(place.note)}</p><a href="${escapeHTML(place.mapsUrl)}" target="_blank" rel="noopener noreferrer">افتح بحث خرائط Google</a></article>`).join('');
    const localFirst = data.workType !== 'remote';
    const nearbyLinks = [['القاهرة', 'Cairo'], ['الجيزة', 'Giza'], ['الإسكندرية', 'Alexandria']].map(([label, place]) => ({ name: `بحث ${label}`, url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.title} ${place} Egypt`)}` }));
    return `<p class="recommendation-greeting"><strong>أهلاً ${escapeHTML(name)} 👋</strong></p>
      <p>توصيات مخصصة لمجال <strong>${escapeHTML(data.title)}</strong> في ${escapeHTML(data.governorate)}، بنمط ${escapeHTML(workLabels[data.workType])} و${escapeHTML(scheduleLabels[data.schedule])}.</p>
      <div class="recommendation-grid">
        <article class="recommendation-card"><h4>مسميات وظيفية مناسبة لحديثي التخرج</h4><ul>${data.jobTitles.map(title => `<li>${escapeHTML(title)}</li>`).join('')}</ul></article>
        <article class="recommendation-card"><h4>🧭 مهارات للتعلم</h4><ul>${data.skills.map(skill => `<li>${escapeHTML(skill)}</li>`).join('')}</ul></article>
        <article class="recommendation-card"><h4>📚 مصادر تعلم</h4><ul>${links(data.learn.map(([url, label]) => ({ url: `https://${url}`, name: label })))}</ul></article>
        <article class="recommendation-card${data.workType === 'remote' ? ' remote-prominent' : ''}"><h4>🔎 فرص عمل ${data.workType === 'remote' ? 'عن بُعد' : 'في منطقتك'}</h4><ul>${links(data.jobs.map(job => ({ name: job.name, url: job.url })))}</ul></article>
      </div>
      ${localFirst ? `<section class="places-section"><h4>📍 أماكن وفرص في ${escapeHTML(data.governorate)}</h4><p>${data.placeMatch ? 'أماكن مرتبطة بالمجال في المحافظة.' : 'استعرضنا لك أقرب الفرص والبدائل المتاحة لتختار من بينها ما يناسبك.'}</p><div class="recommendation-grid">${placeCards}</div><p><a href="${escapeHTML(data.localSearch)}" target="_blank" rel="noopener noreferrer">ابحث عن جهات وأماكن مرتبطة بمجالك في ${escapeHTML(data.governorate)}</a></p>${!data.placeMatch ? `<h5>محاور كبرى قريبة — نتائج بحث:</h5><ul>${links(nearbyLinks)}</ul>` : ''}</section>` : `<section class="places-section"><h4>🌐 موارد مناسبة للعمل عن بُعد</h4><p>ابدأ بروابط الوظائف عن بُعد أعلاه؛ أضفنا البحث المحلي كخيار ثانوي للتدريب ومساحات العمل.</p><div class="recommendation-grid">${placeCards}</div></section>`}`;
  }
});

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
            '🎬 <strong>ننصحك بمشاهدة هذا المحتوى:</strong>',
            '<a href="https://youtu.be/ij6qQQlGKtE?si=S1keYJYLezkr9uF2" target="_blank" style="color: #ff0000; font-weight: bold; text-decoration: underline;">البداية مع بايثون.</a>',
            '<a href="https://youtu.be/35qTqtpQMxg?si=XjXebVGxpf27dAzE" target="_blank" style="color: #ff0000; font-weight: bold; text-decoration: underline;">البداية مع C++.</a>'
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

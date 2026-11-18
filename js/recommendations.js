const FIELD_DATA = {
  uiux: { title: 'تصميم تجربة وواجهات المستخدم (UI/UX)', jobs: ['مصمم UI/UX مبتدئ', 'مصمم واجهات رقمية', 'متدرب أبحاث تجربة المستخدم'], skills: ['Figma وتصميم النماذج', 'مبادئ UX وإمكانية الوصول', 'اختبار قابلية الاستخدام وبناء ملف أعمال'], learn: [['roadmap.sh/design', 'خارطة تصميم المنتجات'], ['freecodecamp.org', 'مقالات ومشاريع مجانية'], ['depi.gov.eg', 'مبادرة رواد مصر الرقمية (DEPI)']] },
  frontend: { title: 'تطوير الواجهات الأمامية', jobs: ['مطور Frontend مبتدئ', 'مطور واجهات ويب', 'متدرب JavaScript'], skills: ['HTML وCSS المتجاوب', 'JavaScript وواجهات API', 'Git وإمكانية الوصول'], learn: [['roadmap.sh/frontend', 'خارطة Frontend'], ['freecodecamp.org/learn', 'منهج freeCodeCamp'], ['iti.gov.eg', 'معهد تكنولوجيا المعلومات (ITI)']] },
  backend: { title: 'تطوير الواجهات الخلفية', jobs: ['مطور Backend مبتدئ', 'مطور API مبتدئ', 'متدرب برمجيات'], skills: ['لغة وخادم ويب', 'SQL وتصميم قواعد البيانات', 'REST وGit والاختبارات'], learn: [['roadmap.sh/backend', 'خارطة Backend'], ['freecodecamp.org/learn', 'مشاريع freeCodeCamp'], ['depi.gov.eg', 'مبادرة DEPI']] },
  data: { title: 'تحليل البيانات', jobs: ['محلل بيانات مبتدئ', 'مساعد ذكاء أعمال', 'متدرب بيانات'], skills: ['Excel وSQL', 'Python وتحليل البيانات', 'تصوير البيانات والإحصاء'], learn: [['roadmap.sh/data-analyst', 'خارطة محلل البيانات'], ['freecodecamp.org/learn', 'مسارات وتحليلات مجانية'], ['iti.gov.eg', 'برامج ITI']] },
  aiml: { title: 'الذكاء الاصطناعي وتعلم الآلة', jobs: ['متدرب تعلم آلة', 'مساعد بيانات وذكاء اصطناعي', 'مطور Python مبتدئ'], skills: ['Python ورياضيات أساسية', 'تحضير البيانات', 'مبادئ تعلم الآلة وتقييم النماذج'], learn: [['roadmap.sh/ai-data-scientist', 'خارطة عالم بيانات وذكاء اصطناعي'], ['freecodecamp.org/learn', 'دروس Python وعلوم البيانات'], ['depi.gov.eg', 'مبادرة DEPI']] },
  cyber: { title: 'الأمن السيبراني', jobs: ['محلل أمن مبتدئ', 'متدرب أمن معلومات', 'مساعد دعم SOC'], skills: ['الشبكات وLinux', 'مبادئ أمن المعلومات', 'تحليل السجلات والاستجابة للحوادث'], learn: [['roadmap.sh/cyber-security', 'خارطة الأمن السيبراني'], ['freecodecamp.org/news', 'مقالات تقنية مجانية'], ['iti.gov.eg', 'برامج ITI']] },
  mobile: { title: 'تطوير تطبيقات الهاتف', jobs: ['مطور تطبيقات مبتدئ', 'متدرب Android', 'مطور Flutter مبتدئ'], skills: ['أساسيات Dart أو Kotlin', 'واجهات وتخزين البيانات', 'اختبار التطبيقات وGit'], learn: [['roadmap.sh/android', 'خارطة Android'], ['freecodecamp.org/learn', 'دروس تطوير مجانية'], ['depi.gov.eg', 'مبادرة DEPI']] },
  devops: { title: 'DevOps والحوسبة السحابية', jobs: ['مساعد DevOps مبتدئ', 'متدرب دعم سحابي', 'مطور أدوات نشر مبتدئ'], skills: ['Linux وGit', 'مبادئ CI/CD والحاويات', 'الشبكات ومراقبة الأنظمة'], learn: [['roadmap.sh/devops', 'خارطة DevOps'], ['freecodecamp.org/news', 'دروس DevOps مجانية'], ['iti.gov.eg', 'برامج ITI']] },
  qa: { title: 'اختبار وضمان جودة البرمجيات', jobs: ['مختبر برمجيات مبتدئ', 'متدرب ضمان جودة', 'مختبر واجهات ومواقع'], skills: ['كتابة حالات الاختبار', 'تتبع الأخطاء وAPI', 'أساسيات الاختبار الآلي'], learn: [['roadmap.sh/qa', 'خارطة ضمان الجودة'], ['freecodecamp.org/news', 'مقالات اختبار البرمجيات'], ['depi.gov.eg', 'مبادرة DEPI']] },
  marketing: { title: 'التسويق الرقمي', jobs: ['مساعد تسويق رقمي', 'متخصص محتوى مبتدئ', 'متدرب تسويق أداء'], skills: ['تحليل الجمهور والمحتوى', 'أساسيات SEO', 'قياس الحملات والتحليلات'], learn: [['coursera.org', 'دورات يمكن تدقيقها مجاناً'], ['freecodecamp.org/news', 'مقالات تسويق وتقنية'], ['depi.gov.eg', 'مبادرة DEPI']] },
  graphic: { title: 'التصميم الجرافيكي', jobs: ['مصمم جرافيك مبتدئ', 'مصمم محتوى بصري', 'متدرب هوية بصرية'], skills: ['التكوين والطباعة والألوان', 'أدوات تصميم رقمية', 'بناء ملف أعمال'], learn: [['youtube.com', 'دروس تصميم مجانية'], ['freecodecamp.org/news', 'موارد تصميم مجانية'], ['depi.gov.eg', 'مبادرة DEPI']] },
  business: { title: 'تحليل الأعمال', jobs: ['محلل أعمال مبتدئ', 'مساعد محلل نظم', 'متدرب عمليات ومنتجات'], skills: ['جمع المتطلبات ورسم العمليات', 'Excel وتحليل البيانات', 'التواصل والتوثيق'], learn: [['coursera.org', 'دورات يمكن تدقيقها مجاناً'], ['edx.org', 'دورات يمكن تدقيقها مجاناً'], ['iti.gov.eg', 'برامج ITI']] }
};

function escapeRecommendationText(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function getRecommendations({ field, workType, schedule, governorate }) {
  const selected = FIELD_DATA[field];
  if (!selected || !governorate) throw new Error('اختيارات التوصيات غير مكتملة.');
  const places = (globalThis.PLACES_DATA && globalThis.PLACES_DATA[governorate]) || [];
  const matching = places.filter(place => !place.fallback && place.fields.includes(field));
  const chosenPlaces = matching.length ? matching : (places.length ? places : [{ name: 'ابحث عن فرص في {{governorate}}', type: 'بحث محلي', fields: ['*'], note: 'لا تتوفر لدينا أماكن موثقة لهذا المجال في {{governorate}}. ابحث عن الجهات والفرص الحالية باستخدام روابط المجال والمحافظة.', mapsUrl: 'https://www.google.com/maps/search/?api=1&query={{query}}', fallback: true }]);
  const fallback = chosenPlaces.map(place => place.fallback ? { ...place, name: place.name.replace('{{governorate}}', governorate), note: place.note.replaceAll('{{governorate}}', governorate), mapsUrl: place.mapsUrl.replace('{{query}}', encodeURIComponent(`${selected.title} ${governorate}`)) } : place);
  const scheduleTerms = { 'full-time': 'دوام كامل', 'part-time': 'دوام جزئي', internship: 'تدريب', freelance: 'عمل حر' };
  const keyword = `${selected.title} حديث التخرج ${scheduleTerms[schedule] || ''}`.trim();
  const location = workType === 'remote' ? 'Egypt' : governorate;
  const remote = workType === 'remote' ? '&f_WT=2' : '';
  const query = `${keyword} ${location}`;
  return { ...selected, governorate, workType, schedule, places: fallback, placeMatch: matching.length > 0, jobTitles: selected.jobs,
    jobs: [
      { name: 'Wuzzuf', url: `https://wuzzuf.net/search/jobs/?q=${encodeURIComponent(keyword)}&a=navbl${workType === 'remote' ? '&workplace=remote' : `&l=${encodeURIComponent(governorate)}`}` },
      { name: 'LinkedIn Jobs', url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}&f_WT=${workType === 'remote' ? '2' : workType === 'hybrid' ? '3' : '1'}` },
      { name: 'Forasna', url: `https://forasna.com/job/search?key=${encodeURIComponent(keyword)}&location=${encodeURIComponent(governorate)}` },
      { name: 'Indeed Egypt', url: `https://eg.indeed.com/jobs?q=${encodeURIComponent(keyword)}&l=${encodeURIComponent(location)}${workType === 'remote' ? '&sc=0kf%3Aattr%28DSQF7%29%3B' : ''}` }
    ],
    localSearch: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selected.title} ${governorate}`)}`
  };
}

if (typeof module !== 'undefined' && module.exports) module.exports = { getRecommendations, FIELD_DATA, escapeRecommendationText };

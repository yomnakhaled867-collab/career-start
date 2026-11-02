(() => {
    const dataUrl = new URL('../data/roadmaps.json', document.currentScript.src);
    const tabs = document.getElementById('fieldTabs');
    const panel = document.getElementById('roadmapPanel');
    const status = document.getElementById('roadmapStatus');
    const fields = [
        { id: 'programming', label: 'البرمجة' },
        { id: 'uiux', label: 'UI/UX' },
        { id: 'graphic', label: 'التصميم الجرافيكي' }
    ];
    const progressKey = field => `cs_roadmap_progress_${field}`;
    let roadmaps = {};
    let activeField = '';

    const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);

    function readProgress(field) {
        try {
            const saved = JSON.parse(localStorage.getItem(progressKey(field)) || '[]');
            return new Set(Array.isArray(saved) ? saved.filter(Number.isInteger) : []);
        } catch (_) {
            return new Set();
        }
    }

    function render() {
        const roadmap = roadmaps[activeField];
        if (!roadmap || !Array.isArray(roadmap.stages)) {
            status.textContent = 'تعذر العثور على خريطة هذا المجال.';
            status.hidden = false;
            panel.hidden = true;
            return;
        }

        const complete = readProgress(activeField);
        const total = roadmap.stages.length;
        const done = roadmap.stages.reduce((count, _, index) => count + (complete.has(index) ? 1 : 0), 0);
        const percent = total ? Math.round(done / total * 100) : 0;
        tabs.querySelectorAll('[role="tab"]').forEach(tab => {
            const selected = tab.dataset.field === activeField;
            tab.setAttribute('aria-selected', String(selected));
            tab.tabIndex = selected ? 0 : -1;
        });

        panel.innerHTML = `
            <header class="roadmap-heading">
                <div><span class="roadmaps-eyebrow">مسار منظم وقابل للتطبيق</span>
                    <h2>${escapeHtml(roadmap.title)}</h2>
                    <p>${escapeHtml(roadmap.description)}</p>
                </div>
            </header>
            <div class="progress-summary">
                <div class="progress-copy"><strong>تقدمك في المسار</strong><span>${done} من ${total} مراحل · ${percent}%</span></div>
                <div class="progress-track" role="progressbar" aria-label="تقدمك في المسار" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div>
            </div>
            <ol class="stage-list">${roadmap.stages.map((stage, index) => `
                <li class="stage-card${complete.has(index) ? ' is-complete' : ''}">
                    <div class="stage-topline"><span class="stage-number">${String(index + 1).padStart(2, '0')}</span>
                        <label class="stage-check"><input type="checkbox" data-stage="${index}"${complete.has(index) ? ' checked' : ''}><span>أكملت هذه المرحلة</span></label>
                    </div>
                    <div class="stage-body"><div class="stage-title-row"><h3>${escapeHtml(stage.name)}</h3><span class="stage-duration">${escapeHtml(stage.duration)}</span></div>
                        <p class="skills-label">ستتعلّم</p><ul class="skill-list">${stage.skills.map(skill => `<li>${escapeHtml(skill)}</li>`).join('')}</ul>
                        <p class="resources-label">مصادر مجانية</p><ul class="resource-list">${stage.resources.map(resource => `
                            <li><a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener">${escapeHtml(resource.title)} <span class="resource-meta">${escapeHtml(resource.type)} · ${resource.language === 'ar' ? 'العربية' : 'English'}</span></a>${resource.verify ? '<span class="verify-note">يحتاج مراجعة الرابط</span>' : ''}</li>
                        `).join('')}</ul>
                    </div>
                </li>`).join('')}</ol>`;
        status.hidden = true;
        panel.hidden = false;
    }

    function selectField(field) {
        if (!roadmaps[field]) return;
        activeField = field;
        try { localStorage.setItem('cs_field', field); } catch (_) { /* Storage may be unavailable. */ }
        render();
    }

    tabs.addEventListener('click', event => {
        const tab = event.target.closest('[role="tab"]');
        if (tab) selectField(tab.dataset.field);
    });

    tabs.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const current = fields.findIndex(field => field.id === activeField);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? fields.length - 1 : (current + (event.key === 'ArrowLeft' ? 1 : -1) + fields.length) % fields.length;
        event.preventDefault();
        const field = fields[next];
        selectField(field.id);
        tabs.querySelector(`[data-field="${field.id}"]`).focus();
    });

    panel.addEventListener('change', event => {
        const checkbox = event.target.closest('[data-stage]');
        if (!checkbox) return;
        const completed = readProgress(activeField);
        const index = Number(checkbox.dataset.stage);
        checkbox.checked ? completed.add(index) : completed.delete(index);
        try {
            localStorage.setItem(progressKey(activeField), JSON.stringify([...completed]));
            render();
        } catch (_) {
            checkbox.checked = !checkbox.checked;
            status.textContent = 'تعذر حفظ التقدم على هذا الجهاز. تحقق من إعدادات التخزين في المتصفح.';
            status.hidden = false;
        }
    });

    fetch(dataUrl)
        .then(response => {
            if (!response.ok) throw new Error('تعذر تحميل خرائط التعلّم.');
            return response.json();
        })
        .then(data => {
            roadmaps = data;
            tabs.innerHTML = fields.map(field => `<button type="button" role="tab" id="tab-${field.id}" aria-controls="roadmapPanel" data-field="${field.id}">${field.label}</button>`).join('');
            const preferred = (() => { try { return localStorage.getItem('cs_field'); } catch (_) { return ''; } })();
            tabs.hidden = false;
            selectField(roadmaps[preferred] ? preferred : fields[0].id);
        })
        .catch(() => {
            status.textContent = 'تعذر تحميل خرائط التعلّم. افتح الصفحة عبر خادم الموقع ثم أعد المحاولة.';
            status.hidden = false;
        });
})();

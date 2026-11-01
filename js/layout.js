(() => {
    const FEEDBACK_KEY = 'cs_landing_feedback';
    const CONTACT_KEY = 'cs_landing_contact_messages';
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackStatus = document.getElementById('feedbackStatus');
    const modal = document.getElementById('contactModal');
    const openButton = document.getElementById('openContactBtn');
    const closeButton = document.getElementById('closeContactBtn');
    const contactForm = document.getElementById('contactForm');
    const contactStatus = document.getElementById('contactStatus');

    function readList(key) {
        const value = localStorage.getItem(key);
        if (!value) return [];
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) throw new Error('Invalid saved data');
        return parsed;
    }

    if (feedbackForm && feedbackStatus) {
        feedbackForm.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(feedbackForm);
            const rating = Number(formData.get('rating'));
            const note = document.getElementById('feedbackText').value.trim();
            if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                feedbackStatus.textContent = 'اختر تقييماً من نجمة إلى خمس نجوم أولاً.';
                feedbackStatus.dataset.state = 'error';
                return;
            }
            try {
                const entries = readList(FEEDBACK_KEY);
                entries.push({ rating, note, savedAt: new Date().toISOString() });
                localStorage.setItem(FEEDBACK_KEY, JSON.stringify(entries.slice(-20)));
                feedbackForm.reset();
                feedbackStatus.textContent = 'تم حفظ تقييمك على هذا الجهاز فقط. لم يتم إرساله إلى فريق المنصة.';
                feedbackStatus.dataset.state = 'success';
            } catch (_) {
                feedbackStatus.textContent = 'تعذر الحفظ على هذا الجهاز. تحقق من إعدادات التخزين وحاول مجدداً.';
                feedbackStatus.dataset.state = 'error';
            }
        });
    }

    if (!modal || !openButton || !closeButton || !contactForm || !contactStatus) return;

    let returnFocus = null;
    function openModal() {
        returnFocus = document.activeElement;
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.getElementById('contactName').focus();
    }
    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
    }

    openButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
    });

    contactForm.addEventListener('submit', event => {
        event.preventDefault();
        const message = {
            name: document.getElementById('contactName').value.trim(),
            email: document.getElementById('contactEmail').value.trim(),
            message: document.getElementById('contactMessage').value.trim(),
            savedAt: new Date().toISOString()
        };
        if (!message.name || !message.email || !message.message) {
            contactStatus.textContent = 'أكمل الحقول المطلوبة قبل الحفظ.';
            contactStatus.dataset.state = 'error';
            return;
        }
        try {
            const messages = readList(CONTACT_KEY);
            messages.push(message);
            localStorage.setItem(CONTACT_KEY, JSON.stringify(messages.slice(-20)));
            contactForm.reset();
            contactStatus.textContent = 'تم حفظ رسالتك على هذا الجهاز فقط. لم تُرسل إلى فريق الدعم، ولن يصلك رد من المنصة.';
            contactStatus.dataset.state = 'success';
        } catch (_) {
            contactStatus.textContent = 'تعذر الحفظ على هذا الجهاز. تحقق من إعدادات التخزين وحاول مجدداً.';
            contactStatus.dataset.state = 'error';
        }
    });
})();

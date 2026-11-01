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
        alert('من فضلك اختر عدد النجوم للتقييم أولاً ✨');
        return;
    }
    
    alert(`شكراً لك على تقييمك (${currentRating} نجوم)! تم استلام رأيك بنجاح ❤️`);
    
    document.getElementById('feedbackText').value = '';
    setRating(0);
}
const modal = document.getElementById('contactModal');
const openBtn = document.getElementById('openContactBtn');
const closeBtn = document.getElementById('closeContactBtn');
const contactForm = document.getElementById('contactForm');

// فتح النافذة عند الضغط على الزرار
openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// إغلاق النافذة عند الضغط على زر الإغلاق (X)
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// إغلاق النافذة عند الضغط في أي مكان خارج الصندوق
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// التعامل مع إرسال الفورم
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('شكرًا لتواصلك معنا! تم إرسال رسالتك بنجاح.');
    contactForm.reset();
    modal.style.display = 'none';
});
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
        alert('من فضلك اختاري عدد النجوم للتقييم أولاً ✨');
        return;
    }
    
    alert(`شكراً لكِ على تقييمك (${currentRating} نجوم)! تم استلام رأيك بنجاح ❤️`);
    
    document.getElementById('feedbackText').value = '';
    setRating(0);
}
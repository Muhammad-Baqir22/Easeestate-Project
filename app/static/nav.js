<!-- ✅ responsiveness for navbar -->

// Mobile menu toggle functionality
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const authButtons = document.querySelector('.auth-buttons');
mobileMenu.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    authButtons.classList.toggle('active');
    
    // Animate hamburger to X
    const spans = this.querySelectorAll('span');
    if (this.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    }
});
    
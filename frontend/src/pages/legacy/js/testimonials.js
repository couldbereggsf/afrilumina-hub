// ====================================
//   TESTIMONIAL AUTO-SLIDER
// ====================================

const testimonials = document.querySelectorAll('.testimonial');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonials.forEach((t, i) => {
        t.classList.remove('active');
        t.style.opacity = '0';
        t.style.transform = 'translateY(20px)';
    });

    testimonials[index].classList.add('active');

    // Animate in
    setTimeout(() => {
        testimonials[index].style.opacity = '1';
        testimonials[index].style.transform = 'translateY(0)';
    }, 50);
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

if (testimonials.length > 0) {
    // Set initial styles
    testimonials.forEach(t => {
        t.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Show first
    showTestimonial(0);

    // Auto-rotate every 4.5 seconds
    setInterval(nextTestimonial, 4500);
}

// ====================================
//   TESTIMONIAL DOTS NAVIGATION
// ====================================

const dotsContainer = document.querySelector('.testimonial-dots');

if (dotsContainer && testimonials.length > 0) {
    testimonials.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentTestimonial = i;
            showTestimonial(i);
            updateDots(i);
        });
        dotsContainer.appendChild(dot);
    });
}

function updateDots(index) {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
    });
}

// Update dots in auto-rotation too
const originalNext = nextTestimonial;
// Patch to update dots
const intervalId = setInterval(() => {
    updateDots(currentTestimonial);
}, 500);

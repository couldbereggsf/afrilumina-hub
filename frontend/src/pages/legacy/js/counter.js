// ====================================
//   ANIMATED COUNTER
// ====================================

function animateCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const targetStr = counter.getAttribute('data-target');
        const target = parseFloat(targetStr);
        const isFloat = target % 1 !== 0 || targetStr.includes('.');
        const decimals = isFloat ? (targetStr.split('.')[1]?.length || 1) : 0;
        const duration = 2000;
        const startTime = performance.now();

        let suffix = '';
        if (counter.hasAttribute('data-suffix')) {
            suffix = counter.getAttribute('data-suffix');
        } else {
            if (target >= 1000) {
                suffix = 'k+';
            } else if (target === 96 || target === 90 || target === 98) {
                suffix = '%';
            } else if (target >= 50) {
                suffix = '+';
            }
        }

        let prefix = counter.hasAttribute('data-prefix') ? counter.getAttribute('data-prefix') : '';

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);

            if (progress < 1) {
                if (counter.hasAttribute('data-suffix') || isFloat || target < 1000) {
                    const current = easedProgress * target;
                    const displayVal = isFloat ? current.toFixed(decimals) : Math.floor(current).toLocaleString();
                    counter.textContent = prefix + displayVal + suffix;
                } else {
                    const current = Math.floor(easedProgress * target);
                    const kVal = (current / 1000).toFixed(current >= 1000 && current % 1000 !== 0 ? 1 : 0);
                    counter.textContent = prefix + kVal + suffix;
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (counter.hasAttribute('data-suffix') || isFloat) {
                    const finalVal = isFloat ? target.toFixed(decimals) : target.toLocaleString();
                    counter.textContent = prefix + finalVal + suffix;
                } else if (target >= 1000) {
                    counter.textContent = prefix + (target / 1000).toFixed(target % 1000 !== 0 ? 1 : 0) + 'k+';
                } else {
                    counter.textContent = prefix + target.toLocaleString() + suffix;
                }
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// ====================================
//   INTERSECTION OBSERVER FOR COUNTERS
// ====================================

const statsSections = document.querySelectorAll('.stats, .about-stats-section');

if (statsSections.length > 0) {
    let counterStarted = false;

    function checkAndStartCounter() {
        if (counterStarted) return;
        statsSections.forEach(section => {
            if (section.getBoundingClientRect().top < window.innerHeight + 150) {
                counterStarted = true;
                animateCounters();
            }
        });
    }

    window.addEventListener('scroll', checkAndStartCounter);
    window.addEventListener('load', checkAndStartCounter);
    window.addEventListener('DOMContentLoaded', checkAndStartCounter);
    setTimeout(checkAndStartCounter, 200);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterStarted) {
                counterStarted = true;
                animateCounters();
            }
        });
    }, {
        threshold: 0.1
    });

    statsSections.forEach(section => observer.observe(section));
}

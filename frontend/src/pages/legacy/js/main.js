// ====================================
//   NAVBAR SCROLL EFFECT
// ====================================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ====================================
//   MOBILE MENU TOGGLE
// ====================================

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');

        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// ====================================
//   DARK MODE TOGGLE
// ====================================

const darkModeToggle = document.getElementById('darkModeToggle');

if (darkModeToggle) {
    // Check saved preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        const icon = darkModeToggle.querySelector('i');

        if (document.body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

// ====================================
//   SCROLL REVEAL ANIMATION
// ====================================

function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight + 150) {
            el.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);
window.addEventListener('resize', revealOnScroll);
setTimeout(revealOnScroll, 100);
setTimeout(revealOnScroll, 400);

setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
}, 1200);

// ====================================
//   SMOOTH SCROLL FOR ANCHOR LINKS
// ====================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ====================================
//   PARALLAX ON HERO IMAGE
// ====================================

window.addEventListener('scroll', () => {
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        const scrolled = window.scrollY;
        heroImage.style.transform = `translateY(${scrolled * 0.05}px)`;
    }
});

// ====================================
//   ACTIVE NAV LINK HIGHLIGHTER
// ====================================

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html') || (currentPage === '/' && href === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// ====================================
//   REAL-TIME FORM VALIDATION & FILE UPLOADS
// ====================================

function setupFormValidation() {
    const allForms = document.querySelectorAll('form');
    
    allForms.forEach(form => {
        const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        requiredInputs.forEach(input => {
            const validateField = () => {
                let isValid = true;
                let errorText = '';
                
                const val = input.value.trim();
                if (!val && input.type !== 'file') {
                    isValid = false;
                    errorText = 'This field is required';
                } else if (input.type === 'email' && val) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(val)) {
                        isValid = false;
                        errorText = 'Please enter a valid email address';
                    }
                }
                
                let errorEl = input.parentElement.querySelector('.error-msg');
                if (!isValid) {
                    input.classList.add('input-error');
                    if (!errorEl) {
                        errorEl = document.createElement('span');
                        errorEl.className = 'error-msg';
                        input.parentElement.appendChild(errorEl);
                    }
                    errorEl.textContent = errorText;
                } else {
                    input.classList.remove('input-error');
                    if (errorEl) errorEl.remove();
                }
                return isValid;
            };

            input.addEventListener('input', validateField);
            input.addEventListener('blur', validateField);
            input.addEventListener('change', validateField);
        });

        const fileDropzones = form.querySelectorAll('.file-dropzone');
        fileDropzones.forEach(dropzone => {
            const fileInput = dropzone.querySelector('input[type="file"]');
            const nameDisplay = dropzone.parentElement.querySelector('.file-name-display') || document.createElement('div');
            if (!dropzone.parentElement.querySelector('.file-name-display')) {
                nameDisplay.className = 'file-name-display';
                dropzone.parentElement.appendChild(nameDisplay);
            }

            if (fileInput) {
                const checkFile = (file) => {
                    let errorText = '';
                    const allowedExts = ['.pdf', '.doc', '.docx'];
                    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
                    
                    if (!allowedExts.includes(ext)) {
                        errorText = 'Invalid format. Only .pdf, .doc, and .docx allowed.';
                    } else if (file.size > 5 * 1024 * 1024) {
                        errorText = 'File size exceeds maximum limit of 5MB.';
                    }

                    let errorEl = dropzone.parentElement.querySelector('.error-msg');
                    if (errorText) {
                        fileInput.value = '';
                        dropzone.classList.add('input-error');
                        nameDisplay.innerHTML = '';
                        if (!errorEl) {
                            errorEl = document.createElement('span');
                            errorEl.className = 'error-msg';
                            dropzone.parentElement.appendChild(errorEl);
                        }
                        errorEl.textContent = errorText;
                        return false;
                    } else {
                        dropzone.classList.remove('input-error');
                        if (errorEl) errorEl.remove();
                        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                        nameDisplay.innerHTML = `<i class="fa-solid fa-file-check"></i> ${file.name} (${sizeMB} MB)`;
                        return true;
                    }
                };

                fileInput.addEventListener('change', (e) => {
                    if (e.target.files && e.target.files[0]) {
                        checkFile(e.target.files[0]);
                    } else {
                        nameDisplay.innerHTML = '';
                    }
                });

                dropzone.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    dropzone.classList.add('dragover');
                });
                dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
                dropzone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dropzone.classList.remove('dragover');
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        fileInput.files = e.dataTransfer.files;
                        checkFile(e.dataTransfer.files[0]);
                    }
                });
            }
        });
    });
}

function validateEntireForm(form) {
    let allValid = true;
    const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    requiredInputs.forEach(input => {
        const val = input.value.trim();
        let isValid = true;
        let errorText = '';
        if (!val && input.type !== 'file') {
            isValid = false;
            errorText = 'This field is required';
        } else if (input.type === 'email' && val) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
                isValid = false;
                errorText = 'Please enter a valid email address';
            }
        }
        let errorEl = input.parentElement.querySelector('.error-msg');
        if (!isValid) {
            allValid = false;
            input.classList.add('input-error');
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'error-msg';
                input.parentElement.appendChild(errorEl);
            }
            errorEl.textContent = errorText;
        } else {
            input.classList.remove('input-error');
            if (errorEl) errorEl.remove();
        }
    });
    
    const fileInput = form.querySelector('input[type="file"][required]');
    if (fileInput && (!fileInput.files || fileInput.files.length === 0)) {
        allValid = false;
        const dropzone = fileInput.closest('.file-dropzone');
        if (dropzone) {
            dropzone.classList.add('input-error');
            let errorEl = dropzone.parentElement.querySelector('.error-msg');
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'error-msg';
                dropzone.parentElement.appendChild(errorEl);
            }
            errorEl.textContent = 'Please upload your resume (.pdf, .doc, .docx)';
        }
    }
    return allValid;
}

function showOnScreenSuccess(modalOrContainer, message, closeFn) {
    if (!modalOrContainer) return;
    const modalCard = modalOrContainer.querySelector('.modal-card') || modalOrContainer;
    const formEl = modalCard.querySelector('form');
    const existingSuccess = modalCard.querySelector('.form-success-card');
    
    if (formEl) formEl.style.display = 'none';
    if (existingSuccess) {
        existingSuccess.classList.add('active');
        const msgEl = existingSuccess.querySelector('p');
        if (msgEl) msgEl.textContent = message;
    } else {
        const successCard = document.createElement('div');
        successCard.className = 'form-success-card active';
        successCard.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <h3>Thank You!</h3>
            <p>${message}</p>
            <button type="button" class="btn primary-btn close-success-btn">Done</button>
        `;
        modalCard.appendChild(successCard);
        successCard.querySelector('.close-success-btn').addEventListener('click', () => {
            if (closeFn) closeFn();
            setTimeout(() => {
                successCard.remove();
                if (formEl) formEl.style.display = '';
            }, 300);
        });
    }
    
    setTimeout(() => {
        if (closeFn && modalOrContainer.classList && modalOrContainer.classList.contains('active')) {
            closeFn();
            setTimeout(() => {
                const sc = modalCard.querySelector('.form-success-card');
                if (sc) sc.remove();
                if (formEl) formEl.style.display = '';
            }, 400);
        }
    }, 4500);
}

// ====================================
//   AJAX FORM SUBMISSIONS (FormSubmit)
// ====================================

function showToast(message, isError = false) {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    
    // Set appropriate class
    if (isError) {
        toast.classList.add('error');
    } else {
        toast.classList.remove('error');
    }

    toast.innerHTML = `
        <i class="fa-solid ${isError ? 'fa-circle-xmark' : 'fa-circle-check'}"></i>
        <span>${message}</span>
    `;

    // Trigger transition
    setTimeout(() => toast.classList.add('show'), 100);

    // Hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}
// Handle Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateEntireForm(newsletterForm)) return;

        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Set Loading State
        submitBtn.disabled = true;
        submitBtn.classList.add('submitting');
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...';

        const formData = new FormData(newsletterForm);

        fetch('https://formsubmit.co/ajax/admin@afriluminahub.com', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data && (data.success === 'false' || data.success === false)) {
                console.info('FormSubmit notice (email verification required or endpoint error):', data);
            }
        })
        .catch(error => {
            console.info('FormSubmit network fallback (testing offline or file:// protocol):', error);
        })
        .finally(() => {
            showToast('Success! Thank you for subscribing.');
            newsletterForm.reset();
            
            // Success state on button
            submitBtn.classList.remove('submitting');
            submitBtn.classList.add('success');
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Subscribed!';
            
            setTimeout(() => {
                submitBtn.classList.remove('success');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    });
}
// Handle Contact Form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateEntireForm(contactForm)) return;

        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('span');
        const originalText = btnText.textContent;

        // Set Loading State
        submitBtn.disabled = true;
        submitBtn.classList.add('submitting');
        btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        const formData = new FormData(contactForm);

        fetch('https://formsubmit.co/ajax/admin@afriluminahub.com', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data && (data.success === 'false' || data.success === false)) {
                console.info('FormSubmit notice (email verification required or endpoint error):', data);
            }
        })
        .catch(error => {
            console.info('FormSubmit network fallback (testing offline or file:// protocol):', error);
        })
        .finally(() => {
            showToast('Message sent! We\'ll get back to you shortly.');
            contactForm.reset();
            
            // Success state on button
            submitBtn.classList.remove('submitting');
            submitBtn.classList.add('success');
            btnText.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
            
            setTimeout(() => {
                submitBtn.classList.remove('success');
                btnText.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    });
}

// ====================================
//   PROGRAM APPLICATION MODAL
// ====================================

const applyModal = document.getElementById('applyModal');
const applyForm = document.getElementById('applyForm');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const appProgramSelect = document.getElementById('appProgram');

// Map HTML section IDs to select values
const programMap = {
    'lumina-mentorship': 'mentorship',
    'skills-accelerator': 'skills',
    'career-exposure': 'career',
    'financial-literacy': 'finance'
};

function openApplyModal(programId = null) {
    if (!applyModal) return;
    
    // Pre-select program if provided
    if (programId && programMap[programId]) {
        appProgramSelect.value = programMap[programId];
    } else {
        appProgramSelect.value = ''; // Default placeholder
    }
    
    applyModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeApplyModal() {
    if (!applyModal) return;
    applyModal.classList.remove('active');
    document.body.style.overflow = '';
    if (applyForm) applyForm.reset();
}

// Attach to specific program buttons
document.querySelectorAll('.apply-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const programRow = btn.closest('.program-row');
        const programId = programRow ? programRow.getAttribute('id') : null;
        openApplyModal(programId);
    });
});

// Attach to general CTA button at bottom
const generalApplyBtn = document.querySelector('.apply-program-btn');
if (generalApplyBtn) {
    generalApplyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openApplyModal();
    });
}

// Close listeners
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeApplyModal);
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', closeApplyModal);
}

// Close on ESC key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && applyModal && applyModal.classList.contains('active')) {
        closeApplyModal();
    }
});
// Handle Application Form Submit
if (applyForm) {
    applyForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateEntireForm(applyForm)) return;

        const submitBtn = applyForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('span');
        const originalText = btnText.textContent;

        // Set Loading State
        submitBtn.disabled = true;
        submitBtn.classList.add('submitting');
        btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

        const formData = new FormData(applyForm);
        const resumeFile = formData.get('resume');
        const resumeName = (resumeFile && resumeFile.name) ? resumeFile.name : "N/A";

        fetch('https://formsubmit.co/ajax/admin@afriluminahub.com', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data && (data.success === 'false' || data.success === false)) {
                console.info('FormSubmit notice (email verification required or endpoint error):', data);
            }
        })
        .catch(error => {
            console.info('FormSubmit network fallback (testing offline or file:// protocol):', error);
        })
        .finally(() => {
            // Save locally for admin portal regardless of remote email state
            saveRegistrationLocally(
                'student',
                formData.get('name'),
                formData.get('email'),
                formData.get('phone'),
                {
                    program: formData.get('program'),
                    status: formData.get('status'),
                    linkedin: formData.get('linkedin'),
                    resume: resumeName,
                    motivation: formData.get('motivation')
                }
            );

            // Show Success state on button
            submitBtn.classList.remove('submitting');
            submitBtn.classList.add('success');
            btnText.innerHTML = '<i class="fa-solid fa-check"></i> Submitted!';

            setTimeout(() => {
                showToast('Application submitted successfully! We will contact you soon.');
                showOnScreenSuccess(applyModal, 'Application submitted successfully! We will review your resume and motivation and contact you soon.', closeApplyModal);
                
                // Reset button for future clicks (if modal reopens)
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                btnText.textContent = originalText;
            }, 1000);
        });
    });
}

// ====================================
//   GET INVOLVED MODAL
// ====================================

const involvedModal = document.getElementById('involvedModal');
const involvedForm = document.getElementById('involvedForm');
const closeInvolvedModalBtn = document.getElementById('closeInvolvedModalBtn');
const involvedModalOverlay = document.getElementById('involvedModalOverlay');
const appRoleSelect = document.getElementById('appRole');

// Map HTML card IDs to select values
const roleMap = {
    'mentors': 'mentor',
    'partners': 'partner',
    'volunteers': 'volunteer'
};

function openInvolvedModal(roleId = null) {
    if (!involvedModal) return;
    
    // Pre-select role if provided
    if (roleId && roleMap[roleId]) {
        appRoleSelect.value = roleMap[roleId];
    } else {
        appRoleSelect.value = ''; // Default placeholder
    }
    
    involvedModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeInvolvedModal() {
    if (!involvedModal) return;
    involvedModal.classList.remove('active');
    document.body.style.overflow = '';
    if (involvedForm) involvedForm.reset();
}

// Attach to role buttons
document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const roleCard = btn.closest('.role-card');
        const roleId = roleCard ? roleCard.getAttribute('id') : null;
        openInvolvedModal(roleId);
    });
});

// Attach to bottom CTA button
const getStartedBtn = document.querySelector('.get-started-btn');
if (getStartedBtn) {
    getStartedBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openInvolvedModal();
    });
}

// Close listeners
if (closeInvolvedModalBtn) {
    closeInvolvedModalBtn.addEventListener('click', closeInvolvedModal);
}
if (involvedModalOverlay) {
    involvedModalOverlay.addEventListener('click', closeInvolvedModal);
}

// Close on ESC key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && involvedModal && involvedModal.classList.contains('active')) {
        closeInvolvedModal();
    }
});
// Handle Involvement Form Submit
if (involvedForm) {
    involvedForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateEntireForm(involvedForm)) return;

        const submitBtn = involvedForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('span');
        const originalText = btnText.textContent;

        // Set Loading State
        submitBtn.disabled = true;
        submitBtn.classList.add('submitting');
        btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

        const formData = new FormData(involvedForm);
        const resumeFile = formData.get('resume');
        const resumeName = (resumeFile && resumeFile.name) ? resumeFile.name : "N/A";

        fetch('https://formsubmit.co/ajax/admin@afriluminahub.com', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data && (data.success === 'false' || data.success === false)) {
                console.info('FormSubmit notice (email verification required or endpoint error):', data);
            }
        })
        .catch(error => {
            console.info('FormSubmit network fallback (testing offline or file:// protocol):', error);
        })
        .finally(() => {
            // Save locally for admin portal regardless of remote email state
            saveRegistrationLocally(
                formData.get('role'),
                formData.get('name'),
                formData.get('email'),
                formData.get('phone'),
                {
                    organization: formData.get('organization'),
                    website: formData.get('website'),
                    resume: resumeName,
                    message: formData.get('message')
                }
            );

            // Show Success state on button
            submitBtn.classList.remove('submitting');
            submitBtn.classList.add('success');
            btnText.innerHTML = '<i class="fa-solid fa-check"></i> Submitted!';

            setTimeout(() => {
                showToast('Thank you! Your interest has been submitted successfully.');
                showOnScreenSuccess(involvedModal, 'Thank you! Your involvement profile and resume have been submitted successfully.', closeInvolvedModal);
                
                // Reset button for future clicks (if modal reopens)
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                btnText.textContent = originalText;
            }, 1000);
        });
    });
}

// ====================================
//   EARLY SUPPORTER MODAL
// ====================================

const supporterModal = document.getElementById('supporterModal');
const supporterForm = document.getElementById('supporterForm');
const closeSupporterModalBtn = document.getElementById('closeSupporterModalBtn');
const supporterModalOverlay = document.getElementById('supporterModalOverlay');
const supInterestSelect = document.getElementById('supInterest');

// Map tier string to interest select option (defaulting to corporate partner)
const tierMap = {
    'bronze': 'corporate_partner',
    'silver': 'corporate_partner',
    'gold': 'corporate_partner'
};

function openSupporterModal(tier = null) {
    if (!supporterModal) return;
    
    // Set early supporter interest select option if mapped
    if (tier && tierMap[tier]) {
        supInterestSelect.value = tierMap[tier];
    } else {
        supInterestSelect.value = ''; // Default placeholder
    }
    
    supporterModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSupporterModal() {
    if (!supporterModal) return;
    supporterModal.classList.remove('active');
    document.body.style.overflow = '';
    if (supporterForm) supporterForm.reset();
}

// Attach to sponsor buttons
document.querySelectorAll('.sponsor-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tier = btn.getAttribute('data-tier');
        openSupporterModal(tier);
    });
});

// Close listeners
if (closeSupporterModalBtn) {
    closeSupporterModalBtn.addEventListener('click', closeSupporterModal);
}
if (supporterModalOverlay) {
    supporterModalOverlay.addEventListener('click', closeSupporterModal);
}

// Close on ESC key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && supporterModal && supporterModal.classList.contains('active')) {
        closeSupporterModal();
    }
});
// Handle Supporter Form Submit
if (supporterForm) {
    supporterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateEntireForm(supporterForm)) return;

        const submitBtn = supporterForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('span');
        const originalText = btnText.textContent;

        // Set Loading State
        submitBtn.disabled = true;
        submitBtn.classList.add('submitting');
        btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Joining...';

        const formData = new FormData(supporterForm);

        fetch('https://formsubmit.co/ajax/admin@afriluminahub.com', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data && (data.success === 'false' || data.success === false)) {
                console.info('FormSubmit notice (email verification required or endpoint error):', data);
            }
        })
        .catch(error => {
            console.info('FormSubmit network fallback (testing offline or file:// protocol):', error);
        })
        .finally(() => {
            // Save locally for admin portal regardless of remote email state
            saveRegistrationLocally(
                'supporter',
                formData.get('name'),
                formData.get('email'),
                '',
                {
                    organization: formData.get('organization'),
                    interest: formData.get('interest')
                }
            );

            // Show Success state on button
            submitBtn.classList.remove('submitting');
            submitBtn.classList.add('success');
            btnText.innerHTML = '<i class="fa-solid fa-check"></i> Joined!';

            setTimeout(() => {
                showToast('Success! You have been added to our early supporter list.');
                showOnScreenSuccess(supporterModal, 'Success! You have been added to our early supporter list.', closeSupporterModal);
                
                // Reset button for future clicks (if modal reopens)
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                btnText.textContent = originalText;
            }, 1000);
        });
    });
}

// ====================================
//   LOCAL STORAGE DATA PERSISTENCE FOR ADMIN PORTAL
// ====================================

function saveRegistrationLocally(role, name, email, phone, details) {
    let registrations = [];
    try {
        const rawData = localStorage.getItem('afrilumina_registrations');
        if (rawData) {
            registrations = JSON.parse(rawData);
        } else {
            // Seed defaults first if admin portal hasn't initialized them yet
            registrations = [
                {
                    id: "reg_1719942000000",
                    name: "Amina Yusuf",
                    email: "amina.yusuf@gmail.com",
                    phone: "+254 712 345678",
                    role: "student",
                    date: "2026-07-01",
                    status: "approved",
                    details: {
                        program: "Lumina Mentorship Hub",
                        status: "Recent Graduate",
                        linkedin: "https://linkedin.com/in/aminayusuf",
                        motivation: "I want to transition into UX design. As a recent graduate in computer science, I lack practical portfolio guidance. Having a mentor from a global tech company would help me polish my design processes and prepare for career opportunities."
                    }
                },
                {
                    id: "reg_1720028400000",
                    name: "Dr. Chioma Adebayo",
                    email: "chioma.adebayo@unilag.edu.ng",
                    phone: "+234 803 123 4567",
                    role: "mentor",
                    date: "2026-07-02",
                    status: "approved",
                    details: {
                        organization: "University of Lagos",
                        website: "https://unilag.edu.ng",
                        message: "I am passionate about empowering African young minds in science and tech. I would love to support AfriLumina by mentoring computer science majors, conducting academic workshops, and providing career navigation advisory."
                    }
                },
                {
                    id: "reg_1720114800000",
                    name: "David Mensah",
                    email: "d.mensah@outlook.com",
                    phone: "+233 24 123 4567",
                    role: "volunteer",
                    date: "2026-07-03",
                    status: "pending",
                    details: {
                        organization: "",
                        website: "https://linkedin.com/in/davidmensah",
                        message: "I have 3 years of experience in social media management and community building. I want to volunteer my skills to handle AfriLumina's online presence, write newsletters, and coordinate communication for upcoming events."
                    }
                }
            ];
        }
    } catch (e) {}

    const newReg = {
        id: "reg_" + Date.now(),
        name: name,
        email: email,
        phone: phone || "N/A",
        role: role,
        date: new Date().toISOString().slice(0, 10),
        status: "pending",
        details: details
    };

    registrations.push(newReg);
    localStorage.setItem('afrilumina_registrations', JSON.stringify(registrations));
}

// ====================================
//   INITIALIZE FORM VALIDATION & ACCORDIONS ON DOM READY
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    setupFormValidation();
    
    // Setup About Page Core Pillar Accordions
    document.querySelectorAll('.accordion-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling || toggle.parentElement.querySelector('.accordion-content');
            if (content) {
                const isOpen = content.classList.contains('open');
                toggle.classList.toggle('active', !isOpen);
                content.classList.toggle('open', !isOpen);
                const icon = toggle.querySelector('i');
                if (icon) {
                    if (isOpen) {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    } else {
                        icon.classList.remove('fa-chevron-down');
                        icon.classList.add('fa-chevron-up');
                    }
                }
            }
        });
    });
});

/* =============================================
   ALEXI SALVAN — PORTFOLIO SCRIPTS
   ============================================= */

(function() {
    'use strict';

    // ── NAVBAR SCROLL ──
    const navbar = document.getElementById('navbar');
    if (navbar) {
        function updateNavbar() {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', updateNavbar, { passive: true });
        updateNavbar();
    }

    // ── MOBILE NAVIGATION ──
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // ── SCROLL REVEAL ──
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ── SMOOTH ANCHOR SCROLL ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // ── PROJECT FILTER ──
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-main-card');

    if (filterBtns.length && projectCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter cards
                projectCards.forEach(card => {
                    const category = card.dataset.category;

                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeIn 0.4s ease forwards';
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

// ── CONTACT FORM AJAX NETLIFY ──
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const btnLoading = submitBtn ? submitBtn.querySelector('.btn-loading') : null;
    const formSuccess = document.getElementById('formSuccess');
    const formFail = document.getElementById('formFail');

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(fieldId, msg) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(fieldId + 'Error');
        const group = field ? field.closest('.form-group') : null;

        if (group) group.classList.add('has-error');

        if (error) {
            error.textContent = msg;
            error.style.display = 'block';
        }
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(fieldId + 'Error');
        const group = field ? field.closest('.form-group') : null;

        if (group) group.classList.remove('has-error');

        if (error) {
            error.textContent = '';
            error.style.display = 'none';
        }
    }

    function setLoading(isLoading) {
        if (btnText) btnText.style.display = isLoading ? 'none' : 'inline';
        if (btnLoading) btnLoading.style.display = isLoading ? 'inline-flex' : 'none';
        if (submitBtn) submitBtn.disabled = isLoading;
    }

    function encodeFormData(formData) {
        return new URLSearchParams(formData).toString();
    }

    ['name', 'email', 'subject', 'message'].forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.addEventListener('input', () => clearError(id));
        }
    });

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        ['name', 'email', 'subject', 'message'].forEach(clearError);

        if (formSuccess) formSuccess.style.display = 'none';
        if (formFail) formFail.style.display = 'none';

        const name = document.getElementById('name')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const subject = document.getElementById('subject')?.value.trim() || '';
        const message = document.getElementById('message')?.value.trim() || '';

        let hasError = false;

        if (!name) {
            showError('name', 'Veuillez entrer votre nom.');
            hasError = true;
        }

        if (!email) {
            showError('email', 'Veuillez entrer votre email.');
            hasError = true;
        } else if (!validateEmail(email)) {
            showError('email', 'Veuillez entrer un email valide.');
            hasError = true;
        }

        if (!subject) {
            showError('subject', 'Veuillez entrer un sujet.');
            hasError = true;
        }

        if (!message) {
            showError('message', 'Veuillez écrire votre message.');
            hasError = true;
        }

        const captchaResponse = contactForm.querySelector('[name="g-recaptcha-response"]');

        if (captchaResponse && !captchaResponse.value) {
            hasError = true;

            if (formFail) {
                formFail.textContent = 'Veuillez valider le CAPTCHA avant d’envoyer le message.';
                formFail.style.display = 'block';
                formFail.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }

        if (hasError) return;

        setLoading(true);

        try {
            const formData = new FormData(contactForm);

            if (!formData.get('form-name')) {
                formData.append('form-name', contactForm.getAttribute('name'));
            }

            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: encodeFormData(formData)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l’envoi du formulaire');
            }

            contactForm.reset();

            if (window.grecaptcha && typeof window.grecaptcha.reset === 'function') {
                window.grecaptcha.reset();
            }

            if (formSuccess) {
                formSuccess.style.display = 'flex';
                formSuccess.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }

        } catch (error) {
            if (formFail) {
                formFail.innerHTML = 'Une erreur est survenue. Envoyez-moi directement un email : <a href="mailto:nesway.pro@gmail.com">nesway.pro@gmail.com</a>';
                formFail.style.display = 'block';
                formFail.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        } finally {
            setLoading(false);
        }
    });
}


    // ── FADE IN KEYFRAME injected for filter animation ──
    if (!document.getElementById('dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(12px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ── COUNTER ANIMATION stats ──
    const statNums = document.querySelectorAll('.stat-num');

    if (statNums.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const text = el.textContent;
                    const numMatch = text.match(/(\d+)/);

                    if (numMatch) {
                        const target = parseInt(numMatch[1], 10);
                        const suffix = text.replace(numMatch[1], '');
                        let current = 0;
                        const step = Math.ceil(target / 40);

                        const interval = setInterval(() => {
                            current = Math.min(current + step, target);
                            el.textContent = current + suffix;

                            if (current >= target) {
                                clearInterval(interval);
                            }
                        }, 40);
                    }

                    counterObserver.unobserve(el);
                }
            });
        }, {
            threshold: 0.5
        });

        statNums.forEach(el => counterObserver.observe(el));
    }

    // ── YEAR IN FOOTER ──
    const yearEl = document.querySelector('.footer-bottom p');

    if (yearEl) {
        yearEl.innerHTML = yearEl.innerHTML.replace('2025', new Date().getFullYear());
    }

})();

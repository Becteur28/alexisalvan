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
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    // ── CONTACT FORM ──
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
            const group = field.closest('.form-group');
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
            if (error) error.style.display = 'none';
        }

        // Live validation
        ['name', 'email', 'subject', 'message'].forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.addEventListener('input', () => clearError(id));
            }
        });

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Clear previous errors
            ['name', 'email', 'subject', 'message'].forEach(clearError);

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

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

            if (hasError) return;

            // Show loading state
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline-flex';
            if (submitBtn) submitBtn.disabled = true;
            if (formSuccess) formSuccess.style.display = 'none';
            if (formFail) formFail.style.display = 'none';

            try {
                // Build mailto link as fallback (since we don't have a backend)
                const mailtoSubject = encodeURIComponent(subject);
                const mailtoBody = encodeURIComponent(
                    `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
                );
                window.location.href = `mailto:nesway.pro@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

                // Show success
                if (formSuccess) {
                    formSuccess.style.display = 'flex';
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                contactForm.reset();
            } catch (err) {
                if (formFail) {
                    formFail.style.display = 'block';
                    formFail.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } finally {
                if (btnText) btnText.style.display = 'inline';
                if (btnLoading) btnLoading.style.display = 'none';
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    // ── FADE IN KEYFRAME (injected for filter animation) ──
    if (!document.getElementById('dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(12px); }
                to   { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // ── COUNTER ANIMATION (stats) ──
    const statNums = document.querySelectorAll('.stat-num');
    if (statNums.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const text = el.textContent;
                    const numMatch = text.match(/(\d+)/);
                    if (numMatch) {
                        const target = parseInt(numMatch[1]);
                        const suffix = text.replace(numMatch[1], '');
                        let current = 0;
                        const step = Math.ceil(target / 40);
                        const interval = setInterval(() => {
                            current = Math.min(current + step, target);
                            el.textContent = current + suffix;
                            if (current >= target) clearInterval(interval);
                        }, 40);
                    }
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNums.forEach(el => counterObserver.observe(el));
    }

    // ── YEAR IN FOOTER ──
    const yearEl = document.querySelector('.footer-bottom p');
    if (yearEl) {
        yearEl.innerHTML = yearEl.innerHTML.replace('2025', new Date().getFullYear());
    }

})();

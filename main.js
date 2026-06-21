/* ===========================
   Portfolio, Interactions
   =========================== */

(function () {
    'use strict';

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            navToggle.innerHTML = isOpen
                ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
                : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
            });
        });
    }

    // --- Scroll-based Animations (skip static/no-motion preference) ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
    } else {
        document.querySelectorAll('.animate-in').forEach(el => el.classList.add('visible'));
    }

    // --- Active Nav Highlighting ---
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.id;
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);

            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // --- Refresh recent writing links (only if index has posts; never shrink below static fallback) ---
    async function loadRecentWriting() {
        const container = document.getElementById('recent-writing');
        if (!container || !window.RNPosts) return;

        const staticCount = container.querySelectorAll('.writing-link').length;

        try {
            const posts = await window.RNPosts.fetchPosts();
            if (posts.length === 0) return;
            // Don't replace static fallbacks with a shorter list (e.g. stale deploy with 1 post)
            if (staticCount > 0 && posts.length < staticCount) return;

            container.innerHTML = posts.map(post => window.RNPosts.renderWritingLink(post)).join('');
        } catch (e) {
            // Static links in HTML stay visible
        }
    }

    loadRecentWriting();
})();

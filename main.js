/* ===========================
   Portfolio — Interactions
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
            // swap icon
            navToggle.innerHTML = isOpen
                ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
                : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        });

        // close on link click
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
            });
        });
    }

    // --- Scroll-based Animations ---
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

    // --- Load Latest Blog Posts ---
    async function loadLatestPosts() {
        const container = document.getElementById('latest-posts');
        if (!container) return;

        try {
            const res = await fetch('posts/index.json');
            if (!res.ok) throw new Error('no posts');
            const posts = await res.json();

            if (posts.length === 0) {
                container.innerHTML = '<p class="blog-empty">nothing here yet.</p>';
                return;
            }

            const latest = posts.slice(0, 3);
            container.innerHTML = latest.map(post => `
                <a href="blog.html?post=${post.slug}" class="post-card">
                    <time>${post.date}</time>
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                </a>
            `).join('');
        } catch (e) {
            // blog not available — hide section gracefully
            const blogSection = document.getElementById('blog');
            if (blogSection) blogSection.style.display = 'none';
        }
    }

    loadLatestPosts();
})();

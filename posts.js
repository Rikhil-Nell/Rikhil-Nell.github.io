/* Shared blog post loader — used by index (main.js) and blog.html */
(function () {
    'use strict';

    const INDEX_URL = 'posts/index.json';

    async function fetchPosts() {
        const res = await fetch(INDEX_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('posts index unavailable');
        const posts = await res.json();
        return posts.sort((a, b) => b.date.localeCompare(a.date));
    }

    function renderPostCard(post) {
        return `
            <a href="blog.html?post=${post.slug}" class="post-card">
                <time>${post.date}</time>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
            </a>
        `;
    }

    function renderBlogListItem(post) {
        return `
            <a href="blog.html?post=${post.slug}" class="blog-list-item">
                <time>${post.date}</time>
                <div class="list-item-content">
                    <h3>${post.title}</h3>
                    <p>${post.excerpt}</p>
                </div>
            </a>
        `;
    }

    window.RNPosts = {
        INDEX_URL,
        fetchPosts,
        renderPostCard,
        renderBlogListItem
    };
})();

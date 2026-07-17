import { getPostById } from '../data/posts.js';

export async function initBlogPost() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  const post = getPostById(id);

  if (!post) {
    document.querySelector('.blog-post-content').innerHTML = `
      <div style="text-align:center;padding:var(--space-16) 0">
        <h1 style="font-family:var(--font-serif);font-size:var(--fs-4xl)">Post Not Found</h1>
        <p style="color:var(--text-tertiary);margin:var(--space-4) 0 var(--space-8)">The article you're looking for doesn't exist or may have been removed.</p>
        <a href="blog.html" class="btn btn-primary">Back to Blog</a>
      </div>
    `;
    document.querySelector('.blog-post-hero').style.display = 'none';
    return;
  }

  // Hero
  const hero = document.querySelector('.blog-post-hero');
  hero.style.backgroundImage = `linear-gradient(135deg, rgba(17,17,17,0.85) 0%, rgba(26,26,26,0.6) 100%), url(${post.image})`;

  document.querySelector('.blog-post-category').textContent = post.category;
  document.querySelector('.blog-post-title').textContent = post.title;
  document.querySelector('.blog-post-meta').innerHTML = `${post.date} &middot; ${post.readTime}`;
  document.querySelector('.blog-post-author').textContent = `By ${post.author}`;

  // Content
  document.querySelector('.blog-post-body').innerHTML = post.content;

  // Sidebar recent posts
  const recentList = document.querySelector('.blog-post-recent');
  if (recentList) {
    const { blogPosts } = await import('../data/posts.js');
    const recent = blogPosts.filter(p => p.id !== post.id).slice(0, 3);
    recentList.innerHTML = '';
    recent.forEach(p => {
      const a = document.createElement('a');
      a.href = `blog-post.html?id=${p.id}`;
      a.className = 'blog-post-recent-item';
      a.innerHTML = `
        <img src="${p.image}" alt="${p.title}" loading="lazy" />
        <div>
          <div class="blog-post-recent-title">${p.title}</div>
          <div class="blog-post-recent-date">${p.date}</div>
        </div>
      `;
      recentList.appendChild(a);
    });
  }
}

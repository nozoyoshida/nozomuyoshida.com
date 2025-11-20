const fs = require('fs');
const path = require('path');
const marked = require('marked');
const frontMatter = require('front-matter');

const POSTS_DIR = path.join(__dirname, '../_posts');
const BLOG_DIR = path.join(__dirname, '../blog');
const TEMPLATE_PATH = path.join(__dirname, '../index.html');

// Ensure blog directory exists
if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR);
}

// Read the main index.html to use as a base for styling
const indexHtml = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// Extract head content to reuse styles
const headMatch = indexHtml.match(/<head>([\s\S]*?)<\/head>/);
const headContent = headMatch ? headMatch[1] : '';

// Common Header/Footer for Blog
// We'll create a simplified version of the header for the blog
const blogHeader = `
<div id="header" class="header-min">
    <div class="cv-section">
        <div class="col-md-12">
            <h1><a href="/" style="color: #333;">Nozomu Yoshida</a> <small style="font-size: 0.6em;">/ Blog</small></h1>
        </div>
    </div>
</div>
`;

const blogFooter = `
<div id="footer">
    <div class="copyright">
        <p>&copy; 2016–${new Date().getFullYear()} Nozomu Yoshida</p>
    </div>
</div>
`;

function generatePage(title, content, isIndex = false) {
    // Adjust paths for CSS/JS since we are in /blog/
    const adjustedHead = headContent.replace(/href="css\//g, 'href="../css/')
                                    .replace(/href="media\//g, 'href="../media/')
                                    .replace(/src="js\//g, 'src="../js/')
                                    .replace(/src="vendor\//g, 'src="../vendor/');

    return `<!DOCTYPE html>
<html>
<head>
    ${adjustedHead}
    <title>${title} | Nozomu Yoshida</title>
    <style>
        /* Blog specific overrides */
        #page { margin-top: 20px; }
        .blog-content { padding: 20px 0; }
        .blog-post { margin-bottom: 40px; }
        .blog-post h1 { font-size: 32px; margin-bottom: 10px; }
        .blog-post .date { color: #999; font-size: 14px; margin-bottom: 20px; display: block; }
        .blog-post-content { font-size: 16px; line-height: 1.8; }
        .blog-post-content h2 { margin-top: 30px; }
        .blog-post-content img { max-width: 100%; height: auto; margin: 20px 0; }
        .back-link { margin-bottom: 20px; display: inline-block; }
    </style>
</head>
<body>
<div id="page" class="container">
    ${blogHeader}
    
    <div id="content" class="cv-section blog-content">
        <div class="col-md-12">
            ${!isIndex ? '<a href="/blog/" class="back-link">&larr; Back to Blog</a>' : ''}
            ${content}
        </div>
    </div>

    ${blogFooter}
</div>
</body>
</html>`;
}

// Process Posts
const posts = [];
fs.readdirSync(POSTS_DIR).forEach(file => {
    if (path.extname(file) === '.md') {
        const fileContent = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
        const { attributes, body } = frontMatter(fileContent);
        const htmlContent = marked.parse(body);
        const slug = path.basename(file, '.md');
        
        posts.push({
            slug,
            title: attributes.title,
            date: attributes.date,
            html: htmlContent,
            ...attributes
        });

        // Generate Post Page
        const postHtml = generatePage(
            attributes.title,
            `<div class="blog-post">
                <h1>${attributes.title}</h1>
                <span class="date">${new Date(attributes.date).toLocaleDateString()}</span>
                <div class="blog-post-content">${htmlContent}</div>
             </div>`
        );
        fs.writeFileSync(path.join(BLOG_DIR, `${slug}.html`), postHtml);
    }
});

// Sort posts by date desc
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Generate Index Page
const indexContent = `
    <div class="blog-list">
        ${posts.map(post => `
            <div class="cv-item">
                <h3><a href="${post.slug}.html">${post.title}</a></h3>
                <h4 class="date">${new Date(post.date).toLocaleDateString()}</h4>
                <p>${post.excerpt || ''}</p>
            </div>
        `).join('')}
    </div>
`;

fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), generatePage('Blog', indexContent, true));

console.log('Blog built successfully!');

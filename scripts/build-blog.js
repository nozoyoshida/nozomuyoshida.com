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
<header id="header" class="header-min">
    <div class="cv-section">
        <div class="col-md-12">
            <h1><a href="/" style="color: #333;">Nozomu Yoshida</a> <small style="font-size: 0.6em;">/ Blog</small></h1>
        </div>
    </div>
</header>
`;

const blogFooter = `
<footer id="footer">
    <div class="copyright">
        <p>&copy; 2016–${new Date().getFullYear()} Nozomu Yoshida</p>
    </div>
</footer>
`;

function generatePage(title, content, isIndex = false, metadata = {}) {
    // Adjust paths for CSS/JS since we are in /blog/
    let adjustedHead = headContent.replace(/href="css\//g, 'href="../css/')
        .replace(/href="media\//g, 'href="../media/')
        .replace(/src="js\//g, 'src="../js/')
        .replace(/src="vendor\//g, 'src="../vendor/');

    // Remove default title and meta tags that we want to override
    adjustedHead = adjustedHead.replace(/<title>.*<\/title>/, '')
        .replace(/<meta name="description".*?>/, '')
        .replace(/<meta name="keywords".*?>/, '')
        .replace(/<link rel="canonical".*?>/, '')
        .replace(/<meta property="og:.*?>/g, '')
        .replace(/<meta property="twitter:.*?>/g, '');

    const pageTitle = `${title} | Nozomu Yoshida`;
    const pageDesc = metadata.description || "Nozomu Yoshida - M.S. in Informatics, Researcher, and Engineer specializing in HCI and Accessibility.";
    const pageUrl = metadata.url || "https://nozomuyoshida.com/blog/";
    const pageImage = metadata.image || "https://nozomuyoshida.com/media/profile/portrait_guitar.jpg";
    const pageType = isIndex ? 'website' : 'article';

    return `<!DOCTYPE html>
<html>
<head>
    ${adjustedHead}
    <title>${pageTitle}</title>
    <meta name="description" content="${pageDesc}">
    <link rel="canonical" href="${pageUrl}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${pageType}">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="${pageDesc}">
    <meta property="og:image" content="${pageImage}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary">
    <meta property="twitter:url" content="${pageUrl}">
    <meta property="twitter:title" content="${pageTitle}">
    <meta property="twitter:description" content="${pageDesc}">
    <meta property="twitter:image" content="${pageImage}">
    <meta property="twitter:site" content="@nozoyoshida">

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
    
    <main id="content" class="cv-section blog-content">
        <div class="col-md-12">
            ${!isIndex ? '<a href="/blog/" class="back-link">&larr; Back to Blog</a>' : ''}
            ${content}
        </div>
    </main>

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
            body: body, // Include raw body for length calculation
            ...attributes
        });

        // Generate Post Page
        const postHtml = generatePage(
            attributes.title,
            `<div class="blog-post">
                <h1>${attributes.title}</h1>
                <span class="date">${new Date(attributes.date).toLocaleDateString()}</span>
                <div class="blog-post-content">${htmlContent}</div>
             </div>`,
            false,
            {
                description: attributes.excerpt || attributes.description || `Read ${attributes.title} on Nozomu Yoshida's Blog`,
                url: `https://nozomuyoshida.com/blog/${slug}.html`,
                image: attributes.image
            }
        );
        fs.writeFileSync(path.join(BLOG_DIR, `${slug}.html`), postHtml);
    }
});

// Sort posts by date desc
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Generate Index Page
const indexContent = `
    <div class="blog-list">
        <div style="text-align: right; margin-bottom: 20px;">
            <a href="network/" class="btn btn-default"><i class="fa fa-share-alt"></i> View Network Graph</a>
        </div>
        ${posts.map(post => `
            <div class="cv-item">
                <h3><a href="${post.slug}.html">${post.title}</a></h3>
                <h4 class="date">${new Date(post.date).toLocaleDateString()}</h4>
                <p>${post.excerpt || ''}</p>
            </div>
        `).join('')}
    </div>
`;

fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), generatePage('Blog', indexContent, true, {
    description: "Blog of Nozomu Yoshida - Thoughts on HCI, Accessibility, and Technology.",
    url: "https://nozomuyoshida.com/blog/"
}));

// --- Network Visualization Data Generation ---

function getTokens(text) {
    return text.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 3); // Filter short words
}

function calculateSimilarity(tokens1, tokens2) {
    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size; // Jaccard similarity for simplicity
}

const nodes = posts.map((post, index) => ({
    id: post.slug,
    title: post.title,
    url: `/blog/${post.slug}.html`,
    group: post.category || 'General',
    size: post.body.length // Use markdown body length
}));

const links = [];
for (let i = 0; i < posts.length; i++) {
    for (let j = i + 1; j < posts.length; j++) {
        const tokens1 = getTokens(posts[i].html.replace(/<[^>]*>/g, '')); // Strip HTML
        const tokens2 = getTokens(posts[j].html.replace(/<[^>]*>/g, ''));
        const weight = calculateSimilarity(tokens1, tokens2);

        if (weight > 0.05) { // Threshold for connection
            links.push({
                source: posts[i].slug,
                target: posts[j].slug,
                value: weight
            });
        }
    }
}

const networkDir = path.join(BLOG_DIR, 'network');
if (!fs.existsSync(networkDir)) {
    fs.mkdirSync(networkDir);
}

fs.writeFileSync(path.join(networkDir, 'network-data.json'), JSON.stringify({ nodes, links }, null, 2));
console.log('Network data generated.');

console.log('Blog built successfully!');

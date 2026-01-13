const marked = require('marked');

const text = '2026年現在のデジタル資産市場において、iOSアプリを一本完成させることは、**「売却可能な事業資産（アセット）」**を一つ築き上げることを意味します。';

// Pre-process regex to handle bold without requiring spaces (common in Japanese)
function preprocessMarkdown(text) {
    // This regex looks for **text** and replaces it with <strong>text</strong>
    // It handles the case where there are no spaces around the asterisks.
    return text.replace(/\*\*(?=\S)(.+?)(?<!\s)\*\*/g, '<strong>$1</strong>');
}

console.log('--- Original marked.parse ---');
console.log(marked.parse(text));

console.log('--- Pre-processed + marked.parse ---');
console.log(marked.parse(preprocessMarkdown(text)));

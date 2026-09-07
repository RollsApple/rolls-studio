export function getLanguageFromName(filename: string): 'html' | 'css' | 'javascript' | 'json' | 'markdown' | 'other' {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['html', 'htm'].includes(ext)) return 'html';
  if (['css', 'scss', 'less'].includes(ext)) return 'css';
  if (['js', 'jsx', 'ts', 'tsx', 'mjs'].includes(ext)) return 'javascript';
  if (['json'].includes(ext)) return 'json';
  if (['md', 'markdown'].includes(ext)) return 'markdown';
  return 'other';
}

export function extractFilesFromResponse(markdown: string): Record<string, string> {
  const files: Record<string, string> = {};

  // Pattern 1: Look for code blocks with filename in backtick header:
  // e.g. ```html:index.html, ```css:style.css, ```javascript:script.js or ```html title="index.html"
  const headerFilenameRegex = /```(?:([a-zA-Z0-9_-]+):([a-zA-Z0-9_\-./]+)|([a-zA-Z0-9_-]+)\s+(?:filename|title)=["']?([a-zA-Z0-9_\-./]+)["']?)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = headerFilenameRegex.exec(markdown)) !== null) {
    const filename = match[2] || match[4];
    const content = (match[5] || '').trim();
    if (filename && content) {
      files[cleanFilename(filename)] = content;
    }
  }

  // Pattern 2: Look for markdown header before code block:
  // e.g. ### index.html or **index.html** or `index.html` followed by ```lang ... ```
  const markdownHeaderRegex = /(?:###?|\*\*|`)([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)(?:\*\*|`)?[:\s]*\n+```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  while ((match = markdownHeaderRegex.exec(markdown)) !== null) {
    const filename = cleanFilename(match[1]);
    const content = (match[3] || '').trim();
    if (filename && content && !files[filename]) {
      files[filename] = content;
    }
  }

  // Pattern 3: Look for code comment as first line:
  // <!-- index.html -->, /* style.css */, // script.js
  const commentFirstLineRegex = /```([a-zA-Z0-9_-]*)\n(?:\s*(?:<!--|\/\*|\/\/|#)\s*([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)\s*(?:-->|\*\/)?)\n([\s\S]*?)```/g;
  while ((match = commentFirstLineRegex.exec(markdown)) !== null) {
    const filename = cleanFilename(match[2]);
    const content = (match[3] || '').trim();
    if (filename && content && !files[filename]) {
      files[filename] = content;
    }
  }

  // Pattern 4: Fallback for generic code blocks:
  // If we haven't extracted any file or only partial files, scan all code blocks
  if (Object.keys(files).length === 0) {
    const genericCodeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    let htmlCount = 0;
    let cssCount = 0;
    let jsCount = 0;

    while ((match = genericCodeBlockRegex.exec(markdown)) !== null) {
      const lang = (match[1] || '').toLowerCase().trim();
      const content = (match[2] || '').trim();

      if (!content) continue;

      if (lang === 'html' || content.includes('<!DOCTYPE html>') || content.includes('<html')) {
        const filename = htmlCount === 0 ? 'index.html' : `page${htmlCount + 1}.html`;
        htmlCount++;
        if (!files[filename]) files[filename] = content;
      } else if (lang === 'css' || content.includes('body {') || content.includes(':root {')) {
        const filename = cssCount === 0 ? 'style.css' : `styles${cssCount + 1}.css`;
        cssCount++;
        if (!files[filename]) files[filename] = content;
      } else if (['javascript', 'js', 'typescript', 'ts'].includes(lang) || content.includes('addEventListener') || content.includes('document.')) {
        const filename = jsCount === 0 ? 'script.js' : `script${jsCount + 1}.js`;
        jsCount++;
        if (!files[filename]) files[filename] = content;
      }
    }
  }

  return files;
}

function cleanFilename(raw: string): string {
  // strip path traversal and special characters, keep clean filename
  return raw.replace(/^(\.\/|\/)+/, '').trim();
}

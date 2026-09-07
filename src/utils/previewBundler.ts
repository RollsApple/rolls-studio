export function bundleProjectForPreview(files: Record<string, string>): string {
  // Find index.html or first HTML file
  let mainHtmlFile = 'index.html';
  if (!files[mainHtmlFile]) {
    const htmlKey = Object.keys(files).find(f => f.toLowerCase().endsWith('.html'));
    if (htmlKey) mainHtmlFile = htmlKey;
  }

  let htmlContent = files[mainHtmlFile];

  // If no HTML file exists at all, construct one from CSS/JS
  if (!htmlContent) {
    const cssContent = Object.entries(files)
      .filter(([k]) => k.endsWith('.css'))
      .map(([, v]) => v)
      .join('\n\n');
    const jsContent = Object.entries(files)
      .filter(([k]) => k.endsWith('.js'))
      .map(([, v]) => v)
      .join('\n\n');

    htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aperçu du site</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 2rem; }
    ${cssContent}
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    ${jsContent}
  </script>
</body>
</html>`;
    return injectConsoleInterceptor(htmlContent);
  }

  // Work with a copy of htmlContent
  let bundled = htmlContent;

  // Inline CSS files
  const cssFiles = Object.keys(files).filter(k => k.endsWith('.css'));
  const inlinedCss = new Set<string>();

  // Replace <link rel="stylesheet" href="..."> with inline styles
  for (const cssFile of cssFiles) {
    const regex = new RegExp(`<link[^>]*href=["'](?:\\./)?${escapeRegExp(cssFile)}["'][^>]*>`, 'gi');
    if (regex.test(bundled)) {
      bundled = bundled.replace(regex, `<style data-file="${cssFile}">\n${files[cssFile]}\n</style>`);
      inlinedCss.add(cssFile);
    }
  }

  // Any remaining CSS files that weren't explicitly referenced, append before </head>
  const remainingCss = cssFiles.filter(f => !inlinedCss.has(f));
  if (remainingCss.length > 0) {
    const styleTags = remainingCss
      .map(f => `<style data-file="${f}">\n${files[f]}\n</style>`)
      .join('\n');
    if (bundled.includes('</head>')) {
      bundled = bundled.replace('</head>', `${styleTags}\n</head>`);
    } else {
      bundled = `${styleTags}\n${bundled}`;
    }
  }

  // Inline JS files
  const jsFiles = Object.keys(files).filter(k => k.endsWith('.js'));
  const inlinedJs = new Set<string>();

  for (const jsFile of jsFiles) {
    const regex = new RegExp(`<script[^>]*src=["'](?:\\./)?${escapeRegExp(jsFile)}["'][^>]*>\\s*<\\/script>`, 'gi');
    if (regex.test(bundled)) {
      bundled = bundled.replace(regex, `<script data-file="${jsFile}">\n${files[jsFile]}\n</script>`);
      inlinedJs.add(jsFile);
    }
  }

  // Remaining JS files appended before </body>
  const remainingJs = jsFiles.filter(f => !inlinedJs.has(f));
  if (remainingJs.length > 0) {
    const scriptTags = remainingJs
      .map(f => `<script data-file="${f}">\n${files[f]}\n</script>`)
      .join('\n');
    if (bundled.includes('</body>')) {
      bundled = bundled.replace('</body>', `${scriptTags}\n</body>`);
    } else {
      bundled = `${bundled}\n${scriptTags}`;
    }
  }

  return injectConsoleInterceptor(bundled);
}

function injectConsoleInterceptor(html: string): string {
  const interceptor = `
  <!-- Console Interceptor -->
  <script>
    (function() {
      function send(type, args) {
        try {
          const message = args.map(function(a) {
            if (typeof a === 'object' && a !== null) {
              try { return JSON.stringify(a); } catch(e) { return String(a); }
            }
            return String(a);
          }).join(' ');
          window.parent.postMessage({
            type: 'PREVIEW_CONSOLE',
            log: { type: type, message: message, timestamp: Date.now() }
          }, '*');
        } catch(e) {}
      }

      var origLog = console.log;
      var origWarn = console.warn;
      var origError = console.error;
      var origInfo = console.info;

      console.log = function() { origLog.apply(console, arguments); send('log', Array.from(arguments)); };
      console.warn = function() { origWarn.apply(console, arguments); send('warn', Array.from(arguments)); };
      console.error = function() { origError.apply(console, arguments); send('error', Array.from(arguments)); };
      console.info = function() { origInfo.apply(console, arguments); send('info', Array.from(arguments)); };

      window.addEventListener('error', function(e) {
        send('error', [e.message + (e.lineno ? ' (ligne ' + e.lineno + ')' : '')]);
      });
    })();
  </script>
  `;

  if (html.includes('<head>')) {
    return html.replace('<head>', `<head>${interceptor}`);
  }
  return interceptor + html;
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

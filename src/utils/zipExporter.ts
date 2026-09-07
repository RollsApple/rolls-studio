import JSZip from 'jszip';

export async function exportFilesToZip(
  files: Record<string, string>,
  projectName: string = 'mon-site-web'
): Promise<Blob> {
  const zip = new JSZip();
  const safeName = projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-') || 'site-web';
  const rootFolder = zip.folder(safeName) || zip;

  for (const [filename, content] of Object.entries(files)) {
    rootFolder.file(filename, content);
  }

  // Ensure README exists
  if (!files['README.md']) {
    rootFolder.file(
      'README.md',
      `# ${projectName}\n\nSite web complet généré avec assistant IA.\n\n## Structure des fichiers :\n${Object.keys(files)
        .map(f => `- \`${f}\``)
        .join('\n')}\n\n## Comment exécuter ce projet :\nOuvrez simplement \`index.html\` dans votre navigateur web, ou utilisez un serveur local comme Live Server, Vite, ou Python (\`python3 -m http.server 8000\`).\n`
    );
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return blob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.zip') ? filename : `${filename}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

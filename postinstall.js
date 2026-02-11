import { copyFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const pdfjsDistPath = dirname(require.resolve('pdfjs-dist/package.json'));
const pdfWorker = join(pdfjsDistPath, 'build', 'pdf.worker.mjs');

copyFileSync(pdfWorker, join(__dirname, 'public', 'js', 'pdf.worker.min.js'));

console.log('pdf.worker.mjs has been copied to public/js/');

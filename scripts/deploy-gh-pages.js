import { execSync } from 'child_process';

// Ensure we're on main and remove local gh-pages so gh-pages can recreate it
try {
  execSync('git checkout main', { stdio: 'inherit' });
} catch (_) {}
try {
  execSync('git branch -D gh-pages', { stdio: 'inherit' });
} catch (_) {}

// Deploy dist to gh-pages branch
execSync('npx gh-pages -d dist --no-history', { stdio: 'inherit' });

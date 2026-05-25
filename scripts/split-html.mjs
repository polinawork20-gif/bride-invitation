import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const style = html.match(/<style>([\s\S]*?)<\/style>/)[1].trim();
const body = html.match(/<body>([\s\S]*?)<script>/)[1].trim();
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1].trim();
const headStart = html.slice(0, html.indexOf('<style>'));

fs.mkdirSync('src', { recursive: true });
fs.writeFileSync('src/index.css', style);
fs.writeFileSync('src/invitation.ts', script);

const viteHtml =
  headStart +
  '</head>\n<body>\n' +
  body +
  '\n  <script type="module" src="/src/main.tsx"></script>\n</body>\n</html>\n';

fs.writeFileSync('index.vite.html', viteHtml);
console.log('split ok');

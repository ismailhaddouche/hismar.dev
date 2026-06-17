import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, 'dist');
const port = Number(process.env.PORT) || 8080;
const host = process.env.HOST || '0.0.0.0';

const mimeTypes = new Map([
  ['.avif', 'image/avif'],
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

const isInsideDist = (filePath) => filePath === distDir || filePath.startsWith(`${distDir}${sep}`);

const resolveStaticFile = (pathname) => {
  const requestedPath = resolve(distDir, `.${pathname}`);
  if (!isInsideDist(requestedPath)) return null;

  if (existsSync(requestedPath)) {
    const stats = statSync(requestedPath);
    if (stats.isFile()) return requestedPath;
    if (stats.isDirectory()) {
      const indexPath = resolve(requestedPath, 'index.html');
      if (existsSync(indexPath) && statSync(indexPath).isFile()) return indexPath;
    }
  }

  return resolve(distDir, 'index.html');
};

const server = createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end('Method Not Allowed');
    return;
  }

  let url;
  try {
    url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  } catch {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  const filePath = resolveStaticFile(pathname);
  if (!filePath || !existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  const extension = extname(filePath);
  res.writeHead(200, {
    'Content-Type': mimeTypes.get(extension) || 'application/octet-stream',
    'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  createReadStream(filePath).pipe(res);
});

server.listen(port, host, () => {
  console.log(`Serving dist on http://${host}:${port}`);
});

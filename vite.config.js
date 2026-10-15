import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Shared header/footer: every page contains <!--@header--> and <!--@footer-->,
// which are replaced by the files in /partials (edit them once, all pages update).
const partial = (name) => readFileSync(resolve(__dirname, 'partials', name), 'utf-8');

const includePartials = () => ({
  name: 'include-partials',
  transformIndexHtml: {
    order: 'pre',
    handler(html) {
      return html
        .replace('<!--@header-->', partial('header.html'))
        .replace('<!--@footer-->', partial('footer.html'));
    },
  },
  handleHotUpdate({ file, server }) {
    if (file.includes('partials')) server.ws.send({ type: 'full-reload' });
  },
});

const pages = ['index', 'about', 'services', 'faq', 'blog', 'contact', 'project', 'coming-soon'];

export default defineConfig({
  plugins: [includePartials()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(__dirname, `${p}.html`)])),
    },
  },
});

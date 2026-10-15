# XTRA Construction – Home Page UI Rebuild

## Project overview
A pixel-matched rebuild of the home page of the XTRA "Construction 2" demo
(https://xtratheme.com/elementor/construction-2/): promo bar, header, hero slider, flip cards,
about, services, process, projects grid, quote form, testimonials carousel, partner logos and footer,
plus the inner pages linked from the menu (About, Services, FAQ, Blog, Contact, Project detail, Coming soon).
Fully responsive (phone, tablet, laptop, large desktop) with no horizontal scrolling.

## Technology used
- HTML5, CSS3 (custom properties, Grid, Flexbox, media queries), vanilla JavaScript (ES modules)
- [Vite](https://vite.dev) 5 as dev server / bundler (no framework)
- Google Fonts (Roboto, Poppins)
- Deployed on Vercel

## Installation
```bash
git clone <your-repo-url>
cd xtra
npm install
```
Images must be present in `public/images/` (see `public/images/README.txt`).

## Development command
```bash
npm run dev        # http://localhost:5173
```

## Build command
```bash
npm run build      # production files in /dist
npm run preview    # serve the production build locally
```

## Deployment instructions (Vercel)
1. Push the project to GitHub.
2. Vercel -> Add New -> Project -> import the repository.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. Every `git push` to `main` redeploys automatically.
(Netlify works the same: build `npm run build`, publish directory `dist`.)

## Dependencies
- Runtime: none (plain browser JavaScript)
- Dev: `vite` ^5.4

## Environment configuration
No environment variables or API keys are needed.

## API documentation
There is no backend/API. The contact/quote forms are front-end only (validation + thank-you message).
Project and blog content is read from `src/data.js`.

## Features / interactions
- Fixed icon box on the right edge (home page, laptop/tablet); hidden on phones
- Hero slider (arrows + auto-play), "Watch video" pop-up
- Feature cards flip on click/tap/Enter (smooth 3D flip)
- Partner logos flip on click/tap and show a "Construction Company" label (one active at a time)
- Testimonials carousel (dots, swipe, next card peeking at the screen edge)
- Mobile menu (right-side panel), mobile call bar, cookie notice ("Accept and close")
- Back-to-top button, search box that filters the Blog
- Font: Times New Roman on laptop/desktop, Roboto on touch devices (phone/tablet)

## Assumptions
- Images were taken from the reference demo and saved in `public/images/`.
- Shop, Cart, Wishlist, My account, Submenu pages and Privacy Policy all open one `coming-soon.html` page.
- Links in the right-side icon box point to the XTRA / Envato pages and can be edited in `index.html`.

## Known limitations
- Forms do not send e-mail (no server).
- Contact details (e-mail, address, hours) are sample text.
- Animations were tuned visually, not frame-by-frame against the reference.
- Tested in Chrome (laptop and phone emulation); please also check Edge/Safari on your devices.
# Vedang Tiwari — Portfolio

Mistral-inspired portfolio: warm cream canvas, ink type, flame gradient accents,
squared corners, and a pixelated cat that chases the cursor.

## Where to put your content (placeholders)

All personal content is centralised in `src/lib/portfolio.ts`:

- `PROFILE` — name, role, headline, degree, email, about paragraphs, CV path
- `SOCIALS` — LinkedIn / Twitter / Instagram / GitHub / anything else (add or remove freely)
- `DEFAULT_ITEMS` — seed entries for projects, skills, achievements, certificates, notes, blog
- `RESUME` — resume shown after registration

Drop your CV at `public/cv/vedang-tiwari-cv.pdf` (or change `PROFILE.cvUrl`).
Home-page stats are inline placeholders in `src/routes/index.tsx`.

## Add / delete

Every section page has "Add <item>" and per-card "Delete", plus "Restore defaults".
Edits persist per visitor in `localStorage` (`vt-portfolio:*`). No backend required.
To make content global and admin-only, enable Lovable Cloud and move these
collections into a database table with an auth-gated write policy.

## Resume registration

`/resume` asks for name, email and an optional reason; the validated entry is
stored under `vt-portfolio:registration` and unlocks the resume plus the CV
download. "Lock again" clears it.

## Pixel pet

`src/components/PixelPet.tsx` renders a 12x11 sprite on a fixed canvas with
`image-rendering: pixelated`, lerps toward the cursor, flips by direction and
swaps walk frames. Automatically disabled for `prefers-reduced-motion` and
touch-only pointers.

## File structure

```text
src/
  components/
    CollectionSection.tsx   add/delete section UI
    CvButton.tsx            Download CV
    PixelPet.tsx            cursor-chasing pixel cat
    SiteHeader.tsx          sticky nav
    SiteFooter.tsx          links + socials
    ui/                     shadcn primitives (unused by default)
  lib/
    portfolio.ts            ALL content + types + storage keys
    use-collection.ts       localStorage-backed collection hook
  routes/
    __root.tsx              shell, fonts, header/footer/pet
    index.tsx               /            hero, about teaser, explore, socials
    about.tsx               /about
    projects.tsx            /projects
    skills.tsx              /skills
    achievements.tsx        /achievements
    certificates.tsx        /certificates
    notes.tsx               /notes
    blog.tsx                /blog
    resume.tsx              /resume      registration gate + resume
  styles.css                design tokens (flame palette, type, shadows)
public/
  cv/vedang-tiwari-cv.pdf   <- put your CV here
```

## Run & deploy (Universal / Anywhere)

```bash
# 1. Install dependencies
npm install    # or bun install

# 2. Start local development server
npm run dev    # http://localhost:8080

# 3. Build for production (outputs static files to dist/)
npm run build

# 4. Preview production build locally
npm run preview
```

### Where to deploy:

- **Vercel**: Push to GitHub and import into Vercel (or run `npx vercel`). Zero config required (`vercel.json` included).
- **Netlify**: Connect repository or drag-and-drop the `dist/` folder (`public/_redirects` included for SPA routing).
- **Cloudflare Pages**: Connect repository, set build command to `npm run build` and output directory to `dist`.
- **GitHub Pages**: Build with `npm run build` and push `dist/` contents to `gh-pages` branch.
- **Docker / Custom Server**: Serve the `dist/` folder with Nginx, Caddy, Apache, or `npx serve -s dist`.

# MAQ Burgers website

Next.js 16 (App Router) + React 19 + TypeScript.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where to edit things

| What | File |
| --- | --- |
| Menu: categories, dishes, prices, descriptions, photos, popular picks | `lib/menu.ts` |
| Phone, email, address, opening hours | `lib/site.ts` |
| Hero slides | `components/HeroSlider.tsx` |
| Styles | `app/globals.css` |
| Images | `public/assets/` (add new sizes to `components/Pic.tsx`) |

Dishes with an `img` get a card and their own page at `/menu/<category>/<dish>`;
dishes without one are listed as menu-board rows.

## Pages

- `/`: hero, popular picks, category index, full menu with search
- `/menu/[category]`: one category (12 static pages)
- `/menu/[category]/[item]`: dish page with Single/Double prices
- `/catering`: catering info and enquiry form
- `/contact`: contact details and message form
- `/api/enquiry`: receives both forms and emails them

## Forms

Both forms post to `/api/enquiry`, which checks the data and emails it to the
shop with Resend (resend.com). It needs `RESEND_API_KEY` set in Vercel's
environment variables (see `.env.example`); never commit the key, as this
repository is public. Until `maqburgers.com.au` is verified at
resend.com/domains, Resend only sends to the Resend account's own address, so
set `ENQUIRY_TO` to that address, or verify the domain and set `RESEND_FROM`.
If sending fails, the visitor is told it didn't send and is shown the phone
number, and the reason is in the Vercel function logs.

## Search engines

- `/sitemap.xml` lists every page and `/robots.txt` points to it.
- Every page has a canonical link to `www.maqburgers.com.au` (the main domain; Vercel redirects `maqburgers.com.au` to it), and `maq-rho.vercel.app`
  redirects there (`next.config.ts`), so only one copy of each page is indexed.
- The home page carries the shop's details as schema.org `Restaurant` data (`lib/schema.tsx`).
- Google: add the domain in Search Console, verify it, and submit `sitemap.xml`. To verify by
  HTML tag instead of DNS, set `GOOGLE_SITE_VERIFICATION` (see `.env.example`).
- Bing (also feeds Yahoo and DuckDuckGo): import the site from Search Console in Bing Webmaster
  Tools, or set `BING_SITE_VERIFICATION`.
- After a deploy that changes pages, run `npm run indexnow` to tell Bing and the other IndexNow
  engines to recrawl straight away. Its key file is `public/1ac4e8dcd2c01f729ee4969aa0b12a39.txt`.

## Old static version

`static-site/` holds the original single-file HTML version for reference. It
isn't used by the Next.js app and can be deleted.

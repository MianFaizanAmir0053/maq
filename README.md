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
- `/contact`: contact details, opening hours and message form
- `/api/enquiry`: receives both forms

## Forms

Both forms post to `/api/enquiry`, which validates the data and forwards it to
`ENQUIRY_WEBHOOK_URL` if set (see `.env.example`). Without it, submissions are
only logged in the server console.

## Old static version

`static-site/` holds the original single-file HTML version for reference. It
isn't used by the Next.js app and can be deleted.

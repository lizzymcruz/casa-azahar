# Casa Azahar

Demo hotel website: a fictional 8-room family guest house in Ciutat Vella, Valencia's old town. Designed and built by [Lizzy Cruz](https://lizzymcruz.com) to show what a direct-booking website can do for a small Valencian hotel.

**Live:** https://casa-azahar.pages.dev (after deploying, see below)

## What's in it

- **Pages:** home, rooms, one page per room, a three-step booking flow, privacy, legal notice, accessibility statement and a 404 page. Every page exists in English (`/`) and Spanish (`/es/`).
- **Booking:** date picker with live availability (keyboard and screen-reader friendly, bottom sheet on phones), price summary that updates as you go, inline form validation, booking reference, add-to-calendar (.ics) download, and a "you save vs. booking sites" figure. A sticky "Book now" bar appears on phones once the main booking bar scrolls away.
- **Accessibility panel** (button in the bottom-left corner): text size up to 150%, high contrast, stop animations, underline links, wider letter and line spacing, simpler font. Choices are saved in the browser and applied before the page paints. The site also follows the device's "reduce motion" setting. Aims for WCAG 2.2 AA.
- **SEO:** unique titles and descriptions, canonical URLs, `hreflang` alternates, Open Graph and Twitter cards, structured data (Hotel, HotelRoom with price, FAQPage, BreadcrumbList), `sitemap.xml` and `robots.txt`.
- **Performance:** self-hosted fonts (no Google Fonts requests), WebP images in three sizes with `srcset`, lazy loading below the fold, preloaded hero image and fonts, long-lived caching and security headers in `_headers`, no frameworks. Lighthouse (served with compression, as on Cloudflare): 96–100 performance on phone and desktop, 100 accessibility, best practices and SEO.
- **Motion:** hero intro, word-by-word headline reveals, fade-up and staggered entrances, image curtain reveals, parallax, smooth scrolling (Lenis), cross-page view transitions and a crossfading room gallery. All built on GSAP + ScrollTrigger and switched off when motion is reduced.

## Run it locally

Needs Node 18 or newer. No packages to install.

```bash
node build.js            # writes the site into public/
cd public && python3 -m http.server 8802
```

Then open http://localhost:8802.

## Edit content

- All text (both languages), rooms, prices and extras: `src/content.js`
- Page layouts, header, footer and structured data: `build.js`
- Shared building blocks (booking bar, booking flow, `<head>` tags, sitemap): `src/lib.js`
- Styles: `assets/css/core.css` (shared components) and `assets/css/site.css` (this hotel's look)
- Behaviour: `assets/js/core.js` (booking, date picker, accessibility panel, gallery) and `assets/js/anim.js` (animations)

Run `node build.js` again after any change.

## Deploy on Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick this repo.
2. Framework preset: **None**. Build command: `node build.js`. Build output directory: `public`.
3. Deploy. Every push to `main` redeploys.

If you use a custom domain, change `domain` at the top of `build.js` so canonical URLs and the sitemap point to it.

## Notes

- This is a demo: the hotel, address, phone numbers, prices and availability are invented, and no booking or email is actually sent.
- Photos are from [Unsplash](https://unsplash.com) and used under the Unsplash License.
- Fonts are open-source (SIL Open Font License), self-hosted from Fontsource.
- GSAP and Lenis are included under their own licences (free for this use).

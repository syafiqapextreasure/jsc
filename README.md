# Jang Sport Center

A responsive Bahasa Melayu football-shoe catalogue using the approved Night Match artwork. Customers choose shoes and requested sizes, review their cart, then open a prepared WhatsApp enquiry to **+60 19-962 8865**. There is no payment processing or automatic message sending.

## Run locally

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4173`. The local server uses the same rendering and routing code as the Worker. `npm test` runs the catalogue, route, metadata, cart and message checks.

```sh
npm test
npm run build
```

The build command performs a Wrangler deployment dry run and writes the Worker bundle into `dist/`. It does not publish the site. `npm run preview` runs Cloudflare's local Wrangler runtime.

## Deploy to Cloudflare Workers from GitHub

1. In Cloudflare, open **Workers & Pages**, create a Worker, and connect the `syafiqapextreasure/jsc` GitHub repository.
2. Select the `main` branch and the repository root as the root directory.
3. Use `npm run build` as the build command and `npm run deploy` as the deploy command. Cloudflare installs dependencies using the committed npm lockfile. If your build setup requires an explicit install step, use `npm ci && npm run build`.
4. Deploy. The project uses the `ASSETS` binding and static directory already declared in `wrangler.jsonc`; no database, API keys or storage service is required.
5. Open the resulting `workers.dev` address. Add a custom domain in the Worker's domain settings when ready.

The Worker name is `jang-sport-center`; keep the name in the Cloudflare project and `wrangler.jsonc` aligned. Do not deploy only the `dist` folder as a static Pages project: this site needs its Worker for server-rendered pages, metadata and clean routes.

For a terminal deployment with a Cloudflare account:

```sh
npx wrangler login
npm run deploy
```

Cloudflare reference: [Workers Builds Git integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/), [build and deploy configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), and [Workers static asset binding](https://developers.cloudflare.com/workers/static-assets/binding/).

## Domain and search visibility

Canonical URLs, social metadata, `robots.txt`, `sitemap.xml` and `llms.txt` use the incoming deployment origin by default. After choosing a permanent domain, add its origin to `wrangler.jsonc`:

```json
"vars": {
  "SITE_URL": "https://your-actual-domain.example"
}
```

Replace that example with the real domain; do not publish the example value. Redeploy after changing it. Public pages are server rendered with Bahasa Melayu language metadata and structured data. Cart, review, WhatsApp and filtered search pages are marked `noindex`. Product structured data intentionally omits unconfirmed prices, availability and reviews. Search-engine indexing and answer-engine inclusion are controlled by the respective services and are not guaranteed.

Routes are extensionless. For example, `/shop.html` redirects to `/shop`, and `/index.html` redirects to `/`. Unknown pages return HTTP 404.

## Maintain the catalogue

- `src/catalog.mjs`: product names, descriptive colours, brand grouping, style and verified surface membership; also shared FAQs and surface explanations.
- `src/views.mjs`: server-rendered page content and image-atlas coordinates.
- `public/app.mjs` and `public/cart-core.mjs`: browser interactions, local cart and prepared WhatsApp message.
- `public/style.css`: responsive layout, typography, animation and reduced-motion behaviour.
- `public/assets/`: approved design artwork and product images. See `docs/asset-provenance.md` for sources and font licensing.

Prices, available sizes, stock, shipping charges and delivery estimates were not supplied. The site therefore uses **Tanya harga** and treats entered sizes as requests to be confirmed. It does not calculate a fictional total.

All nine shoes currently have an empty `surfaces` array. The side photographs do not establish each actual outsole's FG, AG, TF or IC compatibility. Surface pages explain the categories and offer a WhatsApp enquiry. Once the actual outsole specification is verified, assign the appropriate identifiers, such as `['tf']`, to that product. The customer's preferred playing surface remains separate from verified product compatibility.

The general surface guidance follows the [Nike boot guide](https://www.nike.com/my/football/shoe-guide) and [adidas surface guide](https://www.adidas.com/us/blog/594963-how-to-buy-soccer-cleats-fit-features-field-surface). Check the actual product specification and venue rules.

## Order handling and privacy

The browser stores cart and review information locally on the customer's device. The Worker does not store orders or accept payment. The customer opens WhatsApp and sends the prepared message themselves; staff then confirm price, size, stock, outsole suitability and delivery. Clearing the cart removes saved order information on that device. No analytics or advertising trackers are included.

The configured order destination is `60199628865` in international digits-only form. Search the repository for that number when changing it so direct enquiry links, cart checkout, contact copy and structured metadata stay consistent.

Before announcing the store, open the deployed site on a phone, add a shoe with a requested size, review the message and confirm that WhatsApp targets the correct number. Keep real prices, policies and surface assignments current as they become available.

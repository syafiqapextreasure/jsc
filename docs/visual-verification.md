# Design comparison and verification

Compared the fourteen approved Night Match reference pages with rendered website captures at 1440px and 390px. The implementation restores each page's subject, major section order, photographic background and shopping flow. Larger live text and responsive reflow intentionally change page heights; this is not a claim of pixel-identical reconstruction.

| Page | Corrections checked |
| --- | --- |
| Home | Mint boot on the right, real HTML headline, four surface photos, left-socks light strip, Mint/Red/Leopard product order, compact tactics banner. |
| Surface guide | Football hero, 2×2 photo cards, macro artificial-grass fibres, wooden indoor court, side-by-side AG/TF outsole explanations. |
| Turf category | Continuous close-turf hero with white line, five photo navigation tabs, TF outsole enquiry, two lower guide panels. |
| Shop | Shallow football panorama, photo navigation, checkbox filters, sort control and nine products in the approved order. |
| Brands | Empty stadium hero, Nike and adidas stone-plinth duo portraits, surface choices, other-brand enquiry and gift banner. |
| Nike | Mint/Pink hero duo, brand/surface selectors, four stadium-backed products in a two-column desktop grid. |
| adidas | Leopard hero, style filters, five products plus the sixth socks promotion tile. |
| Product | Larger left gallery, correctly oriented Mint photograph, three detail views, size request, quantity controls, gift photograph and grass guide banner. |
| Cart | Whole Mint boot in a shallow continuous hero, product/gift rows, summary, photo surface selection and grass footer strip. |
| Review | Mint hero, form and visual summary, socks photo, WhatsApp action and three next-step panels. |
| WhatsApp | Full stadium composition, centered visual order card, gift row, prepared message, whole boot below the card; phone composition also checked. |
| Size guide | Pink heel close-up, numbered measuring instructions and photo, measurement enquiry form, two pink styles and tactics strip. |
| About | Camo/Red hero duo, two feature cards, Mint/Red/Leopard cards and football call to action. |
| Help | Mint/Red hero duo, contact form and FAQ columns, photographic socks banner. |

The screenshot review additionally corrected the AG/IC photographs, shallow-hero background seams, Nike card backgrounds, product gallery proportions, logo crop, mobile product-form order and WhatsApp shoe placement. The home strip caption was moved clear of the socks after the final comparison.

## Images

39 standalone images were generated using the built-in image-generation tool from the supplied page and product references. The originals remain in `outputs/night-match-v4/assets` in the authoring workspace. Prompts and native dimensions are recorded in `image-generation-prompts.json` and `image-manifest.json`.

- PNG masters: 96,135,356 bytes.
- Lossless WebP delivery files: 64,995,138 bytes, 32.4% smaller.
- Every decoded RGBA pixel was checked against its PNG master. All 39 uploaded Git blobs were also checked against the local files.
- Most wide heroes are 1983×793; the shallow panoramas are 2172×724; product photography is 1536×1024. These are native approximately 2K hero assets, not 4K masters or artificial upscales.
- Compression preserves the generated master pixels. AI reconstruction does not make the artwork pixel-identical to the original design screenshot.

## Readability and functional verification

Measured body and product-description text sizes:

| Viewport width | Text size |
| --- | --- |
| 320px | 18px |
| 768px | 18.688px |
| 1024px | 19.584px |
| 1440px | 21.04px |
| 1920px | 22.72px |
| 2560px | 24.96px |
| 3840px | 29.44px |

The verification workflow passed 16 core tests, 12 browser tests and the Cloudflare Worker build at implementation commit `f0a71cff812cb502531146d6f8c54fb9170a5b72`: [successful browser/build run](https://github.com/syafiqapextreasure/jsc/actions/runs/40503885043).

Coverage includes all fourteen reference captures at phone and desktop widths, route/image checks at 320/390/768/1440/2560px, additional typography checks at 1024/1920/3840px, a 40px-root enlarged-text layout check, mobile navigation, reduced motion, filters, size/contact enquiry forms, cart persistence and cross-tab updates, and cart-to-WhatsApp message contents. Tests prepare WhatsApp links without sending a message.

Prices, stock and actual outsole compatibility remain unconfirmed. Surface photographs and generated outsole images are educational illustrations; they are not used to invent inventory suitability. The layout keeps WhatsApp confirmation and the free-socks offer.

# Night Match page-by-page implementation audit

Audit date: 27 October 2026. Baseline: storefront at commit `a8b3fb10bc81f3a3dba53cb6e33a58c392ea77a3`, before the requested visual revision.

All fourteen approved PNG page references in `outputs/night-match-v3/pages` were opened and visually inspected. Current home, shop, Mint Speed product and WhatsApp screenshots in `work/qa-final/test-results` were also inspected, including the 2560px home screenshot. Other current-page comparisons below are based on the actual templates and CSS, not a claim that screenshots were captured for those routes.

## Main causes

1. `hero()` reused the surface-guide football background for almost every inner route. The reference has distinct shoe, pitch, empty-stadium and centered confirmation compositions. This is the largest source of mismatch.
2. The deployed site enlarged tiny rectangles from 1024×1536 full-page screenshots: product photos were only about 258×170 or 323×229 source pixels. Displaying them across wide desktop cards cannot preserve detail. Full-page WebP compression did not add resolution.
3. The desktop home hero used baked-in headline/body text. This cannot respond to browser text-size preferences, and its typography scales independently from the actual page text and buttons. All headlines, descriptions and actions should be real HTML over clean artwork.
4. `object-fit: fill`, artificial atlas frame ratios and narrow source crops distorted or amputated artwork. Correct source image composition should be supplied for each region, then preserved with intrinsic dimensions and intentional `object-position`.
5. Generic diagonal-line CSS banners replaced the reference's photographic stadium/grass banners and flowing blue light trails. Missing photography makes large dark areas look empty even when spacing is small.
6. Several whole sections were removed or substituted. Passing route and overflow tests did not prove design fidelity.

## Shared corrections

- Replace page-screenshot atlases with dedicated high-resolution, text-free hero, collection, surface, product, socks and supporting photography. Keep approved shoe identity, colours, angle and placement.
- Keep the desktop composition clear: left text area, correctly sized right subject, visible stadium/grass across the background, and a bright blue divider at the section boundary. Avoid a solid black mask covering most of the image.
- Use the source logo at adequate resolution; the 250×57 header crop becomes soft when enlarged.
- Preserve blue edge light, lime accents, dark borders and the layered photographic background. Thin diagonal rules alone are not a substitute for the approved light-streak art.
- Typography needs an accessible scale throughout, not only larger headings. The original mockups' visual proportion should guide layout, while readable HTML text takes precedence over copying small raster text.
- Match card image positions and ratios, then align titles, descriptions and actions. Never stretch the shoe to fill an arbitrary frame.
- Keep gift socks as an actual photographic asset in product, cart, review and promotional sections. A small line icon is visually different from the approved treatment.
- On mobile, adapt composition without hiding a featured product solely to make the grid even. All meaningful content should remain available.

## Hero mapping

| Reference / route | Correct hero artwork and composition | Baseline mismatch |
| --- | --- | --- |
| 01 Home `/` | Large Mint Speed shoe, toe low-left and heel upper-right, floating over dew-covered grass; night stadium across the width; headline left | Baked text inside image, soft raster headline, mobile swaps to a different studio angle |
| 02 Surface guide `/padang` | Black/white football standing on wet grass at right; broad illuminated stadium; large two-line headline left | Subject source is relevant, but compact height and black overlay flatten the composition |
| 03 Turf `/padang/tf` | Close short turf with white diagonal touchline entering from lower-right; stadium above; no ball or shoe in the hero | Generic ball hero instead of the turf texture; title and breadcrumb arrangement differ |
| 04 Shop `/shop` | Shallow panorama of stadium and grass with large blue/white ball cropped at far-right edge | Different football crop from guide page; opaque left mask; grass mostly lost |
| 05 Brands `/jenama` | Empty illuminated stadium with grass strip; no ball, no product in top hero | Generic ball, shallow compact hero |
| 06 Nike `/jenama/nike` | Mint Speed higher/back and Pink Speed lower/front on wet black stone plinths on right; stadium backdrop | Generic ball, no dual-shoe display, missing hero CTA |
| 07 adidas `/jenama/adidas` | Very large Leopard Control three-quarter shoe on right, purple stud plate against grass/stadium | Generic ball; no featured Leopard Control |
| 08 Product `/kasut/mint-speed` | No separate generic title hero: stadium/turf is the background behind breadcrumb, large product gallery and right purchase panel | Flat dark page behind gallery/form; main product region too isolated |
| 09 Cart `/cart` | Mint Speed at right on dew-covered grass, prominent `CART ANDA` heading left | Ball hero and different title; shallow band |
| 10 Review `/pesanan` | Mint Speed at right on grass; `PESANAN ANDA` eyebrow; two-line `SEMAK / PESANAN ANDA` | Ball hero, missing eyebrow, different height |
| 11 WhatsApp `/whatsapp` | Full-height stadium composition; centered WhatsApp icon and headline at top; summary card middle; large Mint Speed foreground near bottom | Standard left-aligned ball hero plus separate generic text panel |
| 12 Size `/panduan-saiz` | Large close-up of Pink Laced heel/side at right, extending out of canvas; stadium and grass, text left | Ball hero, different title and missing product close-up |
| 13 About `/tentang-kami` | Camo Gold upper/back and Red Gold lower/front on grass right; `MINAT YANG SAMA. / GAYA ANDA.` left | Ball hero, unrelated title and no double-shoe arrangement |
| 14 Help `/bantuan` | Mint Speed upper/back and Red Gold lower/front right; `KAMI SEDIA / MEMBANTU.` left; generous supporting copy | Ball hero, unrelated headline and reduced composition |

## 01 — Home

- Keep hero image and copy as separate layers while maintaining the approved shoe angle and full stadium backdrop.
- Restore the four surface tiles' darker bottom gradients and photo-led treatment. In the reference the labels overlap the lower image area; the baseline separates them into large plain slabs.
- Restore the blue flowing-light socks band; baseline uses evenly spaced diagonal CSS lines and a tiny clipped socks rectangle.
- Preserve three featured products in this order: Mint Speed, Red Gold, Leopard Control. Use standalone high-resolution versions of these exact side/three-quarter views.
- Match the reference card hierarchy: product name, colour, `Tanya harga`, `Lihat kasut`. The baseline adds tiny uppercase brand labels and a second button, changing the card arrangement. Any retained enquiry button must not compress the main text.
- The lower help strip needs photographic grass/stadium and tactics board, not mainly a diagonal CSS pattern.

## 02 — Surface guide

- Restore the taller guide hero with visible football, field and overhead lighting.
- Maintain four substantial photographic cards in a two-by-two desktop layout: FG, AG, TF, IC.
- Restore the `AG atau TF?` comparison: distinct AG outsole photograph on left and TF rubber-nub outsole on right, descriptions alongside each, blue vertical separator and `Bantu saya pilih` action.
- Baseline has two text-only panels instead of the outsole comparison, so an important educational visual is missing.
- Retain the actual-product/venue suitability note. The illustrations describe outsole categories; they do not verify inventory.

## 03 — Turf category

- Use the short-turf/touchline hero and place the breadcrumb inside its top-left area.
- Restore five photographic tabs below hero, with TF highlighted lime. Baseline has no category tab row here.
- Restore catalogue framing: left filter panel and right enquiry state. Do not invent available sizes or stock simply because the mockup shows example filter choices.
- Replace the current generic two-column surface explanation with the reference's large central TF-outsole enquiry image, headline, description and two actions.
- Restore the lower pair of educational panels: macro TF nubs on the left; longer artificial grass and link to AG on the right.
- Keep the surface enquiry state until actual outsole specifications are confirmed. No shoe may be assigned TF based on generated imagery.

## 04 — Shop

- Use the shop-specific shallow ball/grass panorama.
- Restore photo thumbnails within the surface tabs. Current tabs are plain gradient text boxes.
- Keep all nine shoes in approved order: Pink Speed, Leopard Control, Mint Speed; Magenta Kobe, Red Gold, Pink Laced; Camo Gold, Pink Laceless, Red White Control.
- Use a narrow checkbox-style brand/style filter sidebar; move sort control to the results bar at the upper-right, matching reference. Current sidebar dropdowns and extra search field alter the arrangement.
- Enlarge product names, descriptions, buttons and result text; replace low-resolution screenshot crops.
- Use the larger bottom socks/stadium/grass banner shown in this reference, not the universal thin diagonal strip.

## 05 — Brands

- Use empty-stadium hero.
- Restore two tall stone-plinth collection panels: Nike with Mint Speed above Red Gold; adidas with Leopard Control above Camo Gold. Baseline shows only one cropped shoe per brand and loses the stacked composition.
- Place clear brand wordmarks/headings and collection actions within those panels.
- Restore `Utamakan padang anda` with four compact photographic surface links below the collection panels.
- Restore the textured `Cari PUMA atau jenama lain?` enquiry strip. Do not imply unconfirmed PUMA stock or official affiliation.
- Restore large socks promotion over stadium grass, with the socks on the right.

## 06 — Nike collection

- Use the Mint Speed + Pink Speed plinth hero and the `Shop koleksi` CTA.
- Restore breadcrumb below the hero.
- Use horizontal brand/surface selectors; do not reuse the shop's left sidebar.
- Use a two-column desktop product grid in order: Pink Speed, Mint Speed, Magenta Kobe, Red Gold.
- Product cards have illuminated stadium background behind each shoe, not the neutral smoky shop-card background.
- Restore the broad socks/stadium banner below the four cards.

## 07 — adidas collection

- Use Leopard Control hero, breadcrumb/eyebrow, explanatory copy and `Shop adidas` action.
- Restore `Pilih gaya anda` section heading, surface selector and `Semua / Bertali / Tanpa tali` segmented control above the grid.
- Use three columns: Leopard Control, Pink Laced, Camo Gold; Pink Laceless, Red White Control, socks promotional card.
- Baseline reuses generic shop sidebar and puts a thin banner after five products; the sixth gift tile is missing.
- Keep card photography and descriptions legible without reducing controls to tiny text.

## 08 — Product detail

- Restore stadium/turf backdrop behind the full gallery and information column.
- Preserve the large Mint Speed main photo with its original shoe position and reflective floor. Use a high-resolution dedicated photo, not a 580×536 screenshot window.
- Restore three gallery thumbnails: full shoe, laces close-up, material/swoosh close-up. Current second thumbnail is merely an enlarged full shoe; the third is absent.
- Keep requested-size input semantics because verified stock sizes are not supplied. The visual control may match the reference without claiming availability.
- Add usable minus/plus quantity controls with an accessible input between them.
- Use actual socks photo in the gift panel and clear surface-selection/verification control.
- Restore the tall lower stadium/grass CTA (`Tak pasti kasut untuk padang anda?`). The generic short help strip is not the reference section.
- The baseline adds a related-products section not shown in this reference. If kept, it should follow the reproduced reference sections rather than replace them.

## 09 — Cart

- Restore Mint Speed hero and `Cart anda` wording.
- Match main two-column layout: wide product card region left, summary right.
- Include dedicated photographic free-socks gift row beneath cart products. Current gift is a small text box in the summary.
- Restore the optional `Jenis padang anda` section with four photo radio cards and store the selection for review/WhatsApp.
- Move `Teruskan shopping` to the lower-left action position shown in the reference.
- Use the curved stadium/grass strip above the footer.
- Actual cart size must remain editable and quantities validated; the mockup's missing-size state is an example, not a default product claim.

## 10 — Order review

- Restore Mint Speed hero, eyebrow and tall two-line heading.
- Keep the three-step row between hero and form.
- Match the large two-column form/summary composition, with a much larger product thumbnail and real socks photo.
- Include requested sizes in the review clearly; do not require redundant conflicting size fields if each cart row already has one.
- Restore full-width lime WhatsApp action and the explanatory note directly beneath it.
- Restore the missing `Langkah seterusnya` three-part explainer with icons: semak pilihan, hantar mesej, sahkan dengan penjual.
- Restore grass/stadium decoration above footer.

## 11 — WhatsApp handoff

- Rebuild page composition instead of using the generic `hero()` plus panel.
- Full main area should be a tall illuminated stadium scene, with a huge Mint Speed shoe resting on foreground turf at bottom.
- Center lime WhatsApp icon, white/lime title and supporting line above the summary card.
- Summary card should visibly show shoe image, name, quantity, size, surface and socks gift. Current long preformatted message can remain as an expandable preview, but cannot replace the visual summary.
- Include clear not-yet-confirmed/no-payment status.
- Match wide `Buka WhatsApp`, outlined `Kembali ke cart`, and lower `Teruskan shopping` actions.
- Preserve the user's explicit send step. Never send a WhatsApp message automatically.

## 12 — Size guide

- Use Pink Laced heel/side close-up hero and `Cari saiz yang sesuai` heading.
- Restore left measurement section: numbered vertical steps and large photo of a white-socked foot on paper with a ruler and heel/toe markings.
- Restore right form: select a shoe, enter foot length in centimetres, prepare a WhatsApp size enquiry. Baseline only has generic steps and a text link.
- Do not generate an invented universal size conversion; retain model-specific confirmation wording.
- Restore lower `Dua rekaan, satu gaya` section with Pink Laced and Pink Laceless side-by-side product cards and socks gift callout.
- Restore lower pitch-guide photographic strip.

## 13 — About / brand story

- Use Camo Gold + Red Gold double-shoe hero with `Minat yang sama. Gaya anda.` and two actions.
- Restore the two compact feature cards directly below hero: pitch image/guide and socks image/gift.
- Restore the three featured products: Mint Speed, Red Gold, Leopard Control.
- Restore the large lower `Sedia pilih kasut?` stadium/grass CTA with branded football at right and two actions.
- The baseline's generic about prose panel + single Mint image + three icon value cards is a different page composition. Short shop information can be included without substituting that layout for the approved design.

## 14 — Help

- Use Mint Speed + Red Gold hero and `Kami sedia membantu` heading, with the two levels of supporting copy.
- Preserve two columns below: contact on the left, FAQ on the right.
- Restore larger WhatsApp contact header/icon and action.
- Restore the missing Name + Message form and `Sediakan mesej` action. It should prepare a WhatsApp message for the customer to send.
- Match FAQ hierarchy and spacing while retaining truthful existing answers. Existing extra privacy information may remain as a final accordion.
- Restore the socks/stadium promotional image below the FAQ column and the continuous grass/light band along the bottom.

## Readability and scaling acceptance criteria

Baseline root font is `clamp(15px, 1.1vw, 25px)`: it stays at 15px through approximately 1363px width and stops growing above approximately 2272px. Important descendants shrink this further: card copy `.8rem` = 12px, card actions `.75rem` = 11.25px, header search `.72rem` = 10.8px, footer `.65rem` = 9.75px at the minimum. This directly explains the readability complaint.

- Use an 18–20px body floor, with primary reading text around 22–24px on a typical desktop and approximately 28–32px on a large desktop. Let the user's browser zoom still work.
- Keep important labels, descriptions, dropdown choices and action text at least 16–18px on phones and at least 18px on desktops. Secondary footer text should not fall below 14–16px.
- Use a fluid `rem` + viewport scale that genuinely increases at 1440, 1920, 2560 and 3840, rather than scaling only the image or capping most UI early.
- Reflow navigation earlier if larger type will not fit. Do not force smaller type to preserve a desktop header on a tablet.
- Avoid `object-fit: fill`; compare image bounding boxes and visible whole-shoe silhouettes at each breakpoint.
- Test 320/390/768/1024/1440/1920/2560/3840px widths and browser 200% zoom. Check horizontal overflow, readable controls, line lengths and subject placement.
- Add computed-font tests for body/card description/button/footer sizes. Existing no-overflow tests alone will accept unreadably small text.
- Capture all fourteen reference routes, including seeded cart/review/WhatsApp states. Inspect each hero and major section against its matching reference. A home/shop/product-only screenshot set is insufficient.

## Image delivery acceptance criteria

- Record the generated master dimensions and intended placement. Request wide production-resolution hero images with a text-free left area and the exact reference subject at right.
- Use dedicated images or clean cutouts/background layers rather than enlarging a small region of a complete page screenshot.
- For literal lossless compression, encode the generated master pixels as lossless WebP and keep a source master. A high-quality lossy encoding must not be described as lossless.
- Responsive derivatives may reduce dimensions for phone bandwidth; document that resizing is separate from lossless encoding. Use `srcset`/`sizes` so large screens obtain adequate pixel density.
- Compare decoded pixel dimensions, intended aspect ratios, shoe silhouettes, brand marks, lace state, colours and camera angle. Upscaling must not quietly swap the product.
- Generated underside/outsole illustrations are educational graphics only, never evidence for assigning actual inventory to a surface.

This audit is a baseline checklist. Mark an item complete only after comparing the revised rendered page with its reference; generating an asset or passing a route test alone does not establish visual parity.

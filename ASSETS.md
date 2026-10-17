# Image provenance and usage

All website photography and branding is served from `public/images`. There are no remote image dependencies. Files retain their supplied aspect ratios. Full photographs are WebP at a maximum of 1920 pixels per dimension, with 768 pixel responsive variants. Original source files remain untouched.

## Brand

- `public/images/brand/logo-original.png`: exact supplied horizontal PNG from `C:/Users/Nezra/Documents/ChatGPT/id/output/tmi-horizontal-right-text.png`.
- `public/images/brand/logo.png`: same supplied artwork with blank outer margins trimmed for a readable header. No artwork, text, or colors were redesigned.
- `public/images/brand/icon.png` and `favicon.png`: supplied transparent icon from `C:/Users/Nezra/Documents/ChatGPT/id/output/tmi-icon-only-transparent.png`, with a 64 pixel favicon derivative.

## Photograph provenance

The 13 service singles were supplied in `clean_pic_Services/01_single_photos`. The existing `.work_image_review/all_edits.json` documents earlier AI-assisted photographic cleanup of these images. They are based on actual business photos and have been supplied as finished assets; this implementation did not generate or modify their visual content. Their source photographs are recorded below and in `src/content/assets.js`. Do not present them as untouched documentary originals.

The mobile-service, glass-work, and workshop photos use original business photography with only format/size conversion. For HEIC originals, the existing orientation-corrected JPEG previews were used because the local image library has no HEIC decoder.

## Before and after

All nine comparisons are genuine matched projects supplied in `clean_pic_Services/02_before_after/separate_pairs`, cross-checked against the contact sheets and original-photo inventory. They preserve the actual removed/damaged versus installed glass state. Camera angle, crop, lighting, and framing can differ, so the interface should display separate comparison panels rather than implying pixel-aligned photography. The red Corvette after detail is an existing straightened crop of a supplied collage panel, not a new service result.

## Supplied badge files

The four `badge-*.webp` files were copied to `public/images/brand` for completeness. Their award, guarantee, and certification implications require business confirmation before publishing them as credentials. This implementation makes no new credentials or badge artwork.

## Inventory reviewed

- `images`: 51 supplied source files.
- `clean_pic_Services`: 90 source, variant, comparison, and contact-sheet files.
- `badge`: 4 supplied badge files.
- `.work_image_review`: 420 previews, working files, metadata, and earlier variants.
- Root `logo`, `logo-no-white`, and `favicon`: raster PNG files without extensions, 1254 by 1254. The explicitly requested supplied horizontal logo and transparent icon were preferred.

## Published photograph map

| Public image | Original or supplied source | Dimensions |
| --- | --- | --- |
| `/images/services/corvette-red-windshield.webp` | `clean_pic_Services/01_single_photos/webp/01-corvette-red-windshield.webp (supplied retouch of images/C6628151-50AE-4029-BC97-B4797F231102.jpg)` | 1536 x 1024 |
| `/images/services/corvette-blue-windshield.webp` | `clean_pic_Services/01_single_photos/webp/02-corvette-blue-windshield.webp (supplied retouch of images/IMG_0543.HEIC)` | 1536 x 1024 |
| `/images/services/bentley-windshield.webp` | `clean_pic_Services/01_single_photos/webp/03-bentley-windshield.webp (supplied retouch of images/IMG_0587.HEIC)` | 1536 x 1024 |
| `/images/services/bmw-windshield.webp` | `clean_pic_Services/01_single_photos/webp/04-bmw-windshield.webp (supplied retouch of images/IMG_3008.JPG)` | 1536 x 1024 |
| `/images/services/gmc-pickup-windshield.webp` | `clean_pic_Services/01_single_photos/webp/05-gmc-pickup-windshield.webp (supplied retouch of images/IMG_2236.JPG)` | 1536 x 1024 |
| `/images/services/isuzu-commercial-windshield.webp` | `clean_pic_Services/01_single_photos/webp/06-isuzu-commercial-windshield.webp (supplied retouch of images/IMG_2221.JPG)` | 1536 x 1024 |
| `/images/services/peterbilt-commercial-windshield.webp` | `clean_pic_Services/01_single_photos/webp/07-peterbilt-commercial-windshield.webp (supplied retouch of images/IMG_2782.JPG)` | 1536 x 1024 |
| `/images/services/mack-truck-glass.webp` | `clean_pic_Services/01_single_photos/webp/08-mack-truck-glass.webp (supplied retouch of images/IMG_2525.HEIC)` | 1536 x 1024 |
| `/images/services/freightliner-fleet-windshield.webp` | `clean_pic_Services/01_single_photos/webp/09-freightliner-fleet-windshield.webp (supplied retouch of images/IMG_2260.JPG)` | 1536 x 1024 |
| `/images/services/tesla-rear-glass.webp` | `clean_pic_Services/01_single_photos/webp/10-tesla-rear-glass.webp (supplied retouch of images/IMG_2836.JPG)` | 1086 x 1448 |
| `/images/services/truck-cab-rear-window.webp` | `clean_pic_Services/01_single_photos/webp/11-truck-cab-rear-window.webp (supplied retouch of images/IMG_0923.HEIC)` | 1536 x 1024 |
| `/images/services/sedan-windshield-detail.webp` | `clean_pic_Services/01_single_photos/webp/12-sedan-windshield-detail.webp (supplied retouch of images/IMG_1193.HEIC)` | 1536 x 1024 |
| `/images/services/porsche-classic-windshield.webp` | `clean_pic_Services/01_single_photos/webp/13-porsche-classic-windshield.webp (supplied retouch of images/IMG_2408.JPG)` | 1536 x 1024 |
| `/images/services/mobile-service-bentley.webp` | `images/IMG_0586.HEIC, existing orientation-corrected preview` | 1400 x 1050 |
| `/images/services/mobile-glass-work.webp` | `images/IMG_1793.PNG` | 1179 x 1038 |
| `/images/services/workshop-and-service-van.webp` | `images/IMG_0585.HEIC, existing orientation-corrected preview` | 1400 x 1050 |
| `/images/gallery/corvette-blue-before.webp` | `clean_pic_Services/02_before_after/separate_pairs/01-corvette-blue-before-after/before.webp, sourced from images/IMG_0539.HEIC` | 1000 x 1136 |
| `/images/gallery/corvette-blue-after.webp` | `clean_pic_Services/02_before_after/separate_pairs/01-corvette-blue-before-after/after.webp, sourced from images/IMG_0543.HEIC` | 1000 x 1136 |
| `/images/gallery/bentley-before.webp` | `clean_pic_Services/02_before_after/separate_pairs/02-bentley-before-after/before.webp, sourced from images/IMG_0581.HEIC` | 1000 x 1067 |
| `/images/gallery/bentley-after.webp` | `clean_pic_Services/02_before_after/separate_pairs/02-bentley-before-after/after.webp, sourced from images/IMG_0587.HEIC` | 1000 x 1067 |
| `/images/gallery/truck-rear-window-before.webp` | `clean_pic_Services/02_before_after/separate_pairs/03-truck-rear-window-before-after/before.webp, sourced from images/IMG_0922.HEIC` | 1000 x 867 |
| `/images/gallery/truck-rear-window-after.webp` | `clean_pic_Services/02_before_after/separate_pairs/03-truck-rear-window-before-after/after.webp, sourced from images/IMG_0923.HEIC` | 1000 x 867 |
| `/images/gallery/sedan-before.webp` | `clean_pic_Services/02_before_after/separate_pairs/04-sedan-before-after/before.webp, sourced from images/IMG_1191.HEIC` | 1000 x 585 |
| `/images/gallery/sedan-after.webp` | `clean_pic_Services/02_before_after/separate_pairs/04-sedan-before-after/after.webp, sourced from images/IMG_1193.HEIC` | 1000 x 585 |
| `/images/gallery/isuzu-before.webp` | `clean_pic_Services/02_before_after/separate_pairs/05-isuzu-before-after/before.webp, sourced from images/IMG_2220.JPG` | 1000 x 1000 |
| `/images/gallery/isuzu-after.webp` | `clean_pic_Services/02_before_after/separate_pairs/05-isuzu-before-after/after.webp, sourced from images/IMG_2221.JPG` | 1000 x 1000 |
| `/images/gallery/gmc-before.webp` | `clean_pic_Services/02_before_after/separate_pairs/06-gmc-before-after/before.webp, sourced from images/IMG_2235.JPG` | 1000 x 1040 |
| `/images/gallery/gmc-after.webp` | `clean_pic_Services/02_before_after/separate_pairs/06-gmc-before-after/after.webp, sourced from images/IMG_2236.JPG` | 1000 x 1040 |
| `/images/gallery/peterbilt-before.webp` | `clean_pic_Services/02_before_after/separate_pairs/07-peterbilt-before-after/before.webp, sourced from images/IMG_2781.JPG` | 1000 x 1066 |
| `/images/gallery/peterbilt-after.webp` | `clean_pic_Services/02_before_after/separate_pairs/07-peterbilt-before-after/after.webp, sourced from images/IMG_2782.JPG` | 1000 x 1066 |
| `/images/gallery/tesla-before.webp` | `clean_pic_Services/02_before_after/separate_pairs/08-tesla-before-after/before.webp, sourced from images/IMG_2833.JPG` | 1000 x 1106 |
| `/images/gallery/tesla-after.webp` | `clean_pic_Services/02_before_after/separate_pairs/08-tesla-before-after/after.webp, sourced from images/IMG_2836.JPG` | 1000 x 1106 |
| `/images/gallery/corvette-red-before.webp` | `clean_pic_Services/02_before_after/separate_pairs/09-corvette-red-before-after/before.webp, sourced from images/IMG_1137.HEIC` | 1000 x 967 |
| `/images/gallery/corvette-red-after.webp` | `clean_pic_Services/02_before_after/separate_pairs/09-corvette-red-before-after/after.webp, sourced from images/C6628151-50AE-4029-BC97-B4797F231102.jpg` | 1000 x 967 |

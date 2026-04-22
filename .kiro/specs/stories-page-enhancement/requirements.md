# Requirements Document

## Introduction

Enhancement of the existing Stories page (`/stories`) in a Next.js Pages Router application for Sampada — a premium Indian heritage fashion brand. The enhancement adds two new visual sections: (A) a Spotlight Reveal Hero replacing the existing top banner, and (B) a "Selected Works" Masonry Gallery section appended above the footer. All existing sections (stories grid, filter tabs, "Every look tells a story", "Wear What Kavya Wears", navbar, footer) must remain untouched.

## Glossary

- **SpotlightReveal**: A full-viewport hero component that renders a mouse-following spotlight clip-path transition between two images using lerp-smoothed animation.
- **EchoCanvas**: A canvas overlay component that renders velocity-based echo rings on mouse movement.
- **SelectedWorksGallery**: A masonry-grid gallery section with category filter tabs, gold hover overlays, and a CTA button.
- **Stories_Page**: The Next.js page at `pages/stories/index.js` using the Pages Router.
- **Kavya_Images**: The seven images located at `/images/Kavya/kavya-1.jpg` through `/images/Kavya/kavya-7.jpg`.
- **Lerp**: Linear interpolation — a smoothing technique applied to mouse position tracking.
- **Masonry_Grid**: A CSS columns-based layout where items flow into columns of varying heights.

---

## Requirements

### Requirement 1: Spotlight Reveal Hero Component

**User Story:** As a site visitor, I want to see a visually striking hero section when I land on the Stories page, so that I immediately understand the premium brand identity and feel engaged.

#### Acceptance Criteria

1. THE `SpotlightReveal` SHALL render at a height of 85vh with a minimum height of 600px.
2. THE `SpotlightReveal` SHALL display a dark navy background color of `#0d1126`.
3. WHEN the user moves the mouse over the hero, THE `SpotlightReveal` SHALL reveal a second image beneath the first using a circular clip-path centered on the cursor position.
4. THE `SpotlightReveal` SHALL apply lerp smoothing (factor 0.08) to the spotlight position so that movement follows the cursor with a lag effect.
5. THE `SpotlightReveal` SHALL display the eyebrow text "Meet the Face" in gold (`#c9a96e`) using Montserrat font at 0.72rem with 0.28em letter-spacing.
6. THE `SpotlightReveal` SHALL display the hero name "Kavya" using Playfair Display font at a fluid size between 5rem and 8rem.
7. THE `SpotlightReveal` SHALL display the brand label "Sampada Originals™" in cream (`#f5f0eb`) at 0.8rem.
8. THE `SpotlightReveal` SHALL use `kavya-1.jpg` as the base (dark) image and `kavya-3.jpg` as the revealed (light) image.
9. IF the user's device does not support pointer events (touch-only), THEN THE `SpotlightReveal` SHALL display a static centered spotlight at 40% radius as a fallback.
10. THE `SpotlightReveal` SHALL accept `imageA` and `imageB` props for the two image paths.

### Requirement 2: Echo Canvas Overlay Component

**User Story:** As a site visitor, I want to see subtle animated rings appear as I move my mouse across the hero, so that the interaction feels alive and premium.

#### Acceptance Criteria

1. THE `EchoCanvas` SHALL render a full-size canvas element positioned absolutely over its parent container.
2. WHEN the mouse moves, THE `EchoCanvas` SHALL spawn echo ring particles at the cursor position with a radius that expands from 0 to 40px.
3. THE `EchoCanvas` SHALL apply velocity-based scaling so that faster mouse movement produces larger initial ring radii (capped at 60px).
4. THE `EchoCanvas` SHALL fade each ring's opacity from 0.6 to 0 over a lifetime of 600ms.
5. THE `EchoCanvas` SHALL render rings in gold color `rgba(201, 169, 110, alpha)`.
6. THE `EchoCanvas` SHALL use `requestAnimationFrame` for its animation loop and cancel the frame on component unmount.
7. THE `EchoCanvas` SHALL be pointer-events-none so it does not block mouse events on the hero beneath it.

### Requirement 3: Hero Section Replacement

**User Story:** As a developer, I want the existing plain text hero in `pages/stories/index.js` replaced with the new SpotlightReveal component, so that the page uses the enhanced visual experience.

#### Acceptance Criteria

1. THE `Stories_Page` SHALL import and render `SpotlightReveal` in place of the existing `<section className={styles.hero}>` block.
2. THE `Stories_Page` SHALL pass `kavya-1.jpg` as `imageA` and `kavya-3.jpg` as `imageB` to `SpotlightReveal`.
3. THE `Stories_Page` SHALL NOT modify any section below the hero (MeetTheFace, StoryTimeline, FilterBar, grid, BehindTheShoot, CollectionBanners).
4. THE `Stories_Page` SHALL NOT add a `'use client'` directive (Pages Router does not use it).

### Requirement 4: Selected Works Masonry Gallery

**User Story:** As a site visitor, I want to browse a curated gallery of Kavya's looks with category filtering, so that I can discover specific styles that interest me.

#### Acceptance Criteria

1. THE `SelectedWorksGallery` SHALL render a masonry grid using CSS `columns` property.
2. THE `SelectedWorksGallery` SHALL display 2 columns on screens below 768px, 3 columns between 768px and 1024px, and 4 columns above 1024px.
3. THE `SelectedWorksGallery` SHALL display filter tabs: All, Casual, Festive, Premium, Summer, Winter.
4. WHEN a filter tab is clicked, THE `SelectedWorksGallery` SHALL show only images whose associated tag matches the selected filter.
5. WHEN the "All" filter tab is active, THE `SelectedWorksGallery` SHALL display all seven Kavya images.
6. WHEN the user hovers over a gallery image, THE `SelectedWorksGallery` SHALL display a gold overlay (`rgba(201,169,110,0.85)`) with the look title and collection name.
7. THE `SelectedWorksGallery` SHALL use a dark navy background of `#0d1126`.
8. THE `SelectedWorksGallery` SHALL display a section heading "Selected Works" and eyebrow "The Kavya Edit".
9. THE `SelectedWorksGallery` SHALL render a CTA button "Explore Full Collection" that links to `/collections/womens-tshirts`.
10. THE `SelectedWorksGallery` SHALL use the same `Kavya_Images` already present in the stories page (kavya-1.jpg through kavya-7.jpg) with their associated metadata from `getLocalKavyaImages`.

### Requirement 5: Stories Page Integration of Gallery

**User Story:** As a developer, I want the SelectedWorksGallery added to the stories page above the footer, so that visitors see the gallery as the final content section before leaving.

#### Acceptance Criteria

1. THE `Stories_Page` SHALL import and render `SelectedWorksGallery` after the `CollectionBanners` section and before the closing `</main>` tag.
2. THE `Stories_Page` SHALL pass the `stories` prop data to `SelectedWorksGallery` so it can use the same image metadata.
3. THE `Stories_Page` SHALL NOT alter the order or content of any existing sections.

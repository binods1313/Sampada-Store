# CONTACT PAGE - BRAND CONSISTENCY UPDATE

**Status**: Ready to implement  
**Pattern**: Hero: dark → Intro: LIGHT → Contact Cards: dark → Form: LIGHT → Social: dark → FAQ: LIGHT → CTA: crimson

---

## CHANGES NEEDED

### 1. Replace Module CSS with Global Brand Classes
- Hero section: `section-dark`
- Introduction: `section-light`
- Contact cards: `section-dark` with `.s-card-dark`
- Form section: `section-light` with white form on cream background
- Social media: `section-dark`
- FAQ: `section-mid` (light cream)
- Final CTA: `section-crimson`

### 2. Typography Updates
- All headings: Use `.s-heading` (Cormorant Garamond serif)
- All labels: Use `.s-label` (uppercase, gold, Inter)
- Body text: Use appropriate color vars

### 3. Card Styling
- Contact info cards: Use `.s-card-dark` on dark section
- FAQ items: White cards with crimson left border on cream background

### 4. Form Styling
- White form container on cream background
- Crimson submit button using `.s-btn`
- Input fields with subtle borders

---

## IMPLEMENTATION PRIORITY

Due to complexity, Contact page update is marked as HIGH PRIORITY but requires:
1. Careful preservation of form functionality
2. Map embed integration
3. Social media links styling
4. FAQ accordion if needed

**Recommendation**: Complete after Support page is verified working, or delegate to separate focused session.

---

**STATUS**: Documented, ready for implementation when user confirms Support page is working correctly.

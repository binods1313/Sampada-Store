# Phase 3: Content & Experience Upgrade

## 🎯 Objective
Implement "Sampada Stories" content hub and restructure the Homepage to feature 3 main categories (Men, Women, Home & Living).

---

## 📅 Task Breakdown

### Part 1: Homepage Restructuring
- [ ] **Components**: Create `MainCategories.jsx` (New component 3-card layout).
- [ ] **Update Page**: Modify `pages/index.js` to replace existing category nav/promo sections with `MainCategories`.
- [ ] **Styling**: Ensure responsive 3-col -> 2-col -> 1-col layout.
- [ ] **Assets**: Use placeholder images for categories if real ones aren't available.

### Part 2: Navigation Updates
- [ ] **Update Navbar**: Modify `components/Navbar.jsx`.
    - [ ] Update Desktop Menu structure (Home, Men, Women, Home & Living, Stories, Contact).
    - [ ] Add Submenus (Hover dropdowns with subcategories as requested).
    - [ ] Mobile Menu: Ensure collapsible sections work.

### Part 3: "Sampada Stories" Tab
- [ ] **Backend (Sanity)**:
    - [ ] Create `post` schema in `sanity_abscommerce/schemaTypes/post.js`.
    - [ ] Fields: title, slug, mainImage, categories, body, videoUrl, excerpt, isFeatured.
    - [ ] Create `category` schema (if not exists) or update for 'Stories' categories.
- [ ] **Frontend (New App Route)**:
    - [ ] Create `app/stories/page.tsx` (Stories Hub).
    - [ ] Create `app/stories/[slug]/page.tsx` (Single Post).
    - [ ] Create `components/stories/Hero.tsx`.
    - [ ] Create `components/stories/FilterBar.tsx`.
    - [ ] Create `components/stories/ContentGrid.tsx`.
    - [ ] Create `components/stories/PostCard.tsx`.
- [ ] **Mock Data**: Create a mock data file or seeding script if we can't deploy Sanity immediately.

---

## 🛠 Technical Details

### Homepage Categories
- **Layout**: CSS Grid / Flexbox.
- **Images**: 400x500px, Portrait.
- **Interactivity**: Hover reveals subcategories.

### Stories Page
- **URL**: `/stories`
- **Design**: White/Light Gray background, Purple Accents (#8B5CF6).
- **Features**: Filter by category (Fashion, Trends, etc.), Search.

---

## ✅ Deliverables
1. Functional `/stories` page.
2. Updated Homepage.
3. Updated Navbar.
4. Admin (Sanity) configured for Stories.

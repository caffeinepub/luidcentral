# Specification

## Summary
**Goal:** Add the custom platform logo image to the Header and all login pages.

**Planned changes:**
- Save the uploaded logo as a static asset at `frontend/public/assets/generated/luid-logo.dim_256x256.png`
- Replace any text-only or placeholder logo in the Header component with an `<img>` tag pointing to the new logo asset
- Display the logo above the login form heading on ClientLogin, MasterLogin, and StaffLogin pages

**User-visible outcome:** The platform logo (green circuit-board diamond icon) appears in the header on all pages and above the login form on each of the three login screens.

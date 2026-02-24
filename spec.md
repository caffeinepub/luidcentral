# Specification

## Summary
**Goal:** Polish the LuidCentral client portal and admin panels by hiding admin navigation from clients, adding a chat online/offline toggle, removing the watermark, and introducing a support tier system with a client profile view.

**Planned changes:**
- Remove all links, buttons, or references to `/master` and `/staff` routes from the client portal header, footer, navigation tabs, and dashboard (admin panels remain accessible via direct URL)
- Add a chat availability toggle (Online/Offline) to both the Master and Staff admin panels; persist the status in localStorage (`chat_status`, default: Online)
- When chat is set to Offline, display a neon-styled "Support chat is currently offline" message in the client portal chat tab and disable the message input
- Remove the "Build with Caffeine AI" watermark/branding text from all pages and components
- Add a `tier` field (`'Basic' | 'Premium' | 'Enterprise'`) to the Client interface and localStorage `clients` collection, defaulting to `'Basic'` for new clients
- Add a tier dropdown to each client row in the Master admin panel's client management section for instantly changing a client's tier
- Add a clickable profile element (showing the user's LUID ID) to the client portal header; clicking it opens a modal displaying the LUID ID, account creation date, and support tier as a neon-green styled badge

**User-visible outcome:** Clients see a clean portal with no admin links, can view their own profile with their support tier badge, and see a clear offline notice when chat is unavailable. Admins can toggle chat availability and assign support tiers (Basic, Premium, Enterprise) to clients directly from the master panel.

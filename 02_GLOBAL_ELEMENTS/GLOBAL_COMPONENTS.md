# Jesus Generation — Global Components

Source of truth for site-wide header, action buttons, language toggle, footer, and the ministry phrase. Paste labeled snippets into GoHighLevel only. Do not flatten visual-reference PNGs. If a screenshot conflicts with this file, the Master Build Guide and `openspec/config.yaml` win.

**Ministry phrase (live text, never replace in chrome):** Reach. Equip. Multiply.

English pages live under `/`. Spanish mirrors are **separate GHL pages** under `/es/` (GHL has no native i18n). Duplicate this chrome on each language instance; do not swap strings with JavaScript on one page.

---

## 1. Header inventory

| Element | Path / value | Visual rule |
|---|---|---|
| Logo | `01_BRAND/Jesus_Generation_Official_Logo.png` | Upper left, official globe/cross logo |
| HOME | `/` | Primary text menu |
| ABOUT | `/about` | Primary text menu |
| ACADEMY | `/academy` | Primary text menu |
| CONTACT | `/contact` | Primary text menu |
| GET INVOLVED | `/get-involved` | Action button. Royal Blue `#0D47A1`, Deep Navy `#0A1E3D`, or white-with-blue. **Never red.** |
| GIVE | `/give` | Action button. Action Red `#E53935` in **all** circumstances |
| Language | EN \| ES | EN → English URL map; ES → matching `/es/…` page |
| Phrase | Reach. Equip. Multiply. | Header and/or footer chrome |

Spanish path prefix: `/es` + English path (`/` → `/es/`, `/about` → `/es/about`).

---

## 2. Footer link groups

Repeat the official logo and the short mission statement: **Reach. Equip. Multiply.**

### Quick links

- Home `/`
- About `/about`
- Academy `/academy`
- Contact `/contact`

### Get Involved

- Mission Trips `/get-involved/mission-trips`
- Serve `/get-involved/serve`
- Partnerships `/get-involved/partners`
- Prayer `/get-involved/pray`

### Give

- Give Now `/give`
- Monthly `/give/monthly`
- Equip a Leader `/give/equip-a-leader`
- Other Ways to Give `/give/other-ways`

### Connect

- Contact `/contact`
- Prayer Request `/contact/prayer`
- Media & Speaking `/contact/media-speaking`

### Secondary

- Know Jesus `/jesus`
- Stories `/stories`
- Privacy — **CONTENT NEEDED** (omit live link until approved copy exists)
- Terms — **CONTENT NEEDED**
- Child Safeguarding — **CONTENT NEEDED**

**Newsletter:** Use a **native GHL Form/Survey** with a separate affirmative opt-in. Do not treat contact, prayer, or inquiry submit as newsletter consent. Do not build a custom HTML `<form>` backend.

Spanish footer: same groups with `/es/` prefixed on every path.

---

## 3. Responsive rules (`openspec/config.yaml`)

Approach: **mobile-first** CSS (base = mobile, enhance with `min-width` queries). Align with GHL preview: mobile ≈ 480px, tablet ≈ 768px.

| Breakpoint | Behavior |
|---|---|
| `max-width: 1024px` | Primary text menu (HOME, ABOUT, ACADEMY, CONTACT) collapses to hamburger / off-canvas drawer |
| Wider than 1024px | Full horizontal menu + GET INVOLVED + GIVE + EN \| ES |
| All widths | Header is **sticky/fixed** on scroll |
| All widths | EN \| ES remains visible |
| Collapsed / mobile | **GIVE remains tappable outside the drawer** — never hidden inside the drawer only. Color stays `#E53935`. |
| GET INVOLVED on mobile | May stay in the sticky bar (not red) or sit in the drawer; GIVE must still be in the bar |
| Tap targets | GET INVOLVED and GIVE at least **44px × 44px** on tablet/mobile |

**QA widths:** 375px, 428px, 768px, 1024px, 1440px (1920px spot-check). No unintended horizontal scroll. No overlapping chrome.

---

## 4. GHL paste targets (repo files)

These three GHL fields are **not interchangeable**. Copy each file’s contents into the matching field. Replace `LOGO_SRC` with the hosted URL of `01_BRAND/Jesus_Generation_Official_Logo.png`. Local preview: open `ghl/preview-en.html` and `ghl/preview-es.html`.

| GHL field | File |
|---|---|
| **(a) Custom CSS** | `ghl/jg-global.css` (`--jg-royal-blue`, `--jg-deep-navy`, `--jg-action-red`, `.jg-btn-give`, `.jg-btn-get-involved`) |
| **(b) Custom Code / HTML embed** | `ghl/jg-header-en.html`, `ghl/jg-header-es.html`, `ghl/jg-footer-en.html`, `ghl/jg-footer-es.html` |
| **(c) Footer Tracking Code** | `ghl/jg-footer-tracking.html` (source also in `ghl/jg-header.js`) |

English vs Spanish are **separate GHL pages** (`/` vs `/es/`). Fonts: set Montserrat / Inter in the GHL site theme when possible.

On interior Spanish pages, point ES at the matching `/es/…` path. Point EN at the English twin. Newsletter: native GHL Form/Survey only.

---

## 5. Color lock (do not override)

- Visual foundation: Royal Blue `#0D47A1`, Deep Navy `#0A1E3D`
- GIVE / `.jg-btn-give`: `#E53935` only
- GET INVOLVED / `.jg-btn-get-involved`: never `#E53935`

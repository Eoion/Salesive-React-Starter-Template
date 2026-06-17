---
name: salesive-theme-builder
description: >-
  Build, scaffold, or modify a Salesive storefront THEME — a React + Vite +
  Tailwind SPA that renders a live merchant's store and is deployed with
  `salesive cook`. Use when creating or editing any salesive-* theme repo:
  wiring the Store API (products / categories / cart / orders / blogs / reviews),
  config-driven content via salesive-dev-tools, the salesive.config.json +
  salesive.form.json schemas, multi-mode (ecommerce / restaurant / business)
  storefronts, shopper login (Google + email OTP), the auto-injected chat
  widget, branding/theming, and verifying + deploying. Covers the canonical
  CLI/SDK workflow plus the non-obvious gotchas that bite every time.
---

# Building a Salesive storefront theme

A Salesive theme is a **React + Vite + Tailwind single-page app** that the
platform serves as a live merchant's storefront. You never ship data — you ship
a UI that, at runtime, reads the store's catalog/cart/orders from the Salesive
Store API and reads the store's branding/copy from injected config. The same
theme must work for *any* store of its declared type(s), so **nothing
store-specific is ever hardcoded** — names, copy, colors, currency, and catalog
all come from config + API at runtime.

**A Salesive store is not only an online shop.** It can be an **ecommerce** store
(products + variants), a **restaurant** (food menu + add-ons), or a **business /
services** store (services + add-ons, no shipping). You declare which you support
in `shopTypes`, and the catalog/cart/order endpoints return a `catalogType` +
per-item `itemType` so one theme can serve several types — write copy, labels,
and cart logic that adapt to the active type (see §5), never ecommerce-only
assumptions.

Two libraries do the heavy lifting:

| Concern | Package | What it gives you |
|---|---|---|
| **Data** (catalog, cart, orders, auth) | `salesive-api-axios` | Typed axios wrappers → `https://store.salesive.com/api/v1`, auto token + `x-shop-id` headers |
| **Content/branding** (copy, colors, logo) | `salesive-dev-tools` | Vite plugin that injects config as `window.SALESIVE_CONFIG`; `useSalesiveConfig()` hook; the `salesive` CLI (`init`/`dev`/`validate`/`cook`) |

> **Canonical docs — use either (both cover the full docs):**
> - **Full docs as one file:** https://docs.salesive.com/llms.txt (fetch it for
>   complete, LLM-friendly reference in a single request).
> - **Salesive Docs MCP:** https://docs.salesive.com/mcp — tools
>   `search_salesive_docs` + the read-only `query_docs_filesystem_salesive_docs`.
>
> Key pages: `/development.mdx`, `/quickstart.mdx`, `/routing.mdx`,
> `/widget.mdx`, `/form-builder/*`, `/api-reference/*`. The MCP is **read-only**
> — there's no tool to file doc-error reports; surface any doc errors to the user.

---

## 0. Before you build — orient

1. **Read the existing repo first** if one exists (`salesive.config.json`,
   `src/lib/`, `src/router.jsx`, any project memory). Match its conventions.
2. **Confirm the dev shop id is valid.** Scaffolds often ship a placeholder
   `VITE_SALESIVE_SHOP_ID` that returns 500. Point `.env` at a *real* shop you
   can read (the user's own store id works). Public reads need only the shop id.
3. **Reuse a running dev server; never broad-kill it.** `pkill -f vite` matches
   *every* Vite process including the user's — don't. Check the port
   (`curl -s localhost:5173`) and reuse it; if you must start your own, track
   its PID and kill only that.
4. Pick a **design direction** before writing components (see §10). Generic =
   bad. Decide on a point of view, a type system, a single accent.

---

## 1. Project setup

```bash
# scaffold (templates: react-vite | react-router)
salesive init --name my-theme --template react-vite
npm install salesive-api-axios salesive-dev-tools
```

**vite.config.js** — register the dev plugin (it's auto-disabled in prod builds):

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { salesiveConfigPlugin } from "salesive-dev-tools";

export default defineConfig({
  plugins: [react(), salesiveConfigPlugin()],
});
```

**.env** (local dev only — the platform injects the real shop at runtime):

```
VITE_SALESIVE_SHOP_ID=<a real shop id you can read>
# VITE_SALESIVE_API_KEY is OPTIONAL — public reads work without it.
```

The SDK reads `VITE_SALESIVE_SHOP_ID` for the `x-shop-id` header and stores its
session token in `localStorage` under `SALESIVE_ACCESS_TOKEN` (mode in
`SALESIVE_AUTH_MODE` = `GHOST` | `USER`). Base URL: `https://store.salesive.com/api/v1`.

Typical file layout:

```
src/
  lib/salesive.js     # API wrapper (session, unwrap, data helpers)
  lib/config.js       # config merge + defaults + mode resolution
  context/            # CartContext, AuthContext
  components/         # Header, Footer, ProductCard, CartDrawer, modals, icons
  pages/              # Home, Shop, Product, Cart, Login, Blog, NotFound
  router.jsx  App.jsx  main.jsx  index.css
salesive.config.json  # variable DEFAULTS + metadata (required to deploy)
salesive.form.json    # the merchant-facing edit form (optional)
index.html            # boot loader, widget pre-theme, fonts
```

---

## 2. The data contract (`salesive-api-axios`)

Every protected call needs a session. Create a **ghost** lazily, dedupe
concurrent attempts, retry once on 401/403, and always unwrap
`res.data.data ?? res.data`. Wrap the SDK in one `src/lib/salesive.js` so the
whole app shares this — never call the SDK raw from components.

```js
import { auth, products, cart, orders, blogs, api } from "salesive-api-axios";

const TOKEN_KEY = "SALESIVE_ACCESS_TOKEN";
const getToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };
const clearSession = () => { try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem("SALESIVE_AUTH_MODE"); } catch {} };

let ghostPromise = null;
export async function ensureSession() {
  if (getToken()) return;
  if (!ghostPromise) ghostPromise = auth.createGhost().catch(() => {}).finally(() => (ghostPromise = null));
  await ghostPromise;
}

// retry once after refreshing the ghost on auth failure
async function withSession(fn) {
  await ensureSession();
  try { return await fn(); }
  catch (err) {
    const s = err?.response?.status;
    if (s === 401 || s === 403) { clearSession(); await ensureSession(); return await fn(); }
    throw err;
  }
}

const unwrap = (res) => res?.data?.data ?? res?.data ?? null;

export const listProducts = (p = {}) => withSession(() => products.list(p).then(unwrap));
export const getProduct   = (idOrSlug) => withSession(() => products.getById(idOrSlug).then(unwrap));
export const listCategories = () => withSession(() => products.listCategories().then(unwrap))
  .then((d) => (Array.isArray(d) ? d : d?.categories || []).filter((c) => !c.deleted)); // hide soft-deleted
export const getCart = () => withSession(() => cart.get().then(unwrap));
// cart.addItem({ productId, variantId?, quantity }) | services: { serviceId, selectedAddons? }
export const checkout = () => withSession(() => orders.createFromCart().then(unwrap));
```

**Shape notes (the API is loosely typed — always guard):**
- `products.list` → `{ products, pagination, statistics, catalogType }`.
- `products.listCategories()` → `GET /products/category`, returns an array that
  **includes soft-deleted** categories → filter `!c.deleted`.
- Product ids: `p._id || p.id`; images: `p.images?.length ? p.images : [p.image]`.
- **Dead image URLs are common.** Give every `<img>` an `onError` that swaps to
  a placeholder data-URI **once** (guard with a dataset flag to avoid loops).
- Money/currency comes from the store config (`currency.symbol`), not a constant.
- Rate limited? `429` → retry with backoff.

---

## 3. Content & branding (`salesive-dev-tools`)

`useSalesiveConfig()` returns `window.SALESIVE_CONFIG.variables`. In **dev** these
come from `salesive.config.json → variables` (injected by the Vite plugin). In
**production** the platform injects the live store's merged config: store
**identity at the top level** (`name`, `currency`, `logo`, `favicon`,
`description`, `socialMedia`, `location`, `type`, `app`) **and** the merchant's
edited theme variables. The plugin also auto-sets document title/description/
favicon from `app-name`/`app-description`/`app-favicon`.

**Golden rule: merge config over generic defaults; never hardcode shop copy.**
Build a single `useShop()` that layers: theme defaults ← merchant variables ←
live store identity. Empty strings must NOT wipe a default.

```js
// src/lib/config.js
import { useSalesiveConfig } from "salesive-dev-tools";

const BASE = {                       // generic, category-agnostic defaults
  name: "Your Store", description: "…",
  heroTitle: "…", heroSubtitle: "…", /* …all copy lives here… */
  instagram: "", contactEmail: "",
};

const injected = () => (typeof window !== "undefined" && window.SALESIVE_CONFIG) || {};
const isRealStore = (s) => Boolean(s && (s.type || s.currency || s.location || s.app));

function storeIdentity(s = injected()) {            // never hardcode identity
  if (!isRealStore(s)) return {};
  const out = {}; const set = (k, v) => { if (v != null && v !== "") out[k] = v; };
  set("name", s.name); set("logo", s.logo || s.app?.logo); set("favicon", s.favicon || s.app?.favicon);
  if (s.currency) out.currency = s.currency;
  set("instagram", s.socialMedia?.instagram);
  set("contactEmail", s.location?.email); set("contactPhone", s.location?.phone);
  return out;
}

const merge = (defaults, cfg) => {                  // skip empties so a blank field keeps the default
  const out = { ...defaults };
  for (const [k, v] of Object.entries(cfg)) if (v != null && v !== "") out[k] = v;
  return out;
};

export function useShop() {
  const variables = useSalesiveConfig() || {};
  const merged = merge(BASE, variables);
  Object.assign(merged, storeIdentity(injected()));
  return merged;
}
```

**Accent color**: read defensively (`color-primary || color-brand-primary ||
primary`), validate it's a hex, then set a CSS custom property once in an effect
so the whole stylesheet (`var(--color-accent)`) re-themes. Brand tokens are
conventionally **kebab-case** (`color-brand-primary`); content fields are
**camelCase** (`heroTitle`) because a form field `id` becomes the variable name.

---

## 4. `salesive.config.json` + `salesive.form.json`

**`salesive.config.json`** (required to deploy) — metadata + variable defaults.
`name` must be lowercase-with-hyphens; `version` semver. `shopTypes` gates which
stores can install the theme.

```json
{
  "name": "my-theme",
  "version": "1.0.0",
  "description": "…",
  "author": "You",
  "shopTypes": ["ecommerce", "restaurant", "business"],
  "variables": { "color-primary": "#f5421e", "heroTitle": "…", "showBlog": true }
}
```

**`salesive.form.json`** (optional) — the merchant-facing editor: `pages[] →
sections[] → fields[]`. **Every editable variable should have a matching field
here** (a field `id` *is* the variable name). Field types:

- `text` — `inputType`: `text|textarea|email|tel|url|number`, `placeholder`.
- `media` — `mediaType`: `image|video|file`; `multiple`, `minItems`, `maxItems`.
- `color` — hex default.
- `select` — `selectType`: `text|boolean|number`; `options:[{label,value}]`; `multiple`.

```json
{ "id": "heroTitle", "type": "text", "inputType": "text",
  "label": "Hero heading", "default": "…", "required": false }
```

Keep `config.json` variable defaults and `form.json` field defaults **in sync**.
Booleans: read them through a `truthy()` helper since they may arrive as
`"false"`/`"0"`/`""`.

---

## 5. Multi-mode themes (`shopTypes` / `catalogType`)

`shopTypes` declares what the theme supports; the catalog endpoints return a
`catalogType` + per-item `itemType` matching the active store:

| Store type | `catalogType` | Catalog shape |
|---|---|---|
| `ecommerce` | `product` | products + variants, shipping |
| `restaurant` | `food` | menu items + add-ons |
| `business` | `service` | services + add-ons, **no shipping/variants** |

Resolve mode **synchronously** to avoid a first-paint flash: explicit override
var → injected `type`/`catalogType` → default `ecommerce`. Keep per-mode COPY +
LABELS maps and branch the cart payload (`productId`+`variantId` vs `serviceId`+
`selectedAddons`) on `itemType`. As a last resort (auto mode, untyped dev shop),
detect once via a light `/products?limit=1` call and write it back with
`updateSalesiveConfig`.

---

## 6. Routing & pages

Use `react-router`. Cover the storefront surfaces (the platform treats some as
**automatic routes**): `/` (home), catalog (`/shop` or `/products`),
`/product/:slug`, `/cart`, `/login`, `/account`, `/orders`, `/blog` +
`/blog/:slug`, and a `*` NotFound. Add a `ScrollManager` that scrolls to top on
path change and to `#hash` anchors (retry once after content settles).

---

## 7. Shopper auth — Google + email OTP  ⚠️ read this carefully

The flows (all via `salesive-api-axios` `auth`):

- **Email OTP**: `auth.authenticate({ email })` → emails a **6-digit** code →
  `auth.verify({ email, otp })` (the SDK persists a `USER` token on success).
  `auth.resendOtp({ email })` to resend.
- **Google**: `GET /auth/google?redirect=false` (`auth.getGoogleAuth()`) returns
  `data.data.url` — the real consent URL carrying shop + callback **state**.
  Show a loading state, then `window.location = url`. The **callback is handled
  by the backend automatically** (cookie-backed, `withCredentials`), so on
  return you just call `auth.me()` — there's no token to parse from the URL.
  (In *local* dev the callback redirects to the store's configured production
  URL from the OAuth state, so the full round-trip only completes on a deploy.)

### ⚠️ The detection gotcha that WILL bite you

`GET /auth/me` nests the shopper at **`data.data.user`** (not `data.data`), and a
**guest/ghost session has `role: "ghost"` with NO `isGuest` field**. So:

- **Do NOT detect "logged in" by token presence** — ghosts have tokens too. The
  docs' Route Protection example (`localStorage.getItem("salesive_token")`) is
  **wrong** (wrong key *and* wrong logic) and produces "signed in as guest".
- **Detect by `role`**: unwrap `.user`, and treat the session as a real shopper
  only when `role` is present and **not** in `{ghost, guest}`.

```js
const GUEST_ROLES = new Set(["ghost", "guest"]);
const unwrapUser = (res) => { const p = res?.data?.data ?? res?.data; return p?.user ?? p ?? null; };
export const isRealUser = (u) => Boolean(u) && !!u.role && !GUEST_ROLES.has(String(u.role).toLowerCase());

export async function getCurrentUser() {
  try { const u = unwrapUser(await auth.me()); return isRealUser(u) ? u : null; }
  catch { return null; }
}
export async function startGoogleLogin() {
  const res = await auth.getGoogleAuth();
  const url = res?.data?.data?.url || res?.data?.url;
  if (!url) throw new Error("Couldn't start Google sign-in.");
  return url; // redirect the browser here
}
export async function logout() { clearSession(); await ensureSession(); } // re-ghost so cart keeps working
```

Wrap this in an `AuthContext` that bootstraps `getCurrentUser()` once on mount,
exposes `{ user, isAuthed, openLogin, logout, completeLogin }`, and a shared
`AuthForm` used by both a login modal and the `/login` page. The real user
object has `name`, `email`, `avatar` (Google photo — render with
`referrerPolicy="no-referrer"` and an `onError` fallback to a user icon).

---

## 8. The chat widget

The Salesive chat bubble auto-injects from `salesive.shop/widget.js` at runtime —
**present in local dev too**, but it loads **asynchronously** and only on its
configured routes, so `window.SalesiveWidget` may be undefined for the first
moments after mount. Always guard calls with `?.` and **retry** (poll briefly)
rather than assuming it's ready. Theme it to the
accent by setting `window.SalesiveWidgetConfig = { theme: { primary, dark } }`
*before* the script loads (an inline `<script>` in `index.html` avoids a blue
flash) and calling `window.SalesiveWidget?.setTheme?.(...)` once mounted.
Control visibility with `SalesiveWidget.chat.hide()/show()/toggleVisibility()`
(these preserve chat state). E.g. hide it while a cart drawer/modal is open —
track whether *you* hid it so you only re-`show()` one you hid, and clear any
retry timer on cleanup.

---

## 9. Branding & boot

- `index.html`: inline a **boot loader** overlay (painted before the JS bundle),
  dismissed in `main.jsx` after React mounts. Its job is **functional, not just
  cosmetic** — it **holds the page during initial load so the injected
  `window.SALESIVE_CONFIG` is in place before first paint**, avoiding a flash of
  default/unstyled content (wrong name, colors, copy) while the platform injects
  the real store's config. This is a real, intentional delay — always ship a
  loader. Show the live store name via `window.SALESIVE_CONFIG.variables.name`.
  Note: an *infinite* loader/marquee animation traps headless
  `--virtual-time-budget` screenshots (see §12).
- A `ThemeVars` component sets `--color-accent` from config and re-themes the
  widget in one effect.
- Preconnect/​load fonts in `index.html`.

---

## 10. Design quality — don't ship generic

Themes are judged on craft. Invoke the **frontend-design** skill for visual
work. Principles that worked:

- **Commit to a point of view** (editorial, brutalist, luxe, playful) and carry
  it through type, spacing, borders, motion — not just color.
- **One signal accent**, everything else neutral; let the accent mean something.
- A real **type system** (display vs body vs mono), tight display leading,
  generous whitespace, intentional grid.
- Tasteful **motion**: reveal-on-scroll, hover transitions, a marquee — all
  respecting `prefers-reduced-motion`.
- Make **every state** good: empty cart, sold-out, loading skeletons, 404,
  broken images.
- Keep all copy **config-driven with generic defaults** so it reads well for any
  store in the category, never just your test shop.

---

## 11. Content honesty (non-negotiable)

You're building for real merchants. **Never fabricate claims.** No invented
discount percentages, fake "free shipping over $X", or testimonials presented as
real. Marketing-flavored *placeholders* must be honest invitations ("Be first to
new drops"), and anything opt-in (promo popups) should default **off** so a
merchant opts in with their own real offer. **Every link must resolve** — no
nav/footer link that dead-ends or points somewhere unrelated; fix it or remove
it. (A promo/announcement modal pattern: content from config, a short on-load
delay, a `localStorage` throttle keyed by a hash of the content so editing the
message re-shows it, suppressed while other overlays are open.)

---

## 12. Verifying your work

You can't trust "it compiles." Run it.

- **Lint + build** every time: `npx eslint src/` and `npm run build`. (ESLint
  with no React plugin flags JSX-only components as unused — add
  `argsIgnorePattern: "^[A-Z_]"` / `varsIgnorePattern` for `<Icon/>`-style refs.)
- **Headless screenshots** for layout — use `--headless=new` (plain `--headless`
  hangs and never writes the file):
  ```bash
  timeout 40 google-chrome --headless=new --no-sandbox --disable-dev-shm-usage \
    --window-size=390,844 --virtual-time-budget=9000 \
    --screenshot=/tmp/x.png "http://localhost:5173/product/<slug>"
  ```
  `/shop` and `/product/:slug` capture reliably; pages with **infinite
  animations** (home marquee, boot loader) keep virtual-time busy → either wait
  in real time via CDP, or retry and accept the first good PNG.
- **Interactive flows via the Chrome DevTools Protocol** (Node 22 has a built-in
  `WebSocket`). Drive a real click/redirect and assert DOM — far stronger than a
  static shot. Two proven recipes:
  - *Mock the network* with the CDP `Fetch` domain to drive auth (email→OTP→
    authed→logout) **without sending real OTP emails**: fulfill `*/auth/*` with
    canned JSON (echo CORS headers + handle the `OPTIONS` preflight; match the
    **real** shapes — `me` returns `data.user` with `role`); `continueRequest`
    everything else (e.g. `/auth/ghost`).
  - *Real-token check*: seed a known `SALESIVE_ACCESS_TOKEN` via
    `Page.addScriptToEvaluateOnNewDocument`, then assert the logged-in UI.
  - For overflow/scroll, measure in-page: `el.scrollWidth > el.clientWidth`,
    `offsetHeight - clientHeight`. (Note: headless Linux uses overlay scrollbars
    that don't paint custom `::-webkit-scrollbar` in a static shot — verify the
    *measurement*, and have the user eyeball the visual.)
- **Custom scrollbars / PC-only UI**: headless reports no mouse, so
  `@media (hover:hover) and (pointer:fine)` rules won't trigger there — that's
  expected, not a bug.

Common layout fix: a flex/grid child that overflows instead of scrolling needs
**`min-w-0`** on itself and its constrained ancestors (the `min-width:auto`
default lets it expand past the container).

---

## 13. Deploy

```bash
salesive validate            # required fields, name format, semver, variables
salesive auth set-token      # one-time, to talk to the Themes API
salesive cook                # packages + uploads (config.json required, form.json optional)
```

`cook` excludes `node_modules/`, `.git/`, `*.log`, etc. CI typically runs only
`salesive cook` (no lint/build gate) — so **lint and build locally** before
deploying. Commit/push and deploy only when the user asks.

---

## 14. Definition of done

- [ ] `npx eslint src/` and `npm run build` both clean.
- [ ] No hardcoded store-specific text/colors/currency — all config-driven with
      generic defaults; identity from `storeIdentity`.
- [ ] Every nav/footer/CTA link resolves; no fabricated claims.
- [ ] Auth (if added) detects login by **role**, not token presence; ghost reads
      as logged-out; avatar/name/email render for real users.
- [ ] Catalog, product, cart, search, empty/loading/404/broken-image states all
      look intentional.
- [ ] Verified in a real browser (screenshot/CDP), not just compiled.
- [ ] `salesive.config.json` ⇄ `salesive.form.json` defaults in sync.
- [ ] You did **not** kill the user's dev server.

---

## Process notes (how to work on these)

- **Consult the advisor** before committing to an architecture and before
  declaring done; verify empirically and trust the screenshot over CSS theory.
- **Confirm before outward/irreversible actions** (deploy, push, deleting files
  you didn't create). Surface mismatches instead of plowing ahead.
- Prefer **reusing** the running dev server; pick sensible defaults and state
  them rather than over-asking.
- When the docs are wrong (they sometimes are — e.g. the auth Route Protection
  snippet), trust the **real API response** you can curl, and tell the user.

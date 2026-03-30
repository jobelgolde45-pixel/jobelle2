# DOTr-HRDD Signatory Portal

## Overview

This implementation migrates `need_to_mimic.html` into a componentized Next.js App Router page using TypeScript, Tailwind utility classes, `next/font`, and `next/image`.

The portal is fully client-driven and preserves the original local-storage workflow:

- Signatory login gate
- Dashboard and signed archive tabs
- Pending batch review modal
- Theme toggle
- Notification tray
- Local document generation for nomination forms and memo directives

## Structure

- `app/layout.tsx`
  - Global metadata and Google font loading through `next/font`
- `app/page.tsx`
  - Mounts the portal entry component
- `app/globals.css`
  - Tailwind v4 theme tokens, class-based dark mode, and portal-specific utility styles
- `components/portal/signatory-portal.tsx`
  - Stateful client controller for authentication, local-storage sync, batch actions, and document viewing
- `components/portal/dashboard-shell.tsx`
  - Main authenticated dashboard layout
- `components/portal/action-modal.tsx`
  - Batch review / sign / disapprove modal
- `components/portal/login-screen.tsx`
  - Signatory login screen
- `components/portal/icons.tsx`
  - Reusable SVG icon components
- `lib/portal-data.ts`
  - Typed storage helpers, training catalog, seeded demo records, document HTML builders, and formatting helpers
- `types/portal.ts`
  - Portal data contracts and UI state types

## Data Model

The page uses `localStorage` under the key `DOTr_HRDD_DB`.

Expected shape:

```ts
interface PortalDatabase {
  applications: PortalApplication[];
}
```

`PortalApplication` supports the same core fields the legacy HTML expected, including:

- `status`
- `title`
- `name`
- `position`
- `office`
- `competency`
- `date_course`
- `date_filing`
- `venue`
- `justification`
- `admin_signature`
- `user_signature`
- `memo_time_in`
- `memo_time_out`
- `memo_provider`
- `memo_mode`
- `messages`

If there is no existing local storage entry, the app seeds a small demo dataset so the UI is usable immediately. Existing stored records are not overwritten.

## Functional Notes

### Login

The signatory credentials currently mirror the source HTML:

- Username: `cao_signatory`
- Password: `dotr123`

This remains client-side only and should be replaced with a real authentication flow before production deployment.

### Documents

The original HTML relied on `html2pdf.js` from a CDN. This Next.js implementation avoids a runtime CDN dependency and instead opens print-ready documents in a new window:

- Nomination form view
- Signed memo directive view

Users can use the browser’s Print / Save as PDF flow from those generated windows.

### Signed Memo Storage

Batch approval stores generated memo markup on each application record as `memoHtml`. If older data already contains `memo_pdf` as a PDF data URI, the viewer still supports it.

## Accessibility

Accessibility changes included during the migration:

- Semantic buttons and dialog-like modal behavior
- Labels tied to inputs
- `aria-expanded` on collapsible controls
- Descriptive button labels
- Reduced-motion support in global styles
- Stable page title through App Router metadata

## Running

```bash
npm run dev
```

Open the app, log in with the local signatory credentials, and interact with the seeded records or your own local-storage dataset.

## Follow-Up Recommendations

- Replace client-only credentials with server-backed auth
- Move local-storage data into a real API or database
- Swap print-window generation for a first-class PDF pipeline if exact downloadable PDFs are required
- Add Playwright coverage for login, batch signing, and archive flows

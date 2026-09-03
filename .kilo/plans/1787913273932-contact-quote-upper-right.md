# Move Contact quote to upper-right of the section

## Goal
In `src/components/Contact.tsx`, reposition the testimonial quote card (quote text + "- Noel Blanco, CEO" attribution + photo) so it sits in the upper-right corner of the Contact section on desktop. Do NOT change `src/components/Footer.tsx` (the fixed left social-links sidebar) or any other component.

## Confirmed decision
Move the whole quote card (text + attribution + photo) to the upper-right area of the Contact section. Everything else on the page stays as-is.

## Change (single file: `src/components/Contact.tsx`)

Line 38 — the right column wrapper:

- From: `className="flex w-full items-stretch lg:w-[60%]"`
- To: `className="flex w-full items-stretch lg:w-[60%] lg:items-start lg:justify-end"`

Effect:
- `lg:items-start` overrides `items-stretch` on desktop, so the card aligns to the top of the right column instead of being vertically stretched/centered.
- `lg:justify-end` pushes the card to the right edge within the 60% column (visible when the column is wider than the card's `max-w-md`).
- Mobile classes are untouched: the quote card keeps its current full-width, stacked-below-text behavior.
- The `article` card and its internals (quote icon, text, attribution row, photo) are unchanged; the card stays `aspect-square max-w-md`.

No other files change.

## Validation
- Run the dev server (`npm run dev`) and inspect the Contact section at desktop width (>=1024px): the quote card should be in the top-right of the section, with the left heading/paragraph vertically centered as before.
- At mobile width: layout identical to current behavior.
- Verify `Footer.tsx` social sidebar is unchanged.
- Run any project lint/typecheck command used by the repo (`npm run lint` / `npm run typecheck` if present) to confirm no issues.

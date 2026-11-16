# Design direction: The First Step, in Focus

## Point of view
Career Start should feel like a calm, well-made field guide for the first job: optimistic, editorial, and distinctly Arabic. The landing page persuades with a high-contrast typographic statement and one vivid blue action, then quickly proves usefulness through real tools. Tool pages operate with quiet structure, clear states, and the same brand details.

## Visual language
- Keep the existing blue identity and pair it with a warm citrus accent, used sparingly for progress and small highlights.
- Use warm paper-like light surfaces and deep ink surfaces with accessible contrast; theme changes retain the same hierarchy.
- Use Tajawal with a system sans-serif fallback. Large Arabic headlines carry strong weight contrast, generous line-height, and a restrained measure.
- Give sections different rhythms: spacious hero, connected four-step process, asymmetric tool bento, practical field cards, then compact FAQs and feedback.
- Use CSS-generated abstract field covers with one shared crop, tint, and overlay. The hero video remains poster-first and degrades to its poster if media is missing.
- Favor fine borders, subtle shadows, clear focus, and rounded corners that feel crafted rather than playful.

## Interaction
- Sticky, compact navigation with one quiz CTA; mobile navigation is a modal drawer with focus management and Escape support.
- One compact utility control groups theme, share, help, and back-to-top actions.
- Motion is short and functional: reveal on scroll, progress feedback, accordion transitions. Respect reduced motion.
- Tool surfaces prioritize scanning, clear forms, explicit loading/error/success states, and confident next steps.

## Surface modes
- Landing page: Persuade.
- Quiz, roadmaps, CV analyzer, CV builder, interview practice: Operate.
- Existing guide and coming-soon pages: Read/Operate as their content requires.

## Constraints
Preserve the logo, blue anchor, product copy meaning, behavior, API/data contracts, and localStorage keys. Do not add libraries. Do not fabricate proof or claims.

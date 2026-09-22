# Luxury Pink Nikkah Envelope

## Goal
Replace the blank opening screen with a full-viewport, handcrafted blush-pink wedding envelope for Huzaifa and Bismah. The envelope opens cinematically to reveal an ivory palace courtyard with a fountain and warm evening light.

## Experience
- Cover the entire first screen with layered pink envelope panels rather than showing a small envelope.
- Build distinct top, side, and bottom folds using blush, dusty rose, champagne pink, and darker rose edges.
- Add restrained rose-gold borders, fine Islamic-inspired line ornament, floral corner details, paper grain, soft highlights, and realistic shadows.
- Center a pressed deep dusty-rose wax seal with a metallic edge and embossed “H & B”.
- Place “Huzaifa & Bismah” and “Tap to Open” beneath the seal in elegant, thin typography.
- On activation, lift the flap, separate the folds, and fade the envelope away to reveal the palace and fountain scene.
- Keep the palace ivory and warmly lit, with blush flowers and mist, so pink remains dominant only in the envelope.

## Interaction and Accessibility
- Make the full envelope an accessible opening control with keyboard support.
- Respect reduced-motion preferences with a simplified reveal.
- Keep all text legible and centered across phone and desktop sizes.

## Technical Details
- Define the complete blush, rose, pearl, and champagne-gold token system in the global stylesheet.
- Use CSS geometry and layered pseudo-elements for physical folds and ornament, avoiding a flat background or cheap gradient treatment.
- Use the generated palace courtyard image as the full-screen reveal scene.
- Add route-specific invitation metadata and load the selected display/body fonts through the document head.
- Verify the closed and opened states at desktop and mobile sizes, including interaction, overflow, and contrast.

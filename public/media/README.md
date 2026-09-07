# Catalog photography

Seed rows point at `/media/*.jpg`.

## Current state

- Editorial SVG plates in this folder provide a non-blank standalone experience.
- The repository currently contains provisional JPG stills for the seeded catalog.
- `npm run media` can fetch replacement stills for development/preview use.

## Outstanding media fidelity work

The current imagery is **not** evidence of historical WordPress media parity. During the P2 content-fidelity pass, each retained legacy media reference must be classified, checked for licensing/ownership, and mapped to a canonical asset where appropriate.

The production media pass should:

1. replace provisional/stock imagery with licensed or authoritative operator photography;
2. preserve useful legacy media references in the migration matrix even when an image is replaced;
3. record source/licensing status and required alt text;
4. verify dimensions, loading behavior and responsive delivery.

Do not commit secrets, scraped WordPress uploads, or media without a clear right to use them.

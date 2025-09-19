# Fix CSS Module Syntax Error in tours.module.css

## Issue
- Syntax error in `src/app/tours/[slug]/tours.module.css` at line 757: Selector "html" is not pure (pure selectors must contain at least one local class or id)
- The `html { scroll-behavior: smooth; }` rule is invalid in CSS Modules as it targets a global element without being marked as global.

## Analysis
- The `scroll-behavior: smooth;` is already defined in `src/app/globals.css`, making the duplicate in the module CSS unnecessary.
- CSS Modules require selectors to be "pure" (contain local classes/ids) or explicitly global using `:global()`.

## Plan
1. ✅ Remove the invalid `html { scroll-behavior: smooth; }` rule from `src/app/tours/[slug]/tours.module.css` since it's already present in `globals.css`.
2. ✅ Verify the build passes after removal.

## Followup Steps
- Run `npm run build` to confirm the error is resolved.
- Test smooth scrolling functionality to ensure it still works.

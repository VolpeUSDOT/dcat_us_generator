Proposed updates for transitioning this generator from DCAT-US 1.1 to dual-mode (DCAT-US 1.1 + DCAT-US 3) are complete and implementation-ready.

Key recommendations based on current code in [`generateJSON()`](app.js:101), schema hardcoding in [`jsonData`](app.js:190), and existing form structure in [`libraryItemForm`](form.html:13):

1. Add dual output mode selector in [`form.html`](form.html)
- Introduce required metadata version field (`dcat-us-1.1` / `dcat-us-3`).
- Keep current fields visible for backward compatibility.
- Mark version-specific fields with inline guidance and validation hints.

2. Refactor generator into profile-based serializers in [`app.js`](app.js)
- Split monolithic flow into:
  - `collectFormData`
  - `buildCanonicalModel`
  - `serializeDcatUs11`
  - `serializeDcatUs3`
  - `validateByProfile`
- Retain shared distribution/file parsing logic and reuse across both serializers.

3. Introduce canonical internal model
- Normalize form inputs once (keywords, files, contact, publisher hierarchy, codes, dates).
- Emit profile-specific JSON from canonical data to reduce duplication and regression risk.

4. Maintain non-breaking defaults
- Default selected mode stays DCAT-US 1.1 during transition.
- Ensure [`form.html`](form.html) preselects `dcat-us-1.1` and [`app.js`](app.js) falls back to [`serializeDcatUs11()`](app.js:138) when no version is specified.
- Existing 1.1 output remains byte-identical unless the user explicitly selects v3; protect by snapshot tests that compare current [`serializeDcatUs11()`](app.js:138) output across fixtures.
- Preserve current ROSA P and USDOT-centric data entry patterns by keeping existing field group ordering, hints, and validations untouched; gate any v3-only controls behind the new version toggle so legacy users see no behavioral changes.

5. Add verification-first checklist for code implementation
- [x] Before coding final v3 mappings, verify each target property against official DCAT-US 3 guidance at [`dcat-us3 resource`](https://resources.data.gov/resources/dcat-us3/).
- [x] Confirm and document per-property cardinality, requiredness, datatype, controlled vocabularies, and JSON-LD context behavior.
- [x] Lock the mapping table once validation is complete and only then finalize serializer constants.

6. File-by-file implementation plan
- [`form.html`](form.html)
  - [x] Add profile selector toggling between DCAT-US 1.1 and DCAT-US 3 with `dcat-us-1.1` preselected.
  - [x] Embed inline field annotations that call out version applicability and validation hints.
  - [x] Introduce conditionally rendered sections for v3-only inputs and guard them behind the selector.
- [`app.js`](app.js)
  - [x] Implement `collectFormData`, `buildCanonicalModel`, `serializeDcatUs11`, `serializeDcatUs3`, and `validateByProfile` to formalize the profile pipeline.
  - [x] Ensure canonical builder normalizes shared inputs (keywords, distributions, contacts, publishers, codes, dates) before serialization.
  - [x] Wire up profile switch logic that routes to the appropriate serializer and enforces validation rules per profile.
- [`README.md`](README.md)
  - [x] Document dual-mode usage instructions, migration notes, known differences, and deprecation milestones.
  - [x] Highlight verification-first workflow and reference the authoritative mapping matrix for implementers.
- [`docs/dcat-us3-mapping.md`](docs/dcat-us3-mapping.md)
  - [x] Create new authoritative mapping matrix capturing property-level verification outcomes, controlled vocabularies, and JSON-LD context notes.
  - [x] Maintain verification records tied back to DCAT-US 3 guidance for auditability.

7. Backward compatibility and deprecation strategy
- Phase 1: default 1.1, optional 3.
- Phase 2: default 3, optional 1.1 legacy.
- Phase 3: sunset 1.1 after stakeholder cutoff date.

8. Test strategy
- Snapshot fixtures for both modes from identical canonical input.
- 1.1 regression tests ensure byte-equivalent or semantically equivalent output.
- v3 conformance checks against verified schema/profile requirements.

This delivers a practical migration path that supports both standards immediately while minimizing risk and keeping implementation scoped to the current project structure.
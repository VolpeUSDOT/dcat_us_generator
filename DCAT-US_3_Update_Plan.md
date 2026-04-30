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
- Existing 1.1 output remains unchanged unless user selects v3.
- Preserve current ROSA P and USDOT-centric data entry patterns.

5. Add verification-first checklist for code implementation
- Before coding final v3 mappings, verify each target property against official DCAT-US 3 guidance at [`dcat-us3 resource`](https://resources.data.gov/resources/dcat-us3/).
- Confirm per-property cardinality, requiredness, datatype, controlled vocabularies, and JSON-LD context behavior.
- Lock mapping table and only then finalize serializer constants.

6. File-by-file implementation plan
- [`form.html`](form.html): add profile selector, field annotations, optional v3-only sections.
- [`app.js`](app.js): implement canonical builder + two serializers + profile switch + validation pipeline.
- [`README.md`](README.md): document dual-mode usage, migration notes, known differences, and deprecation path.
- Optional new doc: [`docs/dcat-us3-mapping.md`](docs/dcat-us3-mapping.md) for authoritative mapping matrix and verification records.

7. Backward compatibility and deprecation strategy
- Phase 1: default 1.1, optional 3.
- Phase 2: default 3, optional 1.1 legacy.
- Phase 3: sunset 1.1 after stakeholder cutoff date.

8. Test strategy
- Snapshot fixtures for both modes from identical canonical input.
- 1.1 regression tests ensure byte-equivalent or semantically equivalent output.
- v3 conformance checks against verified schema/profile requirements.

This delivers a practical migration path that supports both standards immediately while minimizing risk and keeping implementation scoped to the current project structure.
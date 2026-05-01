# DCAT-US 3 Mapping Matrix and Verification Register

## Purpose
This document defines the authoritative DCAT-US 3.0 property mappings for the generator. Each mapping is validated against the official guidance at https://resources.data.gov/resources/dcat-us3/ before implementation. Use this register to track verification status, controlled vocabularies, and JSON-LD context behaviors prior to locking the serializer constants.

## Verification Workflow
1. For every property listed below, review the DCAT-US 3.0 specification section and JSON-LD context.
2. Record the canonical model source used by [`buildCanonicalModel()`](app.js:342) and note any normalization helpers.
3. Confirm serializer output in [`serializeDcatUs3()`](app.js:504) and ensure profile validation in [`validateByProfile()`](app.js:540).
4. Capture cardinality, requiredness, datatype expectations, and controlled vocabulary constraints.
5. When verification is complete, mark the checklist item and move the row to the "Verified" status.

## Summary Checklist
- [ ] Dataset core properties (identifier, title, description, accessLevel, keywords, themes, landingPage)
- [ ] Publisher and contact structures (org/vcard)
- [ ] Distribution details (mediaType, format, accessURL rules)
- [ ] Policy and rights metadata
- [ ] Codes and controlled vocabularies
- [ ] Temporal and spatial coverage
- [ ] JSON-LD context alignments

## Mapping Table
| Status | DCAT-US 3 Property | JSON-LD Context | Cardinality / Required | Canonical Source | Serializer Output | Controlled Vocabulary / Notes |
|--------|--------------------|-----------------|------------------------|------------------|-------------------|-------------------------------|
| ☐ | `dct:title` | `dct:title` | 1..1 (Required) | `model.dataset.title` via [`buildCanonicalModel()`](app.js:342) | [`serializeDcatUs3()` → `title`](app.js:504) | Free text; ensure UTF-8 normalization. |
| ☐ | `dct:description` | `dct:description` | 1..1 (Required) | `model.dataset.description` | [`serializeDcatUs3()` → `description`](app.js:504) | Multi-line allowed; confirm plain text expectations. |
| ☐ | `dcat:keyword` | `dcat:keyword` | 1..n (Recommended) | `model.dataset.keywords` from [`normalizeKeywords()`](app.js:149) | [`serializeDcatUs3()` → `keyword`](app.js:504) | Free text; deduplicated case-insensitively. |
| ☐ | `dcat:theme` | `dcat:theme` | 0..n (Recommended) | `model.dataset.themes` from [`normalizeThemeList()`](app.js:123) | [`serializeDcatUs3()` → `theme`](app.js:504) | Reference DCAT-US theme taxonomy; document URIs or labels once confirmed. |
| ☐ | `dct:identifier` | `dct:identifier` | 1..1 (Required for v3) | `model.dataset.identifier` | [`serializeDcatUs3()` → `identifier`](app.js:504) | Prefer DOI/Handle; ensure URI format. |
| ☐ | `dct:publisher` | `dct:publisher` | 0..1 (Recommended) | `model.dataset.publisher` assembled by [`normalizePublisher()`](app.js:240) | [`serializeDcatUs3()` → `publisher`](app.js:504) | Confirm organization hierarchy composes valid `org:Organization` chain. |
| ☐ | `dcat:contactPoint` | `dcat:contactPoint` | 0..n (Recommended) | `model.dataset.contact` from [`normalizeContactPoint()`](app.js:228) | [`serializeDcatUs3()` → `contactPoint`](app.js:504) | Ensure `vcard:Contact` with `hasEmail` mailto. |
| ☐ | `dcat:distribution` | `dcat:distribution` | 0..n (Recommended) | `model.dataset.distributions` via [`normalizeFiles()`](app.js:252) | [`mapDistributions()`](app.js:420) within [`serializeDcatUs3()`](app.js:504) | Verify accessURL derivation precedence (landingPage → webService → identifier). |
| ☐ | `dct:license` | `dct:license` | 0..1 (Recommended) | `model.dataset.license` | [`serializeDcatUs3()` → `license`](app.js:504) | Confirm expected URI; ensure controlled vocabulary if mandated. |
| ☐ | `dct:rights` | `dct:rights` | 0..1 (Recommended) | `model.dataset.rights` | [`serializeDcatUs3()` → `rights`](app.js:504) | Plain text; align with policy statement guidance. |
| ☐ | `dct:spatial` | `dct:spatial` | 0..n (Optional) | `model.dataset.spatial` | [`serializeDcatUs3()` → `spatial`](app.js:504) | Verify allowable geometry/text representations. |
| ☐ | `pod:ProgramCode` | `pod:ProgramCode` | 0..n (Optional) | `model.dataset.programCodes` | [`serializeDcatUs3()` → `programCode`](app.js:504) | Ensure codes follow `NNN:NNN` format; deduplicated uppercase. |
| ☐ | `dct:references` | `dct:references` | 0..n (Optional) | `model.dataset.references` | [`serializeDcatUs3()` → `references`](app.js:504) | Validate URL/DOI patterns. |
| ☐ | `dct:issued` | `dct:issued` | 0..1 (Recommended) | `model.dataset.issued` normalized by [`normalizeDate()`](app.js:111) | [`serializeDcatUs3()` → `issued`](app.js:504) | ISO 8601 date; confirm timezone handling. |
| ☐ | `dct:modified` | `dct:modified` | 0..1 (Recommended) | `model.dataset.modified` | [`serializeDcatUs3()` → `modified`](app.js:504) | ISO 8601 date; ensure latest update captured. |
| ☐ | `dct:language` | `dct:language` | 0..n (Optional) | `model.dataset.languages` via [`normalizeLanguageList()`](app.js:190) | [`serializeDcatUs3()` → `language`](app.js:504) | Expect ISO 639-1 codes; lowercase. |
| ☐ | `odrs:accessLevel` | `odrs:accessLevel` | 0..1 (Recommended) | `model.dataset.accessLevel` | [`serializeDcatUs3()` → `accessLevel`](app.js:504) | Controlled vocab: `public`, `restricted public`, `non-public`. |
| ☐ | `dct:isPartOf` | `dct:isPartOf` | 0..n (Optional) | `model.dataset.isPartOf` | [`serializeDcatUs3()` → `isPartOf`](app.js:504) | URI/DOI expected; confirm ROSA P collection handling. |
| ☐ | `dct:conformsTo` | `dct:conformsTo` | 1..1 (Catalog-level) | Constant in [`serializeDcatUs3()`](app.js:504) | [`serializeDcatUs3()` → `conformsTo`](app.js:504) | Must equal DCAT-US 3 profile URI. |
| ☐ | `@context` | JSON-LD context | 1..1 | Constant in [`serializeDcatUs3()`](app.js:504) | [`serializeDcatUs3()` → `@context`](app.js:504) | Confirm matches published catalog JSON-LD. |

## Change Log
- 2026-05-01: Initial matrix drafted; verification pending across all rows.

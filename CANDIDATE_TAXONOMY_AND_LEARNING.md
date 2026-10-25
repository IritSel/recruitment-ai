# HOW? — Candidate taxonomy and personalized learning

Status: **Approved product requirement — not yet completed / QA pending** (2026-10-25)

## City / locality selection
- Use the comprehensive, maintainable list of Israeli cities AND localities (not a hand-picked list of 20).
- Authoritative source: Israel Population and Immigration Authority open dataset at https://data.gov.il/datasets/population_authority/citiesandsettelments
- Keep stable locality identifiers and multilingual display labels when available.
- Searchable dropdown opens on click; supports spelling variants and free text with a distinct unverified-entry state. Do not silently treat new free text as an official city.
- Record locality selection for the candidate profile and connect it to location/commute preferences and travel-time matching only when an actual routing service is integrated.

## Desired roles
- Use an extensible profession/occupation taxonomy, multiple hierarchical families and synonyms, instead of a small hand-written static list.
- Searchable dropdown must open on click, allow choosing several target roles in future, and allow free-text new role names.
- Map user-entered synonyms to standardized roles while preserving original wording, without overzealous 1:1 string matching.
- Do not claim "all existing roles" from a closed finite list; professions and role names change.

## Candidate-specific learning (distinct from recruiter learning)
- Explicit candidate choices: target roles, city, radius/travel minutes, schedule, work mode, shift preferences, skills, CV versions and revisions.
- With informed consent, learn from actions such as apply, dismiss and dismissal reasons, saved jobs, clarification responses, and corrections. Do not learn sensitive/protected traits or extrapolate sensitive characteristics.
- Maintain candidate-specific recommendation preferences separately from company requirements and recruiter-specific preferences.
- Provide a clear "why this job was recommended" explanation, review/change/reset learned preferences, and transparent consent controls.
- Candidate dismissals must not automatically be converted to hard exclusion or applied without confirmation.
- QA with two similarly qualified candidates expressing different preferences; verify separated personalized results, provenance, reset and no cross-account leakage.

## Acceptance criteria
1. Open searchable city list with complete official localities available; selections persist after reload; unknown text remains editable and marked as unverified.
2. Open searchable role list with broad taxonomy, synonyms and free-text suggestions; selection persists.
3. Suggestions adapt to candidate's explicitly saved preferences; show why; candidate can override and reset; recruiter and candidate models are isolated.
4. Test accessibility and keyboard interaction, RTL/LTR, desktop and mobile.
5. Mark all above as 'לבדיקה' until demonstrated on production. No live routing or machine learning claims without integration and verification.

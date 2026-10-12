AJMAL'S CSP REVISION GAME — V5 / COVERAGE TRACKING

GETTING STARTED / GITHUB PAGES
1. Extract this ZIP.
2. Upload its contents to the repository root. index.html must be at the root, alongside app.js, engine.js, questions.js, style.css and the other files.
3. Include the sources folder and all 14 PDFs. It supports the source links in the app. Do not upload the ZIP itself as the website.
4. For an existing V4 repository, replace matching files with this version and add engine.js if missing. Keep the folder structure.
5. In repository Settings > Pages, choose the branch containing these files and the root folder, then save.
6. Open the HTTPS website URL. If an older version appears, reload; clear that site's browser data if needed. Clearing browser data removes saved progress.

PHONE INSTALLATION / OFFLINE
Open the hosted HTTPS site online once. Android browsers commonly offer Install app / Add to home screen; iPhone Safari offers Share > Add to Home Screen. The app caches its shell and question data. Source PDFs are cached only after you open them online. First-time access needs internet. Local file:// preview does not enable PWA installation or offline caching.

PLAY
New Random Game: exactly 50 questions. Domains 1 and 2 split 25 questions as 12/13 or 13/12. Domains 3–7 receive five each. Normal games have no adjacent questions from the same domain. Every new round has exactly 15 Study Material and 35 Question Bank questions. Domain practice also uses 15 Study Material and 35 Bank questions. Saved-question modes use your saved questions regardless of source mix. Unseen questions are selected across eight page ranges per domain/source pool. This spreads coverage across the files, rather than using adjacent questions. Source pages are used for coverage; topic labels are not invented. Correctly answered questions are reused only after the required domain/source pool has run out of unseen items. Different pools run out at different times. Selection is randomized within the coverage rules.
Wrong questions from Game 1 become eligible in Game 5. At most four returning wrong questions are included per round, prioritizing older batches and respecting the domain/source slots. Ten wrong questions can return as 4 in Game 5, 4 in Game 6 and 2 in Game 7; if their domain/source slots cannot fit four, they are spread over more rounds. If you miss one again, it returns no earlier than four game numbers later. Only completed random games advance the counter, not bookmark, domain or wrong-only practice. Wrong-only practice is an explicit override and can be used immediately.
If a required pool has too few eligible questions because its wrong items are still delayed, a clear message appears instead of overriding the delay. Try a practice mode.
Select one option to lock the answer, see Correct/Incorrect, the original source explanation and domain. Tap Next; after question 50, tap Finish Game. Results show total score, percentage, wrong count and domain performance. Review Wrong Answers revisits that completed attempt without changing its score.
Wrong Answers Only and Bookmarks use up to 50 saved questions; fewer saved questions means a shorter practice session. Answering a saved wrong question correctly removes it from the ongoing wrong-question list. Domain practice selects 50 questions from one domain.
Home preserves an unfinished session. Resume restores it, including a locked answer. Starting another session replaces the unfinished one after confirmation. Bookmarks and wrong questions stay saved. Storage is local to this browser/device and website address. V4 bookmarks, wrong-answer list and the current attempt are preserved on the same device and URL. V4 did not record a full question history; new coverage tracking starts with V5. An unfinished V4 game retains its original selection.

SOURCE DATABASE
questions.json is the editable database. questions.js exposes the same object as globalThis.CSP_DATA for the static app. Both contain all 2,712 records, including held-out items; 2,219 are eligible for normal play. UI and selection/scoring logic are separate in app.js and engine.js.
Fields include question_id/id, domain, source_file, question, options, correct_answer (source label), correct_answer_index/answer (zero-based option index), explanation, is_math, bookmark, eligible, source_status, exclusion_reason, sourcePath and PDF page. bookmark defaults to false; actual bookmarks are saved in localStorage so the database file is not modified by the browser.
To add questions: preserve source text, choose a unique id, specify the source answer index and source label, source PDF/path/page, domain and kind (study/bank). Hold out incomplete/uncertain questions. Set eligible true only for verified complete non-math, non-duplicate items. Recalculate metadata counts. Regenerate questions.js from the entire JSON object using:
  globalThis.CSP_DATA = <the complete questions.json object>;
Bump the cache version in sw.js whenever data or UI files change.

QUALITY / TEST LIMITS
See QUALITY_REPORT.html and EXCLUDED_QUESTIONS.csv for coverage and exclusions. No external knowledge was used to supply or correct answers. Calculation/formula exclusions are conservative, including uncertain mathematical typesetting. The internal Domain 8 heading in the Domain 7 training bank is ignored.
Automated validation passed 250 consecutive games with full coverage of all 2,219 questions, source/domain quotas, delayed wrong-question scheduling, migration, scoring and state tests, actual UI control tests using a DOM harness, source text checks and service-worker offline/cache harness tests. Real mobile visual layout, PWA installation and device offline behavior could not be verified because the available browser could not reach the local preview. Check those on your phone after hosting.

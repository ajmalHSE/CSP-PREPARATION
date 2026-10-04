AJMAL'S CSP REVISION GAME — V4 / 50-QUESTION ROUNDS

GETTING STARTED / GITHUB PAGES
1. Extract this ZIP.
2. Upload its contents to the repository root. index.html must be at the root, alongside app.js, engine.js, questions.js, style.css and the other files.
3. Include the sources folder and all 14 PDFs. It supports the source links in the app. Do not upload the ZIP itself as the website.
4. For an existing V3 repository, replace matching files with this version and add engine.js if missing. Keep the folder structure.
5. In repository Settings > Pages, choose the branch containing these files and the root folder, then save.
6. Open the HTTPS website URL. If an older version appears, reload; clear that site's browser data if needed. Clearing browser data removes saved progress.

PHONE INSTALLATION / OFFLINE
Open the hosted HTTPS site online once. Android browsers commonly offer Install app / Add to home screen; iPhone Safari offers Share > Add to Home Screen. The app caches its shell and question data. Source PDFs are cached only after you open them online. First-time access needs internet. Local file:// preview does not enable PWA installation or offline caching.

PLAY
New Random Game: exactly 50 questions. Domains 1 and 2 split 25 questions as 12/13 or 13/12. Domains 3–7 receive five each. Normal games have no adjacent questions from the same domain. Each new game randomly selects and orders questions; questions can recur in a later game.
Select one option to lock the answer, see Correct/Incorrect, the original source explanation and domain. Tap Next; after question 50, tap Finish Game. Results show total score, percentage, wrong count and domain performance. Review Wrong Answers revisits that completed attempt without changing its score.
Wrong Answers Only and Bookmarks use up to 50 saved questions; fewer saved questions means a shorter practice session. Answering a saved wrong question correctly removes it from the ongoing wrong-question list. Domain practice selects 50 questions from one domain.
Home preserves an unfinished session. Resume restores it, including a locked answer. Starting another session replaces the unfinished one after confirmation. Bookmarks and wrong questions stay saved. Storage is local to this browser/device and website address. V3 continuous progress is not imported into V4 rounds.

SOURCE DATABASE
questions.json is the editable database. questions.js exposes the same object as globalThis.CSP_DATA for the static app. Both contain all 2,712 records, including held-out items; 2,219 are eligible for normal play. UI and selection/scoring logic are separate in app.js and engine.js.
Fields include question_id/id, domain, source_file, question, options, correct_answer (source label), correct_answer_index/answer (zero-based option index), explanation, is_math, bookmark, eligible, source_status, exclusion_reason, sourcePath and PDF page. bookmark defaults to false; actual bookmarks are saved in localStorage so the database file is not modified by the browser.
To add questions: preserve source text, choose a unique id, specify the source answer index and source label, source PDF/path/page, domain and kind (study/bank). Hold out incomplete/uncertain questions. Set eligible true only for verified complete non-math, non-duplicate items. Recalculate metadata counts. Regenerate questions.js from the entire JSON object using:
  globalThis.CSP_DATA = <the complete questions.json object>;
Bump the cache version in sw.js whenever data or UI files change.

QUALITY / TEST LIMITS
See QUALITY_REPORT.html and EXCLUDED_QUESTIONS.csv for coverage and exclusions. No external knowledge was used to supply or correct answers. Calculation/formula exclusions are conservative, including uncertain mathematical typesetting. The internal Domain 8 heading in the Domain 7 training bank is ignored.
Automated validation passed 2,000 round selections, scoring and state tests, actual UI control tests using a DOM harness, source text checks and service-worker offline/cache harness tests. Real mobile visual layout, PWA installation and device offline behavior could not be verified because the available browser could not reach the local preview. Check those on your phone after hosting.

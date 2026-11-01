# Portfolio guide: input and output contract

Set up before the interface implementation. The guide is a deterministic question graph backed by portfolio data.

## Input

- A visitor selects a predefined question or searches question labels/keywords locally.
- A selection resolves to one stable answer ID.
- Follow-up buttons resolve to another answer ID; no text is sent to a model or remote service.
- Unmatched searches show a useful empty state with a return to the topic list.

## Output

Every answer has `id`, `question`, `topic`, `title`, `paragraphs`, a relevant `image` with alt text/caption, optional `facts`/`bullets`, `actions`, and `followUps`.

- Facts come from `profile.js` and `projects.js`.
- Project answers preserve release/prototype boundaries and link to their full case studies.
- Images are existing product screenshots or the supplied portrait, never claimed to be generated during the conversation.
- Actions are internal routes, portfolio desktop applications, or explicit external links.
- Loading uses “Opening saved answer”; the screenshot reveal uses a scan/wipe animation. Reduced motion displays the same content directly.

## Topics and conversation paths

Start → biography / selected projects / startup work / campus leadership / skills / hiring.

- Selected projects → developer tools → Little Code / Little Terminal.
- Campus → Nexsus / MMMUT Notice / GDGoC.
- Startups → Gryork / Washtro → engineering experience.
- SIH → ManakMitra / SatyaDwar → architecture / project case studies.
- Hiring → skills / achievements / resume / contact.
- Every project answer offers adjacent follow-ups and a return to the collection.

The complete library is `src/data/assistantKnowledge.js`. It can be edited without changing the UI.

## Interaction and accessibility

- Floating panel on the homepage, desktop and reading pages.
- Searchable questions, conversation history, a reset control, and contextual follow-ups.
- Keyboard-accessible controls; Escape closes and restores launcher focus.
- Each answer is announced once. Decorative typing and screenshot animations are hidden from assistive technology.
- Sound is optional and controlled by the shared accessibility/sound settings.

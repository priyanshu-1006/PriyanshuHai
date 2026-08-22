/**
 * Blog posts.
 *
 * Body is an array of typed blocks rather than markdown — no parser dependency,
 * and the renderer stays in full control of typography.
 *
 *   { t: 'p',     c: '…' }          paragraph
 *   { t: 'h',     c: '…' }          section heading
 *   { t: 'ul' | 'ol', c: ['…'] }    list
 *   { t: 'quote', c: '…' }          pull quote
 *   { t: 'code',  c: '…' }          fixed-width block
 *
 * `project` links a post to a case study. `draft: true` hides it from the index.
 */

import { architectureOfAnIdea } from './postArchitectureOfAnIdea.js'

export const posts = [
  architectureOfAnIdea,
  {
    slug: 'write-the-invariants-first',
    title: 'Write the invariants before you write the code',
    dek: 'Ten sentences that are never violated constrained a laundry platform more usefully than any amount of upfront schema design.',
    date: '2026-07-18',
    minutes: 5,
    tags: ['Architecture', 'State machines'],
    project: 'washtro',
    body: [
      { t: 'p', c: 'Before I wrote a line of Washtro, I wrote ten sentences. Not a schema, not an ERD, not a list of endpoints — ten plain statements about what would never be true of the system. It turned out to be the single highest-leverage thing I did on the project.' },
      { t: 'p', c: 'The product tracks individual garments through a laundry chain. Competitors track the order. That distinction sounds academic until a customer says a shirt came back stained, or never came back at all, and the only record anyone has is that eleven items went in and eleven came out.' },

      { t: 'h', c: 'What an invariant is, and is not' },
      { t: 'p', c: 'An invariant is not a requirement. A requirement says what the system should do. An invariant says what the system must never do, and it holds across every feature you have not thought of yet. That second property is the whole value.' },
      { t: 'p', c: 'Two of Washtro’s ten:' },
      { t: 'ol', c: [
        'Every garment state change goes through the single guarded applyEvent(). No status writes outside it; no skipping stages.',
        'GarmentEvent is append-only — it is the audit trail. Never updated, never deleted.',
      ] },
      { t: 'p', c: 'Neither says what the app does. Both eliminate entire categories of future bug. Once the first one is written down, "just update the status here, it is only for the admin view" stops being a conversation.' },

      { t: 'h', c: 'They constrain design better than a schema does' },
      { t: 'p', c: 'A schema tells you the shape of your data. It does not tell you who is allowed to change it, or in what order, or whether a change can ever be undone. Those are exactly the questions that produce disputes six months in.' },
      { t: 'p', c: 'Money is always integer paise — no floats anywhere near money. That is one sentence, and it removes an entire class of rounding bug from a codebase before the codebase exists. Try encoding it as a column type and you will find yourself relying on every future developer noticing.' },
      { t: 'quote', c: 'A schema describes what your data looks like. An invariant describes what your team is not allowed to do to it.' },

      { t: 'h', c: 'The offline case proves the point' },
      { t: 'p', c: 'Delivery agents work in basements and stairwells. A dropped request that silently loses a custody event destroys the audit guarantee — the thing the entire product is sold on.' },
      { t: 'p', c: 'Because the invariant already existed, the solution was forced rather than invented: every field action is written to a durable outbox first and synced second, each carries a client-generated UUIDv7, and a unique constraint in the database turns any replay into a no-op. The agent app is correct whether or not the network is.' },
      { t: 'p', c: 'I did not design that because I am clever about offline sync. I designed it because invariant three says a transition with no actor is rejected and invariant two says events are never deleted, and once both are true the outbox is the only design left standing.' },

      { t: 'h', c: 'The cost' },
      { t: 'p', c: 'Writing them takes an afternoon you would rather spend building. They also feel premature, because at that point you have no code to violate them. That feeling is wrong: the cheapest moment to forbid something is before anybody has built on top of it.' },
      { t: 'p', c: 'The habit came out of Gryork, where I learned the same lesson the expensive way. Every field I made nullable early on became a place where an unverified bill could slip through. In consumer software a loose schema is technical debt. In lending it is underwriting risk wearing a different hat.' },
    ],
  },

  {
    slug: 'i-shipped-the-model-that-lost',
    title: 'I shipped the model that lost',
    dek: 'Coordinate Attention was the architecturally interesting contribution to my fracture detector. It underperformed a plain YOLOv10n on every metric, and I published the table anyway.',
    date: '2026-06-02',
    minutes: 4,
    tags: ['Machine learning', 'Research'],
    project: 'fracturevision-ai',
    body: [
      { t: 'p', c: 'FractureVision has three models. A ViT-Base/16 answers whether a fracture exists at all. A YOLOv10n detector answers which of ten kinds it is and where. And a third variant adds Coordinate Attention to that detector, to test whether direction-aware spatial pooling helps on oriented fracture lines.' },
      { t: 'p', c: 'The third one was the interesting idea. It lost.' },

      { t: 'h', c: 'The comparison' },
      { t: 'code', c: `                    recall_focused   CoordAtt     delta
mAP@0.5                    0.933      0.928     +0.005
mAP@0.5:0.95               0.521      0.499     +0.022
Precision                  0.969      0.934     +0.035
Recall                     0.900      0.846     +0.054
F1                         0.933      0.888     +0.045
Macro F1                   0.926      0.873     +0.053` },
      { t: 'p', c: 'Not close on any of them. The plain detector wins with fewer parameters, no attention modules, and a simpler training schedule.' },

      { t: 'h', c: 'Why it lost' },
      { t: 'p', c: 'CoordAtt was injected at backbone P3/P4/P5 through a gated residual with the gate initialised to zero, so at epoch zero the model is byte-identical to the baseline. That safeguard exists precisely to avoid wrecking pretrained features, and it did soften the damage — but it could not eliminate the distribution shift introduced by re-initialised attention weights fine-tuning on a small, severely imbalanced dataset.' },
      { t: 'p', c: 'Roughly 1,300 training images across ten classes, with a 65:1 ratio between the largest and smallest class. There was not enough signal to learn good attention weights from scratch, and the gate could only regulate how fast the bad ones arrived.' },

      { t: 'h', c: 'Why publish it' },
      { t: 'p', c: 'The obvious move is to drop the third model, present two, and let the writeup read as a clean success. Nobody would know. That is exactly the problem.' },
      { t: 'quote', c: 'A portfolio of only successful experiments is not a record of research. It is a record of editing.' },
      { t: 'p', c: 'The negative result is more informative than the positive one. "A ViT gets 99% on binary fracture screening" tells you something about a well-studied task. "Directional attention did not help here, and here is the parameter count, the dataset size and the imbalance ratio that explain why" tells the next person whether to try it on theirs.' },

      { t: 'h', c: 'The related habit' },
      { t: 'p', c: 'The same instinct is why the case study leads with a failure rather than the headline accuracy. There is a known false negative in the test set — scan 01.png, called Not Fractured at full confidence, with the Grad-CAM heatmap sitting on the smooth healthy curve of the joint while the actual hairline fracture sits just adjacent to it.' },
      { t: 'p', c: 'A 99.01% number tells a radiologist nothing they can act on. An image of the model confidently looking in the wrong place tells them exactly why a human stays in the loop.' },
    ],
  },

  {
    slug: 'nine-services-four-earned-it',
    title: 'Nine services, and only four earned it',
    dek: 'We took a microservices architecture into a hackathon and won with it. Most of the splits were still wrong.',
    date: '2026-04-27',
    minutes: 5,
    tags: ['Architecture', 'Distributed systems'],
    project: 'cognito-learning-hub',
    body: [
      { t: 'p', c: 'Microservices at a hackathon are an unusual and mostly indefensible choice. Cognito Learning Hub shipped nine of them behind an API gateway, took the national win at IIT Bombay Techfest, and I would still only make four of those splits again.' },

      { t: 'h', c: 'The four that earned it' },
      { t: 'p', c: 'A service split is justified when the workload genuinely differs, or when failure needs to be contained. Four passed that test:' },
      { t: 'ul', c: [
        'Gateway — owns routing, rate limiting, CORS and JWT verification so nothing downstream re-implements auth.',
        'Live — synchronised multiplayer quiz sessions. Socket-bound, stateful and long-lived, which is unlike everything else in the system.',
        'Meeting — a MediaSoup SFU. A completely separate transport problem, and a video failure must never take a quiz down with it.',
        'Gamification — XP, levels, achievements and streaks, computed by queue workers so taking a quiz never blocks on badge logic.',
      ] },
      { t: 'p', c: 'Each of those has a real reason: different scaling profile, different failure blast radius, or different runtime characteristics.' },

      { t: 'h', c: 'The ones that did not' },
      { t: 'p', c: 'Auth, Quiz and Result should have been one service. They were split because the others were, which is symmetry, not architecture.' },
      { t: 'p', c: 'The cost was not theoretical. Every cross-service call between those three was pure overhead we paid for nothing — a network hop, a serialisation round trip, and a new failure mode, in exchange for a boundary that never needed to exist. Submitting a quiz result touches all three. We turned a function call into a distributed transaction so the folder structure would look consistent.' },
      { t: 'quote', c: 'If you cannot name the load profile or the failure you are isolating, you have not found a service boundary. You have found a folder.' },

      { t: 'h', c: 'What made it survivable' },
      { t: 'p', c: 'Two decisions kept nine services shippable on a hackathon timeline. Authentication was centralised at the gateway and never re-implemented downstream — services trust a verified header. And a shared package held the common utilities, so nine codebases did not drift into nine conventions.' },
      { t: 'p', c: 'Without both, the integration cost compounds and you spend the last week debugging inconsistent error shapes instead of building.' },

      { t: 'h', c: 'The honest summary' },
      { t: 'p', c: 'Microservices bought us real isolation and cost us real velocity. On a deadline, velocity is usually the scarcer resource — so the split has to pay for itself in something you can name before you make it.' },
      { t: 'p', c: 'We won anyway. That is worth stating plainly, because it is the thing that makes the critique credible rather than sour: the architecture was over-engineered in places and the product still worked. Both are true.' },
    ],
  },

  {
    slug: 'build-the-dumb-path-first',
    title: 'Build the dumb path first',
    dek: 'We built face recognition, QR verification and geofencing before we built the roll-call fallback. Every early demo was one bad camera away from failure.',
    date: '2026-03-11',
    minutes: 4,
    tags: ['Product', 'Lessons'],
    project: 'haazir',
    body: [
      { t: 'p', c: 'Haazir replaces paper attendance with three verification gates: a signed ninety-second QR code, live ArcFace verification against enrolled 512-dimensional embeddings, and a Haversine geo-fence check. Defeating one is easy. Defeating all three at once, in ninety seconds, in a room with the teacher watching, is not worth the effort.' },
      { t: 'p', c: 'We built all three before we built roll call.' },

      { t: 'h', c: 'What that cost' },
      { t: 'p', c: 'Face recognition in a lecture hall is a lighting problem far more than a model problem. A backlit window behind the class is enough to wreck detection, and for weeks there was nothing to fall back to. Every demo carried a risk we could not mitigate, because the only path through the system was the clever one.' },
      { t: 'p', c: 'That is a bad place to be with something that replaces a manual process, because the manual process is not a nice-to-have. It is the thing the institution already trusts.' },

      { t: 'h', c: 'The inversion' },
      { t: 'p', c: 'Once manual roll call and bulk photo marking existed, something unexpected happened: we could make the smart path stricter.' },
      { t: 'p', c: 'The ninety-second QR window is tight for a class of sixty. The obvious pressure is to lengthen it — but lengthening it re-opens the code-sharing hole it was closing. With fallbacks in place, anyone who misses the window gets marked another way, so the guard never has to be relaxed to accommodate reality.' },
      { t: 'quote', c: 'The fallback is not what you build for when the clever path fails. It is what lets the clever path stay uncompromising.' },

      { t: 'h', c: 'A system that replaces a process inherits the process' },
      { t: 'p', c: 'Institutional software does not get graded on its best case. It gets graded on what happens the first time it does not work, in front of people who were fine before you arrived.' },
      { t: 'p', c: 'So the order should have been: roll call, then photo marking, then QR, then face, then geofence. Ship the boring thing first, earn the right to be trusted, then add the parts that make it better. We did it backwards and got away with it, which is not the same as it being right.' },
    ],
  },
]

export const getPost = (slug) => posts.find((p) => p.slug === slug)
export const publishedPosts = posts.filter((p) => !p.draft)

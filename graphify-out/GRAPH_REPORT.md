# Graph Report - MyPortfolio  (2026-09-24)

## Corpus Check
- 17 files · ~63,125 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 213 nodes · 396 edges · 29 communities (25 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.59)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eb84bb5c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_isotope.pkgd.js|isotope.pkgd.js]]
- [[_COMMUNITY_Lightbox|Lightbox]]
- [[_COMMUNITY_Owl|Owl]]
- [[_COMMUNITY_wow.min.js|wow.min.js]]
- [[_COMMUNITY_wow.js|wow.js]]
- [[_COMMUNITY_isotope.pkgd.min.js|isotope.pkgd.min.js]]
- [[_COMMUNITY_typed.js|typed.js]]
- [[_COMMUNITY_typed.min.js|typed.min.js]]
- [[_COMMUNITY_owl.carousel.js|owl.carousel.js]]
- [[_COMMUNITY_owl.carousel.min.js|owl.carousel.min.js]]
- [[_COMMUNITY_main.js|main.js]]

## God Nodes (most connected - your core abstractions)
1. `Owl()` - 53 edges
2. `Lightbox()` - 18 edges
3. `AntigravityEngine` - 13 edges
4. `o()` - 7 edges
5. `t()` - 7 edges
6. `getSize()` - 5 edges
7. `i()` - 5 edges
8. `n()` - 5 edges
9. `s()` - 5 edges
10. `t()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `t()` --indirect_call--> `o()`  [INFERRED]
  lib/waypoints/waypoints.min.js → lib/isotope/isotope.pkgd.min.js
- `c()` --indirect_call--> `g()`  [INFERRED]
  lib/lightbox/js/lightbox.min.js → lib/wow/wow.min.js
- `c()` --indirect_call--> `h()`  [INFERRED]
  lib/lightbox/js/lightbox.min.js → lib/wow/wow.min.js

## Import Cycles
- None detected.

## Communities (29 total, 4 thin omitted)

### Community 0 - "isotope.pkgd.js"
Cohesion: 0.11
Nodes (11): getSize(), getStyle(), getStyleSize(), getValueGetter(), getZeroSize(), jQueryBridget(), mungeSorter(), onComplete() (+3 more)

### Community 3 - "wow.min.js"
Cohesion: 0.20
Nodes (7): c(), a(), c(), d(), e(), g(), h()

### Community 4 - "wow.js"
Cohesion: 0.20
Nodes (6): _classCallCheck(), createEvent(), extend(), MutationObserver(), WeakMap(), WOW()

### Community 5 - "isotope.pkgd.min.js"
Cohesion: 0.36
Nodes (10): a(), e(), i(), n(), o(), r(), s(), t() (+2 more)

### Community 11 - "typed.js"
Cohesion: 0.31
Nodes (5): _classCallCheck(), HTMLParser(), Initializer(), TODO: These methods can probably be combined somehow, Typed()

### Community 13 - "typed.min.js"
Cohesion: 0.60
Nodes (5): e(), i(), n(), s(), t()

### Community 14 - "owl.carousel.js"
Cohesion: 0.67
Nodes (3): prefixed(), TODO: Should be computed from number of min width items in stage, test()

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Owl()` connect `Owl` to `isotope.pkgd.js`, `.is`, `.off`, `.to`, `.trigger`, `.onDragEnd`, `owl.carousel.js`, `.relative`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `o()` (e.g. with `t()` and `t()`) actually correct?**
  _`o()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `t()` (e.g. with `o()` and `e()`) actually correct?**
  _`t()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `TODO: Should be computed from number of min width items in stage`, `TODO: These methods can probably be combined somehow` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `isotope.pkgd.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `.off` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
# Feed pagination

Confession feeds use deterministic ordering. Newest-first pages are ordered by
`created_at DESC, id DESC`; aggregate sorts such as trending and most discussed
use their score first, then `created_at DESC, id DESC`. The unique confession
ID breaks ties when timestamps or aggregate scores match. Cursor predicates use
the same timestamp and ID boundary as the ordering.

Cursor pagination is a continuation below the last row returned, not a
snapshot. Confessions added after a page is requested that sort ahead of that
cursor are not included in subsequent pages; restart the feed to see them. A
new confession that sorts below the cursor may appear on a later page. Legacy
offset pagination is not insertion-stable: new rows ahead of an offset can move
page boundaries, so clients needing stable continuation should use cursors.
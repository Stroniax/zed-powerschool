(start_tag
  ">" @end) @indent

(self_closing_tag
  "/>" @end) @indent

(element
  (start_tag) @start
  (end_tag)? @end) @indent

(ps_if
    (ps_if_tag) @start
    (ps_if_end_tag)? @end
    ) @indent

(tlist_query) @indent

(tlist_sql
    "]" @start
    "tlist_sql"? @end
) @indent

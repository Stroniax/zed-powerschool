(start_tag
  ">" @end) @indent

(self_closing_tag
  "/>" @end) @indent

(element
  (start_tag) @start
  (end_tag)? @end) @indent

(if_block
    (if_start_tag) @start
    (else_tag)? @start
    (else_tag)? @end
    (if_end_tag)? @end
    ) @indent

(tlist_query) @indent

(tlist_sql
    "]" @start
    "tlist_sql"? @end
) @indent

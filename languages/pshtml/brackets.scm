("~[" @open "]" @close)
(if_end_tag ("[/" @open "]" @close))
(tlist_sql ("[/" @open "]" @close))
(else_tag ("[" @open "]" @close))
("~(" @open ")" @close)
(database_field_access ("~([" @open ")" @close))
("<" @open ">" @close)
("<" @open "/>" @close)
("\"" @open "\"" @close)
(parenthetical ("(" @open ")" @close))

((element
    (start_tag) @open
    (end_tag) @close)
    (#set! newline.only)
    (#set! rainbow.exclude))

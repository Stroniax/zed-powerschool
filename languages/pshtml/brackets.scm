("~[" @open "]" @close)
("[/" @open "]" @close)
("~[if" @open "]" @close)
("[else" @open "]" @close)
("[/if" @open "]" @close)
("~(" @open ")" @close)
("<" @open ">" @close)
("<" @open "/>" @close)
("\"" @open "\"" @close)

((element
    (start_tag) @open
    (end_tag) @close)
    (#set! newline.only)
    (#set! rainbow.exclude))

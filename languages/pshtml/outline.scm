(comment) @annotation

(element
    (start_tag
        (tag_name) @name)) @item

(if_block
    else_tag: (else_tag
        "else" @name
        (label)? @name
    )
    alternative: (block_content) @item
)

(if_block
    open: (if_start_tag
        "if" @name
        (label)? @name
    )
    consequent: (block_content) @item
)

(tlist_sql
    ("tlist_sql" @name)
    (";" @name)
    (tlist_query) @item
)

(tlist_sql
    ("tlist_sql" @name)
    (";" @name)
    (dat_option
        (dat_option_name) @name) @item
)

(tlist_sql
    ("tlist_sql" @name)
    ("]" @name)
    (tlist_template) @item
)

(paren_dat
    (dat_name) @label
) @item

(comment) @annotation

(element
    (start_tag
        (tag_name) @name)) @item

(ps_if
    (ps_if_else_tag
        ("[else" @name)
        (ps_condition_label) @name
    )
   (ps_else_content) @item
)

(ps_if
    (ps_if_tag
        ("~[if" @name)
        (ps_condition_label) @name
    )
   (ps_if_content) @item
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

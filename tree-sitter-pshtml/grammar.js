/**
 * @file PowerSchool HTML
 * @author Caleb Frederickson
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const html = require("tree-sitter-html/grammar");

module.exports = grammar(html, {
  name: "pshtml",

  rules: {
    dat: ($) =>
      choice(
        $.gpv,
        $.database_field_access,
        $.tlist_sql,
        $.ps_if,
        $.context_dat,
        $.invoker_dat,
        prec(-1, $.unrecognized_square_dat),
        prec(-1, $.unrecognized_paren_dat),
      ),

    ps_identifier: ($) => /[a-zA-Z0-9_]+/,

    gpv: ($) =>
      seq("~(gpv.", $.ps_identifier, optional(repeat($.gpv_option)), ")"),
    gpv_option: ($) =>
      choice(
        alias(";encodejsstring", $.gpv_escape_option),
        alias(";encodejsonstring", $.gpv_escape_option),
        alias(";urlencode", $.gpv_escape_option),
        alias(";encodehtml", $.gpv_escape_option),
        alias(";num", $.gpv_escape_option),
        alias(";sqlText", $.gpv_escape_option),
        $.gpv_if_blank_then,
        alias(";onlynumeric", $.gpv_escape_option),
        alias(";onlyalpha", $.gpv_escape_option),
        alias(";onlyalphanumeric", $.gpv_escape_option),
        alias(";onlydatecharacters", $.gpv_escape_option),
      ),
    gpv_if_blank_then: ($) => seq(";if.blank.then=", /[^;\)]+/),

    database_field_access: ($) =>
      seq(
        "~([",
        alias($.ps_identifier, $.database_table_name),
        optional(seq(".", alias($.ps_identifier, $.database_extention_name))),
        "]",
        alias($.ps_identifier, $.database_field_name),
        ")",
      ),

    tlist_sql: ($) =>
      seq(
        "~[tlist_sql;",
        $.tlist_query,
        repeat($.tlist_option),
        "]",
        $.tlist_template,
        "[/tlist_sql]",
      ),

    tlist_query: ($) => /[^;\]]+/,
    tlist_nonemessage: ($) => seq(";nonemessage", /[^;\]]+/),
    tlist_option: ($) => choice($.tlist_nonemessage),
    // For now the template will not "parse" its content except the variables...
    tlist_template: ($) =>
      repeat1(
        choice($.tlist_variable, alias(/[^~\[]+/, $.tlist_template_text)),
      ),
    tlist_variable: ($) =>
      seq("~(", /[^;\)]+/, repeat($.tlist_variable_option), ")"),
    tlist_variable_option: ($) =>
      choice(
        ";d",
        ";l;format=time",
        ";url",
        ";js",
        ";json",
        ";html",
        ";xml10",
        ";xml11",
        ";ReplaceCRLFWithBR",
        seq(";", /[^;)]+/),
      ),

    ps_if: ($) =>
      seq(
        $.ps_if_tag,
        alias(repeat($._node), $.ps_if_content),
        optional(
          seq($.ps_if_else_tag, alias(repeat($._node), $.ps_else_content)),
        ),
        $.ps_if_end_tag,
      ),
    ps_if_tag: ($) =>
      seq("~[if", optional($.ps_condition_label), ".", $.ps_if_condition, "]"),
    ps_if_else_tag: ($) => seq("[else", optional($.ps_condition_label), "]"),
    ps_if_end_tag: ($) => seq("[/if", optional($.ps_condition_label), "]"),
    // TODO: does not handle "in" and "not in " operators. Should add a third choice for these.
    ps_if_condition: ($) =>
      choice(
        alias($.ps_condition_path_only, $.ps_condition_path),
        seq(
          $.ps_condition_path,
          $.ps_condition_operator,
          alias(/[^\]]+/, $.ps_condition_operand),
        ),
      ),
    ps_condition_label: ($) => seq("#", $.ps_identifier),
    ps_condition_operator: ($) => choice("=", "<>", ">", "<"),

    ps_condition_path_only: ($) => choice("is.a.school", "is_prod"),
    // TODO: does not handle "in" and "not in" operators
    ps_condition_path: ($) =>
      choice($.database_field_access, $.gpv, token(prec(-1, /[^=><\]\s]+/))),

    context_dat: ($) =>
      choice(
        "~(curstudid)",
        "~(studentfrn)",
        "~(frn)",
        "~(rn)",
        "~(curyearid)",
        "~(curtermid)",
        "~(curschoolid)",
        "~(curtchrid)",
      ),

    invoker_dat: ($) =>
      choice(
        "~[x:userid]",
        "~[x:userid;guardianid]",
        "~[x:users_dcid]",
        "~[x:usersroles]",
        "~[x:username]",
        "~[eaodate]",
        "~[date]",
        "~[time]",
        "~[x:version]",
        "~[x:version;short]",
        "~[x:version;long]",
        "~[x:version;full]",
      ),

    unrecognized_square_dat: ($) => seq("~[", /[^\]]+/, "]"),
    unrecognized_paren_dat: ($) => seq("~(", /[^)]+/, ")"),

    database_field_attribute: ($) =>
      seq(
        alias("name", $.attribute_name),
        "=",
        choice(
          seq("'", alias($.database_field_lookup, $.attribute_value), "'"),
          seq('"', alias($.database_field_lookup, $.attribute_value), '"'),
        ),
      ),
    database_field_lookup: ($) =>
      seq(
        "[",
        alias($.ps_identifier, $.database_table_name),
        optional(seq(".", alias($.ps_identifier, $.database_extention_name))),
        "]",
        alias($.ps_identifier, $.database_field_name),
      ),

    // HTML overrides
    // The easiest way to parse is to just not permit tilde in a "text" syntax node, though it is technically valid when not followed by open paren or bracket.
    text: (_) =>
      choice(
        /[^<>&\s~\[]([^<>&~\[]*[^<>&\s~\[])?/,
        prec(-1, "["),
        prec(-1, "~"),
      ),
    // Extend HTML node to include DAT, since it is technically valid anywhere in the document
    _node: ($, original) => choice($.dat, /** @type { Rule } */ (original)),
    // Extend quoted attribute value to include DAT within text
    quoted_attribute_value: ($) =>
      choice(
        seq(
          '"',
          optional(
            alias(
              repeat(choice($.dat, /[^"~]/, prec(-1, "~"))),
              $.attribute_value,
            ),
          ),
          '"',
        ),
        seq(
          "'",
          optional(
            alias(
              repeat(choice($.dat, /[^'~]/, prec(-1, "~"))),
              $.attribute_value,
            ),
          ),
          "'",
        ),
      ),
    // Extend attribute itself to permit a DAT as an attribute
    attribute: ($, original) =>
      choice(
        $.dat,
        prec(2, $.database_field_attribute),
        seq(
          $.attribute_name,
          optional(
            seq("=", choice($.attribute_value, $.quoted_attribute_value)),
          ),
        ),
      ),
    // Restrict attribute name to not permit tilde, though technically it would be valid without being followed by open paren or bracket
    attribute_name: ($) => /[^<>"'/=~\s]+/,
  },
});

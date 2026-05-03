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
    dat: ($) => choice($.gpv, $.database_field_access),

    ps_identifier: ($) => /[a-zA-Z0-9_]+/,

    gpv: ($) =>
      seq("~(gpv.", $.ps_identifier, optional(repeat($.gpv_option)), ")"),
    gpv_option: ($) =>
      choice(
        ";encodejsstring",
        ";encodejsonstring",
        ";urlencode",
        ";encodehtml",
        ";num",
        ";sqlText",
        $.gpv_if_blank_then,
        ";onlynumeric",
        ";onlyalpha",
        ";onlyalphanumeric",
        ";onlydatecharacters",
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

    // ps_condition_label: ($) => seq("#", $.ps_identifier),
    // ps_condition_operator: ($) => choice("=", "!=", ">", "<"),
    // ps_condition_path: ($) => /[^=><!\]]+/,
    // ps_if: ($) =>
    //   seq(
    //     "if",
    //     optional($.ps_condition_label),
    //     $.ps_condition_path,
    //     $.ps_condition_operator,
    //     $.ps_square_dat_identifier,
    //   ),

    // HTML overrides
    // The easiest way to parse is to just not permit tilde in a "text" syntax node, though it is technically valid when not followed by open paren or bracket.
    text: (_) => /[^<>&\s~]([^<>&~]*[^<>&\s~])?/,
    // Extend HTML node to include DAT, since it is technically valid anywhere in the document
    _node: ($, original) => choice($.dat, /** @type { Rule } */ (original)),
    // Extend quoted attribute value to include DAT within text
    quoted_attribute_value: ($) =>
      choice(
        seq(
          '"',
          optional(alias(repeat(choice($.dat, /[^"]/)), $.attribute_value)),
          '"',
        ),
        seq(
          "'",
          optional(alias(repeat(choice($.dat, /[^']/)), $.attribute_value)),
          "'",
        ),
      ),
    // Extend attribute itself to permit a DAT as an attribute
    attribute: ($, original) =>
      choice(
        $.dat,
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

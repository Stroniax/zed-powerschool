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
    dat: ($) => choice($.gpv),

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
    text: ($) =>
      prec.right(
        repeat1(
          choice(
            $.dat,
            /[^<~]+/, // normal text
            "~", // fallback so parser doesn't choke
          ),
        ),
      ),
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
    attribute_name: ($) => /[^<>"'/=~\s]+/,
  },
});

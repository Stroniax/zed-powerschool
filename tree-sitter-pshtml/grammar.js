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
    ps_dat: ($) => choice($.ps_square_dat, $.ps_smooth_dat),

    ps_square_dat: ($) => seq("~[", $.ps_square_dat_identifier, "]"),
    ps_smooth_dat: ($) => seq("~(", $.ps_smooth_dat_identifier, ")"),

    ps_square_dat_identifier: ($) => /[^\]]+/,
    ps_smooth_dat_identifier: ($) => /[^\)]+/,

    // Override HTML text to permit DAT
    text: ($) =>
      prec.right(
        repeat1(
          choice(
            $.ps_dat,
            /[^<~]+/, // normal text
            "~", // fallback so parser doesn't choke
          ),
        ),
      ),
    // Override HTML attribute value to permit DAT
    quoted_attribute_value: ($) =>
      choice(
        seq('"', repeat(choice($.ps_dat, /[^"]/)), '"'),
        seq("'", repeat(choice($.ps_dat, /[^']/)), "'"),
      ),
  },
});

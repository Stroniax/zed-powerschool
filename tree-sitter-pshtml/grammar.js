//@ts-check

/**
 * @file PowerSchool HTML
 * @author Caleb Frederickson
 * @license MIT
 */

import html from "tree-sitter-html/grammar";

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "pshtml",

  rules: {
    ...html.rules,
  },
});

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

  rules: {},
});

// html-validate config for the Middle Ground site.
//
// Base: html-validate:recommended. Every exception below was verified against
// the actual site output (not assumed) and is narrowly scoped to a single
// rule with a documented, standards-based reason -- see docs/ci.md.
module.exports = {
  extends: ["html-validate:recommended"],
  rules: {
    // Case of "<!doctype html>" has no bearing on HTML validity (HTML5 is
    // case-insensitive here); this rule only enforces a style preference.
    "doctype-style": "off",

    // The site's inline-styles-by-default convention (see CLAUDE.md) is an
    // intentional project convention, not an error. Inline `style` attributes
    // are valid HTML.
    "no-inline-style": "off",

    // Flags multiple same-type landmarks (e.g. two <nav>) without a unique
    // aria-label. This is an accessibility-linting rule, not an HTML
    // correctness check -- accessibility automation is out of scope for
    // this validation pass.
    "unique-landmark": "off",

    // Stylistic preference (e.g. suggesting <progress> over a custom
    // progress bar built from divs). Not an HTML validity issue.
    "prefer-native-element": "off",

    // Suggests replacing "-" with "&#8209;" in phone numbers. Cosmetic
    // typography preference, not a markup error.
    "tel-non-breaking": "off",

    // Trailing whitespace has zero effect on parsing, rendering, or
    // accessibility. Pure formatting, not a validity concern.
    "no-trailing-whitespace": "off",
  },
};

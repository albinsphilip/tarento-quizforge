import {
  ADDON_ID,
  DOCUMENTATION_DISCREPANCY_LINK,
  EVENTS,
  PANEL_ID,
  PARAM_KEY,
  STATUS_TYPE_ID_A11Y,
  STATUS_TYPE_ID_COMPONENT_TEST
} from "./_browser-chunks/chunk-JZJ5QO7P.js";
import {
  __name
} from "./_browser-chunks/chunk-JFJ5UJ7Q.js";

// src/manager.tsx
import React10 from "react";
import { Badge as Badge3 } from "storybook/internal/components";
import { addons, types, useAddonState as useAddonState2, useStorybookApi as useStorybookApi3 } from "storybook/manager-api";

// src/components/A11YPanel.tsx
import React7, { useMemo as useMemo3 } from "react";
import { Badge as Badge2, Button as Button2 } from "storybook/internal/components";
import { SyncIcon as SyncIcon2 } from "@storybook/icons";
import { styled as styled5 } from "storybook/theming";

// src/types.ts
var RuleType = {
  VIOLATION: "violations",
  PASS: "passes",
  INCOMPLETION: "incomplete"
};

// src/components/A11yContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  STORY_CHANGED,
  STORY_FINISHED,
  STORY_HOT_UPDATED,
  STORY_RENDER_PHASE_CHANGED
} from "storybook/internal/core-events";
import { HIGHLIGHT, REMOVE_HIGHLIGHT, SCROLL_INTO_VIEW } from "storybook/highlight";
import {
  experimental_getStatusStore,
  experimental_useStatusStore,
  useAddonState,
  useChannel,
  useGlobals,
  useParameter,
  useStorybookApi,
  useStorybookState
} from "storybook/manager-api";
import { convert, themes } from "storybook/theming";

// src/AccessibilityRuleMaps.ts
var axeRuleMapping_wcag_2_0_a_aa = {
  "area-alt": {
    title: "<area> alt text",
    axeSummary: "Ensure <area> elements of image maps have alternative text",
    friendlySummary: "Add alt text to all <area> elements of image maps."
  },
  "aria-allowed-attr": {
    title: "Supported ARIA attributes",
    axeSummary: "Ensure an element's role supports its ARIA attributes",
    friendlySummary: "Only use ARIA attributes that are permitted for the element's role."
  },
  "aria-braille-equivalent": {
    title: "Braille equivalent",
    axeSummary: "Ensure aria-braillelabel and aria-brailleroledescription have a non-braille equivalent",
    friendlySummary: "If you use braille ARIA labels, also provide a matching non-braille label."
  },
  "aria-command-name": {
    title: "ARIA command name",
    axeSummary: "Ensure every ARIA button, link and menuitem has an accessible name",
    friendlySummary: "Every ARIA button, link, or menuitem needs a label or accessible name."
  },
  "aria-conditional-attr": {
    title: "ARIA attribute valid for role",
    axeSummary: "Ensure ARIA attributes are used as described in the specification of the element's role",
    friendlySummary: "Follow the element role's specification when using ARIA attributes."
  },
  "aria-deprecated-role": {
    title: "Deprecated ARIA role",
    axeSummary: "Ensure elements do not use deprecated roles",
    friendlySummary: "Don't use deprecated ARIA roles on elements."
  },
  "aria-hidden-body": {
    title: "Hidden body",
    axeSummary: 'Ensure aria-hidden="true" is not present on the document <body>',
    friendlySummary: 'Never set aria-hidden="true" on the <body> element.'
  },
  "aria-hidden-focus": {
    title: "Hidden element focus",
    axeSummary: "Ensure aria-hidden elements are not focusable nor contain focusable elements",
    friendlySummary: "Elements marked hidden (aria-hidden) should not be focusable or contain focusable items."
  },
  "aria-input-field-name": {
    title: "ARIA input field name",
    axeSummary: "Ensure every ARIA input field has an accessible name",
    friendlySummary: "Give each ARIA text input or field a label or accessible name."
  },
  "aria-meter-name": {
    title: "ARIA meter name",
    axeSummary: "Ensure every ARIA meter node has an accessible name",
    friendlySummary: 'Give each element with role="meter" a label or accessible name.'
  },
  "aria-progressbar-name": {
    title: "ARIA progressbar name",
    axeSummary: "Ensure every ARIA progressbar node has an accessible name",
    friendlySummary: 'Give each element with role="progressbar" a label or accessible name.'
  },
  "aria-prohibited-attr": {
    title: "ARIA prohibited attributes",
    axeSummary: "Ensure ARIA attributes are not prohibited for an element's role",
    friendlySummary: "Don't use ARIA attributes that are forbidden for that element's role."
  },
  "aria-required-attr": {
    title: "ARIA required attributes",
    axeSummary: "Ensure elements with ARIA roles have all required ARIA attributes",
    friendlySummary: "Include all required ARIA attributes for elements with that ARIA role."
  },
  "aria-required-children": {
    title: "ARIA required children",
    axeSummary: "Ensure elements with an ARIA role that require child roles contain them",
    friendlySummary: "If an ARIA role requires specific child roles, include those child elements."
  },
  "aria-required-parent": {
    title: "ARIA required parent",
    axeSummary: "Ensure elements with an ARIA role that require parent roles are contained by them",
    friendlySummary: "Place elements with certain ARIA roles inside the required parent role element."
  },
  "aria-roles": {
    title: "ARIA role value",
    axeSummary: "Ensure all elements with a role attribute use a valid value",
    friendlySummary: "Use only valid values in the role attribute (no typos or invalid roles)."
  },
  "aria-toggle-field-name": {
    title: "ARIA toggle field name",
    axeSummary: "Ensure every ARIA toggle field has an accessible name",
    friendlySummary: "Every ARIA toggle field (elements with the checkbox, radio, or switch roles) needs an accessible name."
  },
  "aria-tooltip-name": {
    title: "ARIA tooltip name",
    axeSummary: "Ensure every ARIA tooltip node has an accessible name",
    friendlySummary: 'Give each element with role="tooltip" a descriptive accessible name.'
  },
  "aria-valid-attr-value": {
    title: "ARIA attribute values valid",
    axeSummary: "Ensure all ARIA attributes have valid values",
    friendlySummary: "Use only valid values for ARIA attributes (no typos or invalid values)."
  },
  "aria-valid-attr": {
    title: "ARIA attribute valid",
    axeSummary: "Ensure attributes that begin with aria- are valid ARIA attributes",
    friendlySummary: "Use only valid aria-* attributes (make sure the attribute name is correct)."
  },
  blink: {
    title: "<blink> element",
    axeSummary: "Ensure <blink> elements are not used",
    friendlySummary: "Don't use the deprecated <blink> element."
  },
  "button-name": {
    title: "Button name",
    axeSummary: "Ensure buttons have discernible text",
    friendlySummary: "Every <button> needs a visible label or accessible name."
  },
  bypass: {
    title: "Navigation bypass",
    axeSummary: "Ensure each page has at least one mechanism to bypass navigation and jump to content",
    friendlySummary: 'Provide a way to skip repetitive navigation (e.g. a "Skip to content" link).'
  },
  "color-contrast": {
    title: "Color contrast",
    axeSummary: "Ensure the contrast between foreground and background text meets WCAG 2 AA minimum thresholds",
    friendlySummary: "The color contrast between text and its background meets WCAG AA contrast ratio."
  },
  "definition-list": {
    title: "Definition list structure",
    axeSummary: "Ensure <dl> elements are structured correctly",
    friendlySummary: "Definition lists (<dl>) should directly contain <dt> and <dd> elements in order."
  },
  dlitem: {
    title: "Definition list items",
    axeSummary: "Ensure <dt> and <dd> elements are contained by a <dl>",
    friendlySummary: "Ensure <dt> and <dd> elements are contained by a <dl>"
  },
  "document-title": {
    title: "Document title",
    axeSummary: "Ensure each HTML document contains a non-empty <title> element",
    friendlySummary: "Include a non-empty <title> element for every page."
  },
  "duplicate-id-aria": {
    title: "Unique id",
    axeSummary: "Ensure every id attribute value used in ARIA and in labels is unique",
    friendlySummary: "Every id used for ARIA or form labels should be unique on the page."
  },
  "form-field-multiple-labels": {
    title: "Multiple form field labels",
    axeSummary: "Ensure a form field does not have multiple <label> elements",
    friendlySummary: "Don't give a single form field more than one <label>."
  },
  "frame-focusable-content": {
    title: "Focusable frames",
    axeSummary: 'Ensure <frame> and <iframe> with focusable content do not have tabindex="-1"',
    friendlySummary: `Don't set tabindex="-1" on a <frame> or <iframe> that contains focusable elements.`
  },
  "frame-title-unique": {
    title: "Unique frame title",
    axeSummary: "Ensure <iframe> and <frame> elements contain a unique title attribute",
    friendlySummary: "Use a unique title attribute for each <frame> or <iframe> on the page."
  },
  "frame-title": {
    title: "Frame title",
    axeSummary: "Ensure <iframe> and <frame> elements have an accessible name",
    friendlySummary: "Every <frame> and <iframe> needs a title or accessible name."
  },
  "html-has-lang": {
    title: "<html> has lang",
    axeSummary: "Ensure every HTML document has a lang attribute",
    friendlySummary: "Add a lang attribute to the <html> element."
  },
  "html-lang-valid": {
    title: "<html> lang valid",
    axeSummary: "Ensure the <html lang> attribute has a valid value",
    friendlySummary: "Use a valid language code in the <html lang> attribute."
  },
  "html-xml-lang-mismatch": {
    title: "HTML and XML lang mismatch",
    axeSummary: "Ensure that HTML elements with both lang and xml:lang agree on the page's language",
    friendlySummary: "If using both lang and xml:lang on <html>, make sure they are the same language."
  },
  "image-alt": {
    title: "Image alt text",
    axeSummary: "Ensure <img> elements have alternative text or a role of none/presentation",
    friendlySummary: 'Give every image alt text or mark it as decorative with alt="".'
  },
  "input-button-name": {
    title: "Input button name",
    axeSummary: "Ensure input buttons have discernible text",
    friendlySummary: 'Give each <input type="button"> or similar a clear label (text or aria-label).'
  },
  "input-image-alt": {
    title: "Input image alt",
    axeSummary: 'Ensure <input type="image"> elements have alternative text',
    friendlySummary: '<input type="image"> must have alt text describing its image.'
  },
  label: {
    title: "Form label",
    axeSummary: "Ensure every form element has a label",
    friendlySummary: "Every form field needs an associated label."
  },
  "link-in-text-block": {
    title: "Identifiable links",
    axeSummary: "Ensure links are distinguishable from surrounding text without relying on color",
    friendlySummary: "Make sure links are obviously identifiable without relying only on color."
  },
  "link-name": {
    title: "Link name",
    axeSummary: "Ensure links have discernible text",
    friendlySummary: "Give each link meaningful text or an aria-label so its purpose is clear."
  },
  list: {
    title: "List structure",
    axeSummary: "Ensure that lists are structured correctly",
    friendlySummary: "Use proper list structure. Only use <li> inside <ul> or <ol>."
  },
  listitem: {
    title: "List item",
    axeSummary: "Ensure <li> elements are used semantically",
    friendlySummary: "Only use <li> tags inside <ul> or <ol> lists."
  },
  marquee: {
    title: "<marquee> element",
    axeSummary: "Ensure <marquee> elements are not used",
    friendlySummary: "Don't use the deprecated <marquee> element."
  },
  "meta-refresh": {
    title: "<meta> refresh",
    axeSummary: 'Ensure <meta http-equiv="refresh"> is not used for delayed refresh',
    friendlySummary: 'Avoid auto-refreshing or redirecting pages using <meta http-equiv="refresh">.'
  },
  "meta-viewport": {
    title: "<meta> viewport scaling",
    axeSummary: 'Ensure <meta name="viewport"> does not disable text scaling and zooming',
    friendlySummary: `Don't disable user zooming in <meta name="viewport"> to allow scaling.`
  },
  "nested-interactive": {
    title: "Nested interactive controls",
    axeSummary: "Ensure interactive controls are not nested (nesting causes screen reader/focus issues)",
    friendlySummary: "Do not nest interactive elements; it can confuse screen readers and keyboard focus."
  },
  "no-autoplay-audio": {
    title: "Autoplaying video",
    axeSummary: "Ensure <video> or <audio> do not autoplay audio > 3 seconds without a control to stop/mute",
    friendlySummary: "Don't autoplay audio for more than 3 seconds without providing a way to stop or mute it."
  },
  "object-alt": {
    title: "<object> alt text",
    axeSummary: "Ensure <object> elements have alternative text",
    friendlySummary: "Provide alternative text or content for <object> elements."
  },
  "role-img-alt": {
    title: 'role="img" alt text',
    axeSummary: 'Ensure elements with role="img" have alternative text',
    friendlySummary: 'Any element with role="img" needs alt text.'
  },
  "scrollable-region-focusable": {
    title: "Scrollable element focusable",
    axeSummary: "Ensure elements with scrollable content are keyboard-accessible",
    friendlySummary: "If an area can scroll, ensure it can be focused and scrolled via keyboard."
  },
  "select-name": {
    title: "<select> name",
    axeSummary: "Ensure <select> elements have an accessible name",
    friendlySummary: "Give each <select> field a label or other accessible name."
  },
  "server-side-image-map": {
    title: "Server-side image map",
    axeSummary: "Ensure that server-side image maps are not used",
    friendlySummary: "Don't use server-side image maps."
  },
  "svg-img-alt": {
    title: "SVG image alt text",
    axeSummary: "Ensure <svg> images/graphics have accessible text",
    friendlySummary: 'SVG images with role="img" or similar need a text description.'
  },
  "td-headers-attr": {
    title: "Table headers attribute",
    axeSummary: "Ensure each cell in a table using headers only refers to <th> in that table",
    friendlySummary: "In tables using the headers attribute, only reference other cells in the same table."
  },
  "th-has-data-cells": {
    title: "<th> has data cell",
    axeSummary: "Ensure <th> (or header role) elements have data cells they describe",
    friendlySummary: "Every table header (<th> or header role) should correspond to at least one data cell."
  },
  "valid-lang": {
    title: "Valid lang",
    axeSummary: "Ensure lang attributes have valid values",
    friendlySummary: "Use valid language codes in all lang attributes."
  },
  "video-caption": {
    title: "<video> captions",
    axeSummary: "Ensure <video> elements have captions",
    friendlySummary: "Provide captions for all <video> content."
  }
};
var axeRuleMapping_wcag_2_1_a_aa = {
  "autocomplete-valid": {
    title: "autocomplete attribute valid",
    axeSummary: "Ensure the autocomplete attribute is correct and suitable for the form field",
    friendlySummary: "Use valid autocomplete values that match the form field's purpose."
  },
  "avoid-inline-spacing": {
    title: "Forced inline spacing",
    axeSummary: "Ensure that text spacing set via inline styles can be adjusted with custom CSS",
    friendlySummary: "Don't lock in text spacing with forced (!important) inline styles\u2014allow user CSS to adjust text spacing."
  }
};
var axeRuleMapping_wcag_2_2_a_aa = {
  "target-size": {
    title: "Touch target size",
    axeSummary: "Ensure touch targets have sufficient size and space",
    friendlySummary: "Make sure interactive elements are big enough and not too close together for touch."
  }
};
var axeRuleMapping_best_practices = {
  accesskeys: {
    title: "Unique accesskey",
    axeSummary: "Ensure every accesskey attribute value is unique",
    friendlySummary: "Use unique values for all accesskey attributes."
  },
  "aria-allowed-role": {
    title: "Appropriate role value",
    axeSummary: "Ensure the role attribute has an appropriate value for the element",
    friendlySummary: "ARIA roles should have a valid value for the element."
  },
  "aria-dialog-name": {
    title: "ARIA dialog name",
    axeSummary: "Ensure every ARIA dialog and alertdialog has an accessible name",
    friendlySummary: "Give each ARIA dialog or alertdialog a title or accessible name."
  },
  "aria-text": {
    title: 'ARIA role="text"',
    axeSummary: 'Ensure role="text" is used on elements with no focusable descendants',
    friendlySummary: `Only use role="text" on elements that don't contain focusable elements.`
  },
  "aria-treeitem-name": {
    title: "ARIA treeitem name",
    axeSummary: "Ensure every ARIA treeitem node has an accessible name",
    friendlySummary: "Give each ARIA treeitem a label or accessible name."
  },
  "empty-heading": {
    title: "Empty heading",
    axeSummary: "Ensure headings have discernible text",
    friendlySummary: "Don't leave heading elements empty or hide them."
  },
  "empty-table-header": {
    title: "Empty table header",
    axeSummary: "Ensure table headers have discernible text",
    friendlySummary: "Make sure table header cells have visible text."
  },
  "frame-tested": {
    title: "Test all frames",
    axeSummary: "Ensure <iframe> and <frame> elements contain the axe-core script",
    friendlySummary: "Make sure axe-core is injected into all frames or iframes so they are tested."
  },
  "heading-order": {
    title: "Heading order",
    axeSummary: "Ensure the order of headings is semantically correct (no skipping levels)",
    friendlySummary: "Use proper heading order (don't skip heading levels)."
  },
  "image-redundant-alt": {
    title: "Redundant image alt text",
    axeSummary: "Ensure image alternative text is not repeated as nearby text",
    friendlySummary: "Avoid repeating the same information in both an image's alt text and nearby text."
  },
  "label-title-only": {
    title: "Visible form element label",
    axeSummary: "Ensure each form element has a visible label (not only title/ARIA)",
    friendlySummary: "Every form input needs a visible label (not only a title attribute or hidden text)."
  },
  "landmark-banner-is-top-level": {
    title: "Top-level landmark banner",
    axeSummary: "Ensure the banner landmark is at top level (not nested)",
    friendlySummary: "Use the banner landmark (e.g. site header) only at the top level of the page, not inside another landmark."
  },
  "landmark-complementary-is-top-level": {
    title: "Top-level <aside>",
    axeSummary: "Ensure the complementary landmark (<aside>) is top level",
    friendlySummary: 'The complementary landmark <aside> or role="complementary" should be a top-level region, not nested in another landmark.'
  },
  "landmark-contentinfo-is-top-level": {
    title: "Top-level contentinfo",
    axeSummary: "Ensure the contentinfo landmark (footer) is top level",
    friendlySummary: "Make sure the contentinfo landmark (footer) is at the top level of the page and not contained in another landmark."
  },
  "landmark-main-is-top-level": {
    title: "Top-level main",
    axeSummary: "Ensure the main landmark is at top level",
    friendlySummary: "The main landmark should be a top-level element and not nested inside another landmark."
  },
  "landmark-no-duplicate-banner": {
    title: "Duplicate banner landmark",
    axeSummary: "Ensure the document has at most one banner landmark",
    friendlySummary: 'Have only one role="banner" or <header> on a page.'
  },
  "landmark-no-duplicate-contentinfo": {
    title: "Duplicate contentinfo",
    axeSummary: "Ensure the document has at most one contentinfo landmark",
    friendlySummary: 'Have only one role="contentinfo" or <footer> on a page.'
  },
  "landmark-no-duplicate-main": {
    title: "Duplicate main",
    axeSummary: "Ensure the document has at most one main landmark",
    friendlySummary: 'Have only one role="main" or <main> on a page.'
  },
  "landmark-one-main": {
    title: "main landmark",
    axeSummary: "Ensure the document has a main landmark",
    friendlySummary: 'Include a main landmark on each page using a <main> region or role="main".'
  },
  "landmark-unique": {
    title: "Unique landmark",
    axeSummary: "Ensure landmarks have a unique role or role/label combination",
    friendlySummary: "If you use multiple landmarks of the same type, give them unique labels (names)."
  },
  "meta-viewport-large": {
    title: "Significant viewport scaling",
    axeSummary: 'Ensure <meta name="viewport"> can scale a significant amount (e.g. 500%)',
    friendlySummary: '<meta name="viewport"> should allow users to significantly scale content.'
  },
  "page-has-heading-one": {
    title: "Has <h1>",
    axeSummary: "Ensure the page (or at least one frame) contains a level-one heading",
    friendlySummary: "Every page or frame should have at least one <h1> heading."
  },
  "presentation-role-conflict": {
    title: "Presentational content",
    axeSummary: 'Ensure elements with role="presentation"/"none" have no ARIA or tabindex',
    friendlySummary: `Don't give elements with role="none"/"presentation" any ARIA attributes or a tabindex.`
  },
  region: {
    title: "Landmark regions",
    axeSummary: "Ensure all page content is contained by landmarks",
    friendlySummary: "Wrap all page content in appropriate landmark regions (<header>, <main>, <footer>, etc.)."
  },
  "scope-attr-valid": {
    title: "scope attribute",
    axeSummary: "Ensure the scope attribute is used correctly on tables",
    friendlySummary: "Use the scope attribute only on <th> elements, with proper values (col, row, etc.)."
  },
  "skip-link": {
    title: "Skip link",
    axeSummary: 'Ensure all "skip" links have a focusable target',
    friendlySummary: 'Make sure any "skip to content" link targets an existing, focusable element.'
  },
  tabindex: {
    title: "tabindex values",
    axeSummary: "Ensure tabindex attribute values are not greater than 0",
    friendlySummary: "Don't use tabindex values greater than 0."
  },
  "table-duplicate-name": {
    title: "Duplicate names for table",
    axeSummary: "Ensure the <caption> does not duplicate the summary attribute text",
    friendlySummary: "Don't use the same text in both a table's <caption> and its summary attribute."
  }
};
var axeRuleMapping_wcag_2_x_aaa = {
  "color-contrast-enhanced": {
    title: "Enhanced color contrast",
    axeSummary: "Ensure contrast between text and background meets WCAG 2 AAA enhanced contrast thresholds",
    friendlySummary: "Use extra-high contrast for text and background to meet WCAG AAA level."
  },
  "identical-links-same-purpose": {
    title: "Same link name, same purpose",
    axeSummary: "Ensure links with the same accessible name serve a similar purpose",
    friendlySummary: "If two links have the same text, they should do the same thing (lead to the same content)."
  },
  "meta-refresh-no-exceptions": {
    title: 'No <meta http-equiv="refresh">',
    axeSummary: 'Ensure <meta http-equiv="refresh"> is not used for delayed refresh (no exceptions)',
    friendlySummary: `Don't auto-refresh or redirect pages using <meta http-equiv="refresh"> even with a delay.`
  }
};
var axeRuleMapping_experimental = {
  "css-orientation-lock": {
    title: "CSS orientation lock",
    axeSummary: "Ensure content is not locked to a specific display orientation (works in all orientations)",
    friendlySummary: "Don't lock content to one screen orientation; support both portrait and landscape modes."
  },
  "focus-order-semantics": {
    title: "Focus order semantic role",
    axeSummary: "Ensure elements in the tab order have a role appropriate for interactive content",
    friendlySummary: "Ensure elements in the tab order have a role appropriate for interactive content"
  },
  "hidden-content": {
    title: "Hidden content",
    axeSummary: "Informs users about hidden content",
    friendlySummary: "Display hidden content on the page for test analysis."
  },
  "label-content-name-mismatch": {
    title: "Content name mismatch",
    axeSummary: "Ensure elements labeled by their content include that text in their accessible name",
    friendlySummary: "If an element's visible text serves as its label, include that text in its accessible name."
  },
  "p-as-heading": {
    title: "No <p> headings",
    axeSummary: "Ensure <p> elements aren't styled to look like headings (use real headings)",
    friendlySummary: "Don't just style a <p> to look like a heading \u2013 use an actual heading tag for headings."
  },
  "table-fake-caption": {
    title: "Table caption",
    axeSummary: "Ensure that tables with a caption use the <caption> element",
    friendlySummary: "Use a <caption> element for table captions instead of just styled text."
  },
  "td-has-header": {
    title: "<td> has header",
    axeSummary: "Ensure each non-empty data cell in large tables (3\xD73+) has one or more headers",
    friendlySummary: "Every data cell in large tables should be associated with at least one header cell."
  }
};
var axeRuleMapping_deprecated = {
  "aria-roledescription": {
    title: "aria-roledescription",
    axeSummary: "Ensure aria-roledescription is only used on elements with an implicit or explicit role",
    friendlySummary: "Only use aria-roledescription on elements that already have a defined role."
  }
};
var combinedRulesMap = {
  ...axeRuleMapping_wcag_2_0_a_aa,
  ...axeRuleMapping_wcag_2_1_a_aa,
  ...axeRuleMapping_wcag_2_2_a_aa,
  ...axeRuleMapping_wcag_2_x_aaa,
  ...axeRuleMapping_best_practices,
  ...axeRuleMapping_experimental,
  ...axeRuleMapping_deprecated
};

// src/axeRuleMappingHelper.ts
var getTitleForAxeResult = /* @__PURE__ */ __name((axeResult) => combinedRulesMap[axeResult.id]?.title || axeResult.id, "getTitleForAxeResult");
var getFriendlySummaryForAxeResult = /* @__PURE__ */ __name((axeResult) => combinedRulesMap[axeResult.id]?.friendlySummary || axeResult.description, "getFriendlySummaryForAxeResult");

// src/components/A11yContext.tsx
var unhighlightedSelectors = ["html", "body", "main"];
var theme = convert(themes.light);
var colorsByType = {
  [RuleType.VIOLATION]: theme.color.negative,
  [RuleType.PASS]: theme.color.positive,
  [RuleType.INCOMPLETION]: theme.color.warning
};
var A11yContext = createContext({
  parameters: {},
  results: void 0,
  highlighted: false,
  toggleHighlight: /* @__PURE__ */ __name(() => {
  }, "toggleHighlight"),
  tab: RuleType.VIOLATION,
  handleCopyLink: /* @__PURE__ */ __name(() => {
  }, "handleCopyLink"),
  setTab: /* @__PURE__ */ __name(() => {
  }, "setTab"),
  setStatus: /* @__PURE__ */ __name(() => {
  }, "setStatus"),
  status: "initial",
  error: void 0,
  handleManual: /* @__PURE__ */ __name(() => {
  }, "handleManual"),
  discrepancy: null,
  selectedItems: /* @__PURE__ */ new Map(),
  allExpanded: false,
  toggleOpen: /* @__PURE__ */ __name(() => {
  }, "toggleOpen"),
  handleCollapseAll: /* @__PURE__ */ __name(() => {
  }, "handleCollapseAll"),
  handleExpandAll: /* @__PURE__ */ __name(() => {
  }, "handleExpandAll"),
  handleJumpToElement: /* @__PURE__ */ __name(() => {
  }, "handleJumpToElement"),
  handleSelectionChange: /* @__PURE__ */ __name(() => {
  }, "handleSelectionChange")
});
var A11yContextProvider = /* @__PURE__ */ __name((props) => {
  const parameters = useParameter("a11y", {});
  const [globals] = useGlobals() ?? [];
  const api = useStorybookApi();
  const getInitialStatus = useCallback((manual2 = false) => manual2 ? "manual" : "initial", []);
  const manual = useMemo(() => globals?.a11y?.manual ?? false, [globals?.a11y?.manual]);
  const a11ySelection = useMemo(() => {
    const value = api.getQueryParam("a11ySelection");
    if (value) {
      api.setQueryParams({ a11ySelection: "" });
    }
    return value;
  }, [api]);
  const [state, setState] = useAddonState(ADDON_ID, {
    ui: {
      highlighted: false,
      tab: RuleType.VIOLATION
    },
    results: void 0,
    error: void 0,
    status: getInitialStatus(manual)
  });
  const { ui, results, error, status } = state;
  const { storyId } = useStorybookState();
  const currentStoryA11yStatusValue = experimental_useStatusStore(
    (allStatuses) => allStatuses[storyId]?.[STATUS_TYPE_ID_A11Y]?.value
  );
  useEffect(() => {
    const unsubscribe = experimental_getStatusStore("storybook/component-test").onAllStatusChange(
      (statuses, previousStatuses) => {
        const current = statuses[storyId]?.[STATUS_TYPE_ID_COMPONENT_TEST];
        const previous = previousStatuses[storyId]?.[STATUS_TYPE_ID_COMPONENT_TEST];
        if (current?.value === "status-value:error" && previous?.value !== "status-value:error") {
          setState((prev) => ({ ...prev, status: "component-test-error" }));
        }
      }
    );
    return unsubscribe;
  }, [setState, storyId]);
  const handleToggleHighlight = useCallback(() => {
    setState((prev) => ({ ...prev, ui: { ...prev.ui, highlighted: !prev.ui.highlighted } }));
  }, [setState]);
  const [selectedItems, setSelectedItems] = useState(() => {
    const initialValue = /* @__PURE__ */ new Map();
    if (a11ySelection && /^[a-z]+.[a-z-]+.[0-9]+$/.test(a11ySelection)) {
      const [type, id] = a11ySelection.split(".");
      initialValue.set(`${type}.${id}`, a11ySelection);
    }
    return initialValue;
  });
  const allExpanded = useMemo(() => {
    const currentResults = results?.[ui.tab];
    return currentResults?.every((result) => selectedItems.has(`${ui.tab}.${result.id}`)) ?? false;
  }, [results, selectedItems, ui.tab]);
  const toggleOpen = useCallback(
    (event, type, item) => {
      event.stopPropagation();
      const key = `${type}.${item.id}`;
      setSelectedItems((prev) => new Map(prev.delete(key) ? prev : prev.set(key, `${key}.1`)));
    },
    []
  );
  const handleCollapseAll = useCallback(() => {
    setSelectedItems(/* @__PURE__ */ new Map());
  }, []);
  const handleExpandAll = useCallback(() => {
    setSelectedItems(
      (prev) => new Map(
        results?.[ui.tab]?.map((result) => {
          const key = `${ui.tab}.${result.id}`;
          return [key, prev.get(key) ?? `${key}.1`];
        }) ?? []
      )
    );
  }, [results, ui.tab]);
  const handleSelectionChange = useCallback((key) => {
    const [type, id] = key.split(".");
    setSelectedItems((prev) => new Map(prev.set(`${type}.${id}`, key)));
  }, []);
  const handleError = useCallback(
    (err) => {
      setState((prev) => ({ ...prev, status: "error", error: err }));
    },
    [setState]
  );
  const handleResult = useCallback(
    (axeResults, id) => {
      if (storyId === id) {
        setState((prev) => ({ ...prev, status: "ran", results: axeResults }));
        setTimeout(() => {
          setState((prev) => {
            if (prev.status === "ran") {
              return { ...prev, status: "ready" };
            }
            return prev;
          });
          setSelectedItems((prev) => {
            if (prev.size === 1) {
              const [key] = prev.values();
              document.getElementById(key)?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return prev;
          });
        }, 900);
      }
    },
    [storyId, setState, setSelectedItems]
  );
  const handleSelect = useCallback(
    (itemId, details) => {
      const [type, id] = itemId.split(".");
      const { helpUrl, nodes } = results?.[type]?.find((r) => r.id === id) || {};
      const openedWindow = helpUrl && window.open(helpUrl, "_blank", "noopener,noreferrer");
      if (nodes && !openedWindow) {
        const index = nodes.findIndex((n) => details.selectors.some((s) => s === String(n.target))) ?? -1;
        if (index !== -1) {
          const key = `${type}.${id}.${index + 1}`;
          setSelectedItems(/* @__PURE__ */ new Map([[`${type}.${id}`, key]]));
          setTimeout(() => {
            document.getElementById(key)?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        }
      }
    },
    [results]
  );
  const handleReport = useCallback(
    ({ reporters }) => {
      const a11yReport = reporters.find((r) => r.type === "a11y");
      if (a11yReport) {
        if ("error" in a11yReport.result) {
          handleError(a11yReport.result.error);
        } else {
          handleResult(a11yReport.result, storyId);
        }
      }
    },
    [handleError, handleResult, storyId]
  );
  const handleReset = useCallback(
    ({ newPhase }) => {
      if (newPhase === "loading") {
        setState((prev) => ({
          ...prev,
          results: void 0,
          status: manual ? "manual" : "initial"
        }));
      } else if (newPhase === "afterEach" && !manual) {
        setState((prev) => ({ ...prev, status: "running" }));
      }
    },
    [manual, setState]
  );
  const emit = useChannel(
    {
      [EVENTS.RESULT]: handleResult,
      [EVENTS.ERROR]: handleError,
      [EVENTS.SELECT]: handleSelect,
      [STORY_CHANGED]: () => setSelectedItems(/* @__PURE__ */ new Map()),
      [STORY_RENDER_PHASE_CHANGED]: handleReset,
      [STORY_FINISHED]: handleReport,
      [STORY_HOT_UPDATED]: () => {
        setState((prev) => ({ ...prev, status: "running" }));
        emit(EVENTS.MANUAL, storyId, parameters);
      }
    },
    [handleReset, handleReport, handleSelect, handleError, handleResult, parameters, storyId]
  );
  const handleManual = useCallback(() => {
    setState((prev) => ({ ...prev, status: "running" }));
    emit(EVENTS.MANUAL, storyId, parameters);
  }, [emit, parameters, setState, storyId]);
  const handleCopyLink = useCallback(async (linkPath) => {
    const { createCopyToClipboardFunction } = await import("storybook/internal/components");
    await createCopyToClipboardFunction()(`${window.location.origin}${linkPath}`);
  }, []);
  const handleJumpToElement = useCallback(
    (target) => emit(SCROLL_INTO_VIEW, target),
    [emit]
  );
  useEffect(() => {
    setState((prev) => ({ ...prev, status: getInitialStatus(manual) }));
  }, [getInitialStatus, manual, setState]);
  const isInitial = status === "initial";
  useEffect(() => {
    if (!a11ySelection) {
      return;
    }
    setState((prev) => {
      const update = { ...prev.ui, highlighted: true };
      const [type] = a11ySelection.split(".") ?? [];
      if (type && Object.values(RuleType).includes(type)) {
        update.tab = type;
      }
      return { ...prev, ui: update };
    });
  }, [a11ySelection]);
  useEffect(() => {
    emit(REMOVE_HIGHLIGHT, `${ADDON_ID}/selected`);
    emit(REMOVE_HIGHLIGHT, `${ADDON_ID}/others`);
    if (!ui.highlighted || isInitial) {
      return;
    }
    const selected = Array.from(selectedItems.values()).flatMap((key) => {
      const [type, id, number] = key.split(".");
      if (type !== ui.tab) {
        return [];
      }
      const result = results?.[type]?.find((r) => r.id === id);
      const target = result?.nodes[Number(number) - 1]?.target;
      return target ? [String(target)] : [];
    });
    if (selected.length) {
      emit(HIGHLIGHT, {
        id: `${ADDON_ID}/selected`,
        priority: 1,
        selectors: selected,
        styles: {
          outline: `1px solid color-mix(in srgb, ${colorsByType[ui.tab]}, transparent 30%)`,
          backgroundColor: "transparent"
        },
        hoverStyles: {
          outlineWidth: "2px"
        },
        focusStyles: {
          backgroundColor: "transparent"
        },
        menu: results?.[ui.tab].map((result) => {
          const selectors = result.nodes.flatMap((n) => n.target).map(String).filter((e) => selected.includes(e));
          return [
            {
              id: `${ui.tab}.${result.id}:info`,
              title: getTitleForAxeResult(result),
              description: getFriendlySummaryForAxeResult(result),
              selectors
            },
            {
              id: `${ui.tab}.${result.id}`,
              iconLeft: "info",
              iconRight: "shareAlt",
              title: "Learn how to resolve this violation",
              clickEvent: EVENTS.SELECT,
              selectors
            }
          ];
        })
      });
    }
    const others = results?.[ui.tab].flatMap((r) => r.nodes.flatMap((n) => n.target).map(String)).filter((e) => ![...unhighlightedSelectors, ...selected].includes(e));
    if (others?.length) {
      emit(HIGHLIGHT, {
        id: `${ADDON_ID}/others`,
        selectors: others,
        styles: {
          outline: `1px solid color-mix(in srgb, ${colorsByType[ui.tab]}, transparent 30%)`,
          backgroundColor: `color-mix(in srgb, ${colorsByType[ui.tab]}, transparent 60%)`
        },
        hoverStyles: {
          outlineWidth: "2px"
        },
        focusStyles: {
          backgroundColor: "transparent"
        },
        menu: results?.[ui.tab].map((result) => {
          const selectors = result.nodes.flatMap((n) => n.target).map(String).filter((e) => !selected.includes(e));
          return [
            {
              id: `${ui.tab}.${result.id}:info`,
              title: getTitleForAxeResult(result),
              description: getFriendlySummaryForAxeResult(result),
              selectors
            },
            {
              id: `${ui.tab}.${result.id}`,
              iconLeft: "info",
              iconRight: "shareAlt",
              title: "Learn how to resolve this violation",
              clickEvent: EVENTS.SELECT,
              selectors
            }
          ];
        })
      });
    }
  }, [isInitial, emit, ui.highlighted, results, ui.tab, selectedItems]);
  const discrepancy = useMemo(() => {
    if (!currentStoryA11yStatusValue) {
      return null;
    }
    if (currentStoryA11yStatusValue === "status-value:success" && results?.violations.length) {
      return "cliPassedBrowserFailed";
    }
    if (currentStoryA11yStatusValue === "status-value:error" && !results?.violations.length) {
      if (status === "ready" || status === "ran") {
        return "browserPassedCliFailed";
      }
      if (status === "manual") {
        return "cliFailedButModeManual";
      }
    }
    return null;
  }, [results?.violations.length, status, currentStoryA11yStatusValue]);
  return React.createElement(
    A11yContext.Provider,
    {
      value: {
        parameters,
        results,
        highlighted: ui.highlighted,
        toggleHighlight: handleToggleHighlight,
        tab: ui.tab,
        setTab: useCallback(
          (type) => setState((prev) => ({ ...prev, ui: { ...prev.ui, tab: type } })),
          [setState]
        ),
        handleCopyLink,
        status,
        setStatus: useCallback(
          (status2) => setState((prev) => ({ ...prev, status: status2 })),
          [setState]
        ),
        error,
        handleManual,
        discrepancy,
        selectedItems,
        toggleOpen,
        allExpanded,
        handleCollapseAll,
        handleExpandAll,
        handleJumpToElement,
        handleSelectionChange
      },
      ...props
    }
  );
}, "A11yContextProvider");
var useA11yContext = /* @__PURE__ */ __name(() => useContext(A11yContext), "useA11yContext");

// src/components/Report/Report.tsx
import React3 from "react";
import { Badge, EmptyTabContent, IconButton } from "storybook/internal/components";
import { ChevronSmallDownIcon } from "@storybook/icons";
import { styled as styled2 } from "storybook/theming";

// src/components/Report/Details.tsx
import React2, { Fragment, useCallback as useCallback2, useState as useState3 } from "react";
import { Button, Link, SyntaxHighlighter } from "storybook/internal/components";
import { CheckIcon, CopyIcon, LocationIcon } from "@storybook/icons";

// ../../node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
__name(_extends, "_extends");

// ../../node_modules/@radix-ui/react-tabs/dist/index.mjs
import { forwardRef as $1IHzk$forwardRef, createElement as $1IHzk$createElement, useRef as $1IHzk$useRef, useEffect as $1IHzk$useEffect } from "react";

// ../../node_modules/@radix-ui/primitive/dist/index.mjs
function $e42e1063c40fb3ef$export$b9ecd428b558ff10(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return /* @__PURE__ */ __name(function handleEvent(event) {
    originalEventHandler === null || originalEventHandler === void 0 || originalEventHandler(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) return ourEventHandler === null || ourEventHandler === void 0 ? void 0 : ourEventHandler(event);
  }, "handleEvent");
}
__name($e42e1063c40fb3ef$export$b9ecd428b558ff10, "$e42e1063c40fb3ef$export$b9ecd428b558ff10");

// ../../node_modules/@radix-ui/react-context/dist/index.mjs
import { createContext as $3bkAK$createContext, useMemo as $3bkAK$useMemo, createElement as $3bkAK$createElement, useContext as $3bkAK$useContext } from "react";
function $c512c27ab02ef895$export$50c7b4e9d9f19c1(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function $c512c27ab02ef895$export$fd42f52fd3ae1109(rootComponentName, defaultContext) {
    const BaseContext = $3bkAK$createContext(defaultContext);
    const index = defaultContexts.length;
    defaultContexts = [
      ...defaultContexts,
      defaultContext
    ];
    function Provider(props) {
      const { scope, children, ...context } = props;
      const Context = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index]) || BaseContext;
      const value = $3bkAK$useMemo(
        () => context,
        Object.values(context)
      );
      return $3bkAK$createElement(Context.Provider, {
        value
      }, children);
    }
    __name(Provider, "Provider");
    function useContext2(consumerName, scope) {
      const Context = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index]) || BaseContext;
      const context = $3bkAK$useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    __name(useContext2, "useContext");
    Provider.displayName = rootComponentName + "Provider";
    return [
      Provider,
      useContext2
    ];
  }
  __name($c512c27ab02ef895$export$fd42f52fd3ae1109, "$c512c27ab02ef895$export$fd42f52fd3ae1109");
  const createScope = /* @__PURE__ */ __name(() => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return $3bkAK$createContext(defaultContext);
    });
    return /* @__PURE__ */ __name(function useScope(scope) {
      const contexts = (scope === null || scope === void 0 ? void 0 : scope[scopeName]) || scopeContexts;
      return $3bkAK$useMemo(
        () => ({
          [`__scope${scopeName}`]: {
            ...scope,
            [scopeName]: contexts
          }
        }),
        [
          scope,
          contexts
        ]
      );
    }, "useScope");
  }, "createScope");
  createScope.scopeName = scopeName;
  return [
    $c512c27ab02ef895$export$fd42f52fd3ae1109,
    $c512c27ab02ef895$var$composeContextScopes(createScope, ...createContextScopeDeps)
  ];
}
__name($c512c27ab02ef895$export$50c7b4e9d9f19c1, "$c512c27ab02ef895$export$50c7b4e9d9f19c1");
function $c512c27ab02ef895$var$composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope1 = /* @__PURE__ */ __name(() => {
    const scopeHooks = scopes.map(
      (createScope) => ({
        useScope: createScope(),
        scopeName: createScope.scopeName
      })
    );
    return /* @__PURE__ */ __name(function useComposedScopes(overrideScopes) {
      const nextScopes1 = scopeHooks.reduce((nextScopes, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return {
          ...nextScopes,
          ...currentScope
        };
      }, {});
      return $3bkAK$useMemo(
        () => ({
          [`__scope${baseScope.scopeName}`]: nextScopes1
        }),
        [
          nextScopes1
        ]
      );
    }, "useComposedScopes");
  }, "createScope1");
  createScope1.scopeName = baseScope.scopeName;
  return createScope1;
}
__name($c512c27ab02ef895$var$composeContextScopes, "$c512c27ab02ef895$var$composeContextScopes");

// ../../node_modules/@radix-ui/react-roving-focus/dist/index.mjs
import { forwardRef as $98Iye$forwardRef, createElement as $98Iye$createElement, useRef as $98Iye$useRef, useState as $98Iye$useState, useEffect as $98Iye$useEffect, useCallback as $98Iye$useCallback } from "react";

// ../../node_modules/@radix-ui/react-collection/dist/index.mjs
import $6vYhU$react from "react";

// ../../node_modules/@radix-ui/react-collection/node_modules/@radix-ui/react-compose-refs/dist/index.mjs
import { useCallback as $3vqmr$useCallback } from "react";
function $6ed0406888f73fc4$var$setRef(ref, value) {
  if (typeof ref === "function") ref(value);
  else if (ref !== null && ref !== void 0) ref.current = value;
}
__name($6ed0406888f73fc4$var$setRef, "$6ed0406888f73fc4$var$setRef");
function $6ed0406888f73fc4$export$43e446d32b3d21af(...refs) {
  return (node) => refs.forEach(
    (ref) => $6ed0406888f73fc4$var$setRef(ref, node)
  );
}
__name($6ed0406888f73fc4$export$43e446d32b3d21af, "$6ed0406888f73fc4$export$43e446d32b3d21af");
function $6ed0406888f73fc4$export$c7b2cbe3552a0d05(...refs) {
  return $3vqmr$useCallback($6ed0406888f73fc4$export$43e446d32b3d21af(...refs), refs);
}
__name($6ed0406888f73fc4$export$c7b2cbe3552a0d05, "$6ed0406888f73fc4$export$c7b2cbe3552a0d05");

// ../../node_modules/@radix-ui/react-collection/node_modules/@radix-ui/react-slot/dist/index.mjs
import { forwardRef as $9IrjX$forwardRef, Children as $9IrjX$Children, isValidElement as $9IrjX$isValidElement, createElement as $9IrjX$createElement, cloneElement as $9IrjX$cloneElement, Fragment as $9IrjX$Fragment } from "react";
var $5e63c961fc1ce211$export$8c6ed5c666ac1360 = $9IrjX$forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = $9IrjX$Children.toArray(children);
  const slottable = childrenArray.find($5e63c961fc1ce211$var$isSlottable);
  if (slottable) {
    const newElement = slottable.props.children;
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if ($9IrjX$Children.count(newElement) > 1) return $9IrjX$Children.only(null);
        return $9IrjX$isValidElement(newElement) ? newElement.props.children : null;
      } else return child;
    });
    return $9IrjX$createElement($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, {
      ref: forwardedRef
    }), $9IrjX$isValidElement(newElement) ? $9IrjX$cloneElement(newElement, void 0, newChildren) : null);
  }
  return $9IrjX$createElement($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, {
    ref: forwardedRef
  }), children);
});
$5e63c961fc1ce211$export$8c6ed5c666ac1360.displayName = "Slot";
var $5e63c961fc1ce211$var$SlotClone = $9IrjX$forwardRef((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  if ($9IrjX$isValidElement(children)) return $9IrjX$cloneElement(children, {
    ...$5e63c961fc1ce211$var$mergeProps(slotProps, children.props),
    ref: forwardedRef ? $6ed0406888f73fc4$export$43e446d32b3d21af(forwardedRef, children.ref) : children.ref
  });
  return $9IrjX$Children.count(children) > 1 ? $9IrjX$Children.only(null) : null;
});
$5e63c961fc1ce211$var$SlotClone.displayName = "SlotClone";
var $5e63c961fc1ce211$export$d9f1ccf0bdb05d45 = /* @__PURE__ */ __name(({ children }) => {
  return $9IrjX$createElement($9IrjX$Fragment, null, children);
}, "$5e63c961fc1ce211$export$d9f1ccf0bdb05d45");
function $5e63c961fc1ce211$var$isSlottable(child) {
  return $9IrjX$isValidElement(child) && child.type === $5e63c961fc1ce211$export$d9f1ccf0bdb05d45;
}
__name($5e63c961fc1ce211$var$isSlottable, "$5e63c961fc1ce211$var$isSlottable");
function $5e63c961fc1ce211$var$mergeProps(slotProps, childProps) {
  const overrideProps = {
    ...childProps
  };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) overrideProps[propName] = (...args) => {
        childPropValue(...args);
        slotPropValue(...args);
      };
      else if (slotPropValue) overrideProps[propName] = slotPropValue;
    } else if (propName === "style") overrideProps[propName] = {
      ...slotPropValue,
      ...childPropValue
    };
    else if (propName === "className") overrideProps[propName] = [
      slotPropValue,
      childPropValue
    ].filter(Boolean).join(" ");
  }
  return {
    ...slotProps,
    ...overrideProps
  };
}
__name($5e63c961fc1ce211$var$mergeProps, "$5e63c961fc1ce211$var$mergeProps");

// ../../node_modules/@radix-ui/react-collection/dist/index.mjs
function $e02a7d9cb1dc128c$export$c74125a8e3af6bb2(name) {
  const PROVIDER_NAME = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope] = $c512c27ab02ef895$export$50c7b4e9d9f19c1(PROVIDER_NAME);
  const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(PROVIDER_NAME, {
    collectionRef: {
      current: null
    },
    itemMap: /* @__PURE__ */ new Map()
  });
  const CollectionProvider = /* @__PURE__ */ __name((props) => {
    const { scope, children } = props;
    const ref = $6vYhU$react.useRef(null);
    const itemMap = $6vYhU$react.useRef(/* @__PURE__ */ new Map()).current;
    return $6vYhU$react.createElement(CollectionProviderImpl, {
      scope,
      itemMap,
      collectionRef: ref
    }, children);
  }, "CollectionProvider");
  Object.assign(CollectionProvider, {
    displayName: PROVIDER_NAME
  });
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlot = $6vYhU$react.forwardRef((props, forwardedRef) => {
    const { scope, children } = props;
    const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, context.collectionRef);
    return $6vYhU$react.createElement($5e63c961fc1ce211$export$8c6ed5c666ac1360, {
      ref: composedRefs
    }, children);
  });
  Object.assign(CollectionSlot, {
    displayName: COLLECTION_SLOT_NAME
  });
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlot = $6vYhU$react.forwardRef((props, forwardedRef) => {
    const { scope, children, ...itemData } = props;
    const ref = $6vYhU$react.useRef(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref);
    const context = useCollectionContext(ITEM_SLOT_NAME, scope);
    $6vYhU$react.useEffect(() => {
      context.itemMap.set(ref, {
        ref,
        ...itemData
      });
      return () => void context.itemMap.delete(ref);
    });
    return $6vYhU$react.createElement($5e63c961fc1ce211$export$8c6ed5c666ac1360, {
      [ITEM_DATA_ATTR]: "",
      ref: composedRefs
    }, children);
  });
  Object.assign(CollectionItemSlot, {
    displayName: ITEM_SLOT_NAME
  });
  function useCollection(scope) {
    const context = useCollectionContext(name + "CollectionConsumer", scope);
    const getItems = $6vYhU$react.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
      );
      return orderedItems;
    }, [
      context.collectionRef,
      context.itemMap
    ]);
    return getItems;
  }
  __name(useCollection, "useCollection");
  return [
    {
      Provider: CollectionProvider,
      Slot: CollectionSlot,
      ItemSlot: CollectionItemSlot
    },
    useCollection,
    createCollectionScope
  ];
}
__name($e02a7d9cb1dc128c$export$c74125a8e3af6bb2, "$e02a7d9cb1dc128c$export$c74125a8e3af6bb2");

// ../../node_modules/@radix-ui/react-roving-focus/node_modules/@radix-ui/react-compose-refs/dist/index.mjs
import { useCallback as $3vqmr$useCallback2 } from "react";
function $6ed0406888f73fc4$var$setRef2(ref, value) {
  if (typeof ref === "function") ref(value);
  else if (ref !== null && ref !== void 0) ref.current = value;
}
__name($6ed0406888f73fc4$var$setRef2, "$6ed0406888f73fc4$var$setRef");
function $6ed0406888f73fc4$export$43e446d32b3d21af2(...refs) {
  return (node) => refs.forEach(
    (ref) => $6ed0406888f73fc4$var$setRef2(ref, node)
  );
}
__name($6ed0406888f73fc4$export$43e446d32b3d21af2, "$6ed0406888f73fc4$export$43e446d32b3d21af");
function $6ed0406888f73fc4$export$c7b2cbe3552a0d052(...refs) {
  return $3vqmr$useCallback2($6ed0406888f73fc4$export$43e446d32b3d21af2(...refs), refs);
}
__name($6ed0406888f73fc4$export$c7b2cbe3552a0d052, "$6ed0406888f73fc4$export$c7b2cbe3552a0d05");

// ../../node_modules/@radix-ui/react-id/dist/index.mjs
import * as $2AODx$react from "react";

// ../../node_modules/@radix-ui/react-id/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
import { useLayoutEffect as $dxlwH$useLayoutEffect } from "react";
var $9f79659886946c16$export$e5c5a5f917a5871c = Boolean(globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) ? $dxlwH$useLayoutEffect : () => {
};

// ../../node_modules/@radix-ui/react-id/dist/index.mjs
var $1746a345f3d73bb7$var$useReactId = $2AODx$react["useId".toString()] || (() => void 0);
var $1746a345f3d73bb7$var$count = 0;
function $1746a345f3d73bb7$export$f680877a34711e37(deterministicId) {
  const [id, setId] = $2AODx$react.useState($1746a345f3d73bb7$var$useReactId());
  $9f79659886946c16$export$e5c5a5f917a5871c(() => {
    if (!deterministicId) setId(
      (reactId) => reactId !== null && reactId !== void 0 ? reactId : String($1746a345f3d73bb7$var$count++)
    );
  }, [
    deterministicId
  ]);
  return deterministicId || (id ? `radix-${id}` : "");
}
__name($1746a345f3d73bb7$export$f680877a34711e37, "$1746a345f3d73bb7$export$f680877a34711e37");

// ../../node_modules/@radix-ui/react-roving-focus/node_modules/@radix-ui/react-primitive/dist/index.mjs
import { forwardRef as $4q5Fq$forwardRef, useEffect as $4q5Fq$useEffect, createElement as $4q5Fq$createElement } from "react";
import { flushSync as $4q5Fq$flushSync } from "react-dom";

// ../../node_modules/@radix-ui/react-roving-focus/node_modules/@radix-ui/react-slot/dist/index.mjs
import { forwardRef as $9IrjX$forwardRef2, Children as $9IrjX$Children2, isValidElement as $9IrjX$isValidElement2, createElement as $9IrjX$createElement2, cloneElement as $9IrjX$cloneElement2, Fragment as $9IrjX$Fragment2 } from "react";
var $5e63c961fc1ce211$export$8c6ed5c666ac13602 = $9IrjX$forwardRef2((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = $9IrjX$Children2.toArray(children);
  const slottable = childrenArray.find($5e63c961fc1ce211$var$isSlottable2);
  if (slottable) {
    const newElement = slottable.props.children;
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if ($9IrjX$Children2.count(newElement) > 1) return $9IrjX$Children2.only(null);
        return $9IrjX$isValidElement2(newElement) ? newElement.props.children : null;
      } else return child;
    });
    return $9IrjX$createElement2($5e63c961fc1ce211$var$SlotClone2, _extends({}, slotProps, {
      ref: forwardedRef
    }), $9IrjX$isValidElement2(newElement) ? $9IrjX$cloneElement2(newElement, void 0, newChildren) : null);
  }
  return $9IrjX$createElement2($5e63c961fc1ce211$var$SlotClone2, _extends({}, slotProps, {
    ref: forwardedRef
  }), children);
});
$5e63c961fc1ce211$export$8c6ed5c666ac13602.displayName = "Slot";
var $5e63c961fc1ce211$var$SlotClone2 = $9IrjX$forwardRef2((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  if ($9IrjX$isValidElement2(children)) return $9IrjX$cloneElement2(children, {
    ...$5e63c961fc1ce211$var$mergeProps2(slotProps, children.props),
    ref: forwardedRef ? $6ed0406888f73fc4$export$43e446d32b3d21af2(forwardedRef, children.ref) : children.ref
  });
  return $9IrjX$Children2.count(children) > 1 ? $9IrjX$Children2.only(null) : null;
});
$5e63c961fc1ce211$var$SlotClone2.displayName = "SlotClone";
var $5e63c961fc1ce211$export$d9f1ccf0bdb05d452 = /* @__PURE__ */ __name(({ children }) => {
  return $9IrjX$createElement2($9IrjX$Fragment2, null, children);
}, "$5e63c961fc1ce211$export$d9f1ccf0bdb05d45");
function $5e63c961fc1ce211$var$isSlottable2(child) {
  return $9IrjX$isValidElement2(child) && child.type === $5e63c961fc1ce211$export$d9f1ccf0bdb05d452;
}
__name($5e63c961fc1ce211$var$isSlottable2, "$5e63c961fc1ce211$var$isSlottable");
function $5e63c961fc1ce211$var$mergeProps2(slotProps, childProps) {
  const overrideProps = {
    ...childProps
  };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) overrideProps[propName] = (...args) => {
        childPropValue(...args);
        slotPropValue(...args);
      };
      else if (slotPropValue) overrideProps[propName] = slotPropValue;
    } else if (propName === "style") overrideProps[propName] = {
      ...slotPropValue,
      ...childPropValue
    };
    else if (propName === "className") overrideProps[propName] = [
      slotPropValue,
      childPropValue
    ].filter(Boolean).join(" ");
  }
  return {
    ...slotProps,
    ...overrideProps
  };
}
__name($5e63c961fc1ce211$var$mergeProps2, "$5e63c961fc1ce211$var$mergeProps");

// ../../node_modules/@radix-ui/react-roving-focus/node_modules/@radix-ui/react-primitive/dist/index.mjs
var $8927f6f2acc4f386$var$NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
var $8927f6f2acc4f386$export$250ffa63cdc0d034 = $8927f6f2acc4f386$var$NODES.reduce((primitive, node) => {
  const Node = $4q5Fq$forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? $5e63c961fc1ce211$export$8c6ed5c666ac13602 : node;
    $4q5Fq$useEffect(() => {
      window[Symbol.for("radix-ui")] = true;
    }, []);
    return $4q5Fq$createElement(Comp, _extends({}, primitiveProps, {
      ref: forwardedRef
    }));
  });
  Node.displayName = `Primitive.${node}`;
  return {
    ...primitive,
    [node]: Node
  };
}, {});

// ../../node_modules/@radix-ui/react-roving-focus/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
import { useRef as $lwiWj$useRef, useEffect as $lwiWj$useEffect, useMemo as $lwiWj$useMemo } from "react";
function $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(callback) {
  const callbackRef = $lwiWj$useRef(callback);
  $lwiWj$useEffect(() => {
    callbackRef.current = callback;
  });
  return $lwiWj$useMemo(
    () => (...args) => {
      var _callbackRef$current;
      return (_callbackRef$current = callbackRef.current) === null || _callbackRef$current === void 0 ? void 0 : _callbackRef$current.call(callbackRef, ...args);
    },
    []
  );
}
__name($b1b2314f5f9a1d84$export$25bec8c6f54ee79a, "$b1b2314f5f9a1d84$export$25bec8c6f54ee79a");

// ../../node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
import { useCallback as $bnPw9$useCallback, useState as $bnPw9$useState, useRef as $bnPw9$useRef, useEffect as $bnPw9$useEffect } from "react";

// ../../node_modules/@radix-ui/react-use-controllable-state/node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
import { useRef as $lwiWj$useRef2, useEffect as $lwiWj$useEffect2, useMemo as $lwiWj$useMemo2 } from "react";
function $b1b2314f5f9a1d84$export$25bec8c6f54ee79a2(callback) {
  const callbackRef = $lwiWj$useRef2(callback);
  $lwiWj$useEffect2(() => {
    callbackRef.current = callback;
  });
  return $lwiWj$useMemo2(
    () => (...args) => {
      var _callbackRef$current;
      return (_callbackRef$current = callbackRef.current) === null || _callbackRef$current === void 0 ? void 0 : _callbackRef$current.call(callbackRef, ...args);
    },
    []
  );
}
__name($b1b2314f5f9a1d84$export$25bec8c6f54ee79a2, "$b1b2314f5f9a1d84$export$25bec8c6f54ee79a");

// ../../node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
function $71cd76cc60e0454e$export$6f32135080cb4c3({ prop, defaultProp, onChange = /* @__PURE__ */ __name(() => {
}, "onChange") }) {
  const [uncontrolledProp, setUncontrolledProp] = $71cd76cc60e0454e$var$useUncontrolledState({
    defaultProp,
    onChange
  });
  const isControlled = prop !== void 0;
  const value1 = isControlled ? prop : uncontrolledProp;
  const handleChange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a2(onChange);
  const setValue = $bnPw9$useCallback((nextValue) => {
    if (isControlled) {
      const setter = nextValue;
      const value = typeof nextValue === "function" ? setter(prop) : nextValue;
      if (value !== prop) handleChange(value);
    } else setUncontrolledProp(nextValue);
  }, [
    isControlled,
    prop,
    setUncontrolledProp,
    handleChange
  ]);
  return [
    value1,
    setValue
  ];
}
__name($71cd76cc60e0454e$export$6f32135080cb4c3, "$71cd76cc60e0454e$export$6f32135080cb4c3");
function $71cd76cc60e0454e$var$useUncontrolledState({ defaultProp, onChange }) {
  const uncontrolledState = $bnPw9$useState(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = $bnPw9$useRef(value);
  const handleChange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a2(onChange);
  $bnPw9$useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value);
      prevValueRef.current = value;
    }
  }, [
    value,
    prevValueRef,
    handleChange
  ]);
  return uncontrolledState;
}
__name($71cd76cc60e0454e$var$useUncontrolledState, "$71cd76cc60e0454e$var$useUncontrolledState");

// ../../node_modules/@radix-ui/react-direction/dist/index.mjs
import { createContext as $7Gjcd$createContext, createElement as $7Gjcd$createElement, useContext as $7Gjcd$useContext } from "react";
var $f631663db3294ace$var$DirectionContext = $7Gjcd$createContext(void 0);
function $f631663db3294ace$export$b39126d51d94e6f3(localDir) {
  const globalDir = $7Gjcd$useContext($f631663db3294ace$var$DirectionContext);
  return localDir || globalDir || "ltr";
}
__name($f631663db3294ace$export$b39126d51d94e6f3, "$f631663db3294ace$export$b39126d51d94e6f3");

// ../../node_modules/@radix-ui/react-roving-focus/dist/index.mjs
var $d7bdfb9eb0fdf311$var$ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var $d7bdfb9eb0fdf311$var$EVENT_OPTIONS = {
  bubbles: false,
  cancelable: true
};
var $d7bdfb9eb0fdf311$var$GROUP_NAME = "RovingFocusGroup";
var [$d7bdfb9eb0fdf311$var$Collection, $d7bdfb9eb0fdf311$var$useCollection, $d7bdfb9eb0fdf311$var$createCollectionScope] = $e02a7d9cb1dc128c$export$c74125a8e3af6bb2($d7bdfb9eb0fdf311$var$GROUP_NAME);
var [$d7bdfb9eb0fdf311$var$createRovingFocusGroupContext, $d7bdfb9eb0fdf311$export$c7109489551a4f4] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($d7bdfb9eb0fdf311$var$GROUP_NAME, [
  $d7bdfb9eb0fdf311$var$createCollectionScope
]);
var [$d7bdfb9eb0fdf311$var$RovingFocusProvider, $d7bdfb9eb0fdf311$var$useRovingFocusContext] = $d7bdfb9eb0fdf311$var$createRovingFocusGroupContext($d7bdfb9eb0fdf311$var$GROUP_NAME);
var $d7bdfb9eb0fdf311$export$8699f7c8af148338 = $98Iye$forwardRef((props, forwardedRef) => {
  return $98Iye$createElement($d7bdfb9eb0fdf311$var$Collection.Provider, {
    scope: props.__scopeRovingFocusGroup
  }, $98Iye$createElement($d7bdfb9eb0fdf311$var$Collection.Slot, {
    scope: props.__scopeRovingFocusGroup
  }, $98Iye$createElement($d7bdfb9eb0fdf311$var$RovingFocusGroupImpl, _extends({}, props, {
    ref: forwardedRef
  }))));
});
Object.assign($d7bdfb9eb0fdf311$export$8699f7c8af148338, {
  displayName: $d7bdfb9eb0fdf311$var$GROUP_NAME
});
var $d7bdfb9eb0fdf311$var$RovingFocusGroupImpl = $98Iye$forwardRef((props, forwardedRef) => {
  const { __scopeRovingFocusGroup, orientation, loop = false, dir, currentTabStopId: currentTabStopIdProp, defaultCurrentTabStopId, onCurrentTabStopIdChange, onEntryFocus, ...groupProps } = props;
  const ref = $98Iye$useRef(null);
  const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d052(forwardedRef, ref);
  const direction = $f631663db3294ace$export$b39126d51d94e6f3(dir);
  const [currentTabStopId = null, setCurrentTabStopId] = $71cd76cc60e0454e$export$6f32135080cb4c3({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId,
    onChange: onCurrentTabStopIdChange
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = $98Iye$useState(false);
  const handleEntryFocus = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onEntryFocus);
  const getItems = $d7bdfb9eb0fdf311$var$useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = $98Iye$useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = $98Iye$useState(0);
  $98Iye$useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener($d7bdfb9eb0fdf311$var$ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener($d7bdfb9eb0fdf311$var$ENTRY_FOCUS, handleEntryFocus);
    }
  }, [
    handleEntryFocus
  ]);
  return $98Iye$createElement($d7bdfb9eb0fdf311$var$RovingFocusProvider, {
    scope: __scopeRovingFocusGroup,
    orientation,
    dir: direction,
    loop,
    currentTabStopId,
    onItemFocus: $98Iye$useCallback(
      (tabStopId) => setCurrentTabStopId(tabStopId),
      [
        setCurrentTabStopId
      ]
    ),
    onItemShiftTab: $98Iye$useCallback(
      () => setIsTabbingBackOut(true),
      []
    ),
    onFocusableItemAdd: $98Iye$useCallback(
      () => setFocusableItemsCount(
        (prevCount) => prevCount + 1
      ),
      []
    ),
    onFocusableItemRemove: $98Iye$useCallback(
      () => setFocusableItemsCount(
        (prevCount) => prevCount - 1
      ),
      []
    )
  }, $98Iye$createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
    tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
    "data-orientation": orientation
  }, groupProps, {
    ref: composedRefs,
    style: {
      outline: "none",
      ...props.style
    },
    onMouseDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onMouseDown, () => {
      isClickFocusRef.current = true;
    }),
    onFocus: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onFocus, (event) => {
      const isKeyboardFocus = !isClickFocusRef.current;
      if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
        const entryFocusEvent = new CustomEvent($d7bdfb9eb0fdf311$var$ENTRY_FOCUS, $d7bdfb9eb0fdf311$var$EVENT_OPTIONS);
        event.currentTarget.dispatchEvent(entryFocusEvent);
        if (!entryFocusEvent.defaultPrevented) {
          const items = getItems().filter(
            (item) => item.focusable
          );
          const activeItem = items.find(
            (item) => item.active
          );
          const currentItem = items.find(
            (item) => item.id === currentTabStopId
          );
          const candidateItems = [
            activeItem,
            currentItem,
            ...items
          ].filter(Boolean);
          const candidateNodes = candidateItems.map(
            (item) => item.ref.current
          );
          $d7bdfb9eb0fdf311$var$focusFirst(candidateNodes);
        }
      }
      isClickFocusRef.current = false;
    }),
    onBlur: $e42e1063c40fb3ef$export$b9ecd428b558ff10(
      props.onBlur,
      () => setIsTabbingBackOut(false)
    )
  })));
});
var $d7bdfb9eb0fdf311$var$ITEM_NAME = "RovingFocusGroupItem";
var $d7bdfb9eb0fdf311$export$ab9df7c53fe8454 = $98Iye$forwardRef((props, forwardedRef) => {
  const { __scopeRovingFocusGroup, focusable = true, active = false, tabStopId, ...itemProps } = props;
  const autoId = $1746a345f3d73bb7$export$f680877a34711e37();
  const id = tabStopId || autoId;
  const context = $d7bdfb9eb0fdf311$var$useRovingFocusContext($d7bdfb9eb0fdf311$var$ITEM_NAME, __scopeRovingFocusGroup);
  const isCurrentTabStop = context.currentTabStopId === id;
  const getItems = $d7bdfb9eb0fdf311$var$useCollection(__scopeRovingFocusGroup);
  const { onFocusableItemAdd, onFocusableItemRemove } = context;
  $98Iye$useEffect(() => {
    if (focusable) {
      onFocusableItemAdd();
      return () => onFocusableItemRemove();
    }
  }, [
    focusable,
    onFocusableItemAdd,
    onFocusableItemRemove
  ]);
  return $98Iye$createElement($d7bdfb9eb0fdf311$var$Collection.ItemSlot, {
    scope: __scopeRovingFocusGroup,
    id,
    focusable,
    active
  }, $98Iye$createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.span, _extends({
    tabIndex: isCurrentTabStop ? 0 : -1,
    "data-orientation": context.orientation
  }, itemProps, {
    ref: forwardedRef,
    onMouseDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onMouseDown, (event) => {
      if (!focusable) event.preventDefault();
      else context.onItemFocus(id);
    }),
    onFocus: $e42e1063c40fb3ef$export$b9ecd428b558ff10(
      props.onFocus,
      () => context.onItemFocus(id)
    ),
    onKeyDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onKeyDown, (event) => {
      if (event.key === "Tab" && event.shiftKey) {
        context.onItemShiftTab();
        return;
      }
      if (event.target !== event.currentTarget) return;
      const focusIntent = $d7bdfb9eb0fdf311$var$getFocusIntent(event, context.orientation, context.dir);
      if (focusIntent !== void 0) {
        event.preventDefault();
        const items = getItems().filter(
          (item) => item.focusable
        );
        let candidateNodes = items.map(
          (item) => item.ref.current
        );
        if (focusIntent === "last") candidateNodes.reverse();
        else if (focusIntent === "prev" || focusIntent === "next") {
          if (focusIntent === "prev") candidateNodes.reverse();
          const currentIndex = candidateNodes.indexOf(event.currentTarget);
          candidateNodes = context.loop ? $d7bdfb9eb0fdf311$var$wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
        }
        setTimeout(
          () => $d7bdfb9eb0fdf311$var$focusFirst(candidateNodes)
        );
      }
    })
  })));
});
Object.assign($d7bdfb9eb0fdf311$export$ab9df7c53fe8454, {
  displayName: $d7bdfb9eb0fdf311$var$ITEM_NAME
});
var $d7bdfb9eb0fdf311$var$MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function $d7bdfb9eb0fdf311$var$getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
__name($d7bdfb9eb0fdf311$var$getDirectionAwareKey, "$d7bdfb9eb0fdf311$var$getDirectionAwareKey");
function $d7bdfb9eb0fdf311$var$getFocusIntent(event, orientation, dir) {
  const key = $d7bdfb9eb0fdf311$var$getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && [
    "ArrowLeft",
    "ArrowRight"
  ].includes(key)) return void 0;
  if (orientation === "horizontal" && [
    "ArrowUp",
    "ArrowDown"
  ].includes(key)) return void 0;
  return $d7bdfb9eb0fdf311$var$MAP_KEY_TO_FOCUS_INTENT[key];
}
__name($d7bdfb9eb0fdf311$var$getFocusIntent, "$d7bdfb9eb0fdf311$var$getFocusIntent");
function $d7bdfb9eb0fdf311$var$focusFirst(candidates) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus();
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
__name($d7bdfb9eb0fdf311$var$focusFirst, "$d7bdfb9eb0fdf311$var$focusFirst");
function $d7bdfb9eb0fdf311$var$wrapArray(array, startIndex) {
  return array.map(
    (_, index) => array[(startIndex + index) % array.length]
  );
}
__name($d7bdfb9eb0fdf311$var$wrapArray, "$d7bdfb9eb0fdf311$var$wrapArray");
var $d7bdfb9eb0fdf311$export$be92b6f5f03c0fe9 = $d7bdfb9eb0fdf311$export$8699f7c8af148338;
var $d7bdfb9eb0fdf311$export$6d08773d2e66f8f2 = $d7bdfb9eb0fdf311$export$ab9df7c53fe8454;

// ../../node_modules/@radix-ui/react-presence/dist/index.mjs
import { Children as $iqq3r$Children, cloneElement as $iqq3r$cloneElement, useState as $iqq3r$useState, useRef as $iqq3r$useRef, useEffect as $iqq3r$useEffect, useCallback as $iqq3r$useCallback, useReducer as $iqq3r$useReducer } from "react";
import { flushSync as $iqq3r$flushSync } from "react-dom";

// ../../node_modules/@radix-ui/react-presence/node_modules/@radix-ui/react-compose-refs/dist/index.mjs
import { useCallback as $3vqmr$useCallback3 } from "react";
function $6ed0406888f73fc4$var$setRef3(ref, value) {
  if (typeof ref === "function") ref(value);
  else if (ref !== null && ref !== void 0) ref.current = value;
}
__name($6ed0406888f73fc4$var$setRef3, "$6ed0406888f73fc4$var$setRef");
function $6ed0406888f73fc4$export$43e446d32b3d21af3(...refs) {
  return (node) => refs.forEach(
    (ref) => $6ed0406888f73fc4$var$setRef3(ref, node)
  );
}
__name($6ed0406888f73fc4$export$43e446d32b3d21af3, "$6ed0406888f73fc4$export$43e446d32b3d21af");
function $6ed0406888f73fc4$export$c7b2cbe3552a0d053(...refs) {
  return $3vqmr$useCallback3($6ed0406888f73fc4$export$43e446d32b3d21af3(...refs), refs);
}
__name($6ed0406888f73fc4$export$c7b2cbe3552a0d053, "$6ed0406888f73fc4$export$c7b2cbe3552a0d05");

// ../../node_modules/@radix-ui/react-presence/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
import { useLayoutEffect as $dxlwH$useLayoutEffect2 } from "react";
var $9f79659886946c16$export$e5c5a5f917a5871c2 = Boolean(globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) ? $dxlwH$useLayoutEffect2 : () => {
};

// ../../node_modules/@radix-ui/react-presence/dist/index.mjs
function $fe963b355347cc68$export$3e6543de14f8614f(initialState, machine) {
  return $iqq3r$useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState !== null && nextState !== void 0 ? nextState : state;
  }, initialState);
}
__name($fe963b355347cc68$export$3e6543de14f8614f, "$fe963b355347cc68$export$3e6543de14f8614f");
var $921a889cee6df7e8$export$99c2b779aa4e8b8b = /* @__PURE__ */ __name((props) => {
  const { present, children } = props;
  const presence = $921a889cee6df7e8$var$usePresence(present);
  const child = typeof children === "function" ? children({
    present: presence.isPresent
  }) : $iqq3r$Children.only(children);
  const ref = $6ed0406888f73fc4$export$c7b2cbe3552a0d053(presence.ref, child.ref);
  const forceMount = typeof children === "function";
  return forceMount || presence.isPresent ? $iqq3r$cloneElement(child, {
    ref
  }) : null;
}, "$921a889cee6df7e8$export$99c2b779aa4e8b8b");
$921a889cee6df7e8$export$99c2b779aa4e8b8b.displayName = "Presence";
function $921a889cee6df7e8$var$usePresence(present) {
  const [node1, setNode] = $iqq3r$useState();
  const stylesRef = $iqq3r$useRef({});
  const prevPresentRef = $iqq3r$useRef(present);
  const prevAnimationNameRef = $iqq3r$useRef("none");
  const initialState = present ? "mounted" : "unmounted";
  const [state, send] = $fe963b355347cc68$export$3e6543de14f8614f(initialState, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  $iqq3r$useEffect(() => {
    const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
    prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
  }, [
    state
  ]);
  $9f79659886946c16$export$e5c5a5f917a5871c2(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(styles);
      if (present) send("MOUNT");
      else if (currentAnimationName === "none" || (styles === null || styles === void 0 ? void 0 : styles.display) === "none")
        send("UNMOUNT");
      else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (wasPresent && isAnimating) send("ANIMATION_OUT");
        else send("UNMOUNT");
      }
      prevPresentRef.current = present;
    }
  }, [
    present,
    send
  ]);
  $9f79659886946c16$export$e5c5a5f917a5871c2(() => {
    if (node1) {
      const handleAnimationEnd = /* @__PURE__ */ __name((event) => {
        const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(event.animationName);
        if (event.target === node1 && isCurrentAnimation)
          $iqq3r$flushSync(
            () => send("ANIMATION_END")
          );
      }, "handleAnimationEnd");
      const handleAnimationStart = /* @__PURE__ */ __name((event) => {
        if (event.target === node1)
          prevAnimationNameRef.current = $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
      }, "handleAnimationStart");
      node1.addEventListener("animationstart", handleAnimationStart);
      node1.addEventListener("animationcancel", handleAnimationEnd);
      node1.addEventListener("animationend", handleAnimationEnd);
      return () => {
        node1.removeEventListener("animationstart", handleAnimationStart);
        node1.removeEventListener("animationcancel", handleAnimationEnd);
        node1.removeEventListener("animationend", handleAnimationEnd);
      };
    } else
      send("ANIMATION_END");
  }, [
    node1,
    send
  ]);
  return {
    isPresent: [
      "mounted",
      "unmountSuspended"
    ].includes(state),
    ref: $iqq3r$useCallback((node) => {
      if (node) stylesRef.current = getComputedStyle(node);
      setNode(node);
    }, [])
  };
}
__name($921a889cee6df7e8$var$usePresence, "$921a889cee6df7e8$var$usePresence");
function $921a889cee6df7e8$var$getAnimationName(styles) {
  return (styles === null || styles === void 0 ? void 0 : styles.animationName) || "none";
}
__name($921a889cee6df7e8$var$getAnimationName, "$921a889cee6df7e8$var$getAnimationName");

// ../../node_modules/@radix-ui/react-tabs/node_modules/@radix-ui/react-primitive/dist/index.mjs
import { forwardRef as $4q5Fq$forwardRef2, useEffect as $4q5Fq$useEffect2, createElement as $4q5Fq$createElement2 } from "react";
import { flushSync as $4q5Fq$flushSync2 } from "react-dom";

// ../../node_modules/@radix-ui/react-tabs/node_modules/@radix-ui/react-slot/dist/index.mjs
import { forwardRef as $9IrjX$forwardRef3, Children as $9IrjX$Children3, isValidElement as $9IrjX$isValidElement3, createElement as $9IrjX$createElement3, cloneElement as $9IrjX$cloneElement3, Fragment as $9IrjX$Fragment3 } from "react";

// ../../node_modules/@radix-ui/react-tabs/node_modules/@radix-ui/react-compose-refs/dist/index.mjs
import { useCallback as $3vqmr$useCallback4 } from "react";
function $6ed0406888f73fc4$var$setRef4(ref, value) {
  if (typeof ref === "function") ref(value);
  else if (ref !== null && ref !== void 0) ref.current = value;
}
__name($6ed0406888f73fc4$var$setRef4, "$6ed0406888f73fc4$var$setRef");
function $6ed0406888f73fc4$export$43e446d32b3d21af4(...refs) {
  return (node) => refs.forEach(
    (ref) => $6ed0406888f73fc4$var$setRef4(ref, node)
  );
}
__name($6ed0406888f73fc4$export$43e446d32b3d21af4, "$6ed0406888f73fc4$export$43e446d32b3d21af");

// ../../node_modules/@radix-ui/react-tabs/node_modules/@radix-ui/react-slot/dist/index.mjs
var $5e63c961fc1ce211$export$8c6ed5c666ac13603 = $9IrjX$forwardRef3((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = $9IrjX$Children3.toArray(children);
  const slottable = childrenArray.find($5e63c961fc1ce211$var$isSlottable3);
  if (slottable) {
    const newElement = slottable.props.children;
    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if ($9IrjX$Children3.count(newElement) > 1) return $9IrjX$Children3.only(null);
        return $9IrjX$isValidElement3(newElement) ? newElement.props.children : null;
      } else return child;
    });
    return $9IrjX$createElement3($5e63c961fc1ce211$var$SlotClone3, _extends({}, slotProps, {
      ref: forwardedRef
    }), $9IrjX$isValidElement3(newElement) ? $9IrjX$cloneElement3(newElement, void 0, newChildren) : null);
  }
  return $9IrjX$createElement3($5e63c961fc1ce211$var$SlotClone3, _extends({}, slotProps, {
    ref: forwardedRef
  }), children);
});
$5e63c961fc1ce211$export$8c6ed5c666ac13603.displayName = "Slot";
var $5e63c961fc1ce211$var$SlotClone3 = $9IrjX$forwardRef3((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  if ($9IrjX$isValidElement3(children)) return $9IrjX$cloneElement3(children, {
    ...$5e63c961fc1ce211$var$mergeProps3(slotProps, children.props),
    ref: forwardedRef ? $6ed0406888f73fc4$export$43e446d32b3d21af4(forwardedRef, children.ref) : children.ref
  });
  return $9IrjX$Children3.count(children) > 1 ? $9IrjX$Children3.only(null) : null;
});
$5e63c961fc1ce211$var$SlotClone3.displayName = "SlotClone";
var $5e63c961fc1ce211$export$d9f1ccf0bdb05d453 = /* @__PURE__ */ __name(({ children }) => {
  return $9IrjX$createElement3($9IrjX$Fragment3, null, children);
}, "$5e63c961fc1ce211$export$d9f1ccf0bdb05d45");
function $5e63c961fc1ce211$var$isSlottable3(child) {
  return $9IrjX$isValidElement3(child) && child.type === $5e63c961fc1ce211$export$d9f1ccf0bdb05d453;
}
__name($5e63c961fc1ce211$var$isSlottable3, "$5e63c961fc1ce211$var$isSlottable");
function $5e63c961fc1ce211$var$mergeProps3(slotProps, childProps) {
  const overrideProps = {
    ...childProps
  };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) overrideProps[propName] = (...args) => {
        childPropValue(...args);
        slotPropValue(...args);
      };
      else if (slotPropValue) overrideProps[propName] = slotPropValue;
    } else if (propName === "style") overrideProps[propName] = {
      ...slotPropValue,
      ...childPropValue
    };
    else if (propName === "className") overrideProps[propName] = [
      slotPropValue,
      childPropValue
    ].filter(Boolean).join(" ");
  }
  return {
    ...slotProps,
    ...overrideProps
  };
}
__name($5e63c961fc1ce211$var$mergeProps3, "$5e63c961fc1ce211$var$mergeProps");

// ../../node_modules/@radix-ui/react-tabs/node_modules/@radix-ui/react-primitive/dist/index.mjs
var $8927f6f2acc4f386$var$NODES2 = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
var $8927f6f2acc4f386$export$250ffa63cdc0d0342 = $8927f6f2acc4f386$var$NODES2.reduce((primitive, node) => {
  const Node = $4q5Fq$forwardRef2((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? $5e63c961fc1ce211$export$8c6ed5c666ac13603 : node;
    $4q5Fq$useEffect2(() => {
      window[Symbol.for("radix-ui")] = true;
    }, []);
    return $4q5Fq$createElement2(Comp, _extends({}, primitiveProps, {
      ref: forwardedRef
    }));
  });
  Node.displayName = `Primitive.${node}`;
  return {
    ...primitive,
    [node]: Node
  };
}, {});

// ../../node_modules/@radix-ui/react-tabs/dist/index.mjs
var $69cb30bb0017df05$var$TABS_NAME = "Tabs";
var [$69cb30bb0017df05$var$createTabsContext, $69cb30bb0017df05$export$355f5bd209d7b13a] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($69cb30bb0017df05$var$TABS_NAME, [
  $d7bdfb9eb0fdf311$export$c7109489551a4f4
]);
var $69cb30bb0017df05$var$useRovingFocusGroupScope = $d7bdfb9eb0fdf311$export$c7109489551a4f4();
var [$69cb30bb0017df05$var$TabsProvider, $69cb30bb0017df05$var$useTabsContext] = $69cb30bb0017df05$var$createTabsContext($69cb30bb0017df05$var$TABS_NAME);
var $69cb30bb0017df05$export$b2539bed5023c21c = $1IHzk$forwardRef((props, forwardedRef) => {
  const { __scopeTabs, value: valueProp, onValueChange, defaultValue, orientation = "horizontal", dir, activationMode = "automatic", ...tabsProps } = props;
  const direction = $f631663db3294ace$export$b39126d51d94e6f3(dir);
  const [value, setValue] = $71cd76cc60e0454e$export$6f32135080cb4c3({
    prop: valueProp,
    onChange: onValueChange,
    defaultProp: defaultValue
  });
  return $1IHzk$createElement($69cb30bb0017df05$var$TabsProvider, {
    scope: __scopeTabs,
    baseId: $1746a345f3d73bb7$export$f680877a34711e37(),
    value,
    onValueChange: setValue,
    orientation,
    dir: direction,
    activationMode
  }, $1IHzk$createElement($8927f6f2acc4f386$export$250ffa63cdc0d0342.div, _extends({
    dir: direction,
    "data-orientation": orientation
  }, tabsProps, {
    ref: forwardedRef
  })));
});
Object.assign($69cb30bb0017df05$export$b2539bed5023c21c, {
  displayName: $69cb30bb0017df05$var$TABS_NAME
});
var $69cb30bb0017df05$var$TAB_LIST_NAME = "TabsList";
var $69cb30bb0017df05$export$9712d22edc0d78c1 = $1IHzk$forwardRef((props, forwardedRef) => {
  const { __scopeTabs, loop = true, ...listProps } = props;
  const context = $69cb30bb0017df05$var$useTabsContext($69cb30bb0017df05$var$TAB_LIST_NAME, __scopeTabs);
  const rovingFocusGroupScope = $69cb30bb0017df05$var$useRovingFocusGroupScope(__scopeTabs);
  return $1IHzk$createElement($d7bdfb9eb0fdf311$export$be92b6f5f03c0fe9, _extends({
    asChild: true
  }, rovingFocusGroupScope, {
    orientation: context.orientation,
    dir: context.dir,
    loop
  }), $1IHzk$createElement($8927f6f2acc4f386$export$250ffa63cdc0d0342.div, _extends({
    role: "tablist",
    "aria-orientation": context.orientation
  }, listProps, {
    ref: forwardedRef
  })));
});
Object.assign($69cb30bb0017df05$export$9712d22edc0d78c1, {
  displayName: $69cb30bb0017df05$var$TAB_LIST_NAME
});
var $69cb30bb0017df05$var$TRIGGER_NAME = "TabsTrigger";
var $69cb30bb0017df05$export$8114b9fdfdf9f3ba = $1IHzk$forwardRef((props, forwardedRef) => {
  const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
  const context = $69cb30bb0017df05$var$useTabsContext($69cb30bb0017df05$var$TRIGGER_NAME, __scopeTabs);
  const rovingFocusGroupScope = $69cb30bb0017df05$var$useRovingFocusGroupScope(__scopeTabs);
  const triggerId = $69cb30bb0017df05$var$makeTriggerId(context.baseId, value);
  const contentId = $69cb30bb0017df05$var$makeContentId(context.baseId, value);
  const isSelected = value === context.value;
  return $1IHzk$createElement($d7bdfb9eb0fdf311$export$6d08773d2e66f8f2, _extends({
    asChild: true
  }, rovingFocusGroupScope, {
    focusable: !disabled,
    active: isSelected
  }), $1IHzk$createElement($8927f6f2acc4f386$export$250ffa63cdc0d0342.button, _extends({
    type: "button",
    role: "tab",
    "aria-selected": isSelected,
    "aria-controls": contentId,
    "data-state": isSelected ? "active" : "inactive",
    "data-disabled": disabled ? "" : void 0,
    disabled,
    id: triggerId
  }, triggerProps, {
    ref: forwardedRef,
    onMouseDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onMouseDown, (event) => {
      if (!disabled && event.button === 0 && event.ctrlKey === false) context.onValueChange(value);
      else
        event.preventDefault();
    }),
    onKeyDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onKeyDown, (event) => {
      if ([
        " ",
        "Enter"
      ].includes(event.key)) context.onValueChange(value);
    }),
    onFocus: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onFocus, () => {
      const isAutomaticActivation = context.activationMode !== "manual";
      if (!isSelected && !disabled && isAutomaticActivation) context.onValueChange(value);
    })
  })));
});
Object.assign($69cb30bb0017df05$export$8114b9fdfdf9f3ba, {
  displayName: $69cb30bb0017df05$var$TRIGGER_NAME
});
var $69cb30bb0017df05$var$CONTENT_NAME = "TabsContent";
var $69cb30bb0017df05$export$bd905d70e8fd2ebb = $1IHzk$forwardRef((props, forwardedRef) => {
  const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
  const context = $69cb30bb0017df05$var$useTabsContext($69cb30bb0017df05$var$CONTENT_NAME, __scopeTabs);
  const triggerId = $69cb30bb0017df05$var$makeTriggerId(context.baseId, value);
  const contentId = $69cb30bb0017df05$var$makeContentId(context.baseId, value);
  const isSelected = value === context.value;
  const isMountAnimationPreventedRef = $1IHzk$useRef(isSelected);
  $1IHzk$useEffect(() => {
    const rAF = requestAnimationFrame(
      () => isMountAnimationPreventedRef.current = false
    );
    return () => cancelAnimationFrame(rAF);
  }, []);
  return $1IHzk$createElement(
    $921a889cee6df7e8$export$99c2b779aa4e8b8b,
    {
      present: forceMount || isSelected
    },
    ({ present }) => $1IHzk$createElement($8927f6f2acc4f386$export$250ffa63cdc0d0342.div, _extends({
      "data-state": isSelected ? "active" : "inactive",
      "data-orientation": context.orientation,
      role: "tabpanel",
      "aria-labelledby": triggerId,
      hidden: !present,
      id: contentId,
      tabIndex: 0
    }, contentProps, {
      ref: forwardedRef,
      style: {
        ...props.style,
        animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
      }
    }), present && children)
  );
});
Object.assign($69cb30bb0017df05$export$bd905d70e8fd2ebb, {
  displayName: $69cb30bb0017df05$var$CONTENT_NAME
});
function $69cb30bb0017df05$var$makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
__name($69cb30bb0017df05$var$makeTriggerId, "$69cb30bb0017df05$var$makeTriggerId");
function $69cb30bb0017df05$var$makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
__name($69cb30bb0017df05$var$makeContentId, "$69cb30bb0017df05$var$makeContentId");
var $69cb30bb0017df05$export$be92b6f5f03c0fe9 = $69cb30bb0017df05$export$b2539bed5023c21c;
var $69cb30bb0017df05$export$54c2e3dc7acea9f5 = $69cb30bb0017df05$export$9712d22edc0d78c1;
var $69cb30bb0017df05$export$41fb9f06171c75f4 = $69cb30bb0017df05$export$8114b9fdfdf9f3ba;
var $69cb30bb0017df05$export$7c6e2c02157bb7d2 = $69cb30bb0017df05$export$bd905d70e8fd2ebb;

// src/components/Report/Details.tsx
import { styled } from "storybook/theming";
var StyledSyntaxHighlighter = styled(SyntaxHighlighter)(
  ({ theme: theme2 }) => ({
    fontSize: theme2.typography.size.s1
  }),
  ({ language }) => (
    // We appended ' {}' to the selector in order to get proper syntax highlighting. This rule hides the last 3 spans
    // (one character each) in the displayed output. Only siblings of .selector (the actual CSS selector characters)
    // are targeted so that the code comment line isn't affected.
    language === "css" && {
      ".selector ~ span:nth-last-of-type(-n+3)": {
        display: "none"
      }
    }
  )
);
var Info = styled.div({
  display: "flex",
  flexDirection: "column"
});
var RuleId = styled.div(({ theme: theme2 }) => ({
  display: "block",
  color: theme2.textMutedColor,
  fontFamily: theme2.typography.fonts.mono,
  fontSize: theme2.typography.size.s1,
  marginTop: -8,
  marginBottom: 12,
  "@container (min-width: 800px)": {
    display: "none"
  }
}));
var Description = styled.p({
  margin: 0
});
var Wrapper = styled.div({
  display: "flex",
  flexDirection: "column",
  padding: "0 15px 20px 15px",
  gap: 20
});
var Columns = styled.div({
  gap: 15,
  "@container (min-width: 800px)": {
    display: "grid",
    gridTemplateColumns: "50% 50%"
  }
});
var Content = styled.div(({ theme: theme2, side }) => ({
  display: side === "left" ? "flex" : "none",
  flexDirection: "column",
  gap: 15,
  margin: side === "left" ? "15px 0" : 0,
  padding: side === "left" ? "0 15px" : 0,
  borderLeft: side === "left" ? `1px solid ${theme2.color.border}` : "none",
  "&:focus-visible": {
    outline: "none",
    borderRadius: 4,
    boxShadow: `0 0 0 1px inset ${theme2.color.secondary}`
  },
  "@container (min-width: 800px)": {
    display: side === "left" ? "none" : "flex"
  }
}));
var Item = styled(Button)(({ theme: theme2 }) => ({
  fontFamily: theme2.typography.fonts.mono,
  fontWeight: theme2.typography.weight.regular,
  color: theme2.textMutedColor,
  height: 40,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "0 12px",
  '&[data-state="active"]': {
    color: theme2.color.secondary,
    backgroundColor: theme2.background.hoverable
  }
}));
var Messages = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 10
});
var Actions = styled.div({
  display: "flex",
  gap: 10
});
var CopyButton = /* @__PURE__ */ __name(({ onClick }) => {
  const [copied, setCopied] = useState3(false);
  const handleClick = useCallback2(() => {
    onClick();
    setCopied(true);
    const timeout = setTimeout(() => setCopied(false), 2e3);
    return () => clearTimeout(timeout);
  }, [onClick]);
  return React2.createElement(Button, { onClick: handleClick }, copied ? React2.createElement(CheckIcon, null) : React2.createElement(CopyIcon, null), " ", copied ? "Copied" : "Copy link");
}, "CopyButton");
var Details = /* @__PURE__ */ __name(({ id, item, type, selection, handleSelectionChange }) => React2.createElement(Wrapper, { id }, React2.createElement(Info, null, React2.createElement(RuleId, null, item.id), React2.createElement(Description, null, getFriendlySummaryForAxeResult(item), " ", React2.createElement(Link, { href: item.helpUrl, target: "_blank", rel: "noopener noreferrer", withArrow: true }, "Learn how to resolve this violation"))), React2.createElement(
  $69cb30bb0017df05$export$be92b6f5f03c0fe9,
  {
    defaultValue: selection,
    orientation: "vertical",
    value: selection,
    onValueChange: handleSelectionChange,
    asChild: true
  },
  React2.createElement(Columns, null, React2.createElement($69cb30bb0017df05$export$54c2e3dc7acea9f5, { "aria-label": type }, item.nodes.map((node, index) => {
    const key = `${type}.${item.id}.${index + 1}`;
    return React2.createElement(Fragment, { key }, React2.createElement($69cb30bb0017df05$export$41fb9f06171c75f4, { value: key, asChild: true }, React2.createElement(Item, { variant: "ghost", size: "medium", id: key }, index + 1, ". ", node.html)), React2.createElement($69cb30bb0017df05$export$7c6e2c02157bb7d2, { value: key, asChild: true }, React2.createElement(Content, { side: "left" }, getContent(node))));
  })), item.nodes.map((node, index) => {
    const key = `${type}.${item.id}.${index + 1}`;
    return React2.createElement($69cb30bb0017df05$export$7c6e2c02157bb7d2, { key, value: key, asChild: true }, React2.createElement(Content, { side: "right" }, getContent(node)));
  }))
)), "Details");
function getContent(node) {
  const { handleCopyLink, handleJumpToElement } = useA11yContext();
  const { any, all, none, html, target } = node;
  const rules = [...any, ...all, ...none];
  return React2.createElement(React2.Fragment, null, React2.createElement(Messages, null, rules.map((rule) => React2.createElement("div", { key: rule.id }, `${rule.message}${/(\.|: [^.]+\.*)$/.test(rule.message) ? "" : "."}`))), React2.createElement(Actions, null, React2.createElement(Button, { onClick: () => handleJumpToElement(node.target.toString()) }, React2.createElement(LocationIcon, null), " Jump to element"), React2.createElement(CopyButton, { onClick: () => handleCopyLink(node.linkPath) })), React2.createElement(
    StyledSyntaxHighlighter,
    {
      language: "jsx",
      wrapLongLines: true
    },
    `/* element */
${html}`
  ), React2.createElement(
    StyledSyntaxHighlighter,
    {
      language: "css",
      wrapLongLines: true
    },
    `/* selector */
${target} {}`
  ));
}
__name(getContent, "getContent");

// src/components/Report/Report.tsx
var impactStatus = {
  minor: "neutral",
  moderate: "warning",
  serious: "negative",
  critical: "critical"
};
var impactLabels = {
  minor: "Minor",
  moderate: "Moderate",
  serious: "Serious",
  critical: "Critical"
};
var Wrapper2 = styled2.div(({ theme: theme2 }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  borderBottom: `1px solid ${theme2.appBorderColor}`,
  containerType: "inline-size",
  fontSize: theme2.typography.size.s2
}));
var Icon = styled2(ChevronSmallDownIcon)({
  transition: "transform 0.1s ease-in-out"
});
var HeaderBar = styled2.div(({ theme: theme2 }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 6,
  padding: "6px 10px 6px 15px",
  minHeight: 40,
  background: "none",
  color: "inherit",
  textAlign: "left",
  cursor: "pointer",
  width: "100%",
  "&:hover": {
    color: theme2.color.secondary
  }
}));
var Title = styled2.div(({ theme: theme2 }) => ({
  display: "flex",
  alignItems: "baseline",
  flexGrow: 1,
  fontSize: theme2.typography.size.s2,
  gap: 8
}));
var RuleId2 = styled2.div(({ theme: theme2 }) => ({
  display: "none",
  color: theme2.textMutedColor,
  fontFamily: theme2.typography.fonts.mono,
  fontSize: theme2.typography.size.s1,
  "@container (min-width: 800px)": {
    display: "block"
  }
}));
var Count = styled2.div(({ theme: theme2 }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme2.textMutedColor,
  width: 28,
  height: 28
}));
var Report = /* @__PURE__ */ __name(({
  items,
  empty,
  type,
  handleSelectionChange,
  selectedItems,
  toggleOpen
}) => React3.createElement(React3.Fragment, null, items && items.length ? items.map((item) => {
  const id = `${type}.${item.id}`;
  const detailsId = `details:${id}`;
  const selection = selectedItems.get(id);
  const title = getTitleForAxeResult(item);
  return React3.createElement(Wrapper2, { key: id }, React3.createElement(HeaderBar, { onClick: (event) => toggleOpen(event, type, item), "data-active": !!selection }, React3.createElement(Title, null, React3.createElement("strong", null, title), React3.createElement(RuleId2, null, item.id)), item.impact && React3.createElement(Badge, { status: type === RuleType.PASS ? "neutral" : impactStatus[item.impact] }, impactLabels[item.impact]), React3.createElement(Count, null, item.nodes.length), React3.createElement(
    IconButton,
    {
      onClick: (event) => toggleOpen(event, type, item),
      "aria-label": `${selection ? "Collapse" : "Expand"} details for ${title}`,
      "aria-expanded": !!selection,
      "aria-controls": detailsId
    },
    React3.createElement(Icon, { style: { transform: `rotate(${selection ? -180 : 0}deg)` } })
  )), selection ? React3.createElement(
    Details,
    {
      id: detailsId,
      item,
      type,
      selection,
      handleSelectionChange
    }
  ) : React3.createElement("div", { id: detailsId }));
}) : React3.createElement(EmptyTabContent, { title: empty })), "Report");

// src/components/Tabs.tsx
import * as React5 from "react";
import { IconButton as IconButton2, ScrollArea, TooltipNote, WithTooltip } from "storybook/internal/components";
import { CollapseIcon, ExpandAltIcon, EyeCloseIcon, EyeIcon, SyncIcon } from "@storybook/icons";

// ../../node_modules/react-resize-detector/build/index.esm.js
import * as React4 from "react";
import { cloneElement, isValidElement, createRef, PureComponent, Component, forwardRef, useRef, useState as useState4, useEffect as useEffect2, useLayoutEffect } from "react";
import { findDOMNode } from "react-dom";
var extendStatics = /* @__PURE__ */ __name(function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
}, "extendStatics");
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  __name(__, "__");
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
__name(__extends, "__extends");
var __assign = /* @__PURE__ */ __name(function() {
  __assign = Object.assign || /* @__PURE__ */ __name(function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  }, "__assign");
  return __assign.apply(this, arguments);
}, "__assign");
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
__name(__rest, "__rest");
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function isObject$3(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
__name(isObject$3, "isObject$3");
var isObject_1 = isObject$3;
var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal$1;
var freeGlobal = _freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root$2 = freeGlobal || freeSelf || Function("return this")();
var _root = root$2;
var root$1 = _root;
var now$1 = /* @__PURE__ */ __name(function() {
  return root$1.Date.now();
}, "now$1");
var now_1 = now$1;
var reWhitespace = /\s/;
function trimmedEndIndex$1(string) {
  var index = string.length;
  while (index-- && reWhitespace.test(string.charAt(index))) {
  }
  return index;
}
__name(trimmedEndIndex$1, "trimmedEndIndex$1");
var _trimmedEndIndex = trimmedEndIndex$1;
var trimmedEndIndex = _trimmedEndIndex;
var reTrimStart = /^\s+/;
function baseTrim$1(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
}
__name(baseTrim$1, "baseTrim$1");
var _baseTrim = baseTrim$1;
var root = _root;
var Symbol$2 = root.Symbol;
var _Symbol = Symbol$2;
var Symbol$1 = _Symbol;
var objectProto$1 = Object.prototype;
var hasOwnProperty = objectProto$1.hasOwnProperty;
var nativeObjectToString$1 = objectProto$1.toString;
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
function getRawTag$1(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
__name(getRawTag$1, "getRawTag$1");
var _getRawTag = getRawTag$1;
var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
function objectToString$1(value) {
  return nativeObjectToString.call(value);
}
__name(objectToString$1, "objectToString$1");
var _objectToString = objectToString$1;
var Symbol2 = _Symbol;
var getRawTag = _getRawTag;
var objectToString = _objectToString;
var nullTag = "[object Null]";
var undefinedTag = "[object Undefined]";
var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
function baseGetTag$1(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
__name(baseGetTag$1, "baseGetTag$1");
var _baseGetTag = baseGetTag$1;
function isObjectLike$1(value) {
  return value != null && typeof value == "object";
}
__name(isObjectLike$1, "isObjectLike$1");
var isObjectLike_1 = isObjectLike$1;
var baseGetTag = _baseGetTag;
var isObjectLike = isObjectLike_1;
var symbolTag = "[object Symbol]";
function isSymbol$1(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
__name(isSymbol$1, "isSymbol$1");
var isSymbol_1 = isSymbol$1;
var baseTrim = _baseTrim;
var isObject$2 = isObject_1;
var isSymbol = isSymbol_1;
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber$1(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject$2(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject$2(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
__name(toNumber$1, "toNumber$1");
var toNumber_1 = toNumber$1;
var isObject$1 = isObject_1;
var now = now_1;
var toNumber = toNumber_1;
var FUNC_ERROR_TEXT$1 = "Expected a function";
var nativeMax = Math.max;
var nativeMin = Math.min;
function debounce$1(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber(wait) || 0;
  if (isObject$1(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  __name(invokeFunc, "invokeFunc");
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  __name(leadingEdge, "leadingEdge");
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
    return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  __name(remainingWait, "remainingWait");
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  __name(shouldInvoke, "shouldInvoke");
  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  __name(timerExpired, "timerExpired");
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  __name(trailingEdge, "trailingEdge");
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  __name(cancel, "cancel");
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now());
  }
  __name(flush, "flush");
  function debounced() {
    var time = now(), isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  __name(debounced, "debounced");
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
__name(debounce$1, "debounce$1");
var debounce_1 = debounce$1;
var debounce = debounce_1;
var isObject = isObject_1;
var FUNC_ERROR_TEXT = "Expected a function";
function throttle(func, wait, options) {
  var leading = true, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    "leading": leading,
    "maxWait": wait,
    "trailing": trailing
  });
}
__name(throttle, "throttle");
var throttle_1 = throttle;
var patchResizeHandler = /* @__PURE__ */ __name(function(resizeCallback, refreshMode, refreshRate, refreshOptions) {
  switch (refreshMode) {
    case "debounce":
      return debounce_1(resizeCallback, refreshRate, refreshOptions);
    case "throttle":
      return throttle_1(resizeCallback, refreshRate, refreshOptions);
    default:
      return resizeCallback;
  }
}, "patchResizeHandler");
var isFunction = /* @__PURE__ */ __name(function(fn) {
  return typeof fn === "function";
}, "isFunction");
var isSSR = /* @__PURE__ */ __name(function() {
  return typeof window === "undefined";
}, "isSSR");
var isDOMElement = /* @__PURE__ */ __name(function(element) {
  return element instanceof Element || element instanceof HTMLDocument;
}, "isDOMElement");
var createNotifier = /* @__PURE__ */ __name(function(onResize, setSize, handleWidth, handleHeight) {
  return function(_a) {
    var width = _a.width, height = _a.height;
    setSize(function(prev) {
      if (prev.width === width && prev.height === height) {
        return prev;
      }
      if (prev.width === width && !handleHeight || prev.height === height && !handleWidth) {
        return prev;
      }
      if (onResize && isFunction(onResize)) {
        onResize(width, height);
      }
      return { width, height };
    });
  };
}, "createNotifier");
var ResizeDetector = (
  /** @class */
  function(_super) {
    __extends(ResizeDetector2, _super);
    function ResizeDetector2(props) {
      var _this = _super.call(this, props) || this;
      _this.cancelHandler = function() {
        if (_this.resizeHandler && _this.resizeHandler.cancel) {
          _this.resizeHandler.cancel();
          _this.resizeHandler = null;
        }
      };
      _this.attachObserver = function() {
        var _a2 = _this.props, targetRef = _a2.targetRef, observerOptions = _a2.observerOptions;
        if (isSSR()) {
          return;
        }
        if (targetRef && targetRef.current) {
          _this.targetRef.current = targetRef.current;
        }
        var element = _this.getElement();
        if (!element) {
          return;
        }
        if (_this.observableElement && _this.observableElement === element) {
          return;
        }
        _this.observableElement = element;
        _this.resizeObserver.observe(element, observerOptions);
      };
      _this.getElement = function() {
        var _a2 = _this.props, querySelector = _a2.querySelector, targetDomEl = _a2.targetDomEl;
        if (isSSR())
          return null;
        if (querySelector)
          return document.querySelector(querySelector);
        if (targetDomEl && isDOMElement(targetDomEl))
          return targetDomEl;
        if (_this.targetRef && isDOMElement(_this.targetRef.current))
          return _this.targetRef.current;
        var currentElement = findDOMNode(_this);
        if (!currentElement)
          return null;
        var renderType = _this.getRenderType();
        switch (renderType) {
          case "renderProp":
            return currentElement;
          case "childFunction":
            return currentElement;
          case "child":
            return currentElement;
          case "childArray":
            return currentElement;
          default:
            return currentElement.parentElement;
        }
      };
      _this.createResizeHandler = function(entries) {
        var _a2 = _this.props, _b = _a2.handleWidth, handleWidth = _b === void 0 ? true : _b, _c = _a2.handleHeight, handleHeight = _c === void 0 ? true : _c, onResize = _a2.onResize;
        if (!handleWidth && !handleHeight)
          return;
        var notifyResize = createNotifier(onResize, _this.setState.bind(_this), handleWidth, handleHeight);
        entries.forEach(function(entry) {
          var _a3 = entry && entry.contentRect || {}, width = _a3.width, height = _a3.height;
          var shouldSetSize = !_this.skipOnMount && !isSSR();
          if (shouldSetSize) {
            notifyResize({ width, height });
          }
          _this.skipOnMount = false;
        });
      };
      _this.getRenderType = function() {
        var _a2 = _this.props, render = _a2.render, children = _a2.children;
        if (isFunction(render)) {
          return "renderProp";
        }
        if (isFunction(children)) {
          return "childFunction";
        }
        if (isValidElement(children)) {
          return "child";
        }
        if (Array.isArray(children)) {
          return "childArray";
        }
        return "parent";
      };
      var skipOnMount = props.skipOnMount, refreshMode = props.refreshMode, _a = props.refreshRate, refreshRate = _a === void 0 ? 1e3 : _a, refreshOptions = props.refreshOptions;
      _this.state = {
        width: void 0,
        height: void 0
      };
      _this.skipOnMount = skipOnMount;
      _this.targetRef = createRef();
      _this.observableElement = null;
      if (isSSR()) {
        return _this;
      }
      _this.resizeHandler = patchResizeHandler(_this.createResizeHandler, refreshMode, refreshRate, refreshOptions);
      _this.resizeObserver = new window.ResizeObserver(_this.resizeHandler);
      return _this;
    }
    __name(ResizeDetector2, "ResizeDetector");
    ResizeDetector2.prototype.componentDidMount = function() {
      this.attachObserver();
    };
    ResizeDetector2.prototype.componentDidUpdate = function() {
      this.attachObserver();
    };
    ResizeDetector2.prototype.componentWillUnmount = function() {
      if (isSSR()) {
        return;
      }
      this.observableElement = null;
      this.resizeObserver.disconnect();
      this.cancelHandler();
    };
    ResizeDetector2.prototype.render = function() {
      var _a = this.props, render = _a.render, children = _a.children, _b = _a.nodeType, WrapperTag = _b === void 0 ? "div" : _b;
      var _c = this.state, width = _c.width, height = _c.height;
      var childProps = { width, height, targetRef: this.targetRef };
      var renderType = this.getRenderType();
      var typedChildren;
      switch (renderType) {
        case "renderProp":
          return render && render(childProps);
        case "childFunction":
          typedChildren = children;
          return typedChildren(childProps);
        case "child":
          typedChildren = children;
          if (typedChildren.type && typeof typedChildren.type === "string") {
            childProps.targetRef;
            var nativeProps = __rest(childProps, ["targetRef"]);
            return cloneElement(typedChildren, nativeProps);
          }
          return cloneElement(typedChildren, childProps);
        case "childArray":
          typedChildren = children;
          return typedChildren.map(function(el) {
            return !!el && cloneElement(el, childProps);
          });
        default:
          return React4.createElement(WrapperTag, null);
      }
    };
    return ResizeDetector2;
  }(PureComponent)
);
var useEnhancedEffect = isSSR() ? useEffect2 : useLayoutEffect;
function useResizeDetector(props) {
  if (props === void 0) {
    props = {};
  }
  var _a = props.skipOnMount, skipOnMount = _a === void 0 ? false : _a, refreshMode = props.refreshMode, _b = props.refreshRate, refreshRate = _b === void 0 ? 1e3 : _b, refreshOptions = props.refreshOptions, _c = props.handleWidth, handleWidth = _c === void 0 ? true : _c, _d = props.handleHeight, handleHeight = _d === void 0 ? true : _d, targetRef = props.targetRef, observerOptions = props.observerOptions, onResize = props.onResize;
  var skipResize = useRef(skipOnMount);
  var localRef = useRef(null);
  var ref = targetRef !== null && targetRef !== void 0 ? targetRef : localRef;
  var resizeHandler = useRef();
  var _e = useState4({
    width: void 0,
    height: void 0
  }), size = _e[0], setSize = _e[1];
  useEnhancedEffect(function() {
    if (isSSR()) {
      return;
    }
    var notifyResize = createNotifier(onResize, setSize, handleWidth, handleHeight);
    var resizeCallback = /* @__PURE__ */ __name(function(entries) {
      if (!handleWidth && !handleHeight)
        return;
      entries.forEach(function(entry) {
        var _a2 = entry && entry.contentRect || {}, width = _a2.width, height = _a2.height;
        var shouldSetSize = !skipResize.current && !isSSR();
        if (shouldSetSize) {
          notifyResize({ width, height });
        }
        skipResize.current = false;
      });
    }, "resizeCallback");
    resizeHandler.current = patchResizeHandler(resizeCallback, refreshMode, refreshRate, refreshOptions);
    var resizeObserver = new window.ResizeObserver(resizeHandler.current);
    if (ref.current) {
      resizeObserver.observe(ref.current, observerOptions);
    }
    return function() {
      resizeObserver.disconnect();
      var patchedResizeHandler = resizeHandler.current;
      if (patchedResizeHandler && patchedResizeHandler.cancel) {
        patchedResizeHandler.cancel();
      }
    };
  }, [refreshMode, refreshRate, refreshOptions, handleWidth, handleHeight, onResize, observerOptions, ref.current]);
  return __assign({ ref }, size);
}
__name(useResizeDetector, "useResizeDetector");

// src/components/Tabs.tsx
import { styled as styled3 } from "storybook/theming";
var Container = styled3.div({
  width: "100%",
  position: "relative",
  minHeight: "100%"
});
var Item2 = styled3.button(
  ({ theme: theme2 }) => ({
    textDecoration: "none",
    padding: "10px 15px",
    cursor: "pointer",
    color: theme2.textMutedColor,
    fontWeight: theme2.typography.weight.bold,
    fontSize: theme2.typography.size.s2 - 1,
    lineHeight: 1,
    height: 40,
    border: "none",
    borderBottom: "3px solid transparent",
    background: "transparent",
    "&:focus": {
      outline: "0 none",
      borderColor: theme2.color.secondary
    }
  }),
  ({ active, theme: theme2 }) => active ? {
    opacity: 1,
    color: theme2.color.secondary,
    borderColor: theme2.color.secondary
  } : {}
);
var Subnav = styled3.div(({ theme: theme2 }) => ({
  boxShadow: `${theme2.appBorderColor} 0 -1px 0 0 inset`,
  background: theme2.background.app,
  position: "sticky",
  top: 0,
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  whiteSpace: "nowrap",
  overflow: "auto",
  paddingRight: 10,
  gap: 6,
  scrollbarColor: `${theme2.barTextColor} ${theme2.background.app}`,
  scrollbarWidth: "thin"
}));
var TabsWrapper = styled3.div({});
var ActionsWrapper = styled3.div({
  display: "flex",
  flexBasis: "100%",
  justifyContent: "flex-end",
  containerType: "inline-size",
  // 96px is the total width of the buttons without labels
  minWidth: 96,
  gap: 6
});
var ToggleButton = styled3(IconButton2)({
  // 193px is the total width of the action buttons when the label is visible
  "@container (max-width: 193px)": {
    span: {
      display: "none"
    }
  }
});
var Tabs = /* @__PURE__ */ __name(({ tabs }) => {
  const { ref } = useResizeDetector({
    refreshMode: "debounce",
    handleHeight: false,
    handleWidth: true
  });
  const {
    tab: activeTab,
    setTab,
    toggleHighlight,
    highlighted,
    handleManual,
    allExpanded,
    handleCollapseAll,
    handleExpandAll
  } = useA11yContext();
  const handleToggle = React5.useCallback(
    (event) => {
      setTab(event.currentTarget.getAttribute("data-type"));
    },
    [setTab]
  );
  return React5.createElement(Container, { ref }, React5.createElement(Subnav, null, React5.createElement(TabsWrapper, { role: "tablist" }, tabs.map((tab, index) => React5.createElement(
    Item2,
    {
      role: "tab",
      key: index,
      "data-type": tab.type,
      "data-active": activeTab === tab.type,
      "aria-selected": activeTab === tab.type,
      active: activeTab === tab.type,
      onClick: handleToggle
    },
    tab.label
  ))), React5.createElement(ActionsWrapper, null, React5.createElement(
    WithTooltip,
    {
      as: "div",
      hasChrome: false,
      placement: "top",
      tooltip: React5.createElement(TooltipNote, { note: "Highlight elements with accessibility violations" }),
      trigger: "hover"
    },
    React5.createElement(ToggleButton, { onClick: toggleHighlight, active: highlighted }, highlighted ? React5.createElement(EyeCloseIcon, null) : React5.createElement(EyeIcon, null), React5.createElement("span", null, highlighted ? "Hide highlights" : "Show highlights"))
  ), React5.createElement(
    WithTooltip,
    {
      as: "div",
      hasChrome: false,
      placement: "top",
      tooltip: React5.createElement(TooltipNote, { note: allExpanded ? "Collapse all" : "Expand all" }),
      trigger: "hover"
    },
    React5.createElement(
      IconButton2,
      {
        onClick: allExpanded ? handleCollapseAll : handleExpandAll,
        "aria-label": allExpanded ? "Collapse all" : "Expand all"
      },
      allExpanded ? React5.createElement(CollapseIcon, null) : React5.createElement(ExpandAltIcon, null)
    )
  ), React5.createElement(
    WithTooltip,
    {
      as: "div",
      hasChrome: false,
      placement: "top",
      tooltip: React5.createElement(TooltipNote, { note: "Rerun the accessibility scan" }),
      trigger: "hover"
    },
    React5.createElement(IconButton2, { onClick: handleManual, "aria-label": "Rerun accessibility scan" }, React5.createElement(SyncIcon, null))
  ))), React5.createElement(ScrollArea, { vertical: true, horizontal: true }, tabs.find((t) => t.type === activeTab)?.panel));
}, "Tabs");

// src/components/TestDiscrepancyMessage.tsx
import React6, { useMemo as useMemo2 } from "react";
import { Link as Link2 } from "storybook/internal/components";
import { useStorybookApi as useStorybookApi2 } from "storybook/manager-api";
import { styled as styled4 } from "storybook/theming";
var Wrapper3 = styled4.div(({ theme: { color, typography, background } }) => ({
  textAlign: "start",
  padding: "11px 15px",
  fontSize: `${typography.size.s2}px`,
  fontWeight: typography.weight.regular,
  lineHeight: "1rem",
  background: background.app,
  borderBottom: `1px solid ${color.border}`,
  color: color.defaultText,
  backgroundClip: "padding-box",
  position: "relative",
  code: {
    fontSize: `${typography.size.s1 - 1}px`,
    color: "inherit",
    margin: "0 0.2em",
    padding: "0 0.2em",
    background: "rgba(255, 255, 255, 0.8)",
    borderRadius: "2px",
    boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.1)"
  }
}));
var TestDiscrepancyMessage = /* @__PURE__ */ __name(({ discrepancy }) => {
  const api = useStorybookApi2();
  const docsUrl = api.getDocsUrl({
    subpath: DOCUMENTATION_DISCREPANCY_LINK,
    versioned: true,
    renderer: true
  });
  const message = useMemo2(() => {
    switch (discrepancy) {
      case "browserPassedCliFailed":
        return "Accessibility checks passed in this browser but failed in the CLI.";
      case "cliPassedBrowserFailed":
        return "Accessibility checks passed in the CLI but failed in this browser.";
      case "cliFailedButModeManual":
        return "Accessibility checks failed in the CLI. Run the tests manually to see the results.";
      default:
        return null;
    }
  }, [discrepancy]);
  if (!message) {
    return null;
  }
  return React6.createElement(Wrapper3, null, message, " ", React6.createElement(Link2, { href: docsUrl, target: "_blank", withArrow: true }, "Learn what could cause this"));
}, "TestDiscrepancyMessage");

// src/components/A11YPanel.tsx
var RotatingIcon = styled5(SyncIcon2)(({ theme: theme2 }) => ({
  animation: `${theme2.animation.rotate360} 1s linear infinite;`,
  margin: 4
}));
var Tab = styled5.div({
  display: "flex",
  alignItems: "center",
  gap: 6
});
var Centered = styled5.span(({ theme: theme2 }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  fontSize: theme2.typography.size.s2,
  height: "100%",
  gap: 24,
  div: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8
  },
  p: {
    margin: 0,
    color: theme2.textMutedColor
  },
  code: {
    display: "inline-block",
    fontSize: theme2.typography.size.s2 - 1,
    backgroundColor: theme2.background.app,
    border: `1px solid ${theme2.color.border}`,
    borderRadius: 4,
    padding: "2px 3px"
  }
}));
var A11YPanel = /* @__PURE__ */ __name(() => {
  const {
    parameters,
    tab,
    results,
    status,
    handleManual,
    error,
    discrepancy,
    handleSelectionChange,
    selectedItems,
    toggleOpen
  } = useA11yContext();
  const tabs = useMemo3(() => {
    const { passes, incomplete, violations } = results ?? {
      passes: [],
      incomplete: [],
      violations: []
    };
    return [
      {
        label: React7.createElement(Tab, null, "Violations", React7.createElement(Badge2, { compact: true, status: tab === "violations" ? "active" : "neutral" }, violations.length)),
        panel: React7.createElement(
          Report,
          {
            items: violations,
            type: RuleType.VIOLATION,
            empty: "No accessibility violations found.",
            handleSelectionChange,
            selectedItems,
            toggleOpen
          }
        ),
        items: violations,
        type: RuleType.VIOLATION
      },
      {
        label: React7.createElement(Tab, null, "Passes", React7.createElement(Badge2, { compact: true, status: tab === "passes" ? "active" : "neutral" }, passes.length)),
        panel: React7.createElement(
          Report,
          {
            items: passes,
            type: RuleType.PASS,
            empty: "No passing accessibility checks found.",
            handleSelectionChange,
            selectedItems,
            toggleOpen
          }
        ),
        items: passes,
        type: RuleType.PASS
      },
      {
        label: React7.createElement(Tab, null, "Inconclusive", React7.createElement(Badge2, { compact: true, status: tab === "incomplete" ? "active" : "neutral" }, incomplete.length)),
        panel: React7.createElement(
          Report,
          {
            items: incomplete,
            type: RuleType.INCOMPLETION,
            empty: "No inconclusive accessibility checks found.",
            handleSelectionChange,
            selectedItems,
            toggleOpen
          }
        ),
        items: incomplete,
        type: RuleType.INCOMPLETION
      }
    ];
  }, [tab, results, handleSelectionChange, selectedItems, toggleOpen]);
  if (parameters.disable || parameters.test === "off") {
    return React7.createElement(Centered, null, React7.createElement("div", null, React7.createElement("strong", null, "Accessibility tests are disabled for this story"), React7.createElement("p", null, "Update", " ", React7.createElement("code", null, parameters.disable ? "parameters.a11y.disable" : "parameters.a11y.test"), " ", "to enable accessibility tests.")));
  }
  return React7.createElement(React7.Fragment, null, discrepancy && React7.createElement(TestDiscrepancyMessage, { discrepancy }), status === "ready" || status === "ran" ? React7.createElement(Tabs, { key: "tabs", tabs }) : React7.createElement(Centered, { style: { marginTop: discrepancy ? "1em" : 0 } }, status === "initial" && React7.createElement("div", null, React7.createElement(RotatingIcon, { size: 12 }), React7.createElement("strong", null, "Preparing accessibility scan"), React7.createElement("p", null, "Please wait while the addon is initializing...")), status === "manual" && React7.createElement(React7.Fragment, null, React7.createElement("div", null, React7.createElement("strong", null, "Accessibility tests run manually for this story"), React7.createElement("p", null, "Results will not show when using the testing module. You can still run accessibility tests manually.")), React7.createElement(Button2, { size: "medium", onClick: handleManual }, "Run accessibility scan"), React7.createElement("p", null, "Update ", React7.createElement("code", null, "globals.a11y.manual"), " to disable manual mode.")), status === "running" && React7.createElement("div", null, React7.createElement(RotatingIcon, { size: 12 }), React7.createElement("strong", null, "Accessibility scan in progress"), React7.createElement("p", null, "Please wait while the accessibility scan is running...")), status === "error" && React7.createElement(React7.Fragment, null, React7.createElement("div", null, React7.createElement("strong", null, "The accessibility scan encountered an error"), React7.createElement("p", null, typeof error === "string" ? error : error instanceof Error ? error.toString() : JSON.stringify(error, null, 2))), React7.createElement(Button2, { size: "medium", onClick: handleManual }, "Rerun accessibility scan")), status === "component-test-error" && React7.createElement(React7.Fragment, null, React7.createElement("div", null, React7.createElement("strong", null, "This story's component tests failed"), React7.createElement("p", null, "Automated accessibility tests will not run until this is resolved. You can still test manually.")), React7.createElement(Button2, { size: "medium", onClick: handleManual }, "Run accessibility scan"))));
}, "A11YPanel");

// src/components/VisionSimulator.tsx
import React9, { useState as useState5 } from "react";
import { IconButton as IconButton3, TooltipLinkList, WithTooltip as WithTooltip2 } from "storybook/internal/components";
import { AccessibilityIcon } from "@storybook/icons";
import { Global, styled as styled6 } from "storybook/theming";

// src/components/ColorFilters.tsx
import * as React8 from "react";
var Filters = /* @__PURE__ */ __name((props) => React8.createElement("svg", { ...props }, React8.createElement("defs", null, React8.createElement("filter", { id: "protanopia" }, React8.createElement(
  "feColorMatrix",
  {
    in: "SourceGraphic",
    type: "matrix",
    values: "0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0"
  }
)), React8.createElement("filter", { id: "protanomaly" }, React8.createElement(
  "feColorMatrix",
  {
    in: "SourceGraphic",
    type: "matrix",
    values: "0.817, 0.183, 0, 0, 0 0.333, 0.667, 0, 0, 0 0, 0.125, 0.875, 0, 0 0, 0, 0, 1, 0"
  }
)), React8.createElement("filter", { id: "deuteranopia" }, React8.createElement(
  "feColorMatrix",
  {
    in: "SourceGraphic",
    type: "matrix",
    values: "0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0"
  }
)), React8.createElement("filter", { id: "deuteranomaly" }, React8.createElement(
  "feColorMatrix",
  {
    in: "SourceGraphic",
    type: "matrix",
    values: "0.8, 0.2, 0, 0, 0 0.258, 0.742, 0, 0, 0 0, 0.142, 0.858, 0, 0 0, 0, 0, 1, 0"
  }
)), React8.createElement("filter", { id: "tritanopia" }, React8.createElement(
  "feColorMatrix",
  {
    in: "SourceGraphic",
    type: "matrix",
    values: "0.95, 0.05,  0, 0, 0 0,  0.433, 0.567, 0, 0 0,  0.475, 0.525, 0, 0 0,  0, 0, 1, 0"
  }
)), React8.createElement("filter", { id: "tritanomaly" }, React8.createElement(
  "feColorMatrix",
  {
    in: "SourceGraphic",
    type: "matrix",
    values: "0.967, 0.033, 0, 0, 0 0, 0.733, 0.267, 0, 0 0, 0.183, 0.817, 0, 0 0, 0, 0, 1, 0"
  }
)), React8.createElement("filter", { id: "achromatopsia" }, React8.createElement(
  "feColorMatrix",
  {
    in: "SourceGraphic",
    type: "matrix",
    values: "0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0, 0, 0, 1, 0"
  }
)))), "Filters");

// src/components/VisionSimulator.tsx
var iframeId = "storybook-preview-iframe";
var baseList = [
  { name: "blurred vision", percentage: 22.9 },
  { name: "deuteranomaly", percentage: 2.7 },
  { name: "deuteranopia", percentage: 0.56 },
  { name: "protanomaly", percentage: 0.66 },
  { name: "protanopia", percentage: 0.59 },
  { name: "tritanomaly", percentage: 0.01 },
  { name: "tritanopia", percentage: 0.016 },
  { name: "achromatopsia", percentage: 1e-4 },
  { name: "grayscale" }
];
var getFilter = /* @__PURE__ */ __name((filterName) => {
  if (!filterName) {
    return "none";
  }
  if (filterName === "blurred vision") {
    return "blur(2px)";
  }
  if (filterName === "grayscale") {
    return "grayscale(100%)";
  }
  return `url('#${filterName}')`;
}, "getFilter");
var Hidden = styled6.div({
  "&, & svg": {
    position: "absolute",
    width: 0,
    height: 0
  }
});
var ColorIcon = styled6.span(
  {
    background: "linear-gradient(to right, #F44336, #FF9800, #FFEB3B, #8BC34A, #2196F3, #9C27B0)",
    borderRadius: "1rem",
    display: "block",
    height: "1rem",
    width: "1rem"
  },
  ({ filter }) => ({
    filter: getFilter(filter)
  }),
  ({ theme: theme2 }) => ({
    boxShadow: `${theme2.appBorderColor} 0 0 0 1px inset`
  })
);
var Column = styled6.span({
  display: "flex",
  flexDirection: "column"
});
var Title2 = styled6.span({
  textTransform: "capitalize"
});
var Description2 = styled6.span(({ theme: theme2 }) => ({
  fontSize: 11,
  color: theme2.textMutedColor
}));
var getColorList = /* @__PURE__ */ __name((active, set) => [
  ...active !== null ? [
    {
      id: "reset",
      title: "Reset color filter",
      onClick: /* @__PURE__ */ __name(() => {
        set(null);
      }, "onClick"),
      right: void 0,
      active: false
    }
  ] : [],
  ...baseList.map((i) => {
    const description = i.percentage !== void 0 ? `${i.percentage}% of users` : void 0;
    return {
      id: i.name,
      title: React9.createElement(Column, null, React9.createElement(Title2, null, i.name), description && React9.createElement(Description2, null, description)),
      onClick: /* @__PURE__ */ __name(() => {
        set(i);
      }, "onClick"),
      right: React9.createElement(ColorIcon, { filter: i.name }),
      active: active === i
    };
  })
], "getColorList");
var VisionSimulator = /* @__PURE__ */ __name(() => {
  const [filter, setFilter] = useState5(null);
  return React9.createElement(React9.Fragment, null, filter && React9.createElement(
    Global,
    {
      styles: {
        [`#${iframeId}`]: {
          filter: getFilter(filter.name)
        }
      }
    }
  ), React9.createElement(
    WithTooltip2,
    {
      placement: "top",
      tooltip: ({ onHide }) => {
        const colorList = getColorList(filter, (i) => {
          setFilter(i);
          onHide();
        });
        return React9.createElement(TooltipLinkList, { links: colorList });
      },
      closeOnOutsideClick: true,
      onDoubleClick: () => setFilter(null)
    },
    React9.createElement(IconButton3, { key: "filter", active: !!filter, title: "Vision simulator" }, React9.createElement(AccessibilityIcon, null))
  ), React9.createElement(Hidden, null, React9.createElement(Filters, null)));
}, "VisionSimulator");

// src/manager.tsx
var Title3 = /* @__PURE__ */ __name(() => {
  const api = useStorybookApi3();
  const selectedPanel = api.getSelectedPanel();
  const [{ results }] = useAddonState2(ADDON_ID, {
    ui: {
      highlighted: false,
      tab: RuleType.VIOLATION
    },
    results: void 0,
    error: void 0,
    status: "initial"
  });
  const violationsNb = results?.violations?.length ?? 0;
  const incompleteNb = results?.incomplete?.length ?? 0;
  const count = violationsNb + incompleteNb;
  const suffix = count === 0 ? null : React10.createElement(Badge3, { compact: true, status: selectedPanel === PANEL_ID ? "active" : "neutral" }, count);
  return React10.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, React10.createElement("span", null, "Accessibility"), suffix);
}, "Title");
addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    title: "",
    type: types.TOOL,
    match: /* @__PURE__ */ __name(({ viewMode, tabId }) => viewMode === "story" && !tabId, "match"),
    render: /* @__PURE__ */ __name(() => React10.createElement(VisionSimulator, null), "render")
  });
  addons.add(PANEL_ID, {
    title: Title3,
    type: types.PANEL,
    render: /* @__PURE__ */ __name(({ active = true }) => React10.createElement(A11yContextProvider, null, active ? React10.createElement(A11YPanel, null) : null), "render"),
    paramKey: PARAM_KEY
  });
});

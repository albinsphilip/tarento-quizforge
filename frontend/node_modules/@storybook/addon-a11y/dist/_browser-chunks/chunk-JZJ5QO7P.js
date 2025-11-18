// src/constants.ts
var ADDON_ID = "storybook/a11y";
var PANEL_ID = `${ADDON_ID}/panel`;
var PARAM_KEY = `a11y`;
var UI_STATE_ID = `${ADDON_ID}/ui`;
var RESULT = `${ADDON_ID}/result`;
var REQUEST = `${ADDON_ID}/request`;
var RUNNING = `${ADDON_ID}/running`;
var ERROR = `${ADDON_ID}/error`;
var MANUAL = `${ADDON_ID}/manual`;
var SELECT = `${ADDON_ID}/select`;
var DOCUMENTATION_LINK = "writing-tests/accessibility-testing";
var DOCUMENTATION_DISCREPANCY_LINK = `${DOCUMENTATION_LINK}#why-are-my-tests-failing-in-different-environments`;
var EVENTS = { RESULT, REQUEST, RUNNING, ERROR, MANUAL, SELECT };
var STATUS_TYPE_ID_COMPONENT_TEST = "storybook/component-test";
var STATUS_TYPE_ID_A11Y = "storybook/a11y";

export {
  ADDON_ID,
  PANEL_ID,
  PARAM_KEY,
  DOCUMENTATION_DISCREPANCY_LINK,
  EVENTS,
  STATUS_TYPE_ID_COMPONENT_TEST,
  STATUS_TYPE_ID_A11Y
};

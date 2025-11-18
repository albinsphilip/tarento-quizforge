// ../../core/src/component-testing/constants.ts
var ADDON_ID = "storybook/interactions";
var PANEL_ID = `${ADDON_ID}/panel`;
var DOCUMENTATION_LINK = "writing-tests/integrations/vitest-addon";
var DOCUMENTATION_DISCREPANCY_LINK = `${DOCUMENTATION_LINK}#what-happens-when-there-are-different-test-results-in-multiple-environments`;

// ../a11y/src/constants.ts
var ADDON_ID2 = "storybook/a11y";
var PANEL_ID2 = `${ADDON_ID2}/panel`;
var UI_STATE_ID = `${ADDON_ID2}/ui`;
var RESULT = `${ADDON_ID2}/result`;
var REQUEST = `${ADDON_ID2}/request`;
var RUNNING = `${ADDON_ID2}/running`;
var ERROR = `${ADDON_ID2}/error`;
var MANUAL = `${ADDON_ID2}/manual`;
var SELECT = `${ADDON_ID2}/select`;
var DOCUMENTATION_LINK2 = "writing-tests/accessibility-testing";
var DOCUMENTATION_DISCREPANCY_LINK2 = `${DOCUMENTATION_LINK2}#why-are-my-tests-failing-in-different-environments`;

// src/constants.ts
var ADDON_ID3 = "storybook/test";
var TEST_PROVIDER_ID = `${ADDON_ID3}/test-provider`;
var DOCUMENTATION_LINK3 = "writing-tests/integrations/vitest-addon";
var DOCUMENTATION_FATAL_ERROR_LINK = `${DOCUMENTATION_LINK3}#what-happens-if-vitest-itself-has-an-error`;
var storeOptions = {
  id: ADDON_ID3,
  initialState: {
    config: {
      coverage: false,
      a11y: false
    },
    watching: false,
    cancelling: false,
    fatalError: void 0,
    indexUrl: void 0,
    previewAnnotations: [],
    currentRun: {
      triggeredBy: void 0,
      config: {
        coverage: false,
        a11y: false
      },
      componentTestCount: {
        success: 0,
        error: 0
      },
      a11yCount: {
        success: 0,
        warning: 0,
        error: 0
      },
      storyIds: void 0,
      totalTestCount: void 0,
      startedAt: void 0,
      finishedAt: void 0,
      unhandledErrors: [],
      coverageSummary: void 0
    }
  }
};
var FULL_RUN_TRIGGERS = ["global", "run-all"];
var STORE_CHANNEL_EVENT_NAME = `UNIVERSAL_STORE:${storeOptions.id}`;
var STATUS_TYPE_ID_COMPONENT_TEST = "storybook/component-test";
var STATUS_TYPE_ID_A11Y = "storybook/a11y";

export {
  PANEL_ID,
  ADDON_ID2 as ADDON_ID,
  PANEL_ID2,
  ADDON_ID3 as ADDON_ID2,
  TEST_PROVIDER_ID,
  DOCUMENTATION_FATAL_ERROR_LINK,
  storeOptions,
  FULL_RUN_TRIGGERS,
  STATUS_TYPE_ID_COMPONENT_TEST,
  STATUS_TYPE_ID_A11Y
};

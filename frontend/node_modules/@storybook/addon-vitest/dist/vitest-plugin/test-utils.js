import {
  __name
} from "../_browser-chunks/chunk-JK72E6FR.js";

// src/vitest-plugin/test-utils.ts
import { getStoryChildren, isStory } from "storybook/internal/csf";
import { server } from "@vitest/browser/context";
import { composeStory, getCsfFactoryAnnotations } from "storybook/preview-api";

// src/vitest-plugin/viewports.ts
import { UnsupportedViewportDimensionError } from "storybook/internal/preview-errors";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
var DEFAULT_VIEWPORT_DIMENSIONS = {
  width: 1200,
  height: 900
};
var validPixelOrNumber = /^\d+(px)?$/;
var percentagePattern = /^(\d+(\.\d+)?%)$/;
var vwPattern = /^(\d+(\.\d+)?vw)$/;
var vhPattern = /^(\d+(\.\d+)?vh)$/;
var emRemPattern = /^(\d+)(em|rem)$/;
var parseDimension = /* @__PURE__ */ __name((value, dimension) => {
  if (validPixelOrNumber.test(value)) {
    return Number.parseInt(value, 10);
  } else if (percentagePattern.test(value)) {
    const percentageValue = parseFloat(value) / 100;
    return Math.round(DEFAULT_VIEWPORT_DIMENSIONS[dimension] * percentageValue);
  } else if (vwPattern.test(value)) {
    const vwValue = parseFloat(value) / 100;
    return Math.round(DEFAULT_VIEWPORT_DIMENSIONS.width * vwValue);
  } else if (vhPattern.test(value)) {
    const vhValue = parseFloat(value) / 100;
    return Math.round(DEFAULT_VIEWPORT_DIMENSIONS.height * vhValue);
  } else if (emRemPattern.test(value)) {
    const emRemValue = Number.parseInt(value, 10);
    return emRemValue * 16;
  } else {
    throw new UnsupportedViewportDimensionError({ dimension, value });
  }
}, "parseDimension");
var setViewport = /* @__PURE__ */ __name(async (parameters = {}, globals = {}) => {
  let defaultViewport;
  const viewportsParam = parameters.viewport ?? {};
  const viewportsGlobal = globals.viewport ?? {};
  const isDisabled = viewportsParam.disable || viewportsParam.disabled;
  if (viewportsGlobal.value && !isDisabled) {
    defaultViewport = viewportsGlobal.value;
  } else if (!isDisabled) {
    defaultViewport = viewportsParam.defaultViewport;
  }
  const { page } = await import("@vitest/browser/context").catch(() => ({
    page: null
  }));
  if (!page || !globalThis.__vitest_browser__) {
    return;
  }
  const options = {
    ...MINIMAL_VIEWPORTS,
    ...viewportsParam.viewports,
    ...viewportsParam.options
  };
  let viewportWidth = DEFAULT_VIEWPORT_DIMENSIONS.width;
  let viewportHeight = DEFAULT_VIEWPORT_DIMENSIONS.height;
  if (defaultViewport && defaultViewport in options) {
    const { styles } = options[defaultViewport];
    if (styles?.width && styles?.height) {
      const { width, height } = styles;
      viewportWidth = parseDimension(width, "width");
      viewportHeight = parseDimension(height, "height");
    }
  }
  await page.viewport(viewportWidth, viewportHeight);
}, "setViewport");

// src/vitest-plugin/test-utils.ts
var { getInitialGlobals } = server.commands;
var convertToFilePath = /* @__PURE__ */ __name((url) => {
  const path = url.replace(/^file:\/\//, "");
  const normalizedPath = path.replace(/^\/+([a-zA-Z]:)/, "$1");
  return normalizedPath.replace(/%20/g, " ");
}, "convertToFilePath");
var testStory = /* @__PURE__ */ __name((exportName, story, meta, skipTags, storyId, testName) => {
  return async (context) => {
    const annotations = getCsfFactoryAnnotations(story, meta);
    const test = isStory(story) && testName ? getStoryChildren(story).find((child) => child.input.name === testName) : void 0;
    const storyAnnotations = test ? test.input : annotations.story;
    const composedStory = composeStory(
      storyAnnotations,
      annotations.meta,
      { initialGlobals: await getInitialGlobals?.() ?? {} },
      annotations.preview ?? globalThis.globalProjectAnnotations,
      exportName
    );
    if (composedStory === void 0 || skipTags?.some((tag) => composedStory.tags.includes(tag))) {
      context.skip();
    }
    context.story = composedStory;
    const _task = context.task;
    _task.meta.storyId = storyId;
    await setViewport(composedStory.parameters, composedStory.globals);
    await composedStory.run(void 0);
    _task.meta.reports = composedStory.reporting.reports;
  };
}, "testStory");
export {
  convertToFilePath,
  testStory
};

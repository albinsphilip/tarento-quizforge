import {
  PANEL_ID
} from "../_browser-chunks/chunk-CAYLRBRX.js";
import {
  __name
} from "../_browser-chunks/chunk-JK72E6FR.js";

// src/vitest-plugin/setup-file.ts
import { afterEach, beforeAll, vi } from "vitest";
import { Channel } from "storybook/internal/channels";
var transport = { setHandler: vi.fn(), send: vi.fn() };
globalThis.__STORYBOOK_ADDONS_CHANNEL__ ??= new Channel({ transport });
var modifyErrorMessage = /* @__PURE__ */ __name(({ task }) => {
  const meta = task.meta;
  if (task.type === "test" && task.result?.state === "fail" && meta.storyId && task.result.errors?.[0]) {
    const currentError = task.result.errors[0];
    const storybookUrl = import.meta.env.__STORYBOOK_URL__;
    const storyUrl = `${storybookUrl}/?path=/story/${meta.storyId}&addonPanel=${PANEL_ID}`;
    currentError.message = `
\x1B[34mClick to debug the error directly in Storybook: ${storyUrl}\x1B[39m

${currentError.message}`;
  }
}, "modifyErrorMessage");
beforeAll(() => {
  if (globalThis.globalProjectAnnotations) {
    return globalThis.globalProjectAnnotations.beforeAll();
  }
});
afterEach(modifyErrorMessage);
export {
  modifyErrorMessage
};

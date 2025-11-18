import {
  EVENTS,
  PANEL_ID
} from "./chunk-JZJ5QO7P.js";
import {
  __export,
  __name
} from "./chunk-JFJ5UJ7Q.js";

// src/preview.tsx
var preview_exports = {};
__export(preview_exports, {
  afterEach: () => afterEach,
  initialGlobals: () => initialGlobals,
  parameters: () => parameters
});
import { expect } from "storybook/test";

// src/a11yRunner.ts
import { ElementA11yParameterError } from "storybook/internal/preview-errors";
import { global as global2 } from "@storybook/global";
import { addons, waitForAnimations } from "storybook/preview-api";

// src/a11yRunnerUtils.ts
import { global } from "@storybook/global";
var { document } = global;
var withLinkPaths = /* @__PURE__ */ __name((results, storyId) => {
  const pathname = document.location.pathname.replace(/iframe\.html$/, "");
  const enhancedResults = { ...results };
  const propertiesToAugment = ["incomplete", "passes", "violations"];
  propertiesToAugment.forEach((key) => {
    if (Array.isArray(results[key])) {
      enhancedResults[key] = results[key].map((result) => ({
        ...result,
        nodes: result.nodes.map((node, index) => {
          const id = `${key}.${result.id}.${index + 1}`;
          const linkPath = `${pathname}?path=/story/${storyId}&addonPanel=${PANEL_ID}&a11ySelection=${id}`;
          return { id, ...node, linkPath };
        })
      }));
    }
  });
  return enhancedResults;
}, "withLinkPaths");

// src/a11yRunner.ts
var { document: document2 } = global2;
var channel = addons.getChannel();
var DEFAULT_PARAMETERS = { config: {}, options: {} };
var DISABLED_RULES = [
  // In component testing, landmarks are not always present
  // and the rule check can cause false positives
  "region"
];
var queue = [];
var isRunning = false;
var runNext = /* @__PURE__ */ __name(async () => {
  if (queue.length === 0) {
    isRunning = false;
    return;
  }
  isRunning = true;
  const next = queue.shift();
  if (next) {
    await next();
  }
  runNext();
}, "runNext");
var run = /* @__PURE__ */ __name(async (input = DEFAULT_PARAMETERS, storyId) => {
  const axeCore = await import("axe-core");
  const axe = axeCore?.default || globalThis.axe;
  const { config = {}, options = {} } = input;
  if (input.element) {
    throw new ElementA11yParameterError();
  }
  const context = {
    include: document2?.body,
    exclude: [".sb-wrapper", "#storybook-docs", "#storybook-highlights-root"]
    // Internal Storybook elements that are always in the document
  };
  if (input.context) {
    const hasInclude = typeof input.context === "object" && "include" in input.context && input.context.include !== void 0;
    const hasExclude = typeof input.context === "object" && "exclude" in input.context && input.context.exclude !== void 0;
    if (hasInclude) {
      context.include = input.context.include;
    } else if (!hasInclude && !hasExclude) {
      context.include = input.context;
    }
    if (hasExclude) {
      context.exclude = context.exclude.concat(input.context.exclude);
    }
  }
  axe.reset();
  const configWithDefault = {
    ...config,
    rules: [...DISABLED_RULES.map((id) => ({ id, enabled: false })), ...config?.rules ?? []]
  };
  axe.configure(configWithDefault);
  return new Promise((resolve, reject) => {
    const highlightsRoot = document2?.getElementById("storybook-highlights-root");
    if (highlightsRoot) {
      highlightsRoot.style.display = "none";
    }
    const task = /* @__PURE__ */ __name(async () => {
      try {
        const result = await axe.run(context, options);
        const resultWithLinks = withLinkPaths(result, storyId);
        resolve(resultWithLinks);
      } catch (error) {
        reject(error);
      }
    }, "task");
    queue.push(task);
    if (!isRunning) {
      runNext();
    }
    if (highlightsRoot) {
      highlightsRoot.style.display = "";
    }
  });
}, "run");
channel.on(EVENTS.MANUAL, async (storyId, input = DEFAULT_PARAMETERS) => {
  try {
    await waitForAnimations();
    const result = await run(input, storyId);
    const resultJson = JSON.parse(JSON.stringify(result));
    channel.emit(EVENTS.RESULT, resultJson, storyId);
  } catch (error) {
    channel.emit(EVENTS.ERROR, error);
  }
});

// src/utils.ts
function getIsVitestStandaloneRun() {
  try {
    return import.meta.env.VITEST_STORYBOOK === "false";
  } catch (e) {
    return false;
  }
}
__name(getIsVitestStandaloneRun, "getIsVitestStandaloneRun");

// src/preview.tsx
var vitestMatchersExtended = false;
var afterEach = /* @__PURE__ */ __name(async ({
  id: storyId,
  reporting,
  parameters: parameters2,
  globals,
  viewMode
}) => {
  const a11yParameter = parameters2.a11y;
  const a11yGlobals = globals.a11y;
  const shouldRunEnvironmentIndependent = a11yParameter?.disable !== true && a11yParameter?.test !== "off" && a11yGlobals?.manual !== true;
  const getMode = /* @__PURE__ */ __name(() => {
    switch (a11yParameter?.test) {
      case "todo":
        return "warning";
      case "error":
      default:
        return "failed";
    }
  }, "getMode");
  if (shouldRunEnvironmentIndependent && viewMode === "story") {
    try {
      const result = await run(a11yParameter, storyId);
      if (result) {
        const hasViolations = (result?.violations.length ?? 0) > 0;
        reporting.addReport({
          type: "a11y",
          version: 1,
          result,
          status: hasViolations ? getMode() : "passed"
        });
        if (getIsVitestStandaloneRun()) {
          if (hasViolations && getMode() === "failed") {
            if (!vitestMatchersExtended) {
              const { toHaveNoViolations } = await import("./matchers-ZRZBO4XZ.js");
              expect.extend({ toHaveNoViolations });
              vitestMatchersExtended = true;
            }
            expect(result).toHaveNoViolations();
          }
        }
      }
    } catch (e) {
      reporting.addReport({
        type: "a11y",
        version: 1,
        result: {
          error: e
        },
        status: "failed"
      });
      if (getIsVitestStandaloneRun()) {
        throw e;
      }
    }
  }
}, "afterEach");
var initialGlobals = {
  a11y: {
    manual: false
  }
};
var parameters = {
  a11y: {
    test: "todo"
  }
};

export {
  afterEach,
  initialGlobals,
  parameters,
  preview_exports
};

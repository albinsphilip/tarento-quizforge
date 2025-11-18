import {
  ADDON_ID,
  ADDON_ID2,
  DOCUMENTATION_FATAL_ERROR_LINK,
  FULL_RUN_TRIGGERS,
  PANEL_ID,
  PANEL_ID2,
  STATUS_TYPE_ID_A11Y,
  STATUS_TYPE_ID_COMPONENT_TEST,
  TEST_PROVIDER_ID,
  storeOptions
} from "./_browser-chunks/chunk-CAYLRBRX.js";
import {
  __name
} from "./_browser-chunks/chunk-JK72E6FR.js";

// src/manager.tsx
import React5, { useState as useState3 } from "react";
import { Addon_TypesEnum } from "storybook/internal/types";

// src/manager-store.ts
import {
  experimental_UniversalStore,
  experimental_getStatusStore,
  experimental_getTestProviderStore
} from "storybook/manager-api";
var store = experimental_UniversalStore.create({
  ...storeOptions,
  leader: globalThis.CONFIG_TYPE === "PRODUCTION"
});
var componentTestStatusStore = experimental_getStatusStore(STATUS_TYPE_ID_COMPONENT_TEST);
var a11yStatusStore = experimental_getStatusStore(STATUS_TYPE_ID_A11Y);
var testProviderStore = experimental_getTestProviderStore(ADDON_ID2);

// src/manager.tsx
import { addons as addons2 } from "storybook/manager-api";

// src/components/GlobalErrorModal.tsx
import React, { useContext } from "react";
import { Button, IconButton, Modal } from "storybook/internal/components";
import { CloseIcon, SyncIcon } from "@storybook/icons";
import { useStorybookApi } from "storybook/manager-api";
import { styled } from "storybook/theming";
var ModalBar = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "6px 6px 6px 20px"
});
var ModalActionBar = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
});
var ModalTitle = styled(Modal.Title)(({ theme: { typography } }) => ({
  fontSize: typography.size.s2,
  fontWeight: typography.weight.bold
}));
var ModalStackTrace = styled.pre(({ theme }) => ({
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
  overflow: "auto",
  maxHeight: "60vh",
  margin: 0,
  padding: `20px`,
  fontFamily: theme.typography.fonts.mono,
  fontSize: "12px",
  borderTop: `1px solid ${theme.appBorderColor}`,
  borderRadius: 0
}));
var TroubleshootLink = styled.a(({ theme }) => ({
  color: theme.color.defaultText
}));
var GlobalErrorContext = React.createContext({
  isModalOpen: false,
  setModalOpen: void 0
});
function ErrorCause({ error }) {
  if (!error) {
    return null;
  }
  return React.createElement("div", null, React.createElement("h4", null, "Caused by: ", error.name || "Error", ": ", error.message), error.stack && React.createElement("pre", null, error.stack), error.cause && React.createElement(ErrorCause, { error: error.cause }));
}
__name(ErrorCause, "ErrorCause");
function GlobalErrorModal({ onRerun, storeState }) {
  const api = useStorybookApi();
  const { isModalOpen, setModalOpen } = useContext(GlobalErrorContext);
  const handleClose = /* @__PURE__ */ __name(() => setModalOpen?.(false), "handleClose");
  const troubleshootURL = api.getDocsUrl({
    subpath: DOCUMENTATION_FATAL_ERROR_LINK,
    versioned: true,
    renderer: true
  });
  const {
    fatalError,
    currentRun: { unhandledErrors }
  } = storeState;
  const content = fatalError ? React.createElement(React.Fragment, null, React.createElement("p", null, fatalError.error.name || "Error"), fatalError.message && React.createElement("p", null, fatalError.message), fatalError.error.message && React.createElement("p", null, fatalError.error.message), fatalError.error.stack && React.createElement("p", null, fatalError.error.stack), fatalError.error.cause && React.createElement(ErrorCause, { error: fatalError.error.cause })) : unhandledErrors.length > 0 ? React.createElement("ol", null, unhandledErrors.map((error) => React.createElement("li", { key: error.name + error.message }, React.createElement("p", null, error.name, ": ", error.message), error.VITEST_TEST_PATH && React.createElement("p", null, 'This error originated in "', React.createElement("b", null, error.VITEST_TEST_PATH), `". It doesn't mean the error was thrown inside the file itself, but while it was running.`), error.VITEST_TEST_NAME && React.createElement(React.Fragment, null, React.createElement("p", null, `The latest test that might've caused the error is "`, React.createElement("b", null, error.VITEST_TEST_NAME), '". It might mean one of the following:'), React.createElement("ul", null, React.createElement("li", null, "The error was thrown, while Vitest was running this test."), React.createElement("li", null, "If the error occurred after the test had been completed, this was the last documented test before it was thrown."))), error.stacks && React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("b", null, "Stacks:")), React.createElement("ul", null, error.stacks.map((stack) => React.createElement("li", { key: stack.file + stack.line + stack.column }, stack.file, ":", stack.line, ":", stack.column, " - ", stack.method || "unknown method")))), error.stack && React.createElement("p", null, error.stack), error.cause ? React.createElement(ErrorCause, { error: error.cause }) : null))) : null;
  return React.createElement(Modal, { onEscapeKeyDown: handleClose, onInteractOutside: handleClose, open: isModalOpen }, React.createElement(ModalBar, null, React.createElement(ModalTitle, null, "Storybook Tests error details"), React.createElement(ModalActionBar, null, React.createElement(Button, { onClick: onRerun, variant: "ghost" }, React.createElement(SyncIcon, null), "Rerun"), React.createElement(Button, { variant: "ghost", asChild: true }, React.createElement("a", { target: "_blank", href: troubleshootURL, rel: "noreferrer" }, "Troubleshoot")), React.createElement(IconButton, { onClick: handleClose, "aria-label": "Close modal" }, React.createElement(CloseIcon, null)))), React.createElement(ModalStackTrace, null, content, React.createElement("br", null), React.createElement("br", null), "Troubleshoot:", " ", React.createElement(TroubleshootLink, { target: "_blank", href: troubleshootURL }, troubleshootURL)));
}
__name(GlobalErrorModal, "GlobalErrorModal");

// src/components/SidebarContextMenu.tsx
import React4 from "react";

// src/use-test-provider-state.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ../../node_modules/es-toolkit/dist/predicate/isPlainObject.mjs
function isPlainObject(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  const hasObjectPrototype = proto === null || proto === Object.prototype || Object.getPrototypeOf(proto) === null;
  if (!hasObjectPrototype) {
    return false;
  }
  return Object.prototype.toString.call(value) === "[object Object]";
}
__name(isPlainObject, "isPlainObject");

// ../../node_modules/es-toolkit/dist/compat/_internal/getSymbols.mjs
function getSymbols(object) {
  return Object.getOwnPropertySymbols(object).filter((symbol) => Object.prototype.propertyIsEnumerable.call(object, symbol));
}
__name(getSymbols, "getSymbols");

// ../../node_modules/es-toolkit/dist/compat/_internal/getTag.mjs
function getTag(value) {
  if (value == null) {
    return value === void 0 ? "[object Undefined]" : "[object Null]";
  }
  return Object.prototype.toString.call(value);
}
__name(getTag, "getTag");

// ../../node_modules/es-toolkit/dist/compat/_internal/tags.mjs
var regexpTag = "[object RegExp]";
var stringTag = "[object String]";
var numberTag = "[object Number]";
var booleanTag = "[object Boolean]";
var argumentsTag = "[object Arguments]";
var symbolTag = "[object Symbol]";
var dateTag = "[object Date]";
var mapTag = "[object Map]";
var setTag = "[object Set]";
var arrayTag = "[object Array]";
var functionTag = "[object Function]";
var arrayBufferTag = "[object ArrayBuffer]";
var objectTag = "[object Object]";
var errorTag = "[object Error]";
var dataViewTag = "[object DataView]";
var uint8ArrayTag = "[object Uint8Array]";
var uint8ClampedArrayTag = "[object Uint8ClampedArray]";
var uint16ArrayTag = "[object Uint16Array]";
var uint32ArrayTag = "[object Uint32Array]";
var bigUint64ArrayTag = "[object BigUint64Array]";
var int8ArrayTag = "[object Int8Array]";
var int16ArrayTag = "[object Int16Array]";
var int32ArrayTag = "[object Int32Array]";
var bigInt64ArrayTag = "[object BigInt64Array]";
var float32ArrayTag = "[object Float32Array]";
var float64ArrayTag = "[object Float64Array]";

// ../../node_modules/es-toolkit/dist/compat/util/eq.mjs
function eq(value, other) {
  return value === other || Number.isNaN(value) && Number.isNaN(other);
}
__name(eq, "eq");

// ../../node_modules/es-toolkit/dist/predicate/isEqualWith.mjs
function isEqualWith(a, b, areValuesEqual) {
  return isEqualWithImpl(a, b, void 0, void 0, void 0, void 0, areValuesEqual);
}
__name(isEqualWith, "isEqualWith");
function isEqualWithImpl(a, b, property, aParent, bParent, stack, areValuesEqual) {
  const result = areValuesEqual(a, b, property, aParent, bParent, stack);
  if (result !== void 0) {
    return result;
  }
  if (typeof a === typeof b) {
    switch (typeof a) {
      case "bigint":
      case "string":
      case "boolean":
      case "symbol":
      case "undefined": {
        return a === b;
      }
      case "number": {
        return a === b || Object.is(a, b);
      }
      case "function": {
        return a === b;
      }
      case "object": {
        return areObjectsEqual(a, b, stack, areValuesEqual);
      }
    }
  }
  return areObjectsEqual(a, b, stack, areValuesEqual);
}
__name(isEqualWithImpl, "isEqualWithImpl");
function areObjectsEqual(a, b, stack, areValuesEqual) {
  if (Object.is(a, b)) {
    return true;
  }
  let aTag = getTag(a);
  let bTag = getTag(b);
  if (aTag === argumentsTag) {
    aTag = objectTag;
  }
  if (bTag === argumentsTag) {
    bTag = objectTag;
  }
  if (aTag !== bTag) {
    return false;
  }
  switch (aTag) {
    case stringTag:
      return a.toString() === b.toString();
    case numberTag: {
      const x = a.valueOf();
      const y = b.valueOf();
      return eq(x, y);
    }
    case booleanTag:
    case dateTag:
    case symbolTag:
      return Object.is(a.valueOf(), b.valueOf());
    case regexpTag: {
      return a.source === b.source && a.flags === b.flags;
    }
    case functionTag: {
      return a === b;
    }
  }
  stack = stack ?? /* @__PURE__ */ new Map();
  const aStack = stack.get(a);
  const bStack = stack.get(b);
  if (aStack != null && bStack != null) {
    return aStack === b;
  }
  stack.set(a, b);
  stack.set(b, a);
  try {
    switch (aTag) {
      case mapTag: {
        if (a.size !== b.size) {
          return false;
        }
        for (const [key, value] of a.entries()) {
          if (!b.has(key) || !isEqualWithImpl(value, b.get(key), key, a, b, stack, areValuesEqual)) {
            return false;
          }
        }
        return true;
      }
      case setTag: {
        if (a.size !== b.size) {
          return false;
        }
        const aValues = Array.from(a.values());
        const bValues = Array.from(b.values());
        for (let i = 0; i < aValues.length; i++) {
          const aValue = aValues[i];
          const index = bValues.findIndex((bValue) => {
            return isEqualWithImpl(aValue, bValue, void 0, a, b, stack, areValuesEqual);
          });
          if (index === -1) {
            return false;
          }
          bValues.splice(index, 1);
        }
        return true;
      }
      case arrayTag:
      case uint8ArrayTag:
      case uint8ClampedArrayTag:
      case uint16ArrayTag:
      case uint32ArrayTag:
      case bigUint64ArrayTag:
      case int8ArrayTag:
      case int16ArrayTag:
      case int32ArrayTag:
      case bigInt64ArrayTag:
      case float32ArrayTag:
      case float64ArrayTag: {
        if (typeof Buffer !== "undefined" && Buffer.isBuffer(a) !== Buffer.isBuffer(b)) {
          return false;
        }
        if (a.length !== b.length) {
          return false;
        }
        for (let i = 0; i < a.length; i++) {
          if (!isEqualWithImpl(a[i], b[i], i, a, b, stack, areValuesEqual)) {
            return false;
          }
        }
        return true;
      }
      case arrayBufferTag: {
        if (a.byteLength !== b.byteLength) {
          return false;
        }
        return areObjectsEqual(new Uint8Array(a), new Uint8Array(b), stack, areValuesEqual);
      }
      case dataViewTag: {
        if (a.byteLength !== b.byteLength || a.byteOffset !== b.byteOffset) {
          return false;
        }
        return areObjectsEqual(new Uint8Array(a), new Uint8Array(b), stack, areValuesEqual);
      }
      case errorTag: {
        return a.name === b.name && a.message === b.message;
      }
      case objectTag: {
        const areEqualInstances = areObjectsEqual(a.constructor, b.constructor, stack, areValuesEqual) || isPlainObject(a) && isPlainObject(b);
        if (!areEqualInstances) {
          return false;
        }
        const aKeys = [...Object.keys(a), ...getSymbols(a)];
        const bKeys = [...Object.keys(b), ...getSymbols(b)];
        if (aKeys.length !== bKeys.length) {
          return false;
        }
        for (let i = 0; i < aKeys.length; i++) {
          const propKey = aKeys[i];
          const aProp = a[propKey];
          if (!Object.hasOwn(b, propKey)) {
            return false;
          }
          const bProp = b[propKey];
          if (!isEqualWithImpl(aProp, bProp, propKey, a, b, stack, areValuesEqual)) {
            return false;
          }
        }
        return true;
      }
      default: {
        return false;
      }
    }
  } finally {
    stack.delete(a);
    stack.delete(b);
  }
}
__name(areObjectsEqual, "areObjectsEqual");

// ../../node_modules/es-toolkit/dist/function/noop.mjs
function noop() {
}
__name(noop, "noop");

// ../../node_modules/es-toolkit/dist/predicate/isEqual.mjs
function isEqual(a, b) {
  return isEqualWith(a, b, noop);
}
__name(isEqual, "isEqual");

// src/use-test-provider-state.ts
import {
  experimental_useStatusStore,
  experimental_useTestProviderStore,
  experimental_useUniversalStore
} from "storybook/manager-api";
var statusValueToStoryIds = /* @__PURE__ */ __name((allStatuses, typeId, storyIds) => {
  const statusValueToStoryIdsMap = {
    "status-value:pending": [],
    "status-value:success": [],
    "status-value:error": [],
    "status-value:warning": [],
    "status-value:unknown": []
  };
  const stories = storyIds ? storyIds.map((storyId) => allStatuses[storyId]).filter(Boolean) : Object.values(allStatuses);
  stories.forEach((statusByTypeId) => {
    const status = statusByTypeId[typeId];
    if (!status) {
      return;
    }
    statusValueToStoryIdsMap[status.value].push(status.storyId);
  });
  return statusValueToStoryIdsMap;
}, "statusValueToStoryIds");
var useTestProvider = /* @__PURE__ */ __name((api, entryId) => {
  const testProviderState = experimental_useTestProviderStore((s) => s[ADDON_ID2]);
  const [storeState, setStoreState] = experimental_useUniversalStore(store);
  const [isSettingsUpdated, setIsSettingsUpdated] = useState(false);
  const settingsUpdatedTimeoutRef = useRef();
  useEffect(() => {
    const unsubscribe = store.onStateChange((state, previousState) => {
      if (!isEqual(state.config, previousState.config)) {
        testProviderStore.settingsChanged();
        setIsSettingsUpdated(true);
        clearTimeout(settingsUpdatedTimeoutRef.current);
        settingsUpdatedTimeoutRef.current = setTimeout(() => {
          setIsSettingsUpdated(false);
        }, 1e3);
      }
    });
    return () => {
      unsubscribe();
      clearTimeout(settingsUpdatedTimeoutRef.current);
    };
  }, []);
  const storyIds = useMemo(
    () => entryId ? api.findAllLeafStoryIds(entryId) : void 0,
    [entryId, api]
  );
  const componentTestStatusSelector = useCallback(
    (allStatuses) => statusValueToStoryIds(allStatuses, STATUS_TYPE_ID_COMPONENT_TEST, storyIds),
    [storyIds]
  );
  const componentTestStatusValueToStoryIds = experimental_useStatusStore(
    componentTestStatusSelector
  );
  const a11yStatusValueToStoryIdsSelector = useCallback(
    (allStatuses) => statusValueToStoryIds(allStatuses, STATUS_TYPE_ID_A11Y, storyIds),
    [storyIds]
  );
  const a11yStatusValueToStoryIds = experimental_useStatusStore(a11yStatusValueToStoryIdsSelector);
  return {
    storeState,
    setStoreState,
    testProviderState,
    componentTestStatusValueToStoryIds,
    a11yStatusValueToStoryIds,
    isSettingsUpdated
  };
}, "useTestProvider");

// src/components/TestProviderRender.tsx
import React3 from "react";
import {
  Form,
  IconButton as IconButton2,
  ListItem,
  ProgressSpinner,
  TooltipNote,
  WithTooltip
} from "storybook/internal/components";
import { EyeIcon, InfoIcon, PlayHollowIcon, StopAltIcon } from "@storybook/icons";
import { addons } from "storybook/manager-api";
import { styled as styled4 } from "storybook/theming";

// src/components/Description.tsx
import React2 from "react";
import { Link as LinkComponent } from "storybook/internal/components";
import { styled as styled2 } from "storybook/theming";

// src/components/RelativeTime.tsx
import { useEffect as useEffect2, useState as useState2 } from "react";
var RelativeTime = /* @__PURE__ */ __name(({ timestamp }) => {
  const [timeAgo, setTimeAgo] = useState2(null);
  useEffect2(() => {
    if (timestamp) {
      setTimeAgo(Date.now() - timestamp);
      const interval = setInterval(() => setTimeAgo(Date.now() - timestamp), 1e4);
      return () => clearInterval(interval);
    }
  }, [timestamp]);
  if (timeAgo === null) {
    return null;
  }
  const seconds = Math.round(timeAgo / 1e3);
  if (seconds < 60) {
    return `just now`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? `a minute ago` : `${minutes} minutes ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? `an hour ago` : `${hours} hours ago`;
  }
  const days = Math.floor(hours / 24);
  return days === 1 ? `yesterday` : `${days} days ago`;
}, "RelativeTime");

// src/components/Description.tsx
var Wrapper = styled2.div(({ theme }) => ({
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  fontSize: theme.typography.size.s1,
  color: theme.textMutedColor
}));
var PositiveText = styled2.span(({ theme }) => ({
  color: theme.color.positiveText
}));
function Description({
  entryId,
  storeState,
  testProviderState,
  isSettingsUpdated,
  ...props
}) {
  const { setModalOpen } = React2.useContext(GlobalErrorContext);
  const { componentTestCount, totalTestCount, unhandledErrors, finishedAt } = storeState.currentRun;
  const finishedTestCount = componentTestCount.success + componentTestCount.error;
  let description = "Not run";
  if (!entryId && isSettingsUpdated) {
    description = React2.createElement(PositiveText, null, "Settings updated");
  } else if (testProviderState === "test-provider-state:running") {
    description = (finishedTestCount ?? 0) === 0 ? "Starting..." : `Testing... ${finishedTestCount}/${totalTestCount}`;
  } else if (!entryId && testProviderState === "test-provider-state:crashed") {
    description = setModalOpen ? React2.createElement(LinkComponent, { isButton: true, onClick: () => setModalOpen(true) }, "View full error") : "Crashed";
  } else if (!entryId && unhandledErrors.length > 0) {
    const unhandledErrorDescription = `View ${unhandledErrors.length} unhandled error${unhandledErrors?.length > 1 ? "s" : ""}`;
    description = setModalOpen ? React2.createElement(LinkComponent, { isButton: true, onClick: () => setModalOpen(true) }, unhandledErrorDescription) : unhandledErrorDescription;
  } else if (entryId && totalTestCount) {
    description = `Ran ${totalTestCount} ${totalTestCount === 1 ? "test" : "tests"}`;
  } else if (finishedAt) {
    description = React2.createElement(React2.Fragment, null, "Ran ", totalTestCount, " ", totalTestCount === 1 ? "test" : "tests", " ", React2.createElement(RelativeTime, { timestamp: finishedAt }));
  } else if (storeState.watching) {
    description = "Watching for file changes";
  }
  return React2.createElement(Wrapper, { ...props }, description);
}
__name(Description, "Description");

// src/components/TestStatusIcon.tsx
import { styled as styled3 } from "storybook/theming";
var TestStatusIcon = styled3.div(
  ({ percentage }) => ({
    width: percentage ? 12 : 6,
    height: percentage ? 12 : 6,
    margin: percentage ? 1 : 4,
    background: percentage ? `conic-gradient(var(--status-color) ${percentage}%, var(--status-background) ${percentage + 1}%)` : "var(--status-color)",
    borderRadius: "50%"
  }),
  ({ isRunning, theme }) => isRunning && {
    animation: `${theme.animation.glow} 1.5s ease-in-out infinite`
  },
  ({ status, theme }) => status === "positive" && {
    "--status-color": theme.color.positive,
    "--status-background": `${theme.color.positive}66`
  },
  ({ status, theme }) => status === "warning" && {
    "--status-color": theme.color.gold,
    "--status-background": `${theme.color.gold}66`
  },
  ({ status, theme }) => status === "negative" && {
    "--status-color": theme.color.negative,
    "--status-background": `${theme.color.negative}66`
  },
  ({ status, theme }) => status === "critical" && {
    "--status-color": theme.color.defaultText,
    "--status-background": `${theme.color.defaultText}66`
  },
  ({ status, theme }) => status === "unknown" && {
    "--status-color": theme.color.mediumdark,
    "--status-background": `${theme.color.mediumdark}66`
  }
);

// src/components/TestProviderRender.tsx
var Container = styled4.div({
  display: "flex",
  flexDirection: "column"
});
var Heading = styled4.div({
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  gap: 12
});
var Info = styled4.div({
  display: "flex",
  flexDirection: "column",
  marginLeft: 8,
  minWidth: 0
});
var Title = styled4.div(({ crashed, theme }) => ({
  fontSize: theme.typography.size.s1,
  fontWeight: crashed ? "bold" : "normal",
  color: crashed ? theme.color.negativeText : theme.color.defaultText
}));
var Actions = styled4.div({
  display: "flex",
  gap: 4
});
var Extras = styled4.div({
  marginBottom: 2
});
var Muted = styled4.span(({ theme }) => ({
  color: theme.textMutedColor
}));
var Progress = styled4(ProgressSpinner)({
  margin: 4
});
var Row = styled4.div({
  display: "flex",
  gap: 4
});
var StopIcon = styled4(StopAltIcon)({
  width: 10
});
var openPanel = /* @__PURE__ */ __name(({ api, panelId, entryId }) => {
  const story = entryId ? api.findAllLeafStoryIds(entryId)[0] : void 0;
  if (story) {
    api.selectStory(story);
  }
  api.setSelectedPanel(panelId);
  api.togglePanel(true);
}, "openPanel");
var TestProviderRender = /* @__PURE__ */ __name(({
  api,
  entry,
  testProviderState,
  storeState,
  setStoreState,
  componentTestStatusValueToStoryIds,
  a11yStatusValueToStoryIds,
  isSettingsUpdated,
  ...props
}) => {
  const { config, watching, cancelling, currentRun, fatalError } = storeState;
  const finishedTestCount = currentRun.componentTestCount.success + currentRun.componentTestCount.error;
  const hasA11yAddon = addons.experimental_getRegisteredAddons().includes(ADDON_ID);
  const isRunning = testProviderState === "test-provider-state:running";
  const isStarting = isRunning && finishedTestCount === 0;
  const [componentTestStatusIcon, componentTestStatusLabel] = fatalError ? ["critical", "Component tests crashed"] : componentTestStatusValueToStoryIds["status-value:error"].length > 0 ? ["negative", "Component tests failed"] : isRunning ? ["unknown", "Testing in progress"] : componentTestStatusValueToStoryIds["status-value:success"].length > 0 ? ["positive", "Component tests passed"] : ["unknown", "Run tests to see results"];
  const [a11yStatusIcon, a11yStatusLabel] = fatalError ? ["critical", "Component tests crashed"] : a11yStatusValueToStoryIds["status-value:error"].length > 0 ? ["negative", "Accessibility tests failed"] : a11yStatusValueToStoryIds["status-value:warning"].length > 0 ? ["warning", "Accessibility tests failed"] : isRunning ? ["unknown", "Testing in progress"] : a11yStatusValueToStoryIds["status-value:success"].length > 0 ? ["positive", "Accessibility tests passed"] : ["unknown", "Run tests to see accessibility results"];
  return React3.createElement(Container, { ...props }, React3.createElement(Heading, null, React3.createElement(Info, null, entry ? React3.createElement(Title, { id: "testing-module-title" }, "Run component tests") : React3.createElement(
    Title,
    {
      id: "testing-module-title",
      crashed: testProviderState === "test-provider-state:crashed" || fatalError !== void 0 || currentRun.unhandledErrors.length > 0
    },
    currentRun.unhandledErrors.length === 1 ? "Component tests completed with an error" : currentRun.unhandledErrors.length > 1 ? "Component tests completed with errors" : fatalError ? "Component tests didn\u2019t complete" : "Run component tests"
  ), React3.createElement(
    Description,
    {
      id: "testing-module-description",
      storeState,
      testProviderState,
      entryId: entry?.id,
      isSettingsUpdated
    }
  )), React3.createElement(Actions, null, !entry && React3.createElement(
    WithTooltip,
    {
      hasChrome: false,
      trigger: "hover",
      tooltip: React3.createElement(TooltipNote, { note: `${watching ? "Disable" : "Enable"} watch mode` })
    },
    React3.createElement(
      IconButton2,
      {
        "aria-label": `${watching ? "Disable" : "Enable"} watch mode`,
        size: "medium",
        active: watching,
        onClick: () => store.send({
          type: "TOGGLE_WATCHING",
          payload: {
            to: !watching
          }
        }),
        disabled: isRunning
      },
      React3.createElement(EyeIcon, null)
    )
  ), isRunning ? React3.createElement(
    WithTooltip,
    {
      hasChrome: false,
      trigger: "hover",
      tooltip: React3.createElement(TooltipNote, { note: cancelling ? "Stopping..." : "Stop test run" })
    },
    React3.createElement(
      IconButton2,
      {
        "aria-label": cancelling ? "Stopping..." : "Stop test run",
        padding: "none",
        size: "medium",
        onClick: () => store.send({
          type: "CANCEL_RUN"
        }),
        disabled: cancelling || isStarting
      },
      React3.createElement(
        Progress,
        {
          percentage: finishedTestCount && storeState.currentRun.totalTestCount ? finishedTestCount / storeState.currentRun.totalTestCount * 100 : void 0
        },
        React3.createElement(StopIcon, null)
      )
    )
  ) : React3.createElement(
    WithTooltip,
    {
      hasChrome: false,
      trigger: "hover",
      tooltip: React3.createElement(TooltipNote, { note: "Start test run" })
    },
    React3.createElement(
      IconButton2,
      {
        "aria-label": "Start test run",
        size: "medium",
        onClick: () => {
          let storyIds;
          if (entry) {
            storyIds = entry.type === "story" ? [entry.id] : api.findAllLeafStoryIds(entry.id);
          }
          store.send({
            type: "TRIGGER_RUN",
            payload: { storyIds, triggeredBy: entry?.type ?? "global" }
          });
        }
      },
      React3.createElement(PlayHollowIcon, null)
    )
  ))), React3.createElement(Extras, null, React3.createElement(Row, null, React3.createElement(
    ListItem,
    {
      as: "label",
      title: "Interactions",
      icon: entry ? null : React3.createElement(Form.Checkbox, { checked: true, disabled: true })
    }
  ), React3.createElement(
    WithTooltip,
    {
      hasChrome: false,
      trigger: "hover",
      tooltip: React3.createElement(TooltipNote, { note: componentTestStatusLabel })
    },
    React3.createElement(
      IconButton2,
      {
        size: "medium",
        disabled: componentTestStatusValueToStoryIds["status-value:error"].length === 0 && componentTestStatusValueToStoryIds["status-value:warning"].length === 0 && componentTestStatusValueToStoryIds["status-value:success"].length === 0,
        onClick: () => {
          openPanel({
            api,
            panelId: PANEL_ID,
            entryId: componentTestStatusValueToStoryIds["status-value:error"][0] ?? componentTestStatusValueToStoryIds["status-value:warning"][0] ?? componentTestStatusValueToStoryIds["status-value:success"][0] ?? entry?.id
          });
        }
      },
      React3.createElement(
        TestStatusIcon,
        {
          status: componentTestStatusIcon,
          "aria-label": componentTestStatusLabel,
          isRunning
        }
      ),
      componentTestStatusValueToStoryIds["status-value:error"].length + componentTestStatusValueToStoryIds["status-value:warning"].length || null
    )
  )), !entry && React3.createElement(Row, null, React3.createElement(
    ListItem,
    {
      as: "label",
      title: watching ? React3.createElement(Muted, null, "Coverage (unavailable)") : "Coverage",
      icon: React3.createElement(
        Form.Checkbox,
        {
          checked: config.coverage,
          disabled: isRunning,
          onChange: () => setStoreState((s) => ({
            ...s,
            config: { ...s.config, coverage: !config.coverage }
          }))
        }
      )
    }
  ), React3.createElement(
    WithTooltip,
    {
      hasChrome: false,
      trigger: "hover",
      tooltip: React3.createElement(
        TooltipNote,
        {
          note: watching ? "Unavailable in watch mode" : currentRun.triggeredBy && !FULL_RUN_TRIGGERS.includes(currentRun.triggeredBy) ? "Unavailable when running focused tests" : isRunning ? "Testing in progress" : currentRun.coverageSummary ? "View coverage report" : fatalError ? "Component tests crashed" : "Run tests to calculate coverage"
        }
      )
    },
    watching || currentRun.triggeredBy && !FULL_RUN_TRIGGERS.includes(currentRun.triggeredBy) ? React3.createElement(IconButton2, { size: "medium", disabled: true }, React3.createElement(
      InfoIcon,
      {
        "aria-label": watching ? `Coverage is unavailable in watch mode` : `Coverage is unavailable when running focused tests`
      }
    )) : currentRun.coverageSummary ? React3.createElement(IconButton2, { asChild: true, size: "medium" }, React3.createElement("a", { href: "/coverage/index.html", target: "_blank", "aria-label": "Open coverage report" }, React3.createElement(
      TestStatusIcon,
      {
        isRunning,
        percentage: currentRun.coverageSummary.percentage,
        status: currentRun.coverageSummary.status,
        "aria-label": `Coverage status: ${currentRun.coverageSummary.status}`
      }
    ), React3.createElement("span", { "aria-label": `${currentRun.coverageSummary.percentage} percent coverage` }, currentRun.coverageSummary.percentage, "%"))) : React3.createElement(IconButton2, { size: "medium", disabled: true }, React3.createElement(
      TestStatusIcon,
      {
        isRunning,
        status: fatalError ? "critical" : "unknown",
        "aria-label": "Coverage status: unknown"
      }
    ))
  )), hasA11yAddon && React3.createElement(Row, null, React3.createElement(
    ListItem,
    {
      as: "label",
      title: "Accessibility",
      icon: entry ? null : React3.createElement(
        Form.Checkbox,
        {
          checked: config.a11y,
          disabled: isRunning,
          onChange: () => setStoreState((s) => ({
            ...s,
            config: { ...s.config, a11y: !config.a11y }
          }))
        }
      )
    }
  ), React3.createElement(
    WithTooltip,
    {
      hasChrome: false,
      trigger: "hover",
      tooltip: React3.createElement(TooltipNote, { note: a11yStatusLabel })
    },
    React3.createElement(
      IconButton2,
      {
        size: "medium",
        disabled: a11yStatusValueToStoryIds["status-value:error"].length === 0 && a11yStatusValueToStoryIds["status-value:warning"].length === 0 && a11yStatusValueToStoryIds["status-value:success"].length === 0,
        onClick: () => {
          openPanel({
            api,
            entryId: a11yStatusValueToStoryIds["status-value:error"][0] ?? a11yStatusValueToStoryIds["status-value:warning"][0] ?? a11yStatusValueToStoryIds["status-value:success"][0] ?? entry?.id,
            panelId: PANEL_ID2
          });
        }
      },
      React3.createElement(
        TestStatusIcon,
        {
          status: a11yStatusIcon,
          "aria-label": a11yStatusLabel,
          isRunning
        }
      ),
      a11yStatusValueToStoryIds["status-value:error"].length + a11yStatusValueToStoryIds["status-value:warning"].length || null
    )
  ))));
}, "TestProviderRender");

// src/components/SidebarContextMenu.tsx
var SidebarContextMenu = /* @__PURE__ */ __name(({ context, api }) => {
  const {
    testProviderState,
    componentTestStatusValueToStoryIds,
    a11yStatusValueToStoryIds,
    storeState,
    setStoreState
  } = useTestProvider(api, context.id);
  return React4.createElement(
    TestProviderRender,
    {
      api,
      entry: context,
      style: { minWidth: 240 },
      testProviderState,
      componentTestStatusValueToStoryIds,
      a11yStatusValueToStoryIds,
      storeState,
      setStoreState,
      isSettingsUpdated: false
    }
  );
}, "SidebarContextMenu");

// src/manager.tsx
addons2.register(ADDON_ID2, (api) => {
  const storybookBuilder = globalThis.STORYBOOK_BUILDER || "";
  if (storybookBuilder.includes("vite")) {
    const openPanel2 = /* @__PURE__ */ __name((panelId) => {
      api.setSelectedPanel(panelId);
      api.togglePanel(true);
    }, "openPanel");
    componentTestStatusStore.onSelect(() => {
      openPanel2(PANEL_ID);
    });
    a11yStatusStore.onSelect(() => {
      openPanel2(PANEL_ID2);
    });
    testProviderStore.onRunAll(() => {
      store.send({
        type: "TRIGGER_RUN",
        payload: {
          triggeredBy: "run-all"
        }
      });
    });
    store.untilReady().then(() => {
      store.setState((state) => ({
        ...state,
        indexUrl: new URL("index.json", window.location.href).toString()
      }));
    });
    addons2.add(TEST_PROVIDER_ID, {
      type: Addon_TypesEnum.experimental_TEST_PROVIDER,
      render: /* @__PURE__ */ __name(() => {
        const [isModalOpen, setModalOpen] = useState3(false);
        const {
          storeState,
          setStoreState,
          testProviderState,
          componentTestStatusValueToStoryIds,
          a11yStatusValueToStoryIds,
          isSettingsUpdated
        } = useTestProvider(api);
        return React5.createElement(GlobalErrorContext.Provider, { value: { isModalOpen, setModalOpen } }, React5.createElement(
          TestProviderRender,
          {
            api,
            storeState,
            setStoreState,
            isSettingsUpdated,
            testProviderState,
            componentTestStatusValueToStoryIds,
            a11yStatusValueToStoryIds
          }
        ), React5.createElement(
          GlobalErrorModal,
          {
            storeState,
            onRerun: () => {
              setModalOpen(false);
              store.send({
                type: "TRIGGER_RUN",
                payload: {
                  triggeredBy: "global"
                }
              });
            }
          }
        ));
      }, "render"),
      sidebarContextMenu: /* @__PURE__ */ __name(({ context }) => {
        if (context.type === "docs") {
          return null;
        }
        if (context.type === "story" && !context.tags.includes("test")) {
          return null;
        }
        return React5.createElement(SidebarContextMenu, { context, api });
      }, "sidebarContextMenu")
    });
  }
});

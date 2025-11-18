import {
  Source
} from "./_browser-chunks/chunk-UZFOWTVP.js";
import {
  __name
} from "./_browser-chunks/chunk-MM7DTO55.js";

// src/manager.tsx
import React, { useEffect, useState } from "react";
import { AddonPanel } from "storybook/internal/components";
import { addons, types, useChannel, useParameter } from "storybook/manager-api";
import { ignoreSsrWarning, styled, useTheme } from "storybook/theming";

// ../../core/src/docs-tools/shared.ts
var ADDON_ID = "storybook/docs";
var PANEL_ID = `${ADDON_ID}/panel`;
var PARAM_KEY = `docs`;
var SNIPPET_RENDERED = `${ADDON_ID}/snippet-rendered`;

// src/manager.tsx
addons.register(ADDON_ID, (api) => {
  addons.add(PANEL_ID, {
    title: "Code",
    type: types.PANEL,
    paramKey: PARAM_KEY,
    /**
     * This code panel can be enabled by adding this parameter:
     *
     * @example
     *
     * ```ts
     *  parameters: {
     *    docs: {
     *      codePanel: true,
     *    },
     *  },
     * ```
     */
    disabled: /* @__PURE__ */ __name((parameters) => !parameters?.docs?.codePanel, "disabled"),
    match: /* @__PURE__ */ __name(({ viewMode }) => viewMode === "story", "match"),
    render: /* @__PURE__ */ __name(({ active }) => {
      const channel = api.getChannel();
      const currentStory = api.getCurrentStoryData();
      const lastEvent = channel?.last(SNIPPET_RENDERED)?.[0];
      const [codeSnippet, setSourceCode] = useState({
        source: lastEvent?.source,
        format: lastEvent?.format ?? void 0
      });
      const parameter = useParameter(PARAM_KEY, {
        source: { code: "" },
        theme: "dark"
      });
      useEffect(() => {
        setSourceCode({
          source: void 0,
          format: void 0
        });
      }, [currentStory?.id]);
      useChannel({
        [SNIPPET_RENDERED]: ({ source, format }) => {
          setSourceCode({ source, format });
        }
      });
      const theme = useTheme();
      const isDark = theme.base !== "light";
      return React.createElement(AddonPanel, { active: !!active }, React.createElement(SourceStyles, null, React.createElement(
        Source,
        {
          ...parameter.source,
          code: parameter.source?.code || codeSnippet.source || parameter.source?.originalSource,
          format: codeSnippet.format,
          dark: isDark
        }
      )));
    }, "render")
  });
});
var SourceStyles = styled.div(() => ({
  height: "100%",
  [`> :first-child${ignoreSsrWarning}`]: {
    margin: 0,
    height: "100%",
    boxShadow: "none"
  }
}));

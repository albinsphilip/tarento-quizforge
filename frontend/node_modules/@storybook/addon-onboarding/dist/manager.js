import {
  ADDON_CONTROLS_ID
} from "./_browser-chunks/chunk-B266DSPW.js";
import "./_browser-chunks/chunk-CBI7MY27.js";

// src/manager.tsx
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { STORY_SPECIFIED } from "storybook/internal/core-events";
import { addons } from "storybook/manager-api";
var Onboarding = lazy(() => import("./_browser-chunks/Onboarding-XBLXWDOE.js"));
addons.register("@storybook/addon-onboarding", async (api) => {
  const urlState = api.getUrlState();
  const isOnboarding = urlState.path === "/onboarding" || urlState.queryParams.onboarding === "true";
  api.once(STORY_SPECIFIED, () => {
    const hasButtonStories = !!api.getData("example-button--primary") || !!document.getElementById("example-button--primary");
    if (!hasButtonStories) {
      console.warn(
        `[@storybook/addon-onboarding] It seems like you have finished the onboarding experience in Storybook! Therefore this addon is not necessary anymore and will not be loaded. You are free to remove it from your project. More info: https://github.com/storybookjs/storybook/tree/next/code/addons/onboarding#uninstalling`
      );
      return;
    }
    if (!isOnboarding || window.innerWidth < 730) {
      return;
    }
    api.togglePanel(true);
    api.togglePanelPosition("bottom");
    api.setSelectedPanel(ADDON_CONTROLS_ID);
    const domNode = document.createElement("div");
    domNode.id = "storybook-addon-onboarding";
    document.body.appendChild(domNode);
    ReactDOM.render(
      React.createElement(Suspense, { fallback: React.createElement("div", null) }, React.createElement(Onboarding, { api })),
      domNode
    );
  });
});

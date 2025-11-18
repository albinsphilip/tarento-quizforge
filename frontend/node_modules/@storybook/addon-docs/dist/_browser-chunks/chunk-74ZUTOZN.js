import {
  __name
} from "./chunk-MM7DTO55.js";

// src/DocsRenderer.tsx
import React, { Component } from "react";
import { renderElement, unmountElement } from "@storybook/react-dom-shim";
import { AnchorMdx, CodeOrSourceMdx, Docs, HeadersMdx } from "@storybook/addon-docs/blocks";
var defaultComponents = {
  code: CodeOrSourceMdx,
  a: AnchorMdx,
  ...HeadersMdx
};
var _ErrorBoundary = class _ErrorBoundary extends Component {
  constructor() {
    super(...arguments);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    const { showException } = this.props;
    showException(err);
  }
  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    return hasError ? null : React.createElement(React.Fragment, null, children);
  }
};
__name(_ErrorBoundary, "ErrorBoundary");
var ErrorBoundary = _ErrorBoundary;
var _DocsRenderer = class _DocsRenderer {
  constructor() {
    this.render = async (context, docsParameter, element) => {
      const components = {
        ...defaultComponents,
        ...docsParameter?.components
      };
      const TDocs = Docs;
      return new Promise((resolve, reject) => {
        import("@mdx-js/react").then(
          ({ MDXProvider }) => (
            // We use a `key={}` here to reset the `hasError` state each time we render ErrorBoundary
            renderElement(
              React.createElement(ErrorBoundary, { showException: reject, key: Math.random() }, React.createElement(MDXProvider, { components }, React.createElement(TDocs, { context, docsParameter }))),
              element
            )
          )
        ).then(() => resolve());
      });
    };
    this.unmount = (element) => {
      unmountElement(element);
    };
  }
};
__name(_DocsRenderer, "DocsRenderer");
var DocsRenderer = _DocsRenderer;

export {
  defaultComponents,
  DocsRenderer
};

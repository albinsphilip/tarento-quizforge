import {
  __export,
  __name
} from "./chunk-MM7DTO55.js";

// src/preview.ts
var preview_exports = {};
__export(preview_exports, {
  parameters: () => parameters
});
var excludeTags = Object.entries(globalThis.TAGS_OPTIONS ?? {}).reduce(
  (acc, entry) => {
    const [tag, option] = entry;
    if (option.excludeFromDocsStories) {
      acc[tag] = true;
    }
    return acc;
  },
  {}
);
var parameters = {
  docs: {
    renderer: /* @__PURE__ */ __name(async () => {
      const { DocsRenderer } = await import("./DocsRenderer-HT7GNKAR.js");
      return new DocsRenderer();
    }, "renderer"),
    stories: {
      filter: /* @__PURE__ */ __name((story) => {
        const tags = story.tags || [];
        return tags.filter((tag) => excludeTags[tag]).length === 0 && !story.parameters.docs?.disable;
      }, "filter")
    }
  }
};

export {
  parameters,
  preview_exports
};

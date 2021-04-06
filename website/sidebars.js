module.exports = {
  //docs: ['core', 'concepts', 'start', 'charts', 'api'],

  docs: [
    "core",
    {
      type: "category",
      label: "Concepts",
      items: [
        "workflow",
        "glossary",
      ],
    },
    {
      type: "category",
      label: "Getting started",
      items: ["install", "example-npm", "example-script"],
    },
    "rendering",
    {
      type: "category",
      label: "Implementing charts",
      items: ["chart-interface", "chart-utilities", "declarative-mapping"],
    },
    {
      type: "category",
      label: "Utility functions",
      items: [
        "data-parsing",
        // "import-export",
      ],
    },
    "api",
  ],
}

// @ts-check

/**
 * @type {import('@stackbit/types').StackbitConfig}
 */
module.exports = {
  stackbitVersion: '~2.1.14',
  contentSources: [
    {
      name: 'git',
      driver: {
        type: 'git',
        repo: {
          type: 'local'
        },
        rootPath: '.',
        contentDirs: ['content']
      },
      modelTypeKey: 'type',
      models: [
        // Page Models
        {
          name: "HomePage",
          type: "page",
          urlPath: "/",
          filePath: "content/pages/index.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "heroTitle", type: "string" },
            { name: "heroSubtitle", type: "string" },
            { name: "sections", type: "list", items: { type: "reference", models: ["HeroSection", "ProvenTrackRecordSection", "PastInvestmentsSection", "PerformanceSection", "LogoShowcaseSection"] } }
          ]
        },
        {
          name: "AboutPage",
          type: "page",
          urlPath: "/about",
          filePath: "content/pages/about.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "content", type: "markdown" }
          ]
        },
        {
          name: "InvestmentsPage",
          type: "page",
          urlPath: "/investments",
          filePath: "content/pages/investments.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "content", type: "markdown" }
          ]
        },
        {
          name: "TeamPage",
          type: "page",
          urlPath: "/team",
          filePath: "content/pages/team.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "teamMembers", type: "list", items: { type: "object", fields: [
              { name: "name", type: "string" },
              { name: "position", type: "string" },
              { name: "bio", type: "markdown" },
              { name: "image", type: "image" }
            ]}}
          ]
        },
        {
          name: "ContactPage",
          type: "page",
          urlPath: "/contact",
          filePath: "content/pages/contact.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "address", type: "string" },
            { name: "email", type: "string" },
            { name: "phone", type: "string" }
          ]
        },
        {
          name: "PrivacyPolicyPage",
          type: "page",
          urlPath: "/privacy-policy",
          filePath: "content/pages/privacy-policy.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "content", type: "markdown" }
          ]
        },
        {
          name: "TermsOfUsePage",
          type: "page",
          urlPath: "/terms-of-use",
          filePath: "content/pages/terms-of-use.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "content", type: "markdown" }
          ]
        },
        
        // Component Models
        {
          name: "HeroSection",
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "subtitle", type: "string" },
            { name: "backgroundImage", type: "image" },
            { name: "buttonText", type: "string" },
            { name: "buttonLink", type: "string" }
          ]
        },
        {
          name: "ProvenTrackRecordSection",
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "description", type: "markdown" },
            { name: "stats", type: "list", items: { type: "object", fields: [
              { name: "value", type: "string" },
              { name: "label", type: "string" }
            ]}}
          ]
        },
        {
          name: "PastInvestmentsSection",
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "description", type: "markdown" },
            { name: "investments", type: "list", items: { type: "object", fields: [
              { name: "name", type: "string" },
              { name: "description", type: "string" },
              { name: "image", type: "image" }
            ]}}
          ]
        },
        {
          name: "PerformanceSection",
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "description", type: "markdown" },
            { name: "metrics", type: "list", items: { type: "object", fields: [
              { name: "label", type: "string" },
              { name: "value", type: "string" }
            ]}}
          ]
        },
        {
          name: "LogoShowcaseSection",
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "logos", type: "list", items: { type: "object", fields: [
              { name: "name", type: "string" },
              { name: "image", type: "image" }
            ]}}
          ]
        }
      ]
    }
  ]
};

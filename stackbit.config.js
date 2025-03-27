// @ts-check

/**
 * @type {import('@stackbit/types').StackbitConfig}
 */
module.exports = {
  stackbitVersion: '~2.1.14',
  contentSources: [
    {
      id: 'content',
      driver: {
        type: 'git',
        repo: {
          type: 'github',
          url: 'https://github.com/tasmancapital/webapp'
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
          filePath: "content/pages/home.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "subtitle", type: "string" },
            { name: "heroVideo", type: "string" },
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
            { name: "description", type: "markdown" },
            { name: "heroImage", type: "string" },
            { name: "history", type: "object", fields: [
              { name: "title", type: "string" },
              { name: "description", type: "string" }
            ]},
            { name: "values", type: "list", items: { type: "object", fields: [
              { name: "title", type: "string" },
              { name: "description", type: "string" },
              { name: "points", type: "list", items: { type: "string" } }
            ]}}
          ]
        },
        {
          name: "InvestmentsPage",
          type: "page",
          urlPath: "/investments",
          filePath: "content/pages/investments.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "heroImage", type: "string" },
            { name: "investments", type: "list", items: { type: "object", fields: [
              { name: "name", type: "string" },
              { name: "id", type: "string" },
              { name: "logo", type: "string" },
              { name: "type", type: "string" },
              { name: "url", type: "string" },
              { name: "description", type: "string" },
              { name: "sector", type: "string" },
              { name: "investment", type: "string" },
              { name: "exit", type: "string" }
            ]}}
          ]
        },
        {
          name: "TeamPage",
          type: "page",
          urlPath: "/team",
          filePath: "content/pages/team.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "description", type: "string" },
            { name: "heroVideo", type: "string" },
            { name: "teamMembers", type: "list", items: { type: "object", fields: [
              { name: "id", type: "string" },
              { name: "name", type: "string" },
              { name: "role", type: "string" },
              { name: "image", type: "string" },
              { name: "summary", type: "string" },
              { name: "details", type: "list", items: { type: "string" } }
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
            { name: "description", type: "string" },
            { name: "heroImage", type: "string" },
            { name: "address", type: "object", fields: [
              { name: "street", type: "string" },
              { name: "city", type: "string" },
              { name: "state", type: "string" },
              { name: "postcode", type: "string" },
              { name: "country", type: "string" }
            ]},
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
            { name: "lastUpdated", type: "string" },
            { name: "sections", type: "list", items: { type: "object", fields: [
              { name: "title", type: "string" },
              { name: "content", type: "markdown" }
            ]}}
          ]
        },
        {
          name: "TermsOfUsePage",
          type: "page",
          urlPath: "/terms-of-use",
          filePath: "content/pages/terms-of-use.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "lastUpdated", type: "string" },
            { name: "sections", type: "list", items: { type: "object", fields: [
              { name: "title", type: "string" },
              { name: "content", type: "markdown" }
            ]}}
          ]
        },
        
        // Section Models
        {
          name: "HeroSection",
          type: "object",
          fields: [
            { name: "type", type: "string", required: true },
            { name: "heading", type: "string" },
            { name: "subheading", type: "string" },
            { name: "videoUrl", type: "string" }
          ]
        },
        {
          name: "ProvenTrackRecordSection",
          type: "object",
          fields: [
            { name: "type", type: "string", required: true }
          ]
        },
        {
          name: "PastInvestmentsSection",
          type: "object",
          fields: [
            { name: "type", type: "string", required: true }
          ]
        },
        {
          name: "PerformanceSection",
          type: "object",
          fields: [
            { name: "type", type: "string", required: true }
          ]
        },
        {
          name: "LogoShowcaseSection",
          type: "object",
          fields: [
            { name: "type", type: "string", required: true }
          ]
        }
      ]
    }
  ]
};

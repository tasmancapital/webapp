// @ts-check

/**
 * @type {import('@stackbit/types').StackbitConfig}
 */
const { defineStackbitConfig } = require("@stackbit/types");
const { GitContentSource } = require("@stackbit/cms-git");

module.exports = defineStackbitConfig({
  stackbitVersion: '~2.1.14',
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["project/src/content"],
      models: [
        // Page Models
        {
          name: "home",
          type: "page",
          urlPath: "/",
          filePath: "project/src/content/pages/home.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "subtitle", type: "string" },
            { name: "heroVideo", type: "string" },
            { name: "sections", type: "list", items: { type: "reference", models: ["HeroSection", "ProvenTrackRecordSection", "PastInvestmentsSection", "PerformanceSection", "LogoShowcaseSection"] } }
          ]
        },
        {
          name: "about",
          type: "page",
          urlPath: "/about",
          filePath: "project/src/content/pages/about.json",
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
          name: "investments",
          type: "page",
          urlPath: "/investments",
          filePath: "project/src/content/pages/investments.json",
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
          name: "team",
          type: "page",
          urlPath: "/team",
          filePath: "project/src/content/pages/team.json",
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
          name: "contact",
          type: "page",
          urlPath: "/contact",
          filePath: "project/src/content/pages/contact.json",
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
          name: "privacy-policy",
          type: "page",
          urlPath: "/privacy-policy",
          filePath: "project/src/content/pages/privacy-policy.json",
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
          name: "terms-of-use",
          type: "page",
          urlPath: "/terms-of-use",
          filePath: "project/src/content/pages/terms-of-use.json",
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
    })
  ],
  // Add siteMap function to connect page models to URLs
  siteMap: ({ documents, models }) => {
    // 1. Filter all page models
    const pageModels = models.filter(m => m.type === "page");
    
    // Debug: Log the documents and models to help diagnose issues
    console.log('Available models:', models.map(m => m.name));
    console.log('Available documents:', documents.map(d => d.modelName));
    
    return documents
      // 2. Filter all documents which are of a page model
      .filter(d => {
        const isPageModel = pageModels.some(m => m.name === d.modelName);
        if (!isPageModel) {
          console.log('Skipping document with model:', d.modelName);
        }
        return isPageModel;
      })
      // 3. Map each document to a SiteMapEntry
      .map(document => {
        // Map the model name to its corresponding URL
        const urlModel = (() => {
          switch (document.modelName) {
            case 'home':
              return '';
            case 'about':
              return 'about';
            case 'investments':
              return 'investments';
            case 'team':
              return 'team';
            case 'contact':
              return 'contact';
            case 'privacy-policy':
              return 'privacy-policy';
            case 'terms-of-use':
              return 'terms-of-use';
            default:
              console.log('Unknown model name:', document.modelName);
              return null;
          }
        })();
        
        console.log('Mapping document:', document.modelName, 'to URL:', urlModel ? `/${urlModel}` : '/');
        
        return {
          stableId: document.id,
          urlPath: urlModel ? `/${urlModel}` : '/',
          document,
          isHomePage: document.modelName === 'home'
        };
      })
      .filter(Boolean);
  },
  
  // Add custom asset sources
  assetSources: [
    {
      name: 'thinkenergy',
      title: 'Think Energy Assets',
      icon: 'https://thinkenergy.au/favicon.ico',
      url: 'https://thinkenergy.au/tasman/',
      transform: (data) => {
        // Transform the selected asset data
        return {
          src: data.url,
          alt: data.alt || '',
          width: data.width,
          height: data.height
        };
      }
    }
  ]
});

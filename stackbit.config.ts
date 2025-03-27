import { defineStackbitConfig, GitContentSource } from '@stackbit/types';

export default defineStackbitConfig({
  stackbitVersion: '~0.6.0',
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ['project/src/content'],
      models: [
        {
          name: 'Page',
          type: 'page',
          urlPath: '/{slug}',
          filePath: 'project/src/pages/{slug}.tsx',
          fields: [
            { name: 'title', type: 'string', required: true },
            { name: 'content', type: 'markdown' }
          ]
        },
        {
          name: 'Component',
          type: 'object',
          filePath: 'project/src/components/{slug}.tsx',
          fields: [
            { name: 'title', type: 'string' },
            { name: 'content', type: 'markdown' }
          ]
        }
      ]
    })
  ],
  // Map your page models to URLs
  siteMap: ({ documents, models }) => {
    // Filter for page models
    const pageModels = models.filter(m => m.type === 'page');
    
    return documents
      .filter(doc => pageModels.some(m => m.name === doc.modelName))
      .map(document => {
        // Get the URL path based on the document's slug
        const urlPath = `/${document.slug || ''}`;
        
        return {
          path: urlPath,
          lastModified: document.lastModified,
          changeFrequency: 'weekly',
          priority: 0.5
        };
      });
  }
});

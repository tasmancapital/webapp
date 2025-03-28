/**
 * Content Loader Utility
 * 
 * This utility helps load content files and adds Netlify Visual Editor annotations
 * to enable proper sitemap detection and content editing.
 */

// Import content files
import homeContent from '../content/pages/home.json';
import aboutContent from '../content/pages/about.json';
import investmentsContent from '../content/pages/investments.json';
import teamContent from '../content/pages/team.json';
import contactContent from '../content/pages/contact.json';
import privacyPolicyContent from '../content/pages/privacy-policy.json';
import termsOfUseContent from '../content/pages/terms-of-use.json';

// Import component content files
import heroSectionContent from '../content/components/hero-section.json';
import provenTrackRecordSectionContent from '../content/components/proven-track-record-section.json';
import pastInvestmentsSectionContent from '../content/components/past-investments-section.json';
import performanceSectionContent from '../content/components/performance-section.json';
import logoShowcaseSectionContent from '../content/components/logo-showcase-section.json';
import timelineSectionContent from '../content/components/timeline-section.json';
import valuesSectionContent from '../content/components/values-section.json';

// Content map for easy access
export const contentMap = {
  // Pages
  home: homeContent,
  about: aboutContent,
  investments: investmentsContent,
  team: teamContent,
  contact: contactContent,
  'privacy-policy': privacyPolicyContent,
  'terms-of-use': termsOfUseContent,
  
  // Components
  'components/hero-section': heroSectionContent,
  'components/proven-track-record-section': provenTrackRecordSectionContent,
  'components/past-investments-section': pastInvestmentsSectionContent,
  'components/performance-section': performanceSectionContent,
  'components/logo-showcase-section': logoShowcaseSectionContent,
  'components/timeline-section': timelineSectionContent,
  'components/values-section': valuesSectionContent
};

// Type definitions
export type ContentType = keyof typeof contentMap;

/**
 * Adds Netlify Visual Editor data attributes to a component
 * @param contentType The type of content (matches the model name in stackbit.config.js)
 * @param props Additional props to add to the element
 * @returns Object with data attributes for Netlify Visual Editor
 */
export function annotateContent(contentType: ContentType, props: Record<string, unknown> = {}) {
  // Only add annotations if we're in development or on Netlify
  if (import.meta.env.DEV || window.location.hostname.includes('netlify')) {
    return {
      ...props,
      'data-sb-object-id': contentType,
      'data-sb-field-path': '*'
    };
  }
  return props;
}

/**
 * Get content for a specific page or component
 * @param contentType The type of content to load
 * @returns The content object
 */
export function getContent<T = Record<string, unknown>>(contentType: ContentType): T {
  return contentMap[contentType] as T;
}

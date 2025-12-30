import { NewsletterComponent } from '../types';

export interface ValidationError {
  componentId: string;
  componentType: string;
  message: string;
  severity: 'error' | 'warning';
}

export const validateNewsletter = (components: NewsletterComponent[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  components.forEach((component) => {
    switch (component.type) {
      case 'image':
        if (!component.src) {
          errors.push({
            componentId: component.id,
            componentType: 'image',
            message: 'Image source is missing',
            severity: 'warning',
          });
        }
        if (!component.alt) {
          errors.push({
            componentId: component.id,
            componentType: 'image',
            message: 'Image alt text is missing (important for accessibility)',
            severity: 'warning',
          });
        }
        break;

      case 'button':
        if (!component.href || component.href === '#') {
          errors.push({
            componentId: component.id,
            componentType: 'button',
            message: 'Button URL is missing or invalid',
            severity: 'warning',
          });
        }
        if (!component.text) {
          errors.push({
            componentId: component.id,
            componentType: 'button',
            message: 'Button text is missing',
            severity: 'error',
          });
        }
        break;

      case 'text':
        if (!component.content || component.content === '<p></p>' || component.content === '') {
          errors.push({
            componentId: component.id,
            componentType: 'text',
            message: 'Text component is empty',
            severity: 'warning',
          });
        }
        break;

      case 'heading':
        if (!component.text) {
          errors.push({
            componentId: component.id,
            componentType: 'heading',
            message: 'Heading text is missing',
            severity: 'warning',
          });
        }
        break;

      case 'socialLinks':
        component.platforms.forEach((platform) => {
          if (!platform.url || platform.url === '#') {
            errors.push({
              componentId: component.id,
              componentType: 'socialLinks',
              message: `Social link for ${platform.type} is missing or invalid`,
              severity: 'warning',
            });
          }
        });
        break;

      case 'layout':
        if (component.columns.every(col => col.length === 0)) {
          errors.push({
            componentId: component.id,
            componentType: 'layout',
            message: 'Layout is empty',
            severity: 'warning',
          });
        }
        break;
    }
  });

  return errors;
};

export const getValidationSummary = (errors: ValidationError[]): string => {
  if (errors.length === 0) {
    return 'Newsletter validation passed! No issues found.';
  }

  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;

  let summary = 'Validation Results:\n\n';
  
  if (errorCount > 0) {
    summary += `❌ ${errorCount} error${errorCount > 1 ? 's' : ''}\n`;
  }
  
  if (warningCount > 0) {
    summary += `⚠️ ${warningCount} warning${warningCount > 1 ? 's' : ''}\n`;
  }

  summary += '\n';
  errors.forEach(error => {
    const icon = error.severity === 'error' ? '❌' : '⚠️';
    summary += `${icon} ${error.componentType}: ${error.message}\n`;
  });

  return summary;
};


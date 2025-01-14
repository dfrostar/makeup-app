import Handlebars from 'handlebars';

class SchemaManager {
  constructor() {
    this.schemas = new Map();
    this.templates = new Map();
  }

  async loadSchema(type) {
    try {
      const response = await fetch(`/schemas/${type}-schema.json`);
      const schema = await response.text();
      this.templates.set(type, Handlebars.compile(schema));
      this.schemas.set(type, JSON.parse(schema));
    } catch (error) {
      console.error(`Error loading schema for ${type}:`, error);
    }
  }

  generateSchema(type, data) {
    const template = this.templates.get(type);
    if (!template) {
      throw new Error(`Schema template for ${type} not found`);
    }
    return template(data);
  }

  injectSchema(type, data) {
    const schema = this.generateSchema(type, data);
    const scriptElement = document.createElement('script');
    scriptElement.type = 'application/ld+json';
    scriptElement.textContent = schema;
    document.head.appendChild(scriptElement);
  }

  async initializeSchemas() {
    const schemaTypes = ['product', 'tutorial', 'review', 'virtual-tryon'];
    await Promise.all(schemaTypes.map(type => this.loadSchema(type)));
  }
}

export const schemaManager = new SchemaManager();
export default schemaManager;

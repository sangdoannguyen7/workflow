import {
  ITemplate,
  ITemplateResponse,
  ITemplateSearchParams,
} from "../../interface/template.interface";
import { ITemplateApi } from "./api.template.interface";
import {
  getMockTemplates,
  getMockTemplateById,
  getMockTemplateByCode,
  getMockTemplatesByAgent,
  mockTemplates,
} from "../../mock/template.mock";

class TemplateApi implements ITemplateApi {
  private nextId = Math.max(...mockTemplates.map((t) => t.templateId || 0)) + 1;

  async getTemplates(
    params?: ITemplateSearchParams
  ): Promise<ITemplateResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockTemplates(params));
      }, 300);
    });
  }

  async getTemplateById(id: number): Promise<ITemplate> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const template = getMockTemplateById(id);
        if (template) {
          resolve(template);
        } else {
          reject(new Error("Template not found"));
        }
      }, 200);
    });
  }

  async createTemplate(
    template: Omit<ITemplate, "templateId">
  ): Promise<ITemplate> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTemplate: ITemplate = {
          ...template,
          templateId: this.nextId++,
          search:
            `${template.templateCode} ${template.templateName} ${template.templateType} ${template.statusName}`.toLowerCase(),
        };
        mockTemplates.push(newTemplate);
        resolve(newTemplate);
      }, 500);
    });
  }

  async updateTemplate(id: number, template: ITemplate): Promise<ITemplate> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockTemplates.findIndex((t) => t.templateId === id);
        if (index !== -1) {
          const updatedTemplate = {
            ...template,
            templateId: id,
            search:
              `${template.templateCode} ${template.templateName} ${template.templateType} ${template.statusName}`.toLowerCase(),
          };
          mockTemplates[index] = updatedTemplate;
          resolve(updatedTemplate);
        } else {
          reject(new Error("Template not found"));
        }
      }, 500);
    });
  }

  async deleteTemplate(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockTemplates.findIndex((t) => t.templateId === id);
        if (index !== -1) {
          mockTemplates.splice(index, 1);
          resolve();
        } else {
          reject(new Error("Template not found"));
        }
      }, 300);
    });
  }

  async getTemplateByCode(code: string): Promise<ITemplate> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const template = getMockTemplateByCode(code);
        if (template) {
          resolve(template);
        } else {
          reject(new Error("Template not found"));
        }
      }, 200);
    });
  }

  async getTemplatesByAgent(agentCode: string): Promise<ITemplate[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockTemplatesByAgent(agentCode));
      }, 200);
    });
  }
}

export default new TemplateApi();

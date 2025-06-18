import {
  ITemplate,
  ITemplateResponse,
  ITemplateSearchParams,
} from "../../interface/template.interface";

export interface ITemplateApi {
  getTemplates(params?: ITemplateSearchParams): Promise<ITemplateResponse>;
  getTemplateById(id: number): Promise<ITemplate>;
  createTemplate(template: Omit<ITemplate, "templateId">): Promise<ITemplate>;
  updateTemplate(id: number, template: ITemplate): Promise<ITemplate>;
  deleteTemplate(id: number): Promise<void>;
  getTemplateByCode(code: string): Promise<ITemplate>;
  getTemplatesByAgent(agentCode: string): Promise<ITemplate[]>;
}

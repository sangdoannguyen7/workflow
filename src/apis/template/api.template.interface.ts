import {
  ITemplate,
  ITemplateResponse,
  ITemplateSearchParams,
  ITemplateRequest,
} from "../../interface/template.interface";

export interface ITemplateApi {
  getTemplates(params?: ITemplateSearchParams): Promise<ITemplateResponse>;
  getTemplateById(id: number): Promise<ITemplate>;
  createTemplate(templateRequest: ITemplateRequest): Promise<ITemplate>;
  updateTemplate(
    templateCode: string,
    templateRequest: ITemplateRequest
  ): Promise<ITemplate>;
  deleteTemplate(id: number): Promise<void>;
  getTemplateByCode(code: string): Promise<ITemplate>;
  getTemplatesByAgent(agentCode: string): Promise<ITemplate[]>;
  initializeTemplates(initializationCode: string): Promise<ITemplate[]>;
}

export interface IAgent {
  agentId?: number;
  agentCode: string;
  agentName: string;
  statusCode: string;
  statusName: string;
  description?: string;
}

export interface IAgentSearchParams {
  search?: string;
  sorter?: string;
  current?: number;
  pageSize?: number;
}

export interface IAgentResponse {
  content: IAgent[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// API Response wrappers
export interface PageImplResponse<T> {
  content: T[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}


  export interface CompanyType {

  }

  export interface CompanyResponseType {
    success: boolean;
    data?: CompanyType | CompanyType[];
    message: string
  }
  
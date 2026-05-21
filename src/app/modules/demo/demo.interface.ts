export interface DemoType {}

export interface DemoResponseType {
  success: boolean;
  data?: DemoType | DemoType[];
  message: string;
}

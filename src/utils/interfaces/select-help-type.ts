export interface IQueryType {
  id: string;
  label: string;
  value: string;
}
export interface ISelectHelpTypeFormData {
  queryType: IQueryType;
  message: string;
  orderId: string;
}

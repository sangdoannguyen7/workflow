export interface ITransfer<T> {
  dataSource: T[];
  targetKeys: string[];
  selectKeys: string[]
}
import { ColumnData } from '../types/columnData';

export interface DBBase<T> {
  config(conf:T):DBBase<T>
  getData(): Promise<ColumnData[]>
}
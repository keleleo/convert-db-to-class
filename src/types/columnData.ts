import { ColumnType } from './columnType'

export type ColumnData = {
  tableName: string,
  columnName: string,
  isPK: boolean,
  isUnique: boolean,
  isFK: boolean,
  fkTableName: string,
  fkColumnName: string,
  type: ColumnType
}
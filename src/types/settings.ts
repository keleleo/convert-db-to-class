export type ConvertConfigs = {
  lang: LangType
  db: DBType
}

export enum DBType {
  'PostgreSql' = 'PostgreSql'
}

export enum LangType {
  'JS' = 'JS',
  'TS' = 'TS'
}
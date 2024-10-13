import { JsBuilder } from './builders/jsBuilder';
import { TsBuilder } from './builders/tsBuilder';
import { Postgres } from './db/postgress';
import { ColumnData } from './types/columnData';
import { FileData } from './types/fileData';
import { PgConfig } from './types/pgConfig';
import { ConvertConfigs, DBType, LangType } from './types/settings';
import fs from 'fs'

export async function convert(config: ConvertConfigs, dbConfig: any, path: string) {
  const data: ColumnData[] = await getData(config, dbConfig)

  const builder = getBuilder(config)
  const fileData = new builder()
    .data(data)
    .build()
  for (const fd of fileData) {
    createFile(fd, path)
  }
}

function getBuilder(config: ConvertConfigs) {
  if (config.lang == LangType.JS) return JsBuilder
  if (config.lang == LangType.TS) return TsBuilder
  return JsBuilder
}
async function getData(config: ConvertConfigs, dbConfig: any): Promise<ColumnData[]> {
  if (config.db == DBType.PostgreSql) return getPgData(dbConfig as PgConfig)

  return []
}
async function getPgData(dbSettings: PgConfig): Promise<ColumnData[]> {
  return await new Postgres()
    .config(dbSettings)
    .getData()
}

async function createFile(fileData: FileData, path: string) {
  await fs.writeFileSync(`${path}/${fileData.name}`, fileData.content)
}
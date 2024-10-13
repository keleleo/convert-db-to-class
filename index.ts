import inquirer from 'inquirer';
import { getPgConfig, PgConfig } from './src/types/pgConfig';
import { LangType, DBType, ConvertConfigs } from './src/types/settings';
import p from 'path'
import fs from 'fs'
import { convert } from './src';

const PATH = p.resolve('./dist')

async function init() {
  await fs.mkdirSync(PATH, { recursive: true })
  var config
  var dbConfig
  if (process.argv.includes('--config-file')) {
    const data = require('./config.json');
    config = data.convert
    dbConfig = data.connection
  } else {
    config = await getConfig()
    dbConfig = await getDbConfig(config)
  }

  convert(config, dbConfig, PATH)
}

async function getDbConfig(config: ConvertConfigs) {
  if (config.db == DBType.PostgreSql) return getPgConfig()
}

async function getConfig() {
  return await inquirer.prompt([
    {
      name: 'lang',
      message: 'Convert to ',
      type: 'select',
      choices: Object.keys(LangType)
    },
    {
      name: 'db',
      message: 'DB',
      type: 'select',
      choices: Object.keys(DBType)
    },
  ]) as ConvertConfigs;
}

init();
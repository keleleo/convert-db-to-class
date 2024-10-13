import inquirer from 'inquirer'

export type PgConfig = {
  user: string
  database: string
  port: number
  host: string
  password: string
  ssl: boolean
}

export async function getPgConfig() {
  return await inquirer.prompt([
    {
      name: 'user',
      message: 'User',
      type: 'input',
      required: true,
      default:'postgres'
    },
    {
      name: 'database',
      message: 'Database',
      type: 'input',
      required:true
    },
    {
      name: 'port',
      message: 'Port',
      type: 'number',
      required:true,
      default:5432
    },
    {
      name: 'host',
      message: 'Host',
      type: 'input',
      required:true,
      default:'localhost'
    },
    {
      name: 'password',
      message: 'Password',
      type: 'password',
    },
    {
      name: 'ssl',
      message: 'SSL',
      type: 'confirm',
      default:false
    },
  ]) as PgConfig;
}
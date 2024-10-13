import { Client } from 'pg';
import { ColumnData } from '../types/columnData';
import { DBBase } from './db.base';
import fs from 'fs'
import { PgConfig } from '../types/pgConfig';

const SQL = fs.readFileSync('./src/db/postgress.sql').toString()


export class Postgres<T extends PgConfig> implements DBBase<T> {
  private client: Client | null = null

  config(conf: T): DBBase<T> {
    this.client = new Client({
      user: conf.user,
      database: conf.database,
      port: conf.port,
      host: conf.host,
      password: conf.password,
      ssl: conf.ssl
    })
    this.client.connect()
    
    return this
  }

  async getData(): Promise<ColumnData[]> {
    if (!this.client) throw new Error('config is not defined')

    try {
      const res = await this.client.query<ColumnData>(SQL)
      this.client?.end();
      return res.rows;
    } catch (ex) {
      console.error(ex);

      return []
    }
  }

}
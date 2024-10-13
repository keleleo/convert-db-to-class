import { ColumnData } from '../types/columnData';
import { FileData } from '../types/fileData';

export abstract class BuilderBase {
  readonly SPACE = 2;
  protected _data: Map<string, ColumnData[]> = new Map()

  data(data: ColumnData[]) {
    for (const d of data) {
      this.pushColumnData(d)
    }
    return this
  }

  public abstract build(): Generator<FileData, void, unknown>


  private pushColumnData(data: ColumnData) {
    const { tableName } = data
    if (!this._data.has(tableName)) {
      this._data.set(tableName, [data])
      return;
    }
    this._data.get(tableName)?.push(data)
  }


  protected formatColumn(name: string): string {
    return name.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
  }

  protected formatTable(name: string): string {
    return name.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
      .replace(/^([a-z])/, (match, letter) => letter.toUpperCase())
  }


  spc(level: number): string {
    return ' '.repeat(this.SPACE * level)
  }
}
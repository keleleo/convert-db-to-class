import { ColumnData } from '../types/columnData';
import { ColumnType } from '../types/columnType';
import { FileData } from '../types/fileData';
import { BuilderBase } from './build.base';

export class JsBuilder extends BuilderBase {
  * build(): Generator<FileData, void, unknown> {
    for (const cd of this._data.values()) {
      const clss = this.createClass(cd)

      yield {
        name: this.formatTable(cd[0].tableName) + '.js',
        content: clss
      } as FileData
    }
  }

  createClass(cd: ColumnData[]) {
    const name = this.formatTable(cd[0].tableName)
    return `module.exports = class ${name} {\n${this.createAttr(cd)}\n}`
  }

  createAttr(cd: ColumnData[]) {
    return cd.map(data => {
      return this.spc(1)
        + this.formatColumn(data.columnName)
        + '  //'
        + this.getType(data.type)

    }).join('\n')
  }

  getType(type: ColumnType) {
    const temp: { [key in ColumnType]: string } = {
      [ColumnType.string]: 'string',
      [ColumnType.number]: 'number',
      [ColumnType.boolean]: 'boolean',
      [ColumnType.date]: 'Date'
    }
    return temp[type]
  }


}

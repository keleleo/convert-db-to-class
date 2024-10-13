import { ColumnData } from '../types/columnData';
import { ColumnType } from '../types/columnType';
import { FileData } from '../types/fileData';
import { BuilderBase } from './build.base';

export class TsBuilder extends BuilderBase {
  * build(): Generator<FileData, void, unknown> {
    for (const cd of this._data.values()) {
      const clss: string = this.createFile(cd);
      yield {
        name: this.formatTable(cd[0].tableName) + '.ts',
        content: clss
      } as FileData
    }
  }

  createFile(cd: ColumnData[]): string {
    const imp = this.createImport(cd)
    return imp
      + (imp && '\n')
      + this.createClass(cd)
  }

  createClass(cd: ColumnData[]): string {
    const name = this.formatTable(cd[0].tableName)
    const attr = this.createAttrList(cd)
    return `export class ${name} {\n`
      + attr.map(m => this.spc(1) + m).join('\n')
      + '\n\n'
      + this.createConstructor(attr, cd)
      + '\n}'
  }

  createConstructor(attr: string[], cd: ColumnData[]) {
    return this.spc(1)
      + 'constructor ('
      + attr.join(', ')
      + ') {\n'
      + cd.map(m => {
        const n = this.formatColumn(m.columnName)
        return `${this.spc(2)}this.${n} = ${n}`
      }).join('\n')
      + '\n'
      + this.spc(1)
      + '}'
  }

  createAttrList(cd: ColumnData[]): string[] {
    return cd.map(m=> this.createAttr(m))
  }

  createAttr(cd: ColumnData) {
    return `${this.formatColumn(cd.columnName)}: ${this.getType(cd)}`
  }

  getType(m: ColumnData): string {
    if (m.isFK) return this.formatTable(m.fkTableName)
    const temp: { [key in ColumnType]: string } = {
      [ColumnType.string]: 'string',
      [ColumnType.number]: 'number',
      [ColumnType.boolean]: 'boolean',
      [ColumnType.date]: 'Date'
    }
    return temp[m.type]
  }

  createImport(cd: ColumnData[]): string {
    return cd.filter(f => f.isFK).map(m=>this.createImportLine(m)).join('\n')
  }

  createImportLine(cd: ColumnData) {
    const n = this.formatTable(cd.fkTableName)
    return `import { ${n} } from './${n}'`
  }
}
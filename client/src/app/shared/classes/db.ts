import ColumnData from './column-data';

/** DB */
export default class Db {
  /** DB 物理名 */
  dbName: string;
  /** DB 論理名 */
  dbDisplayName: string;
  /** シーケンス値 */
  seq: number;
  /** カラム定義 */
  columns: Array<ColumnData>;
  /** データ */
  data: Array<any>;
}

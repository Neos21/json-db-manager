/** カラム定義 */
export class ColumnData {
  /** カラム物理名 */
  name: string;
  /** カラム物理名 (変更前の値・カラム名変更時に追跡するため) */
  originalName: string;
  /** カラム論理名 */
  displayName: string;
  /** 型 : `id`・`text`・`date` */
  type: string;
  /** 必須項目かどうか */
  required: boolean;
}

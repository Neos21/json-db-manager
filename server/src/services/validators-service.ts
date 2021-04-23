/**
 * 値があるかどうか検証する
 * 
 * @param value 値
 * @returns 空値なら `true`・値があれば `false``
 */
export function isEmptyString(value: string | null | undefined): boolean {
  return value == null || value.trim() === '';
}

/** カラムの型 */
export const columnTypes = ['id', 'text', 'date'];

/** 英小文字・数字・ハイフンのみのパターン */
export const regExpForName = new RegExp('^[a-z0-9-]+$');

/** エラーメッセージ定義 */
export const errorMessages = {
  // リクエストボディ
  requestBodyEmpty         : 'Request Body Is Empty',
  // DB 物理名
  dbNameRequired           : 'DB Name Is Required',
  dbNameInvalid            : 'Invalid DB Name Pattern',
  // DB 論理名
  dbDisplayNameRequired    : 'DB Display Name Is Required',
  // カラム定義
  columnsEmpty             : 'Columns Is Empty',
  // カラム定義 … カラム物理名
  columnNameRequired       : 'Column Name Is Required',
  columnNameInvalid        : 'Invalid Column Name Pattern',
  columnNameDuplicated     : 'Duplicated Column Names',
  // カラム定義 … カラム論理名
  columnDisplayNameRequired: 'Column Display Name Is Required',
  // カラム定義 … 型
  columnTypeRequired       : 'Column Type Is Required',
  columnTypeInvalid        : 'Invalid Column Type',
  // カラム定義 … 必須
  columnRequiredRequired   : 'Column Required Is Required',
  columnRequiredInvalid    : 'Invalid Column Required',
  // カラム定義 … ID カラムの存在チェック
  noIdColumn               : 'ID Column Does Not Exist',
  // DB ファイル
  dbFileIsAlreadyExist     : 'The DB File Is Already Exist',
  dbFileDoesNotExist       : 'The DB File Does Not Exist',
  // シーケンス値
  seqRequired              : 'Sequence Number Is Required',
  seqInvalid               : 'Invalid Sequence Number',
};

import { promises as fs } from 'fs';
import path from 'path';

import constants from '../constants';
import { isFileExist, jsonStringifyFormatted } from '../services/file-utils-service';
import { columnTypes, errorMessages, isEmptyString, regExpForName } from '../services/validators-service';

// `YYYY-MM-DD` 形式を雑に検索する正規表現
const regExpDate = new RegExp('^[0-9]{4}-[0-1][0-9]-[0-3][0-9]$');

/**
 * DB カラムを更新する
 * 
 * @param req リクエスト
 * @param res レスポンス
 */
export default async function dbColumnUpdateController(req, res) {
  try {
    const postDb = req.body;
    if(postDb == null) throw new Error(errorMessages.requestBodyEmpty);
    
    const dbName  = postDb.dbName;
    const columns = postDb.columns;
    
    // DB 物理名
    if(isEmptyString(dbName)      ) throw new Error(errorMessages.dbNameRequired);
    if(!regExpForName.test(dbName)) throw new Error(errorMessages.dbNameInvalid);
    // ファイルの存在チェック
    const dbFilePath = path.join(constants.dbDirectoryPath, `${dbName}.json`);
    if(! await isFileExist(dbFilePath)) throw new Error(errorMessages.dbFileDoesNotExist);
    
    // カラム定義チェック
    if(columns == null || !columns.length) throw new Error(errorMessages.columnsEmpty);
    columns.forEach((column) => {
      if(isEmptyString(column.name)          ) throw new Error(errorMessages.columnNameRequired);
      if(!regExpForName.test(column.name)    ) throw new Error(errorMessages.columnNameInvalid);
      if(isEmptyString(column.displayName)   ) throw new Error(errorMessages.columnDisplayNameRequired);
      if(isEmptyString(column.type)          ) throw new Error(errorMessages.columnTypeRequired);
      if(!columnTypes.includes(column.type)  ) throw new Error(errorMessages.columnTypeInvalid);
      if(column.required == null             ) throw new Error(errorMessages.columnRequiredRequired);
      if(typeof column.required !== 'boolean') throw new Error(errorMessages.columnRequiredInvalid);
    });
    // ID カラム必須
    const hasIdColumn = columns.some((column) => column.type === 'id' && column.name === 'id');
    if(!hasIdColumn) throw new Error(errorMessages.noIdColumn);
    // カラム名の重複チェック
    const columnNames = columns.map((column) => column.name);
    const columnNamesSet = new Set(columnNames);  // 重複した値がセットされない Set を利用する
    if(columnNames.length !== columnNamesSet.size) throw new Error(errorMessages.columnNameDuplicated);
    
    // 元ファイルを読み込む
    const dbFileText = await fs.readFile(dbFilePath, 'utf-8');
    const db = JSON.parse(dbFileText);
    
    // 削除されたカラム : 元ファイルの `name` と、リクエストボディの `originalName` を比較する
    const originalColumnNames = columns.map((column) => column.originalName);
    const deletedColumns = db.columns.filter((beforeColumn) => !originalColumnNames.includes(beforeColumn.name));
    // カラム名の変更 : 新規カラムではなく `originalName` と `name` が異なるカラム
    const renamedColumns = columns.filter((column) => column.originalName !== '' && column.name !== column.originalName);
    // 新規追加カラム
    const newColumns = columns.filter((column) => column.originalName === '');
    // カラムの型変更 : 現状は `text` から `date` に変更する際、値が `YYYY-MM-DD` でない場合に空値にする
    const typeChangedTextToDateColumns = columns.filter((column) => {
      const beforeColumn = db.columns.find((beforeColumn) => beforeColumn.name === column.originalName);
      if(!beforeColumn) return false;  // 新規追加カラムは除外する
      return (beforeColumn.type === 'text' && column.type === 'date');
    });
    
    // 既存データのカラムを操作する
    const newData = db.data.map((row) => {
      // 削除されたカラムを削除する
      deletedColumns.forEach((deletedColumn) => {
        delete row[deletedColumn.name];
      });
      // カラム名を変更する
      renamedColumns.forEach((renamedColumn) => {
        row[renamedColumn.name] = row[renamedColumn.originalName];
        delete row[renamedColumn.originalName];
      });
      // 追加されたカラムを追加する
      newColumns.forEach((newColumn) => {
        row[newColumn.name] = '';
      });
      // 型変更 : `text` から `date` への変更かつ、値が `YYYY-MM-DD` でないデータは空値に変更する
      typeChangedTextToDateColumns.forEach((typeChangedTextToDateColumn) => {
        const value = row[typeChangedTextToDateColumn.name];
        if(value === '' || regExpDate.test(value)) return;  // 空値や `YYYY-MM-DD` 形式の場合は何もしない
        row[typeChangedTextToDateColumn.name] = '';
      });
      
      // 更新後のカラム名の順序どおりに行データを並べ替える
      const newRow = {};
      columnNames.forEach((columnName) => {
        newRow[columnName] = row[columnName];
      });
      return newRow;
    });
    db.data = newData;
    
    // カラム定義を差し替える
    columns.forEach((column) => { delete column.originalName; });  // `originalName` は保存しない
    db.columns = columns;
    
    // ファイル保存
    const text = jsonStringifyFormatted(db);
    await fs.writeFile(dbFilePath, text, 'utf-8');
    
    res.status(200);
    res.json({ result: 'DB Column Updated' });
  }
  catch(error) {
    res.status(500);
    const errorMessage = Object.values(errorMessages).includes(error.message) ? error.message : 'Failed To Update DB Column';
    res.json({ error: errorMessage, errorDetals: error });
  }
}

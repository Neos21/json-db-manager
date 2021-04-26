import { promises as fs } from 'fs';
import path from 'path';

import constants from '../constants';
import { isFileExist, jsonStringifyFormatted } from '../services/file-utils-service';
import { columnTypes, errorMessages, isEmptyString, regExpForName } from '../services/validators-service';

/**
 * DB を新規作成する
 * 
 * @param req リクエスト
 * @param res レスポンス
 */
export default async function dbCreateController(req, res) {
  try {
    const postDb = req.body;
    if(postDb == null) throw new Error(errorMessages.requestBodyEmpty);
    
    const dbName        = postDb.dbName;
    const dbDisplayName = postDb.dbDisplayName;
    const postColumns   = postDb.columns;
    
    // DB 物理名
    if(isEmptyString(dbName)      ) throw new Error(errorMessages.dbNameRequired);
    if(!regExpForName.test(dbName)) throw new Error(errorMessages.dbNameInvalid);
    // ファイルの存在チェック
    const dbFilePath = path.join(constants.dbDirectoryPath, `${dbName}.json`);
    if(await isFileExist(dbFilePath)) throw new Error(errorMessages.dbFileIsAlreadyExist);
    
    // DB 論理名
    if(isEmptyString(dbDisplayName)) throw new Error(errorMessages.dbDisplayNameRequired);
    
    // カラム定義チェック
    if(postColumns == null || !postColumns.length) throw new Error(errorMessages.columnsEmpty);
    const columns = postColumns.map((column) => {
      if(isEmptyString(column.name)          ) throw new Error(errorMessages.columnNameRequired);
      if(!regExpForName.test(column.name)    ) throw new Error(errorMessages.columnNameInvalid);
      if(isEmptyString(column.displayName)   ) throw new Error(errorMessages.columnDisplayNameRequired);
      if(isEmptyString(column.type)          ) throw new Error(errorMessages.columnTypeRequired);
      if(!columnTypes.includes(column.type)  ) throw new Error(errorMessages.columnTypeInvalid);
      if(column.required == null             ) throw new Error(errorMessages.columnRequiredRequired);
      if(typeof column.required !== 'boolean') throw new Error(errorMessages.columnRequiredInvalid);
      // `originalName` はこの時点で破棄する
      return {
        'name'        : column.name,
        'display-name': column.displayName,
        'type'        : column.type,
        'required'    : column.required
      };
    });
    // ID カラム必須
    const hasIdColumn = postColumns.some((column) => column.type === 'id' && column.name === 'id');
    if(!hasIdColumn) throw new Error(errorMessages.noIdColumn);
    // カラム名の重複チェック
    const columnNames = postColumns.map((column) => column.name);
    const columnNamesSet = new Set(columnNames);  // 重複した値がセットされない Set を利用する
    if(columnNames.length !== columnNamesSet.size) throw new Error(errorMessages.columnNameDuplicated);
    
    // DB データを準備する
    const db = {
      'db-name'        : dbName,
      'db-display-name': dbDisplayName,
      'columns'        : columns,
      'seq'            : 0,  // ID を利用したシーケンスを定義する (+1 した値を使用するので 1 から始まるようにする)
      'data'           : []  // データを格納する配列を定義しておく
    };
    
    // ファイル保存
    const text = jsonStringifyFormatted(db);
    await fs.writeFile(dbFilePath, text, 'utf-8');
    
    res.status(200);
    res.json({ result: 'DB Created' });
  }
  catch(error) {
    res.status(500);
    const errorMessage = Object.values(errorMessages).includes(error.message) ? error.message : 'Failed To Create DB';
    res.json({ error: errorMessage, errorDetals: error });
  }
}

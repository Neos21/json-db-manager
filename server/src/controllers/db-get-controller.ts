import { promises as fs } from 'fs';
import path from 'path';

import constants from '../constants';
import { isFileExist } from '../services/file-utils-service';
import { errorMessages, isEmptyString, regExpForName } from '../services/validators-service';

/**
 * DB 1件を取得する
 * 
 * @param req リクエスト
 * @param res レスポンス
 */
export default async function dbGetController(req, res) {
  try {
    const dbName = req.query.dbName;
    if(isEmptyString(dbName)      ) throw new Error(errorMessages.dbNameRequired);
    if(!regExpForName.test(dbName)) throw new Error(errorMessages.dbNameInvalid);
    
    // ファイルが存在しなければエラーとする
    const dbFilePath = path.join(constants.dbDirectoryPath, `${dbName}.json`);
    if(! await isFileExist(dbFilePath)) throw new Error(errorMessages.dbFileDoesNotExist);
    
    // ファイル取得
    const dbFileText = await fs.readFile(dbFilePath, 'utf-8');
    const db = JSON.parse(dbFileText);
    
    // データ加工
    db.dbName = db['db-name'];
    db.dbDisplayName = db['db-display-name'];
    db.columns.forEach((column) => {
      column.displayName  = column['display-name'];
      delete column['display-name'];
      column.originalName = column.name;  // `originalName` を用意しておく
    });
    
    res.status(200);
    res.json({ result: db });
  }
  catch(error) {
    res.status(500);
    const errorMessage = Object.values(errorMessages).includes(error.message) ? error.message : 'Failed To Get DB';
    res.json({ error: errorMessage, errorDetals: error });
  }
}

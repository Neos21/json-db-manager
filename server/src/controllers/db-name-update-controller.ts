import { promises as fs } from 'fs';
import path from 'path';

import constants from '../constants';
import { isFileExist, jsonStringifyFormatted } from '../services/file-utils-service';
import { errorMessages, isEmptyString, regExpForName } from '../services/validators-service';

/**
 * DB 物理名を更新する
 * 
 * @param req リクエスト
 * @param res レスポンス
 */
export default async function dbNameUpdateController(req, res) {
  try {
    const dbName    = req.body.dbName;
    const newDbName = req.body.newDbName;
    
    // 必須チェック
    if(isEmptyString(dbName)       || isEmptyString(newDbName)      ) throw new Error(errorMessages.dbNameRequired);
    if(!regExpForName.test(dbName) || !regExpForName.test(newDbName)) throw new Error(errorMessages.dbNameInvalid);
    
    // 元ファイルが存在しない場合はエラーとする
    const dbFilePath = path.join(constants.dbDirectoryPath, `${dbName}.json`);
    if(! await isFileExist(dbFilePath)) throw new Error(errorMessages.dbFileDoesNotExist);
    
    // 変更後ファイルが既に存在する場合はエラーとする
    const newDbFilePath = path.join(constants.dbDirectoryPath, `${newDbName}.json`);
    if(await isFileExist(newDbFilePath)) throw new Error(errorMessages.dbFileIsAlreadyExist);
    
    // 元ファイルを読み込む
    const dbFileText = await fs.readFile(dbFilePath, 'utf-8');
    const db = JSON.parse(dbFileText);
    
    // ファイル内の DB 物理名を更新する
    db['db-name'] = newDbName;
    
    // 新ファイル名で書き換えた内容を保存する
    const text = jsonStringifyFormatted(db);
    await fs.writeFile(newDbFilePath, text, 'utf-8');
    
    // 元ファイルを削除する
    await fs.unlink(dbFilePath);
    
    res.status(200);
    res.json({ result: 'DB Name Updated' });
  }
  catch(error) {
    res.status(500);
    const errorMessage = Object.values(errorMessages).includes(error.message) ? error.message : 'Failed To Update DB Name';
    res.json({ error: errorMessage, errorDetals: error });
  }
}

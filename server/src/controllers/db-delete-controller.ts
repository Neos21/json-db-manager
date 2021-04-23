import { promises as fs } from 'fs';
import path from 'path';

import constants from '../constants';
import { isFileExist } from '../services/file-utils-service';
import { errorMessages, isEmptyString, regExpForName } from '../services/validators-service';

/**
 * DB を削除する
 * 
 * @param req リクエスト
 * @param res レスポンス
 */
export default async function dbDeleteController(req, res) {
  try {
    const dbName = req.query.dbName;
    if(isEmptyString(dbName)      ) throw new Error(errorMessages.dbNameRequired);
    if(!regExpForName.test(dbName)) throw new Error(errorMessages.dbNameInvalid);
    
    // ファイルが存在しなければエラーとする
    const dbFilePath = path.join(constants.dbDirectoryPath, `${dbName}.json`);
    if(! await isFileExist(dbFilePath)) throw new Error(errorMessages.dbFileDoesNotExist);
    
    // ファイル削除
    await fs.unlink(dbFilePath);
    
    res.status(200);
    res.json({ result: 'DB Deleted' });
  }
  catch(error) {
    res.status(500);
    const errorMessage = Object.values(errorMessages).includes(error.message) ? error.message : 'Failed To Delete DB';
    res.json({ error: errorMessage, errorDetals: error });
  }
}

import { promises as fs } from 'fs';
import path from 'path';

import constants from '../constants';
import isFileExistService from '../services/is-file-exist-service';

const errorMessageDbFileDoesNotExist = 'The DB File Does Not Exist';

/**
 * DB 1件を取得する
 * 
 * @param req リクエスト
 * @param res レスポンス
 */
export default async function dbGetController(req, res) {
  try {
    const dbName = req.query.dbName;
    
    // ファイルが存在しなければエラーとする
    const dbFilePath = path.join(constants.dbDirectoryPath, `${dbName}.json`);
    if(await !isFileExistService(dbFilePath)) throw new Error(errorMessageDbFileDoesNotExist);
    
    // ファイル取得
    const dbFileText = await fs.readFile(dbFilePath, 'utf-8');
    const db = JSON.parse(dbFileText);
    
    res.status(200);
    res.json({ result: db });
  }
  catch(error) {
    console.log('ERR', error);
    res.status(500);
    const errorMessage = (error.message === errorMessageDbFileDoesNotExist) ? errorMessageDbFileDoesNotExist : 'Failed To Get DB';
    res.json({ error: errorMessage, errorDetals: error });
  }
}

import { promises as fs } from 'fs';

import constants from '../constants';
import jsonStringifyFormatted from '../services/json-stringify-formatted-service';
import path from 'path';
import isFileExistService from '../services/is-file-exist-service';

const errorMessageDbFileDoesNotExist = 'The DB File Does Not Exist';

/**
 * DB を削除する
 * 
 * @param req リクエスト
 * @param res レスポンス
 */
export default async function dbDeleteController(req, res) {
  try {
    const dbName = req.query.dbName;
    
    // ファイルが存在しなければエラーとする
    const dbFilePath = path.join(constants.dbDirectoryPath, `${dbName}.json`);
    if(await !isFileExistService(dbFilePath)) throw new Error(errorMessageDbFileDoesNotExist);
    
    // ファイル削除
    await fs.unlink(dbFilePath);
    
    res.status(200);
    res.json({ result: 'DB Deleted' });
  }
  catch(error) {
    res.status(500);
    const errorMessage = (error.message === errorMessageDbFileDoesNotExist) ? errorMessageDbFileDoesNotExist : 'Failed To Delete DB';
    res.json({ error: errorMessage, errorDetals: error });
  }
}

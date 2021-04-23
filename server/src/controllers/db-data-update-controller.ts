import { promises as fs } from 'fs';

import constants from '../constants';
import jsonStringifyFormatted from '../services/json-stringify-formatted-service';
import path from 'path';
import isFileExistService from '../services/is-file-exist-service';

const errorMessageDbFileDoesNotExist = 'The DB File Does Not Exist';

/**
 * DB データを更新する
 * 
 * @param req リクエスト
 * @param res レスポンス
 */
export default async function dbDataUpdateController(req, res) {
  try {
    const postDb = req.body;  // TODO : 値のバリデーション
    
    // ファイルの存在チェック
    const dbName = postDb.dbName;
    const dbFilePath = path.join(constants.dbDirectoryPath, `${dbName}.json`);
    if(! await isFileExistService(dbFilePath)) throw new Error(errorMessageDbFileDoesNotExist);
    
    // 元ファイルを読み込む
    const dbFileText = await fs.readFile(dbFilePath, 'utf-8');
    const db = JSON.parse(dbFileText);
    
    // 値を差し替える
    db.dbDisplayName = postDb.dbDisplayName;
    db.seq           = postDb.seq;
    db.data          = postDb.data;
    
    // ファイル保存
    const text = jsonStringifyFormatted(db);
    await fs.writeFile(dbFilePath, text, 'utf-8');
    
    res.status(200);
    res.json({ result: 'DB Data Updated' });
  }
  catch(error) {
    res.status(500);
    const errorMessage = (error.message === errorMessageDbFileDoesNotExist) ? errorMessageDbFileDoesNotExist : 'Failed To Update DB Data';
    res.json({ error: errorMessage, errorDetals: error });
  }
}

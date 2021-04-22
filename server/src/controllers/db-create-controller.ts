import { promises as fs } from 'fs';

import constants from '../constants';
import jsonStringifyFormatted from '../services/json-stringify-formatted-service';
import path from 'path';
import isFileExistService from '../services/is-file-exist-service';

const errorMessageDbFileIsAlreadyExist = 'The DB File Is Already Exist';

/**
 * DB を新規作成する
 * 
 * @param req リクエスト
 * @param res レスポンス
 */
export default async function dbCreateController(req, res) {
  try {
    const db = req.body;  // TODO : 値のバリデーション
    db.seq  = 0 ;  // ID を利用したシーケンスを定義する (+1 した値を使用するので 1 から始まるようにする)
    db.data = [];  // データを格納する配列を定義しておく
    
    // ファイルの存在チェック
    const dbName = db.dbName;
    const dbFilePath = path.join(constants.dbDirectoryPath, `${dbName}.json`);
    if(await isFileExistService(dbFilePath)) throw new Error(errorMessageDbFileIsAlreadyExist);
    
    // ファイル保存
    const text = jsonStringifyFormatted(db);
    await fs.writeFile(dbFilePath, text, 'utf-8');
    
    res.status(200);
    res.json({ result: 'DB Created' });
  }
  catch(error) {
    res.status(500);
    const errorMessage = (error.message === errorMessageDbFileIsAlreadyExist) ? errorMessageDbFileIsAlreadyExist : 'Failed To Create DB';
    res.json({ error: errorMessage, errorDetals: error });
  }
}

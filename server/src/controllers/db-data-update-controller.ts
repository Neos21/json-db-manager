import { promises as fs } from 'fs';

import constants from '../constants';
import jsonStringifyFormatted from '../services/json-stringify-formatted-service';
import path from 'path';
import isFileExistService from '../services/is-file-exist-service';
import { columnTypes, errorMessages, isEmptyString, regExpForName } from '../services/validators-service';

/**
 * DB データを更新する
 * 
 * @param req リクエスト
 * @param res レスポンス
 */
export default async function dbDataUpdateController(req, res) {
  try {
    const postDb = req.body;  // TODO : 値のバリデーション
    if(postDb == null) throw new Error(errorMessages.requestBodyEmpty);
    
    const dbName        = postDb.dbName;
    const dbDisplayName = postDb.dbDisplayName;
    const seq           = postDb.seq;
    const data          = postDb.data;
    
    if(isEmptyString(dbName)      ) throw new Error(errorMessages.dbNameRequired);
    if(!regExpForName.test(dbName)) throw new Error(errorMessages.dbNameInvalid);
    
    // ファイルの存在チェック
    const dbFilePath = path.join(constants.dbDirectoryPath, `${dbName}.json`);
    if(! await isFileExistService(dbFilePath)) throw new Error(errorMessages.dbFileDoesNotExist);
    
    if(isEmptyString(dbDisplayName)) throw new Error(errorMessages.dbDisplayNameRequired);
    if(seq == null                                                  ) throw new Error(errorMessages.seqRequired);
    if(typeof seq !== 'number' || seq <= 0 || !Number.isInteger(seq)) throw new Error(errorMessages.seqInvalid);
    
    // 元ファイルを読み込む
    const dbFileText = await fs.readFile(dbFilePath, 'utf-8');
    const db = JSON.parse(dbFileText);
    
    // カラム定義どおりのデータかどうか (変更の衝突を確認する)
    // 必須入力のカラムに入力があるかどうか
    const baseColumns = db.columns;
    const baseColumnNamesString = [...baseColumns].sort().join(',');
    data.forEach((row) => {
      const columnNamesString = Object.keys(row).sort().join(',');
      if(baseColumnNamesString !== columnNamesString) throw new Error('Columns Of Data Are In Conflict With Column Definitions');  // カラム不一致
      // TODO : 必須入力チェック
    });
    
    // 値を差し替える
    db.dbDisplayName = dbDisplayName;
    db.seq           = seq;
    db.data          = data;
    
    // ファイル保存
    const text = jsonStringifyFormatted(db);
    await fs.writeFile(dbFilePath, text, 'utf-8');
    
    res.status(200);
    res.json({ result: 'DB Data Updated' });
  }
  catch(error) {
    res.status(500);
    const errorMessage = Object.values(errorMessages).includes(error.message) ? error.message : 'Failed To Update DB Data';
    res.json({ error: errorMessage, errorDetals: error });
  }
}

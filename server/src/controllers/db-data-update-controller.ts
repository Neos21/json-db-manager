import { promises as fs } from 'fs';
import path from 'path';

import constants from '../constants';
import { isFileExist, jsonStringifyFormatted } from '../services/file-utils-service';
import { errorMessages, isEmptyString, regExpForName } from '../services/validators-service';

/**
 * DB データを更新する
 * 
 * @param req リクエスト
 * @param res レスポンス
 */
export default async function dbDataUpdateController(req, res) {
  try {
    const postDb = req.body;
    if(postDb == null) throw new Error(errorMessages.requestBodyEmpty);
    
    const dbName        = postDb.dbName;
    const dbDisplayName = postDb.dbDisplayName;
    const seq           = postDb.seq;
    const data          = postDb.data;
    
    if(isEmptyString(dbName)      ) throw new Error(errorMessages.dbNameRequired);
    if(!regExpForName.test(dbName)) throw new Error(errorMessages.dbNameInvalid);
    
    // ファイルの存在チェック
    const dbFilePath = path.join(constants.dbDirectoryPath, `${dbName}.json`);
    if(! await isFileExist(dbFilePath)) throw new Error(errorMessages.dbFileDoesNotExist);
    
    if(isEmptyString(dbDisplayName)) throw new Error(errorMessages.dbDisplayNameRequired);
    if(seq == null                                                 ) throw new Error(errorMessages.seqRequired);
    if(typeof seq !== 'number' || seq < 0 || !Number.isInteger(seq)) throw new Error(errorMessages.seqInvalid);
    
    // 元ファイルを読み込む
    const dbFileText = await fs.readFile(dbFilePath, 'utf-8');
    const db = JSON.parse(dbFileText);
    
    // カラム定義どおりのデータかどうか (変更の衝突を確認する)
    const baseColumns = db.columns;
    const baseColumnNamesString = baseColumns.map((baseColumn) => baseColumn.name).sort().join(',');
    data.forEach((row) => {
      const columnNamesString = Object.keys(row).sort().join(',');
      if(baseColumnNamesString !== columnNamesString) throw new Error(errorMessages.invalidColumnDefinitions);  // カラム不一致
      // 必須入力のカラムに入力があるかどうか
      Object.entries(row).forEach(([key, value]) => {
        const baseColumnRequired = baseColumns.find((baseColumn) => baseColumn.name === key).required;
        if(baseColumnRequired && isEmptyString(String(value))) throw new Error(errorMessages.requiredColumn);
      });
    });
    // ID カラム必須 : カラム定義とデータのカラムの一致確認はしたので、カラム定義側に ID カラムがあれば OK と判断する
    const hasIdColumn = baseColumns.some((baseColumn) => baseColumn.type === 'id' && baseColumn.name === 'id');
    if(!hasIdColumn) throw new Error(errorMessages.noIdColumn);
    
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

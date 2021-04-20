import { promises as fs } from 'fs';
import path from 'path';

import constants from '../constants';

/**
 * DB リストを取得する
 * 
 * @param _req リクエスト
 * @param res レスポンス
 */
export default async function dbListController(_req, res) {
  try {
    const dirents = await fs.readdir(constants.dbDirectoryPath, { withFileTypes: true });
    const jsonDbFiles = dirents
      .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.json'))     // JSON ファイルのみに絞る
      .map((dirent) => path.basename(dirent.name, path.extname(dirent.name)));  // 拡張子を除去する
    
    res.status(200);
    res.json({ result: jsonDbFiles });
  }
  catch(error) {
    res.status(500);
    res.json({ error: error.toString() });
  }
}

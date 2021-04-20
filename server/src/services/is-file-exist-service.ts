import { promises as fs } from 'fs';

/**
 * ファイルが存在するかどうか検証する
 * 
 * @param filePath ファイルパス
 * @return ファイルが存在したら `true`・存在しなかったら `false`
 */
export default async function isFileExistService(filePath: string): Promise<boolean> {
  return await fs.stat(filePath).then(() => true).catch(() => false);
}

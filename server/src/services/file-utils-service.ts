import { promises as fs } from 'fs';

import constants from '../constants';

/**
 * ファイルが存在するかどうか検証する
 * 
 * @param filePath ファイルパス
 * @return ファイルが存在したら `true`・存在しなかったら `false`
 */
export async function isFileExist(filePath: string): Promise<boolean> {
  return await fs.stat(filePath).then(() => true).catch(() => false);
}

/**
 * DB ディレクトリがなければ作成する
 */
export async function createDbDirectory(): Promise<void> {
  try {
    if(await isFileExist(constants.dbDirectoryPath)) return;
    await fs.mkdir(constants.dbDirectoryPath);
    console.log('Create DB Directory : DB Directory Created');
  }
  catch(error) {
    console.error('Create DB Directory : Error', error);
    throw error;
  }
}

/**
 * 2スペースインデントした JSON 文字列を返す
 * 
 * @param obj オブジェクト
 * @returns JSON 文字列
 */
export function jsonStringifyFormatted(obj: any): string {
  return JSON.stringify(obj, null, '  ') + '\n';
}

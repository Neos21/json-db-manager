/**
 * 2スペースインデントした JSON 文字列を返す
 * 
 * @param obj オブジェクト
 * @returns JSON 文字列
 */
export default function jsonStringifyFormatted(obj: any): string {
  return JSON.stringify(obj, null, '  ');
}

import path from 'path';
import dotenv from 'dotenv';

dotenv.config();  // エントリポイントよりも先に読み込まれるようなので `.env` を使用する箇所で都度呼ぶことにする

/**
 * 環境変数を取得する
 * 
 * @param variableName 環境変数名
 * @returns 環境変数の値
 * @throws 環境変数の値がない場合はエラーとする
 */
function getEnvironmentVariable(variableName) {
  const environmentVariable = process.env[variableName];
  if(environmentVariable == null || String(environmentVariable).trim() === '') throw new Error(`Environment Variable [${variableName}] Does Not Exist`);
  return environmentVariable;
}

/**
 * 定数
 */
const constants = {
  /** ログインユーザ名 */
  userName: getEnvironmentVariable('USERNAME'),
  /** ログインパスワード */
  password: getEnvironmentVariable('PASSWORD'),
  /** DB ディレクトリのパス */
  dbDirectoryPath: (() => {
    // プロジェクトルートからの相対パスとして環境変数の値を利用する
    // スラッシュ `/` 始まりの値を渡せば手前の `__dirname`・`../../` は無視されフルパスとして解決される
    const environmentVariable = getEnvironmentVariable('DB_DIRECTORY_PATH');
    return path.resolve(__dirname, '../../', environmentVariable);
  })()
};

export default constants;

/**
 * 遷移時に認証チェックを行う : 既に認証済みのユーザからのリクエストかどうかをチェックする
 * 
 * @param req リクエスト
 * @param res レスポンス
 * @param next 制御関数
 */
export default function isAuthed(req, res, next): void {
  if(req.isAuthenticated()) {
    next();
  }
  else {
    console.error('Is Authed : NG');
    res.status(401);  // HttpClient で `catch()` に移動させるため 401 を返す
    res.send({ error: 'Is Authed : NG' });  // `catch()` の仮引数 `error` 内の `error` プロパティで以下のオブジェクトが参照できる
  }
}

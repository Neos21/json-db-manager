/**
 * 遷移時に認証チェックを行う : 既に認証済みのユーザからのリクエストかどうかをチェックする
 * 
 * @param req リクエスト
 * @param res レスポンス
 * @param next 制御関数
 */
export default function isAuthedService(req, res, next): void {
  if(req.isAuthenticated()) {
    next();
  }
  else {
    res.status(401);  // HttpClient で `catch()` に移動させるため 401 を返す
    res.json({ error: 'Not Authed' });  // `catch(error)` の `error.error.error` で取得できる
  }
}

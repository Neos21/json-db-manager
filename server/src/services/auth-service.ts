import passport from 'passport';
import passportLocal from 'passport-local';
import express from 'express';

import constants from '../constants';

/**
 * Passport 初期設定
 * 
 * @param app Express アプリ
 */
export function initializePassport(app: express): void {
  app.use(passport.initialize());
  app.use(passport.session());
  // 認証ロジック
  passport.use('local', new passportLocal.Strategy({
    usernameField: 'userName',  // POST の Body から参照するフィールド名を指定する
    passwordField: 'password',
    session: true,
    passReqToCallback: true
  }, (_req, userName, password, done) => {
    if(userName === constants.userName && password === constants.password) {  // 超簡易認証
      console.info('Passport : Success To Auth', userName);
      return done(null, { userName });  // 成功・第2引数で渡す内容がシリアライズされる
    }
    else {
      console.error('Passport : Failed To Auth', userName, password);
      return done(null, false);  // 失敗
    }
  }));
  passport.serializeUser  ((auth, done) => { done(null, auth); });  // シリアライズ
  passport.deserializeUser((auth, done) => { done(null, auth); });  // デシリアライズ
}

/**
 * ログイン認証コントローラを返す
 * 
 * @returns 関数
 */
export function authController(router: express.Router, urlPath: string): void {
  router.post(urlPath, passport.authenticate('local', { session: true }), (req, res) => {
    res.json({ userName: req.user.userName });  // Angular の HttpClient がエラー扱いにしないよう JSON を返す
  });
}

/**
 * 遷移時に認証チェックを行う : 既に認証済みのユーザからのリクエストかどうかをチェックする
 * 
 * @param req リクエスト
 * @param res レスポンス
 * @param next 制御関数
 */
export function isAuthed(req, res, next): void {
  if(req.isAuthenticated()) {
    next();
  }
  else {
    res.status(401);  // HttpClient で `catch()` に移動させるため 401 を返す
    res.json({ error: 'Not Authed' });  // `catch(error)` の `error.error.error` で取得できる
  }
}

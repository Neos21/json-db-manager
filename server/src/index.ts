import express from 'express';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import passportLocal from 'passport-local';

import constants from './constants';
import createDbDirectoryService from './services/create-db-directory-service';
import router from './routes/router';

/** JSON DB Manager Server */
const app = express();

// クッキー設定
app.use(cookieParser());
// セッション設定
app.use(expressSession({
  secret: 'SessionKey',  // クッキーの暗号化に使用するキー
  resave: false,  // セッションチェックする領域にリクエストするたびにセッションを作り直してしまうので `false` にする
  saveUninitialized: false,  // 未認証時のセッションを保存しないようにする
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,  // クッキーの有効期限をミリ秒指定 (1週間)
    secure: false  // HTTP 利用時は `false` にする
  }
}));

// リクエストデータ処理用
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');  // Angular 開発サーバのために必要・`*` 指定だと OPTIONS リクエストでエラーになる
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Passport 初期設定
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

// ルーティング
app.use('/', router);

(async () => {
  try {
    await createDbDirectoryService();  // DB ディレクトリがなければ作成する
    
    // サーバを起動する
    const server = app.listen(process.env.PORT || 8080, () => {
      const host = server.address().address;
      const port = server.address().port;
      console.log(`Listening at http${process.env.IS_HTTPS === 'true' ? 's' : ''}://${host}:${port}`);
    });
  }
  catch(error) {
    console.error('Failed To Start Server', error);
  }
})();

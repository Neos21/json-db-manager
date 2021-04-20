import express from 'express';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import passportLocal from 'passport-local';

const app = express();

// クッキー設定
app.use(cookieParser());
// セッション設定
app.use(expressSession({
  secret: 'SessionKey',  // クッキーの暗号化に使用するキー
  resave: false,  // セッションチェックする領域にリクエストするたびにセッションを作り直してしまうので false
  saveUninitialized: false,  // 未認証時のセッションを保存しないようにする
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,  // クッキーの有効期限をミリ秒指定 (1週間)
    secure: false  // HTTP 利用時は false にする
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
  usernameField: 'userName',  // POST の body から参照するフィールド名を指定する
  passwordField: 'password',
  session: true,
  passReqToCallback: true
}, (_req, userName, password, done) => {
  if(userName === 'CHANGE-THIS' && password === 'CHANGE-THIS') {  // TODO : 超簡易認証
    console.error('Passport : Success To Auth', userName);
    const auth = { userName: userName };
    return done(null, auth);  // 成功・第2引数で渡す内容がシリアライズされる
  }
  else {
    console.error('Passport : Failed To Auth', userName, password);
    return done(null, false);  // 失敗
  }
}));
// シリアライズ
passport.serializeUser((auth, done) => { done(null, auth); });
// デシリアライズ
passport.deserializeUser((auth, done) => { done(null, auth); });

// TODO : 疎通確認
app.get('/', (_req, res) => {
  console.log(new Date(), 'Hello World');
  res.send('Hello World');
});

(async () => {
  const server = app.listen(process.env.PORT || 8080, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Listening at http${process.env.IS_HTTPS === 'true' ? 's' : ''}://${host}:${port}`);
  });
})();

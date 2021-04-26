import express from 'express';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';

import { createDbDirectory } from './services/file-utils-service';
import router from './routes/router';
import { initializePassport } from './services/auth-service';

(async () => {
  try {
    // JSON DB Manager Server
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
    initializePassport(app);
    // ルーティング定義
    app.use('/', router);
    // DB ディレクトリがなければ作成する
    await createDbDirectory();
    
    // サーバを起動する
    const server = app.listen(process.env.PORT || 2222, () => {
      const host = server.address().address;
      const port = server.address().port;
      console.log(`Listening at http${process.env.IS_HTTPS === 'true' ? 's' : ''}://${host}:${port}`);
    });
  }
  catch(error) {
    console.error('Failed To Start Server', error);
  }
})();

import express from 'express';
import passport from 'passport';

import isAuthedService from '../services/is-authed-service';

import dbListController   from '../controllers/db-list-controller';
//import dbCreateController from '../controllers/db-create-controller';
//import dbGetController    from '../controllers/db-get-controller';
//import dbUpdateController from '../controllers/db-update-controller';

/** ルーティング */
const router = express.Router();

// アクセスログ
router.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.url} [${req.method}] : ${JSON.stringify(req.body)}`);
  next();
});

// Angular の資材をレスポンスする
router.use ('/', express.static(`${__dirname}/../../../client/dist`));

// ログイン処理 : `passport.use('local')` で定義した認証処理が成功したらこの関数が実行される
router.post('/api/login', passport.authenticate('local', { session: true }), (req, res) => {
  res.json({ userName: req.user.userName });  // Angular の HttpClient がエラー扱いにしないよう JSON を返す
});

router.get ('/api/db'    , isAuthedService, dbListController  );
//router.put ('/api/db'    , isAuthed, dbCreateController);
//router.get ('/api/db/:id', isAuthed, dbGetController   );
//router.post('/api/db/:id', isAuthed, dbUpdateController);

export default router;

import express from 'express';
import passport from 'passport';

import isAuthedService from '../services/is-authed-service';

import dbListController   from '../controllers/db-list-controller';
import dbCreateController from '../controllers/db-create-controller';
import dbDeleteController from '../controllers/db-delete-controller';
import dbGetController   from '../controllers/db-get-controller';
import dbDataUpdateController from '../controllers/db-data-update-controller';

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

router.get   ('/api/db'             , isAuthedService, dbListController      );
router.post  ('/api/db'             , isAuthedService, dbCreateController    );
router.delete('/api/db'             , isAuthedService, dbDeleteController    );
router.get   ('/api/db/:dbName'     , isAuthedService, dbGetController       );
router.put   ('/api/db/:dbName/data', isAuthedService, dbDataUpdateController);

export default router;

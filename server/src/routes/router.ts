import express from 'express';

import { authController, isAuthed } from '../services/auth-service';
import dbListController   from '../controllers/db-list-controller';
import dbCreateController from '../controllers/db-create-controller';
import dbDeleteController from '../controllers/db-delete-controller';
import dbGetController   from '../controllers/db-get-controller';
import dbNameUpdateController from '../controllers/db-name-update-controller';
import dbDataUpdateController from '../controllers/db-data-update-controller';

/** ルーティング */
const router = express.Router();

// アクセスログ
router.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.url} [${req.method}] : ${JSON.stringify(req.body)}`);
  next();
});

// Angular の資材をレスポンスする
router.use('/', express.static(`${__dirname}/../../../client/dist`));

// ログイン処理 : `passport.use('local')` で定義した認証処理が成功したらこの関数が実行される
authController(router, '/api/login');

router.get   ('/api/db'             , isAuthed, dbListController      );
router.post  ('/api/db'             , isAuthed, dbCreateController    );
router.delete('/api/db'             , isAuthed, dbDeleteController    );
router.get   ('/api/db/:dbName'     , isAuthed, dbGetController       );
router.put   ('/api/db/:dbName/name', isAuthed, dbNameUpdateController);
router.put   ('/api/db/:dbName/data', isAuthed, dbDataUpdateController);

export default router;

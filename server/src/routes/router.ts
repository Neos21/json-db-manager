import express from 'express';
import passport from 'passport';

import isAuthed from '../services/is-authed';

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
router.post('/login', passport.authenticate('local', { session: true }), (req, res) => {
  res.json({ userName: req.user.userName });  // Angular の HttpClient がエラー扱いにしないよう JSON を返す
});

// router.post('/api/example', isAuthed, async (req, res) => { await exampleController(req, res); });

router.get('/test', (_req, res) => { res.send('Hello World'); });  // TODO : 疎通確認用・後で消す

export default router;

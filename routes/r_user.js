const router = require('express').Router();
const dbsql = require('../dbsql');


router.get('/', async function (req, res) {
    let ret = await dbsql.db_user.getMailData();
    return res.json(ret);
});

router.post('/data', async function (req, res) {
    let ret = await dbsql.db_user.getDataByMail(req.body.data);
    return res.json(ret);
});

router.post('/DataById', async function (req, res) {
    let ret = await dbsql.db_user.getDataByID(req.body.data);
    return res.json(ret);
});

module.exports = router;
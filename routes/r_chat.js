const router = require('express').Router();
const dbsql = require('../dbsql');

router.get('/', async function (req, res) {
    //let ret = await dbsql.db_msg.getMessagesByUserID(req.user[0]);
    //console.log(ret);
    return res.render('chat.html', { userid: req.user[0], username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'chat' });
});

router.post('/sendMessage', async function (req, res) {
    // Write message into database
    try {
        let ret = await dbsql.db_msg.insertMessage(req.body.timestamp, req.body.text, req.user[0], req.body.user_receive_id, req.body.group_id);
        console.log('send msg: ' + req.body.timestamp);
    } catch (err) {
        console.log(err);
    }
    return res.sendStatus(200);
});

router.get('/messages', async function (req, res) {
    let ret = await dbsql.db_msg.getMessagesByUserID(req.user[0]);
    console.log(ret);
    for (let index = 0; index < ret.length; index++) {
      ret[index]['timetag'] = ret[index]['timetag'].toLocaleString(); // convert timezone since mysql is shit and fucks it up
    }
    return res.json(ret);
});

router.get('/user', async function (req, res) {
    let ret = await dbsql.db_user.getMailData();
    return res.json(ret);
});

router.post('/userdata', async function (req, res) {
    let ret = await dbsql.db_user.getDataByMail(req.body.data);
    return res.json(ret);
});

router.post('/userDataById', async function (req, res) {
    let ret = await dbsql.db_user.getDataByID(req.body.data);
    return res.json(ret);
});

module.exports = router;
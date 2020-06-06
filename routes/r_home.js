const router = require('express').Router();
const dbsql = require('../dbsql');


// Home - Cashboard
router.get('/', async function (req, res) {
    let inv_groups = [];
    try {
        let all_groups = await dbsql.db_user_group.getInvitedGroups(req.user[0]);
        for (g_ctr = 0; g_ctr < all_groups.length; g_ctr++) {
            //console.log(all_groups[g_ctr]);
            let group = await dbsql.db_group.getGroup(all_groups[g_ctr][0]);
            let inv = await dbsql.db_user.getName(all_groups[g_ctr][1]);
            let obj = {
                'id': all_groups[g_ctr][0],
                'name': group[dbsql.db_group.COLS[1]],
                'inv': inv
            }
            inv_groups.push(obj);
        }
    } catch (err) {
        console.log(err);
    }
    return res.render('index.html', { inv_groups: inv_groups, pagename: 'index' });
});

module.exports = router;
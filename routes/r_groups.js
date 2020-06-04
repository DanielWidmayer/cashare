const router = require('express').Router();
const dbsql = require('../dbsql');

const usergroup_cols = dbsql.db_user_group.COLS;
const group_cols = dbsql.db_group.COLS;
const alert_cols = dbsql.db_alerts.COLS;
const user_cols = dbsql.db_user.COLS;

router.get('/', async function (req, res) {
  var group_list = [];
    try {
      var user_groups = await dbsql.db_user_group.getUserGroups(req.user[0]);   // user_groups = [{group_id: x, user_role: y}, {...}, ...]
      for (g_ctr = 0; g_ctr < user_groups.length; g_ctr++) {
        if (user_groups[g_ctr][usergroup_cols[2]] > 0) {      // check if user_role > 0
          let groupid = user_groups[g_ctr][usergroup_cols[1]];

          let user_role = await dbsql.db_user_group.getUserRole(req.user[0], groupid);

          let group = await get_group_data(groupid); // group = {group_id:x,group_name:x,group_desc:x,group_bal:x} 

          let alerts = await get_group_alerts(req.user[0], groupid); // alerts = [{alert_id, user_id, timestamp, alert_msg, status}]

          let members = await get_group_members(groupid);
          
          let obj = {
            'role': user_role,
            'group_data': group,
            'group_alerts': alerts,
            'group_members': members
          };
          group_list.push(obj);
        }
      }
    } catch (err) {
      console.log(err);
    }
    console.log(group_list);
    return res.render('payment-groups.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], 
      userbalance: req.user[5], userpic: req.user[6], groups: group_list, pagename: 'groups' });
});

router.get('/certaingroup', function (req, res) {
    return res.render('paymentgroup-shareboard.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'groups' });
});


async function get_group_data (groupid) {
  try {
    let group = await dbsql.db_group.getGroup(groupid);
    let obj = {
      'id': group[group_cols[0]],
      'name': group[group_cols[1]],
      'description': group[group_cols[2]],
      'balance': group[group_cols[3]]
    };
    return obj;
  } catch (err) {
    throw(err);
  }
}

async function get_group_alerts (userid, groupid) {
  var alerts = [];
  try {
    var alert_list = await dbsql.db_alerts.getGroupAlerts(groupid);
    for (a_ctr = 0; a_ctr < alert_list.length; a_ctr++) {
      if(alert_list[a_ctr][alert_cols[1]] == userid && alert_list[a_ctr][alert_cols[6]] == 0) {
        //console.log(alert_list[a_ctr]);
        let obj = {
          'id': alert_list[a_ctr][alert_cols[0]],
          'time': alert_list[a_ctr][alert_cols[3]],
          'class': alert_list[a_ctr][alert_cols[4]],
          'message': alert_list[a_ctr][alert_cols[5]]
        };
      alerts.push(obj); 
      }
    }
  } catch (err) {
    throw (err);
  }
  return alerts;
}

async function get_group_members (groupid) {
  var members = [];
  try {
    var member_list = await dbsql.db_user_group.getMembers(groupid);
    for (m_ctr = 0; m_ctr < member_list.length; m_ctr++) {
      if (member_list[m_ctr][usergroup_cols[2]] > 0) {
        let el_user = await dbsql.db_user.getDataByID(member_list[m_ctr][usergroup_cols[0]], false);
        let role = await dbsql.db_user_group.getUserRole(el_user[user_cols[0]], groupid);
        //console.log(el_user);
        let obj = {
          'id': el_user[user_cols[0]],
          'firstname': el_user[user_cols[1]],
          'lastname': el_user[user_cols[2]],
          'mail': el_user[user_cols[3]],
          'picture': el_user[user_cols[9]],
          'role': role
        };
        members.push(obj);
      }
    }
  } catch (err) {
    throw (err);
  }
  return members;
}

module.exports = router;
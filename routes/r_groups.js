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

          let user_role = await dbsql.db_user_group.getUserRole(groupid, req.user[0]);

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
    //console.log(group_list);
    return res.render('payment-groups.html', { groups: group_list, pagename: 'groups' });
});


router.post('/', async function(req,res) {
  try {
    let now = getcurrentDateTime();
    console.log(now);
    let groupid = await dbsql.db_group.createGroup(req.body['groupname'], req.body['groupdesc']);
    await dbsql.db_user_group.setUserAdmin(groupid, req.user[0]);
    await dbsql.db_alerts.createGroupAlert(groupid, 'primary', `Payment Group "${req.body['groupname']}" was created.`, now);
    await dbsql.db_alerts.createUserAlert(req.user[0], 'primary', `You just created the Payment Group "${req.body['groupname']}"!`, now);
  } catch (err) {
    console.log(err);
  }
  return res.redirect('/groups');
})

router.get('/:group', function (req, res) {
  console.log(req.params.group);
    return res.render('paymentgroup-shareboard.html', { pagename: 'groups' });
});

router.post('/join', function (req, res) {
  //let groupid = req.params.group.replace(/[^\d]/g, '');
  console.log(req.params);
  console.log(req.query);
  console.log(req.boy);
  return res.redirect('/groups/:group');
});

router.post('/:group', async function (req, res) {
  let groupid = req.params.group.replace(/[^\d]/g, '');
  let groupname = req.body['groupname'];
  let groupdesc = req.body['groupdesc'];
  let members = [];
  let num = 0;
  for (key in req.body) {
    if(/write/.test(key)) {
      members.push({
        'id': key.split(/_/).pop(),
        'roles': [req.body[key]]
      });
    }
    if(/admin/.test(key)) {
      members[num]['roles'].push(req.body[key]);
      num++;
    }
  }
  
  try {
    if (await dbsql.db_user_group.getUserRole(groupid, req.user[0]) == 3) {
      for (m_ctr = 0; m_ctr < members.length; m_ctr++) {
        let userid = members[m_ctr]['id'];
        if(members[m_ctr]['roles'][1] == 1) {
          await dbsql.db_user_group.setUserAdmin(groupid, userid);
        }
        else if (members[m_ctr]['roles'][0] == 1) {
          await dbsql.db_user_group.setUserWrite(groupid, userid);
        }
        else {
          await dbsql.db_user_group.setUserRead(groupid, userid);
        }
      }
      if (/\p{L}{1,}/u.test(groupname)) {
        await dbsql.db_group.changeGroupName(groupid, req.body['groupname']);
      } 
      if (/\p{L}{1,}/u.test(groupdesc)) {
        await dbsql.db_group.changeGroupDesc(groupid, req.body['groupdesc']);
      } 
    }
  } catch (err) {
    console.log(err);
  }
  return res.redirect('/groups/' + req.params.group);
})

router.get('/:group/rem', async function(req, res) {
  let groupid = req.params.group.replace(/[^\d]/g, '');
  groupid = parseInt(groupid);
  try {
    let now = getcurrentDateTime();
    if (await dbsql.db_user_group.getUserRole(groupid, req.user[0]) == 3) {
      let pmgroup = await dbsql.db_group.getGroup(groupid);
      let members = await dbsql.db_user_group.getMembers(groupid);
      for (m_ctr = 0; m_ctr < members.length; m_ctr++) {
        if (members[m_ctr][usergroup_cols[2]] > 0) {
          await dbsql.db_alerts.createUserAlert(members[m_ctr][usergroup_cols[0]], 'primary', `Payment Group "${pmgroup[group_cols[1]]}" has been deleted by its Admin.`, now);
        }
      }
      await dbsql.db_group.deleteGroup(groupid);
      await dbsql.db_alerts.createUserAlert(req.user[0], 'primary', `You deleted the Payment Group "${pmgroup[group_cols[1]]}"!`, now);
    }
  } catch (err) {
    console.log(err);
  }
  return res.redirect('/groups');
});



// ---------------------------------------------------------------------------------------------------------------------------- functions

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
          'time': alert_list[a_ctr][alert_cols[3]].toLocaleString(),
          'class': alert_list[a_ctr][alert_cols[4]],
          'message': alert_list[a_ctr][alert_cols[5]]
        };
        //console.log(obj['time']);
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
        let role = await dbsql.db_user_group.getUserRole(groupid, el_user[user_cols[0]]);
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

function getcurrentDateTime () {
  let ms = new Date();
  let date = [ms.getFullYear(), ('0' + (ms.getMonth() + 1)).slice(-2), ('0' + ms.getDate()).slice(-2)];
  let time = [ms.getHours(), ms.getMinutes(), ms.getSeconds()];
  let datetime = date.join('-') + ' ' + time.join(':');
  return datetime;
}

module.exports = router;
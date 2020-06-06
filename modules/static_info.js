const dbsql = require('../dbsql');

module.exports = async function(req, res, next) {
    if(/jsondata/.test(req.originalUrl)) return next();
    var messages = [];
      var alerts = [];
      var groups = [];
      try {
          let raw_messages = await dbsql.db_msg.getUnreadMessages(req.user[0]);

          for (m_ctr = 0; m_ctr < raw_messages.length; m_ctr++) {
              let sender_obj = {};
              let gr_flag = false;
              if((groupid = raw_messages[m_ctr][dbsql.db_msg.COLS[5]])) {
                  let group = await dbsql.db_group.getGroup(groupid);
                  for (gr_ctr = 0; gr_ctr < messages.length; gr_ctr++) {
                      if (messages[gr_ctr]['sender']['type'] == 'group') {
                          if (messages[gr_ctr]['sender']['id'] == groupid && raw_messages[m_ctr][dbsql.db_msg.COLS[1]].toLocaleString() >= messages[gr_ctr]['time']) {
                              messages[gr_ctr]['time'] = raw_messages[m_ctr][dbsql.db_msg.COLS[1]].toLocaleString();
                              messages[gr_ctr]['text'] = raw_messages[m_ctr][dbsql.db_msg.COLS[2]];
                              gr_flag = true;
                          }
                      }
                  }
                  sender_obj = {
                      'type': 'group',
                      'id': group[dbsql.db_group.COLS[0]],
                      'name': group[dbsql.db_group.COLS[1]]
                  } 
              } 
              else {
                  let member = await dbsql.db_user.getDataByID(raw_messages[m_ctr][dbsql.db_msg.COLS[3]]);
                  sender_obj = {
                      'type': 'user',
                      'id': member[0],
                      'firstname': member[1],
                      'lastname': member[2],
                      'mail': member[3],
                      'picture': member[6]
                  }
              }
              
              let obj = {
                  'id': raw_messages[m_ctr][dbsql.db_msg.COLS[0]],
                  'time': raw_messages[m_ctr][dbsql.db_msg.COLS[1]].toLocaleString(),
                  'sender': sender_obj,
                  'text': raw_messages[m_ctr][dbsql.db_msg.COLS[2]],
                  'read': raw_messages[m_ctr][dbsql.db_msg.COLS[6]]
              }
              if (!gr_flag) messages.push(obj);
          }
          let raw_alerts = await dbsql.db_alerts.getUnreadAlerts(req.user[0]);
          for (a_ctr = 0; a_ctr < raw_alerts.length; a_ctr++) {
              let obj = {
                  'id': raw_alerts[a_ctr][dbsql.db_alerts.COLS[0]],
                  'time': raw_alerts[a_ctr][dbsql.db_alerts.COLS[3]].toLocaleString(),
                  'class': raw_alerts[a_ctr][dbsql.db_alerts.COLS[4]],
                  'msg': raw_alerts[a_ctr][dbsql.db_alerts.COLS[5]],
                  'read': raw_alerts[a_ctr][dbsql.db_alerts.COLS[6]]
              }
              alerts.push(obj);
          }
          let raw_groups = await dbsql.db_user_group.getUserGroups(req.user[0]);
          for (g_ctr = 0; g_ctr < raw_groups.length; g_ctr++) {
            let groupid = raw_groups[g_ctr][dbsql.db_user_group.COLS[1]];
            //console.log(groupid);
            if (raw_groups[g_ctr][dbsql.db_user_group.COLS[2]] > 0) {
              let grp = await dbsql.db_group.getGroup(groupid);
              let obj = {
                'id': groupid,
                'name': grp[dbsql.db_group.COLS[1]]
              }
              groups.push(obj);
            }
          }
      } catch (err) {
          console.log(err);
      }
      
    res.locals.static_messages = messages;  
    res.locals.static_alerts = alerts;
    res.locals.static_groups = groups;
    res.locals.static_user = req.user;
    next();
  }
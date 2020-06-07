
const TBNAME = 'alert_table';
const COLS = [
    'alert_id',
    'user_id',
    'group_id',
    'timestamp',
    'alert_class',          // 'primary', 'success', 'warning', 'danger'
    'alert_msg',
    'status'
];

const db_user = require('./db_user');
const db_group = require('./db_group');
const db_user_group = require('./db_user_group');

module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;

module.exports.create_table = async function() {
    var sql = "SELECT 1 FROM " + TBNAME + " LIMIT 1;"
    try {
        await query(sql);
        console.log("Table '" + TBNAME + "' already exists!");
    }
    catch(err) {
        console.log("Didn't find table named '" + TBNAME + "'"); 
        console.log("Creating table '" + TBNAME + "'...");
        sql = "create table " + TBNAME + " ("
            + COLS[0] + " int not null auto_increment primary key,"
            + COLS[1] + " int,"
            + `FOREIGN KEY (${COLS[1]}) REFERENCES ${db_user.TBNAME}(${db_user.COLS[0]}) ON DELETE CASCADE,`
            + COLS[2] + " int,"
            + `FOREIGN KEY (${COLS[2]}) REFERENCES ${db_group.TBNAME}(${db_group.COLS[0]}) ON DELETE CASCADE,`
            + COLS[3] + " datetime not null,"
            + COLS[4] + " varchar(255) not null,"
            + COLS[5] + " varchar(500) not null,"
            + COLS[6] + " int not null default 0"
            +");"
        try {
            await query(sql);
            console.log("Table '" + TBNAME + "' successfully created!");
        }
        catch(err) {
            console.log("Error: Can't create table '" + TBNAME + "'...");
            console.log(err);
        }
    }
}

module.exports.getAll = async function () {
    try {
        let sql = `SELECT * FROM ${TBNAME};`;
        let rows = await query(sql);
        //console.log(rows);
        return rows;
    } catch (err) {
        throw (err);
    }
}

module.exports.readSingleAlert = async function (alertid) {
    var sql = `UPDATE ${TBNAME} SET ${COLS[6]}=1 WHERE ${COLS[0]}='${alertid}';`;
    try {
        await query(sql);
        return 1;
    } catch (err) {
        throw (err);
    }
}

module.exports.getUserAlerts = async function (userid) {
    var sql = `SELECT * FROM ${TBNAME} WHERE ${COLS[1]}='${userid}';`;
    try {
        let rows = await query(sql);
        return rows;
    } catch(err) {
        throw (err);
    }
}

module.exports.getUnreadAlerts = async function (userid) {
    var sql = `SELECT * FROM ${TBNAME} WHERE ${COLS[1]}='${userid}' AND ${COLS[6]}=0;`;
    try {
        let rows = await query(sql);
        return rows;
    } catch (err) {
        throw (err);
    }
}

module.exports.getGroupAlerts = async function(groupid) {
    var sql = `SELECT ${COLS[0]}, ${COLS[1]}, ${COLS[3]}, ${COLS[4]}, ${COLS[5]}, ${COLS[6]} FROM ${TBNAME} WHERE ${COLS[2]}='${groupid}';`;
    try {
        let row = query(sql);
        return row;
    } catch (err) {
        throw (err);
    }
}

module.exports.createUserAlert = async function (userid, aclass, msg, time) {
    var sql = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[3]}, ${COLS[4]}, ${COLS[5]}, ${COLS[6]}) VALUES ('${userid}', '${time}', '${aclass}', '${msg}', 0);`;
    try {
        await query(sql);
        return 1;
    } catch (err) {
        throw (err);
    }
}

module.exports.createGroupAlert = async function (groupid, aclass, msg, time) {
    try {
        let members = await db_user_group.getMembers(groupid);
        let sql = ``;
        for (m_ctr = 0; m_ctr < members.length; m_ctr++) {
            let userid = members[m_ctr][db_user_group.COLS[0]];
            sql = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[4]}, ${COLS[5]}, ${COLS[6]}) VALUES ('${userid}', '${groupid}', '${time}', '${aclass}', '${msg}', 0);`;
            await query(sql);
            return 1;
        }
    } catch (err) {
        throw (err);
    }
}

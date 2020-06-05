
const TBNAME = 'user_group_table';
const COLS = [
    'user_id',
    'group_id',
    'user_role'                 // 0 = invited , 1 = basic (only read) , 2 = advanced (edit payment goals e.g.) , 3 = admin
];

const db_user = require('./db_user');
const db_group = require('./db_group');

module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;

module.exports.create_table = async function() {
    var sql = "SELECT 1 FROM " + TBNAME  + " LIMIT 1;"
    try {
        await query(sql);
        console.log("table user_group_table allready exists!");
    }
    catch(err) {
        console.log(err);
        console.log("No table user_group_table.."); 

        console.log("create table..");
        sql = "create table " + TBNAME + " ("
            + COLS[0] + " int not null,"
            +`Foreign Key (${COLS[0]}) References ${db_user.TBNAME}(${db_user.COLS[0]}) `
            +"ON DELETE CASCADE,"
            + COLS[1] + " int not null,"
            +`Foreign Key (${COLS[1]}) REFERENCES ${db_group.TBNAME}(${db_group.COLS[0]}) `
            +"ON DELETE CASCADE,"
            + COLS[2] + " int not null,"
            +`PRIMARY KEY (${COLS[0]},${COLS[1]})`
            +");"
        try {
            await query(sql);
            console.log("table user_group_table created!");
        }
        catch(err) {
            console.log("cannot create table...");
            console.log(err);
        }
    }
}


module.exports.getUserGroups = async function(userid) {
    var sql = `SELECT ${COLS[1]}, ${COLS[2]} FROM ${TBNAME} WHERE ${COLS[0]}='${userid}';`;
    try {
        let row = await query(sql);
        return row;
    } catch (err) {
        throw (err);
    }
}


module.exports.getMembers = async function(groupid) {
    var sql = `SELECT ${COLS[0]}, ${COLS[2]} FROM ${TBNAME} WHERE ${COLS[1]}='${groupid}';`;
    try {
        let row = await query(sql);
        return row;
    } catch (err) {
        throw (err);
    }
}

module.exports.getUserRole = async function (groupid, userid) {
    var sql = `SELECT ${COLS[2]} FROM ${TBNAME} WHERE ${COLS[0]}='${userid}' AND ${COLS[1]}='${groupid}';`;
    try {
        let row = await query(sql);
        if(row.length > 0) return row[0][COLS[2]];
        else return -1;
    } catch (err) {
        throw (err);
    }
}

module.exports.setUserInvited = async function (groupid, userid) {
    try {
        let res = await this.editUserGroupRole(groupid, userid, 0);
        return res;
    } catch (err) {
        throw (err);
    }
}

module.exports.setUserRead = async function (groupid, userid) {
    try {
        let res = await this.editUserGroupRole(groupid, userid, 1);
        return res;
    } catch (err) {
        throw (err);
    }
}

module.exports.setUserWrite = async function (groupid, userid) {
    try {
        let res = await this.editUserGroupRole(groupid, userid, 2);
        return res;
    } catch (err) {
        throw (err);
    }
}

module.exports.setUserAdmin = async function (groupid, userid) {
    try {
        let res = await this.editUserGroupRole(groupid, userid, 3);
        return res;
    } catch (err) {
        throw (err);
    }
}

module.exports.kickUser = async function (groupid, userid) {
    try {
        let res = await this.editUserGroupRole(groupid, userid, -1);
        return res;
    } catch (err) {
        throw (err);
    }
}

module.exports.editUserGroupRole = async function(groupid, userid, role) {
    var sql;
    try {
        if(await this.getUserRole(groupid, userid) >= 0) {
            if (role < 0) sql = `DELETE FROM ${TBNAME} WHERE ${COLS[0]}='${userid}' AND ${COLS[1]}='${groupid}';`;
            else sql = `UPDATE ${TBNAME} SET ${COLS[2]}='${role}' WHERE ${COLS[0]}='${userid}' AND ${COLS[1]}='${groupid}';`;
        } else {
            sql = `INSERT INTO ${TBNAME} (${COLS[0]}, ${COLS[1]}, ${COLS[2]}) VALUES ('${userid}', '${groupid}', '${role}');`;
        }
        await query(sql);
        return 1;
    } catch (err) {
        throw (err);
    }
}
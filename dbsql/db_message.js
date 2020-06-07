const TBNAME = 'message_table';
const COLS = [
    'message_id',
    'timetag',
    'text',
    'user_send_id',
    'user_receive_id',
    'group_id',
    'status'
];

const db_user = require('./db_user');
const db_group = require('./db_group');

module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;

module.exports.create_table = async function() {
    var sql = "SELECT 1 FROM " + TBNAME + " LIMIT 1;"
    try {
        await query(sql);
        console.log("Table '" + TBNAME + "' already exists!");
    } catch (err) {
        console.log("Didn't find table named '" + TBNAME + "'"); 
        console.log("Creating table '" + TBNAME + "'...");
        sql = "create table "+ TBNAME + " ("
            + COLS[0] + " int not null auto_increment primary key,"
            + COLS[1] + " datetime not null,"
            + COLS[2] + " text not null,"
            + COLS[3] + " int not null,"
            +`Foreign Key (${COLS[3]}) REFERENCES ${db_user.TBNAME}(${db_user.COLS[0]}) `
            +"ON DELETE CASCADE,"
            + COLS[4] + " int,"
            +`Foreign Key (${COLS[4]}) REFERENCES ${db_user.TBNAME}(${db_user.COLS[0]}) `
            +"ON DELETE CASCADE,"
            + COLS[5] + " int,"
            +`Foreign Key (${COLS[5]}) REFERENCES ${db_group.TBNAME}(${db_group.COLS[0]}) `
            +"ON DELETE CASCADE,"
            + COLS[6] + " int not null default 0"
            +");"
        try {
            await query(sql);
            console.log("Table '" + TBNAME + "' successfully created!");
        } catch (err) {
            console.log("Error: Can't create table '" + TBNAME + "'...");
            console.log(err);
        }
    }
};

module.exports.getMessagesByUserID = async function (user_id) {
    var sql = `SELECT * FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' OR ${COLS[4]} = '${user_id}')`;
    try {
        let res = await query(sql);
        return res;
    } catch (err) {
        throw err;
    }
};

module.exports.getUnreadMessages = async function (userid) {
    var sql = `SELECT * FROM ${TBNAME} WHERE ${COLS[4]}='${userid}' AND ${COLS[6]}=0;`;
    try {
        let rows = await query(sql);
        return rows;
    } catch (err) {
        throw (err);
    }
}

module.exports.getMessagesByUserIDandTimestamp = async function (user_id) {};

module.exports.insertMessage = async function (timetag, text, user_send_id, user_receive_id, group_id) {
    var sql, res;

    if (user_receive_id != null) {
        try {
            sql = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[4]}) ` + `VALUES ('${timetag}', '${text}', ${user_send_id}, ${user_receive_id});`;
            res = await query(sql);
            return res;
        } catch (err) {
            throw err;
        }
    } else if (group_id != null) {
        try {
            sql = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[5]}) ` + `VALUES ('${timetag}', '${text}', ${user_send_id}, ${group_id});`;

            res = await query(sql);
            return res;
        } catch (err) {
            throw err;
        }
    } else {
        console.log('Error: Both group_id and user_receive_id are null, but at least one value should be != null');
    }


};

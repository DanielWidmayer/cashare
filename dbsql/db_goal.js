
const TBNAME = 'goal_table';
const COLS = [
    'goal_id',
    'value',
    'current',
    'title',
    'group_id',
    'user_id'
];

const db_cat = require('./db_cat');
const db_group = require('./db_group');
const db_user = require('./db_user');

module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;

module.exports.create_table = async function() {
    var sql = "SELECT 1 FROM " + TBNAME + " LIMIT 1;"
    try {
        await query(sql);
        console.log("table goal_table allready exists!");
    }
    catch(err) {
        console.log(err);
        console.log("No table goal_table.."); 

        console.log("create table..");
        sql = "create table " + TBNAME + " ("
            + COLS[0] + " int not null auto_increment primary key,"
            + COLS[1] + " decimal(10,2) not null default('0'),"
            + COLS[2] + " decimal(10,2) not null default('0'),"
            + COLS[3] + " varchar(255) not null,"
            + COLS[4] + " int,"
            +`Foreign Key (${COLS[4]}) REFERENCES ${db_group.TBNAME}(${db_group.COLS[0]}) `
            +"ON DELETE CASCADE,"
            + COLS[5] + " int,"
            +`Foreign Key (${COLS[5]}) REFERENCES ${db_user.TBNAME}(${db_user.COLS[0]}) `
            +"ON DELETE CASCADE"
            +");"
        try {
            await query(sql);
            console.log("table goal_table created!");
        }
        catch(err) {
            console.log("cannot create table...");
            console.log(err);
        }
    }
}

module.exports.insertPaymentGoal = async function (value, title, group_id, user_id) {
    var sql = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[3]}, ${COLS[4]}, ${COLS[5]}) ` + `VALUES ('${value}', '${title}', ${group_id}, ${user_id});`;
    try {
        var ret = await query(sql);
        return 0;
    } catch (error) {
        throw error;
    }
}

module.exports.getPaymentGoalsByUserID = async function(userid){
    var sql = `SELECT * FROM ${TBNAME} WHERE ${COLS[5]} = '${userid}'`;
    try {
        let res = await query(sql);
        return res;
    } catch (err) {
        throw err;
    }
}

module.exports.addPaymentGoalValue = async function(value, goal_id){
    var sql = `UPDATE ${TBNAME} SET ${COLS[1]} = ${value} WHERE ${COLS[0]} = ${goal_id}`
    try {
        let res = await query(sql);
        return 0;
    } catch (err) {
        throw err;
    }
}

const TBNAME = 'goal_table';
const COLS = [
    'goal_id',
    'value',
    'current',
    'period_days',
    'category_id',
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
            + COLS[3] + " int,"
            + COLS[4] + " int not null,"
            +`Foreign Key (${COLS[4]}) REFERENCES ${db_cat.TBNAME}(${db_cat.COLS[0]}),`
            + COLS[5] + " int,"
            +`Foreign Key (${COLS[5]}) REFERENCES ${db_group.TBNAME}(${db_group.COLS[0]}) `
            +"ON DELETE CASCADE,"
            + COLS[6] + " int,"
            +`Foreign Key (${COLS[6]}) REFERENCES ${db_user.TBNAME}(${db_user.COLS[0]}) `
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
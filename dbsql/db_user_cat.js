
const TBNAME = 'user_category_table';
const COLS = [
    'user_id',
    'category_id',
    'category_description'
    ];
module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;

const db_user = require('./db_user');
const db_cat = require('./db_cat');

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
            + COLS[0] + " int not null,"
            +`Foreign Key (${COLS[0]}) References ${db_user.TBNAME}(${db_user.COLS[0]}) `
            +"ON DELETE CASCADE,"
            + COLS[1] + " int not null,"
            +`Foreign Key (${COLS[1]}) REFERENCES ${db_cat.TBNAME}(${db_cat.COLS[0]}) `
            +"ON DELETE CASCADE,"
            + COLS[2] + " varchar(5000),"
            +`PRIMARY KEY (${COLS[0]},${COLS[1]})`
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

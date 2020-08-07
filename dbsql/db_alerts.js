
const TBNAME = 'alert_table';
const COLS = [
    'alert_id',
    'user_id',
    'timestamp',
    'alert_msg'
];

module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;

module.exports.create_table = async function(db_user) {
    var sql = "SELECT 1 FROM " + TBNAME + " LIMIT 1;"
    try {
        await query(sql);
        console.log("table alert_table allready exists!");
    }
    catch(err) {
        console.log(err);
        console.log("No table alert_table.."); 

        console.log("create table..");
        sql = "create table " + TBNAME + " ("
            + COLS[0] + " int not null auto_increment primary key,"
            + COLS[1] + " int not null,"
            + `FOREIGN KEY (${COLS[1]}) REFERENCES ${db_user.TBNAME}(${db_user.COLS[0]}) ON DELETE CASCADE,`
            + COLS[2] + " datetime not null,"
            + COLS[3] + " varchar(500) not null"
            +");"
        try {
            await query(sql);
            console.log("table alert_table created!");
        }
        catch(err) {
            console.log("cannot create table...");
            console.log(err);
        }
    }
}
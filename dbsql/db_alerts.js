
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

module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;

module.exports.create_table = async function(db_user, db_group) {
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
            + COLS[1] + " int,"
            + `FOREIGN KEY (${COLS[1]}) REFERENCES ${db_user.TBNAME}(${db_user.COLS[0]}) ON DELETE CASCADE,`
            + COLS[2] + " int,"
            + `FOREIGN KEY (${COLS[2]}) REFERENCES ${db_group.TBNAME}(${db_group.COLS[0]}) ON DELETE CASCADE,`
            + COLS[3] + " datetime not null,"
            + COLS[4] + " varchar(500) not null,"
            + COLS[5] + " varchar(255) not null,"
            + COLS[6] + " int not null default(0)"
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


module.exports.getGroupAlerts = async function(groupid) {
    var sql = `SELECT ${COLS[0]}, ${COLS[1]}, ${COLS[3]}, ${COLS[4]}, ${COLS[5]}, ${COLS[6]} FROM ${TBNAME} WHERE ${COLS[2]}='${groupid}';`;
    try {
        let row = query(sql);
        return row;
    } catch (err) {
        throw (err);
    }
}
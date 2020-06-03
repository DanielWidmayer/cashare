
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

module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;

module.exports.create_table = async function(db_user, db_group) {
    var sql = "SELECT 1 FROM " + TBNAME + " LIMIT 1;"
    try {
        await query(sql);
        console.log("table message_table allready exists!");
    }
    catch(err) {
        console.log(err);
        console.log("No table message_table.."); 

        console.log("create table..");
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
            + COLS[6] + " int not null default(0)"
            +");"
        try {
            await query(sql);
            console.log("table message_table created!");
        }
        catch(err) {
            console.log("cannot create table...");
            console.log(err);
        }
    }
}
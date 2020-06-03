
const TBNAME = 'group_table';
const COLS = [
    'group_id',
    'group_name',
    'group_description',
    'group_balance'
];
module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;

module.exports.create_table = async function() {
    var sql = "SELECT 1 FROM " + TBNAME + " LIMIT 1;"
    try {
        await query(sql);
        console.log("table group_table allready exists!");
    }
    catch(err) {
        console.log(err);
        console.log("No table group_table.."); 

        console.log("create table..");
        sql = "create table " + TBNAME + " ("
            + COLS[0] + " int not null auto_increment primary key," 
            + COLS[1] + " varchar(255) not null,"
            + COLS[2] + " varchar(500),"
            + COLS[3] + " decimal(10,2) not null default('0')"
            +");"
        try {
            await query(sql);
            console.log("table group_table created!");
        }
        catch(err) {
            console.log("cannot create table...");
            console.log(err);
        }
    }
}


module.exports.getGroup = async function(groupid) {
    var sql = `SELECT * FROM ${TBNAME} WHERE ${COLS[0]}='${groupid}';`;
    try {   
        let row = await query(sql);
        return row[0];
    } catch (err) {
        throw (err);
    }
}

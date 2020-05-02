
const TBNAME = 'category_table';
const COLS = [
    'category_id',
    'category_name',
    'category_description',
    'category_isExpense'
];
module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;

module.exports.create_table = async function() {
    var sql = "SELECT 1 FROM " + TBNAME + " LIMIT 1;"
    try {
        await query(sql);
        console.log("table category_table allready exists!");
    }
    catch(err) {
        console.log(err);
        console.log("No table category_table.."); 
        console.log("create table..");
        sql = "create table " + TBNAME + " ("
            + COLS[0] + " int not null auto_increment primary key," 
            + COLS[1] + " varchar(255) not null,"
            + COLS[2] + " varchar(500), "
            + COLS[3] + " boolean not null"
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

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
    var sql2;
    try {
        await query(sql);
        await query(sql2);
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
        
            sql2 = "INSERT INTO "+ TBNAME +"("
            + COLS[1] + "," + COLS[2] + "," + COLS[3] + ") " + "VALUES"
            + "('Food', 'What I Eat', True),"
            + "('Health', 'For my body', True),"
            + "('Travel', 'Travelaround', True),"
            + "('Amusement', 'For Hedonism', True),"
            + "('Kekse', 'The important stuff', True);"
            
        try {
            await query(sql);
            console.log("table group_table created!");
            
        }
        catch(err) {
            console.log("cannot create table...");
            console.log(err);
        }
        await query(sql2);
    }
}
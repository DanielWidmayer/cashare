
const TBNAME = 'category_table';
const COLS = [
    'category_id',
    'category_name',
    'category_description',
    'category_isExpense',
    'category_userID'
];
module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;

module.exports.create_table = async function(db_user) {
    var sql = "SELECT 1 FROM " + TBNAME + " LIMIT 1;"
    var sql2;
    try {
        await query(sql);
        console.log("table category_table allready exists!");
    }
    catch(err) {
        console.log(err);
        console.log("No table category_table.."); 
        console.log("create table..");
        sql_create_cat_table = "create table " + TBNAME + " ("
            + COLS[0] + " int not null auto_increment primary key," 
            + COLS[1] + " varchar(255) not null,"
            + COLS[2] + " varchar(500), "
            + COLS[3] + " boolean not null,"
            + COLS[4] + " int,"
            +`Foreign Key (${COLS[4]}) References ${db_user.TBNAME}(${db_user.COLS[0]}) `
            + "ON DELETE CASCADE"
            +");"
        
            /*sql_insert_default_cats = "INSERT INTO "+ TBNAME +"("
            + COLS[1] + "," + COLS[2] + "," + COLS[3] + ") " + "VALUES"
            + "('Travel', 'Travelaround', True),"
            + "('Amusement', 'For Hedonism', True),"
            + "('Food', 'For xx', True),"
            + "('Health', 'The my body', True),";*/

            /*sql_insert_default_cats = "INSERT INTO "+ TBNAME +"("
            + COLS[0] + "," + COLS[1] + "," + COLS[2] + "," + COLS[3] + ") " + "VALUES"
            + "(90001, 'user', 'user_income', False),"
            + "(90002, 'payment_group', 'payment_group_income', False)";*/
            
        try {
            await query(sql_create_cat_table);
            console.log("table group_table created!");
        }
        catch(err) {
            console.log("cannot create table...");
            console.log(err);
        }
        //await query(sql_insert_default_cats);
    }
}

module.exports.addCategory = async function(name, description, isExpense, user_id) {
    var sql, res;

    var toBool = (isExpense == 'true');
    try {
        sql = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[4]}) `
                + `VALUES ('${name}', '${description}', ${isExpense}, ${user_id});`;
            
        res = await query(sql);
        return res;
    }
    catch(err) {
        throw err;
    }
}

module.exports.getCategorysByUserID = async function(user_id, isExpense) {
    if(isExpense == true)
    {
        var sql = `SELECT * FROM ${TBNAME} WHERE (${COLS[4]} = '${user_id}' AND ${COLS[3]} = true) OR (${COLS[4]} IS NULL AND ${COLS[3]} = true);`;
        try {
            let q_res = await query(sql);
            let res = [];
            for (i in q_res) {
                res.push(q_res[i]);
            }
            return res;
        }
        catch(err) {
             throw err;
        }
    }
    else
    {
        var sql = `SELECT * FROM ${TBNAME} WHERE (${COLS[4]} = '${user_id}' AND ${COLS[3]} = false) OR (${COLS[4]} IS NULL AND ${COLS[3]} = false);`;
        try {
            let q_res = await query(sql);
            let res = [];
            for (i in q_res) {
                res.push(q_res[i]);
            }
            return res;
        }
        catch(err) {
             throw err;
        }
    }
}

module.exports.getCategoryByCatNameAndUserID = async function(user_id, cat_name, isExpense) {

    if(isExpense == true)
    {  
        console.log("Get Category ID expense....");
        var sql = `SELECT * FROM ${TBNAME} WHERE (${COLS[4]} = '${user_id}' AND ${COLS[3]} = true AND ${COLS[1]} = '${cat_name}');`;
        try {
            let q_res = await query(sql);
            let res = [];
            for (i in q_res) {
                res.push(q_res[i]);
            }
            return res;
        }
        catch(err) {
             throw err;
        }
    }
    else
    {
        console.log("Get Category ID income....");
        var sql = `SELECT * FROM ${TBNAME} WHERE (${COLS[4]} = '${user_id}' AND ${COLS[3]} = false AND ${COLS[1]} = '${cat_name}');`;
        try {
            let q_res = await query(sql);
            let res = [];
            for (i in q_res) {
                console.log(i);
                res.push(q_res[i]);
            }
            return res;
        }
        catch(err) {
             throw err;
        }
    }
}
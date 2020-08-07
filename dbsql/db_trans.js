
const TBNAME = 'transaction_table';
const COLS = [
    'transaction_id',
    'transaction_value',
    'transaction_date',
    'comment',
    'user_id',
    'category_id'    
];
module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;

module.exports.create_table = async function(db_user, db_cat, db_group) {
    var sql = "SELECT 1 FROM " + TBNAME + " LIMIT 1;"
    try {
        await query(sql);
        console.log("table transaction_table allready exists!");
    }
    catch(err) {
        console.log(err);
        console.log("No table transaction_table.."); 

        console.log("create table..");
        sql = "create table " + TBNAME + " ("
            + COLS[0] + " int not null auto_increment primary key,"
            + COLS[1] + " decimal(20,2) not null,"
            + COLS[2] + " datetime,"
            + COLS[3] + " int not null,"
            +`Foreign Key (${COLS[3]}) REFERENCES ${db_user.TBNAME}(${db_user.COLS[0]}) `
            +"ON DELETE CASCADE,"
            + COLS[4] + " int ,"
            +`Foreign Key (${COLS[4]}) REFERENCES ${db_cat.TBNAME}(${db_cat.COLS[0]}) `
            +"ON DELETE SET NULL"
            //+ COLS[5] + " int,"
            //+`Foreign Key (${COLS[5]}) REFERENCES ${db_cat.TBNAME}(${db_cat.COLS[0]}),`
            //+ COLS[6] + " int,"
            //+`Foreign Key (${COLS[6]}) REFERENCES ${db_group.TBNAME}(${db_group.COLS[0]}) `
            //"ON DELETE CASCADE,"
            //+ COLS[7] + " int,"
            //+`Foreign Key (${COLS[7]}) REFERENCES ${db_user.TBNAME}(${db_user.COLS[0]}),`
            //+ COLS[8] + " varchar(255)"
            +");"
        try {
            await query(sql);
            console.log("table transaction_table created!");
        }
        catch(err) {
            console.log("cannot create table...");
            console.log(err);
        }
    }
}

module.exports.trialtrans = function () {
    console.log("trial function triggered");
}

module.exports.insertTransaction = async function(value, transonce, category, isExpense, userID) {
    var sql, res;

    try {
        if(isExpense){
            value = value - (value * 2);
        }
        var currenttime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        // single income
        if(transonce == 1){
            sql = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[4]}) `
            + `VALUES ('${value}', '${currenttime}', '${userID}', '${category}');`;
        }
        // event scheduled income (here: monthly)
        else if (transonce > 1){
            //sql = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[3]}, ${COLS[4]}) `
            //+ `VALUES ('${value}', '${userID}', '${category}');`; // CURRENT_TIMESTAMP
            await query(`SET GLOBAL event_scheduler = on;`);
            sql = `CREATE EVENT IF NOT EXISTS period_event
                    ON SCHEDULE EVERY '1' SECOND
                    STARTS CONCAT(adddate(last_day(curdate()), 1), ' 00:00:00')
                    DO
                    INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[4]})
                    VALUES ('${value}', NOW(), '${userID}', '${category}');`;
            try {
                await query(sql);
                console.log("sql event created!");
            }
            catch(err) {
                console.log("cannot create event...");
                console.log(err);
            }
        }
    

    


        res = await query(sql);
        return res;
        
    }
    catch(err) {
        throw err;
    }
}

module.exports.getTransactionsByUserID = async function(user_id, isExpense) {
    if(isExpense == true)
    {
        var sql = `SELECT * FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value < 0);`;
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
        var sql = `SELECT * FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value > 0);`;
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
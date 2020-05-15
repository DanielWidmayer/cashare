
const TBNAME = 'transaction_table';
const COLS = [
    'transaction_id',
    'transaction_value',
    'transaction_date',
    'user_id',
    'category_id',   
    'comment'
];
module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;
var event_counter = 1;

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

module.exports.insertTransaction = async function(value, transonce, category, isExpense, userID, repetitionValue, timeUnit, dateTimeID) {
    var sql, res;

    timeUnit = timeUnit.toString().replace("1", 'YEAR');
    timeUnit = timeUnit.toString().replace("2", 'MONTH');
    timeUnit = timeUnit.toString().replace("3", 'DAY');
    timeUnit = timeUnit.toString().replace("4", 'HOUR');
    timeUnit = timeUnit.toString().replace("5", 'MINUTE');
    timeUnit = timeUnit.toString().replace("6", 'SECOND');

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
        //SELECT ${COLS[1]} FROM ${TBNAME} INTO OUTFILE 'dbtxt.txt';
        // event scheduled income (here: monthly)
        else if (transonce > 1){

            // //CONCAT(adddate(last_day(curdate()), 1), ' 00:00:00')
            await query(`SET GLOBAL event_scheduler = on;`);
            sql = `CREATE EVENT IF NOT EXISTS scheduled_event${event_counter}
                    ON SCHEDULE EVERY '${repetitionValue}' ${timeUnit}
                    STARTS '${dateTimeID}'
                    DO
                    INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[4]})
                    VALUES ('${value}', NOW(), '${userID}', '${category}');`;
            event_counter++;
            try {
                await query(sql);
                
                console.log("sql1 event created!");
                //await query(sql_event2);
                //console.log("sql2 event created!");
                // 
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
    var sql_getTransactions;
    if(isExpense == true)
    {
        sql_getTransactions = `SELECT * FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value < 0);`;
        console.log("vlaue < 0!!!");
    }
    else
    {
        sql_getTransactions = `SELECT * FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value > 0);`;
    }
        
    try {
        let q_res = await query(sql_getTransactions);
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


module.exports.getPersonalBalance = async function(user_id){
    var personal_balance;
    var sql_get_personal_balance = `SELECT sum(${COLS[1]}) AS balance FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}');`;
    try {
        let q_res = await query(sql_get_personal_balance);
        personal_balance = q_res[0].balance;
    }
    catch(err) {
        throw err;
    }
    return {"personal_balance":personal_balance};
}

module.exports.checkBalance = async function(user_id, transaction_value){
    var personal_balance = (await this.getPersonalBalance(user_id)).personal_balance;
    if (personal_balance - transaction_value < 0)
    {
        console.log("schulden!!!");
        return false;
    } else {
        console.log("keine Schulden");
        return true;
    }
}


module.exports.getTransactionValueByUserID = async function(user_id, isExpense) {

    // calc span months
    var span_months;
    var sql_getSpan = `SELECT PERIOD_DIFF(CONCAT((SELECT YEAR(CURDATE())), (SELECT LPAD(MONTH(CURDATE()), 2, 0))),CONCAT((SELECT YEAR(registrationDate) FROM user_table WHERE (${COLS[3]} = ${user_id})), (SELECT LPAD(MONTH(registrationDate), 2, 0) FROM user_table WHERE (${COLS[3]} = ${user_id})))) AS registr_month;`
    try {
        let q_res = await query(sql_getSpan);
        span_months = q_res[0].registr_month;
    }
    catch (err) {
        throw err;
    }

    var comparison_sign;
    if(isExpense == true)
    {
        comparison_sign = "<";
    } else {
        comparison_sign = ">";
    }
        
    var average_val, annual_val, lastMonth_val;

    // calc average val
    var sql_get_average_val;
    if (span_months <= 12 && span_months >= 1) {
        sql_get_average_val = `SELECT (sum(${COLS[1]}) / '${span_months}') AS average FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value ${comparison_sign} 0);`;
    } else if (span_months > 12) {
         sql_get_average_val = `SELECT (sum(${COLS[1]}) / 12) AS average FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value ${comparison_sign} 0 AND transaction_date > (SELECT DATE_SUB(CURDATE(), INTERVAL 12 MONTH)));`;
    } else if (span_months == 0) {
        sql_get_average_val = `SELECT sum(${COLS[1]}) AS average FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value ${comparison_sign} 0);`;
    }

    try {
        let q_res = await query(sql_get_average_val);
        average_val = q_res[0].average;

    }
    catch(err) {
        throw err;
    }

    var number_of_months = new Date().getMonth()+1

    // calc annual value
    var sql_get_annual_val = `SELECT sum(${COLS[1]}) AS annual FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value ${comparison_sign} 0 AND transaction_date > (SELECT DATE_SUB(CURDATE(), INTERVAL ${number_of_months} MONTH)));`;
    try {
        let q_res = await query(sql_get_annual_val);
        annual_val = q_res[0].annual;
    }
    catch(err) {
        throw err;
    }

    // calc last month income
    var sql_get_last_month_val = `SELECT sum(${COLS[1]}) AS lastMonth FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value ${comparison_sign} 0 AND MONTH(transaction_date) = MONTH(CURDATE())-1);`;
    try {
        let q_res = await query(sql_get_last_month_val);
        lastMonth_val = q_res[0].lastMonth;
    }
    catch(err) {
        throw err;
    }

    var values_barchart = [];
    for (var i = 0; i < number_of_months; i++){
        var sql_eachMonth = `SELECT sum(${COLS[1]}) AS values_month FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value ${comparison_sign} 0 AND MONTH(transaction_date) = MONTH(CURDATE())-${i});`;
        try {
            let q_res = await query(sql_eachMonth);

            if (q_res[0].values_month == null){
                values_barchart[i] = 0;
            } else {
                values_barchart[i] = q_res[0].values_month;
            }
        }
        catch(err) {
            throw err;
        }
    }

    // return JSON
    if(isExpense == true)
    {
        return {"average_expenses":average_val, "annual_expenses":annual_val, "lastMonth_expenses":lastMonth_val, "expenses_eachMonth":values_barchart};
    } 
    else 
    {
        return {"average_income":average_val, "annual_income":annual_val, "lastMonth_income":lastMonth_val, "income_eachMonth":values_barchart};
    }
 }
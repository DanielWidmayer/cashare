
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


// hier noch speziell für User? Payment-Groups?
module.exports.insertTransaction = async function(value, transonce, category, isExpense, userID, repetitionValue, timeUnit, dateTimeID, contractualPartner, destinationAccount) {
    
    let count_events = await query(`SELECT count(*) AS events FROM INFORMATION_SCHEMA.EVENTS;`);
    var event_counter = parseInt(JSON.stringify(count_events[0].events)) + 1;
    console.log(event_counter);
    
    var sql, res;
    var destination_userID;

    timeUnit = timeUnit.toString().replace("1", 'YEAR');
    timeUnit = timeUnit.toString().replace("2", 'MONTH');
    timeUnit = timeUnit.toString().replace("3", 'DAY');
    timeUnit = timeUnit.toString().replace("4", 'HOUR');
    timeUnit = timeUnit.toString().replace("5", 'MINUTE');
    timeUnit = timeUnit.toString().replace("6", 'SECOND');


    if (destinationAccount == "1") {
        destination_userID = userID;
    }
    if (destinationAccount == "2") {
        console.log("Partner: " + contractualPartner);
        var nameArray = contractualPartner.split(' '); // contractual partner als "richtige" User ID... variablenbenennung destinationUserID hier sehr unglücklich...
        try {
            let q_res = await query(`SELECT user_id FROM user_table WHERE firstname = '${nameArray[0]}' AND lastname = '${nameArray[1]}'`);
            destination_userID = q_res[0].user_id;
        }
        catch (err) {
            throw err;
        }
    }
    if (destinationAccount == "3") {
        //destination_userID = payment-group ID!!! (für die Payment-Groups innerhalb: Mischung aus 1) und 3)...)
    }

    var currenttime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // single income
    if(transonce == 1){
        if (destinationAccount == "1")
        {
            let sql;
            if (isExpense){
                value = value * (-1); // expenses are subtracted froom account balance
            }
            sql = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[4]}) `
            + `VALUES ('${value}', '${currenttime}', '${destination_userID}', '${category}');`;
            res = await query(sql);
            return res;
        }

        if (destinationAccount == "2"  && isExpense){ // Transaktionen zu anderen Usern / Groups können nur in Form von Expenses stattfinden
            let res, sql1, sql2;

            sql1 = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}) ` // + on other user account
            + `VALUES ('${value}', '${currenttime}', '${destination_userID}');`;
            res = await query(sql1);
            sql2 = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}) ` // - on this user account
            + `VALUES ('${value * (-1)}', '${currenttime}', '${userID}');`; // muss in der Cat Table noch explizit definiert werden...
            await query(sql2);

            return res; //??? is that really necessary
        }


        if (destinationAccount == "3"  && isExpense){ // Transaktionen zu anderen Usern / Groups können nur in Form von Expenses stattfinden
            let res, sql1, sql2;
            sql1 = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}) ` // + on other user account
            + `VALUES ('${value}', '${currenttime}', '${destination_userID}');`;
            res = await query(sql1);
            sql2 = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}) ` // - on this user account
            + `VALUES ('${value * (-1)}', '${currenttime}', '${userID}');`; // muss in der Cat Table noch explizit definiert werden...
            await query(sql2);

            return res; //??? is that really necessary
        }
    }

    // event scheduled income (regularly)
    else if (transonce > 1){
        
        var sql_startTimeSpan = `SELECT IF(UNIX_TIMESTAMP('${dateTimeID}') < UNIX_TIMESTAMP(NOW()), true, false) AS future;`;
        var future_boolean;
        try {
            let res = await query(sql_startTimeSpan);
            future_boolean = res[0].future;
        }
        catch (err) {
            console.log(err);
        }
        
        console.log("future_boolean: " + future_boolean);
        // start time must be in close future, not in past
        if (future_boolean == 1) {
            return {"error": "past_error"};
        }

        if (destinationAccount == "1"){
            var sql;
            // //CONCAT(adddate(last_day(curdate()), 1), ' 00:00:00')
            if (isExpense){
                value = value * (-1); // expenses are subtracted froom account balance
            }
            console.log("dateTimeID: " +dateTimeID);
            await query(`SET GLOBAL event_scheduler = on;`);
            sql = `CREATE EVENT IF NOT EXISTS scheduled_event${event_counter}
                    ON SCHEDULE EVERY '${repetitionValue}' ${timeUnit}
                    STARTS '${dateTimeID}'
                    DO
                    INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[4]})
                    VALUES ('${value}', NOW(), '${destination_userID}', '${category}');`;
            console.log(sql);
            try {
                await query(sql);
                return {"error": "-"};
            }
            catch(err) {
                console.log(err);
            }
        }

        if ((destinationAccount == "2") && isExpense){
            let sql1, sql2;
            // //CONCAT(adddate(last_day(curdate()), 1), ' 00:00:00')
            await query(`SET GLOBAL event_scheduler = on;`);
            sql1 = `CREATE EVENT IF NOT EXISTS scheduled_event${event_counter}
                    ON SCHEDULE EVERY '${repetitionValue}' ${timeUnit}
                    STARTS '${dateTimeID}'
                    DO
                    INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]})
                    VALUES ('${value}', NOW(), '${destination_userID}');`;
            try {
                await query(sql1);
            }
            catch(err) {
                console.log(err);
            }

            sql2 = `CREATE EVENT IF NOT EXISTS scheduled_event${event_counter + 1}
                    ON SCHEDULE EVERY '${repetitionValue}' ${timeUnit}
                    STARTS '${dateTimeID}'
                    DO
                    INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]})
                    VALUES ('${value * (-1)}', NOW(), '${userID}');`;        

            try {
                await query(sql2);
                return {"error": "-"};
            }
            catch(err) {
                console.log(err);
            }
        }
        
        
        if ((destinationAccount == "3") && isExpense){
            let sql1, sql2;
            // //CONCAT(adddate(last_day(curdate()), 1), ' 00:00:00') //, ${COLS[4]}    , '${category}'
            await query(`SET GLOBAL event_scheduler = on;`);
            sql1 = `CREATE EVENT IF NOT EXISTS scheduled_event${event_counter}
                    ON SCHEDULE EVERY '${repetitionValue}' ${timeUnit}
                    STARTS '${dateTimeID}'
                    DO
                    INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]})
                    VALUES ('${value}', NOW(), '${destination_userID}');`;
            try {
                await query(sql1);
            }
            catch(err) {
                console.log(err);
            }

            sql2 = `CREATE EVENT IF NOT EXISTS scheduled_event${event_counter + 1}
                    ON SCHEDULE EVERY '${repetitionValue}' ${timeUnit}
                    STARTS '${dateTimeID}'
                    DO
                    INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[4]})
                    VALUES ('${value * (-1)}', NOW(), '${userID}', '${category}');`;        

            try {
                await query(sql2);
                return {"error": "-"};
            }
            catch(err) {
                console.log(err);
            }
        }  

    }
}

module.exports.setRegularTransaction = async function(user_id, value) {

};

module.exports.deleteRegularTransaction = async function(user_id, value) {
// stop now
// delete 
};


module.exports.getTransactionsByUserID = async function(user_id, isExpense) {
    var sql_getTransactions;
    if(isExpense == true)
    {
        sql_getTransactions = `SELECT * FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value < 0);`;
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
        console.log(err);
    }

    if (personal_balance == null) {
        personal_balance = 0;
    }

    var sql_update_balance = `UPDATE user_table SET balance = ${personal_balance} WHERE user_id = ${user_id};`;
    try {
        await query(sql_update_balance);
    }
    catch(err) {
        console.log(err);
    }

    return {"personal_balance":personal_balance};
}

module.exports.checkBalance = async function(user_id, transaction_value){
    var personal_balance = (await this.getPersonalBalance(user_id)).personal_balance;
    if (personal_balance - transaction_value < 0)
    {
        return false;
    } else {
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
 

 module.exports.getArraysPieChart = async function(user_id){
var sqlgetcatval  = `select category_table.category_name, 
                    ABS(SUM(transaction_value)) as total_value
                    From transaction_table
                    Inner Join category_table on transaction_table.category_id = category_table.category_id
                    where (${COLS[3]} = '${user_id}' AND  transaction_value < 0)
                    group by transaction_table.category_id
                    order by total_value desc;`

    try {
        let q_res = await query(sqlgetcatval);
        var i= 0;
        var categories = new Array(q_res.length);
        var totalexpenses = new Array(q_res.length);
        for(;i < q_res.length;i++){
            
            categories[i]=q_res[i].category_name;
            totalexpenses[i]=q_res[i].total_value;
        }

        
    }
    catch (err) {
        throw err;
    }
    
    return{'categories':categories, 'totalexpenses': totalexpenses};

 }

 module.exports.getArraysPieChartIncomes = async function(user_id){
    var sqlgetcatval  = `select category_table.category_name, 
                        ABS(SUM(transaction_value)) as total_value
                        From transaction_table
                        Inner Join category_table on transaction_table.category_id = category_table.category_id
                        where (${COLS[3]} = '${user_id}' AND  transaction_value > 0)
                        group by transaction_table.category_id
                        order by total_value desc;`
    
        try {
            let q_res = await query(sqlgetcatval);
            var i= 0;
            var categories = new Array(q_res.length);
            var totalincomes = new Array(q_res.length);
            for(;i < q_res.length;i++){
                
                categories[i]=q_res[i].category_name;
                totalincomes[i]=q_res[i].total_value;
            }
           
            
        }
        catch (err) {
            throw err;
        }
        
        return{'categories':categories, 'totalincomes': totalincomes};
    
     }
    

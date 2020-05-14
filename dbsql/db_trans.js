
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
            sql = `CREATE EVENT IF NOT EXISTS period_event
                    ON SCHEDULE EVERY '${repetitionValue}' ${timeUnit}
                    STARTS CURRENT_TIMESTAMP
                    DO
                    INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[4]})
                    VALUES ('${value}', NOW(), '${userID}', '${category}');`;
            try {
                await query(sql);
                console.log("sql event created!");
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



module.exports.getTransactionValueByUserID = async function(user_id, isExpense) {
    if(isExpense == true)
    {
        var sql = `SELECT sum(${COLS[1]}) AS destination_value FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value < 0);`;
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
        /* If the user is registred for less than one year, the average income is displayed for the time span the user is registred.
           If the user is registred for more than one year, the average income for the last / recent 12 months is displayed.
           To difference, the month span between today's date and the users registry date is calculated.
        */

        var span_months, average_income, annual_income, lastMonth_income;

        // calc average income
        var sql_getSpan = `SELECT PERIOD_DIFF(CONCAT((SELECT YEAR(CURDATE())), (SELECT LPAD(MONTH(CURDATE()), 2, 0))),CONCAT((SELECT YEAR(registrationDate) FROM user_table WHERE (${COLS[3]} = ${user_id})), (SELECT LPAD(MONTH(registrationDate), 2, 0) FROM user_table WHERE (${COLS[3]} = ${user_id})))) AS registr_month;`
        try {
            let q_res = await query(sql_getSpan);
            span_months = q_res[0].registr_month;
        }
        catch (err) {
            throw err;
        }

        var sql_get_average_income;
        if (span_months <= 12 && span_months >= 1) {
            sql_get_average_income = `SELECT (sum(${COLS[1]}) / '${span_months}') AS average_income FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value > 0);`;
        } else if (span_months > 12) {
            sql_get_average_income = `SELECT (sum(${COLS[1]}) / 12) AS average_income FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value > 0 AND transaction_date > (SELECT DATE_SUB(CURDATE(), INTERVAL 12 MONTH)));`;
        } else if (span_months == 0) {
            sql_get_average_income = `SELECT sum(${COLS[1]}) AS average_income FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value > 0);`;
        }

        try {
            let q_res = await query(sql_get_average_income);
            average_income = q_res[0].average_income;

        }
        catch(err) {
             throw err;
        }

        // calc annual income
        var sql_get_annual_income = `SELECT sum(${COLS[1]}) AS annual_income FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value > 0 AND transaction_date > (SELECT DATE_SUB(CURDATE(), INTERVAL 12 MONTH)));`;
        try {
            let q_res = await query(sql_get_annual_income);
            annual_income = q_res[0].annual_income;
        }
        catch(err) {
             throw err;
        }

        // calc last month income
        var sql_get_last_month_income = `SELECT sum(${COLS[1]}) AS lastMonth_income FROM ${TBNAME} WHERE (${COLS[3]} = '${user_id}' AND transaction_value > 0 AND MONTH(transaction_date) = MONTH(CURDATE())-1);`;
        try {
            let q_res = await query(sql_get_last_month_income);
            lastMonth_income = q_res[0].lastMonth_income;
        }
        catch(err) {
             throw err;
        }
        
        return {"average_income":average_income, "annual_income":annual_income, "lastMonth_income":lastMonth_income};
    }
}
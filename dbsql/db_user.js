const bcrypt = require('bcrypt');
const crypto = require('crypto-js');

const TBNAME = 'user_table';
const COLS = [
    'user_id',
    'firstname',
    'lastname',
    'mail',
    'password',
    'isVerified',
    'pw_reset',
    'phone',
    'balance',
    'picture',
    'registrationDate'
];
module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;


module.exports.create_table = async function() {
    var sql = "SELECT 1 FROM " + TBNAME + " LIMIT 1;"
    try {
        await query(sql);
        console.log("table user_table allready exists!");
    }
    catch(err) {
        console.log(err);
        console.log("No Table user_table.."); 
        console.log("create Table..");
            sql = "create table " + TBNAME + " ("
              + COLS[0] + " int not null auto_increment primary key," 
              + COLS[1] + " varchar(255) not null,"
              + COLS[2] + " varchar(255) not null,"
              + COLS[3] + " VARCHAR(255) not null,"
              + COLS[4] + " varchar(255) not null,"
              + COLS[5] + " boolean default(false),"
              + COLS[6] + " varchar(255),"
              + COLS[7] + " varchar(255),"
              + COLS[8] + " decimal(10,2) not null default('0'),"
              + COLS[9] + " varchar(255),"
              + COLS[10] + " date"
              + ");"
        try {
            await query(sql);
            console.log("table user_table created!");
        }
        catch( err ) {
            console.log("cannot create table...");
            console.log(err);
        }    
    }
}

// module.exports.link = async function(db_msg, db_alert) {
//     var sql1 = `ALTER TABLE ${TBNAME} ADD FOREIGN KEY (${COLS[10]}) REFERENCES ${db_alert.TBNAME} (${db_alert.COLS[0]});`
//     var sql2 = `ALTER TABLE ${TBNAME} ADD FOREIGN KEY (${COLS[11]}) REFERENCES ${db_msg.TBNAME}(${db_msg.COLS[0]});`
//     try {
//         await query(sql1);
//         await query(sql2);
//     }
//     catch(err) {
//         console.log(err);
//     }
// }

module.exports.getEvery = async function() {
    var sql = `SELECT * FROM ${TBNAME};`
    try {
        let res = await query(sql);
        //console.log(res);
        return res;
    }
    catch(err) {
        throw err;
    }
}

module.exports.getDataByMail = async function(mail, arr = true) {
    var sql, res;
    sql = `SELECT ${COLS[0]}, ${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[7]}, ${COLS[8]}, ${COLS[9]}, ${COLS[10]} FROM ${TBNAME} WHERE ${COLS[3]} = '${mail}';`
    try {
        let q_res = await query(sql);
        let res = [];
        q_res = q_res[0];

        if(arr) {
            for (i in q_res) {
                res.push(q_res[i]);
            }
        }
        else {
            res = q_res;
        }
        
        return res;
    }
    catch(err) {
        throw err;
    }
}

module.exports.getDataByID = async function(user_id, arr = true) {
    var sql = `SELECT ${COLS[0]}, ${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[7]}, ${COLS[8]}, ${COLS[9]}, ${COLS[10]} FROM ${TBNAME} WHERE ${COLS[0]} = '${user_id}';`
    try {
        let q_res = await query(sql);
        let res = [];   
        q_res = q_res[0];

        if (arr) {
            for (i in q_res) {
                res.push(q_res[i]);
            }
        }
        else {
            res = q_res;
        }
        
        return res;
    }
    catch(err) {
        throw err;
    }
}

module.exports.changeProfileImg = async function(user_id) {
    var sql = `UPDATE ${TBNAME} SET ${COLS[9]} = 'user${user_id}pic.jpg' WHERE ${COLS[0]} = '${user_id}';`
    try {
        await query(sql);
    } catch(err) {
        throw err;
    }
    return true;
}

module.exports.changeNameAndMail = async function(user_id, firstname, lastname, mail) {
    var sql = `UPDATE ${TBNAME} SET ${COLS[1]} = '${firstname}', ${COLS[2]} = '${lastname}', ${COLS[3]} = '${mail}' WHERE ${COLS[0]} = '${user_id}';`;
    try {
        let res = await this.getDataByMail(mail);
        if(res.length && res[0] != user_id) throw "Mail is already used!";
        else {
            await query(sql);
        }
    }catch(err) {
        throw err;
    }
    return true;
}

module.exports.changePassword = async function(user_id, old_pw, new_pw) {
    var sql, res;
    sql = `SELECT ${COLS[4]} FROM ${TBNAME} WHERE ${COLS[0]} = '${user_id}';`;
    try {
        let res = await query(sql);
        if(res[0]) {
            let f1 = await bcrypt.compare(old_pw, res[0][COLS[4]]);
            if(f1) {
                new_pw = await bcrypt.hash(new_pw,10);
                sql = `UPDATE ${TBNAME} SET ${COLS[4]} = '${new_pw}' WHERE ${COLS[0]} = '${user_id}';`
                await query(sql);
                return true;
            }
            else throw "Invalid Password!";
        }
        else throw "Invalid Password!";
    } catch (err) {
        throw err;
    }
}

module.exports.login = async function(mail, password) {
    var sql, res;
    sql = `SELECT ${COLS[0]}, ${COLS[4]} FROM ${TBNAME} WHERE ${COLS[3]} = '${mail}';`;
    try {
        res = await query(sql);
        res = res[0];
        if(res) {
            let f1 = await bcrypt.compare(password, res[COLS[4]]);
            if(f1) return res[COLS[0]];
            else return false;
        }
    }
    catch(err) {
        console.log(err);
    }
}

module.exports.registerUser = async function(firstname, lastname, mail, password, phone) {
    var sql, res;

    try {
        res = await this.getDataByMail(mail);
        if(res.length) throw "Mail is already used!";
        else {
            let phone_namespace = phone ? `, ${COLS[7]}` : ``;
            let phone_value = phone ? `, '${phone}'` : ``;
            password = await bcrypt.hash(password,10);
            registrationDate = await query(`SELECT CURRENT_TIMESTAMP();`);


            sql = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[4]}${phone_namespace}, ${COLS[10]}) `
                + `VALUES ('${firstname}', '${lastname}', '${mail}', '${password}'${phone_value}, CURRENT_TIMESTAMP);`;
            
            res = await query(sql);
            return res.insertId;
        }
    }
    catch(err) {
        throw err;
    }
}

module.exports.getMailData = async function() {
    var sql = `SELECT ${COLS[3]} FROM ${TBNAME};`
    try {
        let q_res = await query(sql);
        let res = [];
        for (i in q_res) {
            res.push(q_res[i][COLS[3]]);
        }
        return res;
    }
    catch(err) {
        throw err;
    }
}
const bcrypt = require('bcrypt');

const TBNAME = 'user_table';
const COLS = [
    'user_id',
    'firstname',
    'lastname',
    'mail',
    'password',
    'phone',
    'balance'
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
              + COLS[5] + " varchar(255),"
              + COLS[6] + " decimal(10,2) not null default('0')"
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

module.exports.getDataByMail = async function(mail) {
    var sql, res;
    sql = `SELECT * FROM ${TBNAME} WHERE ${COLS[3]} = '${mail}';`
    try {
        res = await query(sql);
        return res[0];
    }
    catch(err) {
        throw err;
    }
}

module.exports.getNameByID = async function(user_id) {
    var sql, res;
    sql = `SELECT ${COLS[1]}, ${COLS[2]} FROM ${TBNAME} WHERE ${COLS[0]} = '${user_id}';`
    try {
        res = await query(sql);
        res = res[0];
        return [res[COLS[1]], res[COLS[2]]];
    }
    catch(err) {
        throw err;
    }
}

module.exports.login = async function(mail, password) {
    var sql, res;
    sql = `SELECT ${COLS[0]}, ${COLS[4]} FROM ${TBNAME} WHERE ${COLS[3]} = '${mail}';`
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
        throw err;
    }
}

module.exports.registerUser = async function(firstname, lastname, mail, password, phone) {
    var sql, res;

    try {
        res = await this.getDataByMail(mail);
        if(res) throw "Mail is already used!";
        else {
            let phone_namespace = phone ? `, ${COLS[5]}` : ``;
            let phone_value = phone ? `, '${phone}'` : ``;
            password = await bcrypt.hash(password,10);

            sql = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}, ${COLS[4]}${phone_namespace}) `
                + `VALUES ('${firstname}', '${lastname}', '${mail}', '${password}'${phone_value});`;
            
            res = await query(sql);
            return res.insertId;
        }
    }
    catch(err) {
        throw err;
    }
}
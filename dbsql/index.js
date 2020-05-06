const mysql = require('mysql');
const util = require('util');

module.exports.db_user = require('./db_user');
module.exports.db_cat = require('./db_cat');
module.exports.db_group = require('./db_group');
module.exports.db_user_group = require('./db_user_group');
module.exports.db_goal = require('./db_goal');
module.exports.db_user_cat = require('./db_user_cat');
module.exports.db_trans = require('./db_trans');
module.exports.db_msg = require('./db_message');


// Connect to database
// Node module mysql muss mit "npm install mysql" installiert werden, wenn noch nicht vorhanden..
module.exports.createConnection = function( env_host, env_user, env_password, env_port, env_dbname ) {
    con = mysql.createConnection({
        host: env_host,
        user: env_user,
        password: env_password,
        // Port muss evtl. bei euch angepasst werden..
        port: env_port,
        // Datenbank "cashare" vor dem starten angelegt werden mit "CREATE DATABASE cashare;"
        database: env_dbname
    });
    query = util.promisify(con.query).bind(con);
    return con;
}

module.exports.query = async function(sql_query){
    try {
        res = await query(sql_query);
    }
    catch(err) {
        console.log(err);
    }
    return res;
}

/*module.exports.connect = async function() {
    con.connect(async function(err) {
        if (err) throw err;
        console.log("Connected to database!");

        // create TABLE user_table
        await db_user.create_table(); 

        // create TABLE category_table
        await db_cat.create_table();

        // create TABLE group_table
        await db_group.create_table();

        // create TABLE user_group_table
        await db_user_group.create_table(db_user, db_group);
  
        // create TABLE user_category_table
        await db_user_cat.create_table(db_user, db_cat);

        // create TABLE goal_table
        await db_goal.create_table(db_cat, db_group, db_user);

        // create TABLE message_table
        await db_msg.create_table(db_user, db_group);

        // create TABLE transaction_table
        await db_trans.create_table(db_user, db_cat, db_group);
    });
}*/




  
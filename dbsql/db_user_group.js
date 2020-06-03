
const TBNAME = 'user_group_table';
const COLS = [
    'user_id',
    'group_id',
    'user_role'                 // 0 = invited , 1 = basic (only read) , 2 = advanced (edit payment goals e.g.) , 3 = admin
];

module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;

module.exports.create_table = async function(db_user, db_group) {
    var sql = "SELECT 1 FROM " + TBNAME  + " LIMIT 1;"
    try {
        await query(sql);
        console.log("table user_group_table allready exists!");
    }
    catch(err) {
        console.log(err);
        console.log("No table user_group_table.."); 

        console.log("create table..");
        sql = "create table " + TBNAME + " ("
            + COLS[0] + " int not null,"
            +`Foreign Key (${COLS[0]}) References ${db_user.TBNAME}(${db_user.COLS[0]}) `
            +"ON DELETE CASCADE,"
            + COLS[1] + " int not null,"
            +`Foreign Key (${COLS[1]}) REFERENCES ${db_group.TBNAME}(${db_group.COLS[0]}) `
            +"ON DELETE CASCADE,"
            + COLS[2] + " int not null,"
            +`PRIMARY KEY (${COLS[0]},${COLS[1]})`
            +");"
        try {
            await query(sql);
            console.log("table user_group_table created!");
        }
        catch(err) {
            console.log("cannot create table...");
            console.log(err);
        }
    }
}


module.exports.getUserGroups = async function(userid) {
    var sql = `SELECT ${COLS[1]}, ${COLS[2]} FROM ${TBNAME} WHERE ${COLS[0]}='${userid}';`;
    try {
        let row = await query(sql);
        return row;
    } catch (err) {
        throw (err);
    }
}


module.exports.getMembers = async function(groupid) {
    var sql = `SELECT ${COLS[0]}, ${COLS[2]} FROM ${TBNAME} WHERE ${COLS[1]}='${groupid}';`;
    try {
        let row = await query(sql);
        return row;
    } catch (err) {
        throw (err);
    }
}

module.exports.getUserRole = async function(userid, groupid) {
    var sql = `SELECT ${COLS[2]} FROM ${TBNAME} WHERE ${COLS[0]}='${userid}' AND ${COLS[1]}='${groupid}';`;
    try {
        let row = await query(sql);
        row = row[0][COLS[2]];
        return row;
    } catch (err) {
        throw (err);
    }
}
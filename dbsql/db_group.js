
const TBNAME = 'group_table';
const COLS = [
    'group_id',
    'group_name',
    'group_description',
    'group_balance'
];
module.exports.TBNAME = TBNAME;
module.exports.COLS = COLS;

module.exports.create_table = async function() {
    var sql = "SELECT 1 FROM " + TBNAME + " LIMIT 1;"
    try {
        await query(sql);
        console.log("Table '" + TBNAME + "' already exists!");
    }
    catch(err) {
        console.log("Didn't find table named '" + TBNAME + "'"); 
        console.log("Creating table '" + TBNAME + "'...");
        sql = "create table " + TBNAME + " ("
            + COLS[0] + " int not null auto_increment primary key," 
            + COLS[1] + " varchar(255) not null,"
            + COLS[2] + " varchar(500),"
            + COLS[3] + " decimal(10,2) not null default '0'"
            +");"
        try {
            await query(sql);
            console.log("Table '" + TBNAME + "' successfully created!");
        }
        catch(err) {
            console.log("Error: Can't create table '" + TBNAME + "'...");
            console.log(err);
        }
    }
}


module.exports.getGroup = async function(groupid) {
    var sql = `SELECT * FROM ${TBNAME} WHERE ${COLS[0]}='${groupid}';`;
    try {   
        let row = await query(sql);
        return row[0];
    } catch (err) {
        throw (err);
    }
}


module.exports.createGroup = async function(groupname, groupdesc) {
    var sql1 = `SELECT MAX(${COLS[0]}) AS 'index' FROM ${TBNAME} WHERE ${COLS[1]}='${groupname}' AND ${COLS[2]}='${groupdesc}';`;
    var sql2 = `INSERT INTO ${TBNAME} (${COLS[1]}, ${COLS[2]}, ${COLS[3]}) VALUES ('${groupname}', '${groupdesc}', 0);`;
    try {

        await query(sql2);
        let index = await query(sql1);
        index = index[0]['index'];
        return index;
    } catch (err) {
        throw (err);
    }
}

module.exports.deleteGroup = async function (groupid) {
    var sql = `DELETE FROM ${TBNAME} WHERE ${COLS[0]}='${groupid}';`;
    try {
        await query(sql);
        return 1;
    } catch (err) {
        throw (err);
    }
}

module.exports.changeGroupName = async function (groupid, groupname) {
    var sql = `UPDATE ${TBNAME} SET ${COLS[1]}='${groupname}' WHERE ${COLS[0]}='${groupid}';`;
    try {
        await query(sql);
        return 1;
    } catch (err) {
        throw (err);
    }
}

module.exports.changeGroupDesc = async function (groupid, groupdesc) {
    var sql = `UPDATE ${TBNAME} SET ${COLS[2]}='${groupdesc}' WHERE ${COLS[0]}='${groupid}';`;
    try {
        await query(sql);
        return 1;
    } catch (err) {
        throw (err);
    }
}

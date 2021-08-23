const createTable = function(command) {

    const tableName = command.match(/table\s(\w+)\s/)[1]
    const columns = command.match(/\((.+)\)/)[1].trim().split(', ')

    this.tables = {
        [tableName]: {
            columns: {}
        },
        data: []
    }

    for (const column of columns) {
        const splitArray = column.split(" ")
        const name = splitArray[0]
        const value = splitArray[1]
        Object.assign(this.tables[tableName].columns, {[name]: value})
    }

}

const execute = function(command) {

    if (command.startsWith("create table")) {
        return createTable.call(this, command)
    }
}

const command = 'create table author (id number, name string, age number, city string, state string, country string)'
const database = {
    "tables": {},
    execute
}

database.execute(command)

console.log(JSON.stringify(database, null, " "))


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

const DatabaseError = function (statement, message) {
    this.statement = statement
    this.message = message
}

const execute = function(command) {

    if (command.startsWith("create table")) {
        return createTable.call(this, command)
    }

    throw new DatabaseError(command, `Syntax error: '${command}' `)
}

const command = 'create table author (id number, name string, age number, city string, state string, country string)'
const database = {
    "tables": {},
    execute
}

try {

    database.execute(command)

    console.log(JSON.stringify(database, null, " "))
    
} catch (error) {
    
    console.error(error.message)
}



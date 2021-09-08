
const createTable = function(command) {

    const tableName = command.match(/table\s(\w+)\s/)[1]
    const columns = command.match(/\((.+)\)/)[1].trim().split(', ')

    this.tables = {
        [tableName]: {
            columns: {},
            data: []
        },
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
    } else if(command.startsWith("insert into")) {
        return this.insert(command)
    }

    throw new DatabaseError(command, `Syntax error: '${command}' `)
}

const insert = function(command) {

    const tableName = command.match(/into\s(\w+)\s/)[1]
    const columns = command.match(/\((.+?)\)/)[1].trim().split(', ')
    const values = command.match(/\(.+?\).*?(\(.+?\))/)[1].trim().substring(1).slice(0, -1).split(', ')

    let row = {}
    for (let i = 0; i < columns.length; i++) {
        row[columns[i]] = values[i]
    }

    this.tables[tableName].data.push(row)
}

const database = {
    "tables": {},
    execute, 
    insert
}

try {

    database.execute("create table author (id number, name string, age number, city string, state string, country string)");
    database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
    database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
    database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");

    console.log(JSON.stringify(database, null, " "))
    
} catch (error) {
    
    console.error(error.message)
}



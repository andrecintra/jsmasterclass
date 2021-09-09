
const filterSelectedElements = function(selectedElements, selectedColumns) {

    return selectedElements.map((row) => {
        let returnObject = {}

        selectedColumns.forEach(key => {
            returnObject[key] = row[key]
        });

        return returnObject
    })

}

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
        return this.createTable(command)
    } else if(command.startsWith("insert into")) {
        return this.insert(command)
    } else if(command.startsWith("select")) {
        return this.select(command)
    } else if(command.startsWith("delete")) {
        return this.rowDelete(command)
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

const select = function(command) {

    // const regexp = /select (.+) from ([a-z]+)(?: where (.+))?/;

    let tableName
    let columnsWhere
    let valuesWhere
    if (command.includes("where")){
        tableName = command.match(/from\s(\w+)\s/)[1].trim()
        columnsWhere = command.match(/where\s(.+)\s=/)[1].trim()
        valuesWhere = command.match(/where\s.+\s=\s(.+)/)[1].trim()
    } else {
        tableName = command.match(/from\s(\w+)/)[1].trim()
    }

    const selectedColumns = command.match(/select\s(.+)\sfrom/)[1].trim().split(', ')

    if (columnsWhere){

        const filtered = this.tables[tableName].data.filter((row) => {
            return row[columnsWhere] === valuesWhere
        })

        return filterSelectedElements(filtered, selectedColumns)
    } 

    return filterSelectedElements(this.tables[tableName].data, selectedColumns)
    
}

const rowDelete = function(command) {

    const regexp = /delete from ([a-z]+) (?: where (.+))?/
    const parsedStatement = command.match(regexp)
    console.log(parsedStatement)
    const [,tableName, whereClause] = parsedStatement
    // const [column, value] = whereClause.split(" = ")

    // if (whereClause) {
    //     this.tables[tableName].data = this.tables[tableName].data.filter((row) => {
    //         return row[column] !== value
    //     })
    // } else {
    //     this.tables[tableName].data = []
    // } 
}



const database = {
    "tables": {},
    createTable,
    execute, 
    insert,
    select,
    rowDelete
}

try {

    database.execute("create table author (id number, name string, age number, city string, state string, country string)");
    database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)");
    database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)");
    database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)");
    database.execute("delete from author where id = 2")
    const selectResult1 = database.execute("select name, age from author");
    const selectResult2 = database.execute("select name, age from author where id = 1");

    console.log("result1: %j", selectResult1)
    console.log("result1: %j", selectResult2)
    console.log(JSON.stringify(database, null, " "))
    
} catch (error) {
    
    console.error(error.message)
}



const command = 'create table author (id number, name string, age number, city string, state string, country string)'

const tableName = command.match(/table\s(\w+)\s/)[1]
const columns = command.match(/\((.+)\)/)[1].trim().split(', ')

console.log(tableName)
console.log(columns)

const tables = {
    "tables": {}
}

Object.assign(tables.tables, {[tableName]: {columns: {}}})
Object.assign(tables.tables[tableName], {data: []})

for (const column of columns) {
    const splitArray = column.split(" ")
    const name = splitArray[0]
    const value = splitArray[1]
    Object.assign(tables.tables[tableName].columns, {[name]: value})
}


console.log(JSON.stringify(tables, null, "\t"))
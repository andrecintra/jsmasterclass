const command = 'create table author (id number, name string, age number, city string, state string, country string)'

const tableName = command.match(/table\s(\w+)\s/)[1]
const columns = command.match(/\((.+)\)/)[1].trim().split(', ')

console.log(tableName)
console.log(columns)
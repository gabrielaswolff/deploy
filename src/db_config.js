const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'deploy'
});

connection.connect((err) => {
    if(err) {
        throw err;
    } else {
        console.log('mysql conectado')
    }
})

module.exports = connection;
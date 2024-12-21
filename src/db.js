const mysql = require("mysql2")

const connection = mysql.createConnection({
    host: "localhost", // localhost
    port: 3306, // 3306
    user: "root", // root
    password: "", // ""
    database: "productos"
})

connection.connect(function (error) {
    if (error) {
        console.log("Error connecting to the database")
    } else {
        console.log("Connected to the database")
    }
})

module.exports = connection

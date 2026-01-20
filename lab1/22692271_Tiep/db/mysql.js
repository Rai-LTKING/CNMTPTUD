const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // XAMPP mặc định để trống, nếu bạn có đặt pass thì điền vào đây
    database: 'shopdb'
});
module.exports = pool.promise();
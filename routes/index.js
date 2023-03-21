const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
});
const promisePool = pool.promise();

/* GET home page. */
/*
router.get('/', async function (req, res) {
    return res.json({ msg: 'Hello World' });
});
*/
router.get('/', async function (req, res, next) {
    const [rows] = await promisePool.query("SELECT * FROM lgl23forum");
    res.render('index.njk', {
        rows: rows,
        title: 'Forum',
        //nav: nav
    });
});


module.exports = router;
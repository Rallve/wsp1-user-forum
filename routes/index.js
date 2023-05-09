require('dotenv').config();
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { post } = require('../app.js');
/*
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
});
*/
const pool = require('../utils/database.js');
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
        session: req.session.LoggedIn
    });
});

router.get('/profile', async function (req, res, next) {
    //console.log(req.session)
    
    //const [users] = await promisePool.query("SELECT * FROM unusers WHERE id=?", req.session.userId);
    //console.log(req.session)
    if (req.session.LoggedIn) {
        return res.render('profile.njk', {   
            title: 'Profile', 
            user: req.session.userId, 
        }
        );
    } else {
        
        return res.status(401).send("Access denied");
    }

    

});

router.get('/new', async function (req, res, next) {
    const [users] = await promisePool.query('SELECT * FROM lgl23users');
    console.log(users)
    res.render('new.njk', {
        title: 'Nytt inlägg',
        users,
    });
});


router.post('/new', async function (req, res, next) {
    const { author, title, content } = req.body;
    const errors = [];
    

    const [rows] = await promisePool.query('INSERT INTO lgl23forum (authorId, title, content) VALUES (?, ?, ?)', [1, title, content]);
    res.redirect('/');
});


router.get('/login', function (req, res, next) {
    res.render('login.njk', { title: 'Login' }); 
});

router.post('/login', async function (req, res, next) {
    const { username, password } = req.body;
    const errors = [];
    console.log('test');

    if (username === "") {
        console.log("Username is Required")
        errors.push("Username is Required")
        return res.json(errors)
    } else if (password === "") {
        console.log("Password is Required")
        errors.push("Password is Required")
        return res.json(errors)
    }

    
    if (response.errors.length === 0) {
        // sanitize title och body, tvätta datan
        const sanitize = (str) => {
            let temp = str.trim();
            temp = validator.stripLow(temp);
            temp = validator.escape(temp);
            return temp;
        };
        if (title) sanitizedTitle = sanitize(title);
        if (body) sanitizedBody = sanitize(body);
    }

    const [users] = await promisePool.query("SELECT * FROM lgl23users WHERE name=?", username);
    console.log(users)
    if (users.length > 0) {

        bcrypt.compare(password, users[0].password, function (err, result) {
            // result == true logga in, annars buuuu 
            if (result) {
                console.log(users[0].id)
                req.session.userId = username;
                req.session.LoggedIn = true;
                nav.splice(2,3);
                nav.push({
                    url: "/profile",
                    title: "Profile"
                })
                return res.redirect('/profile');
            } else {
                errors.push("Invalid username or password")
                return res.json(errors)
            }
        });
    } else {
        errors.push("Wrong credentials")
        return res.json(errors)
    }
    // if username inte är i db : login fail!
});

router.post('/delete', async function(req, res, next) {
    if(req.session.LoggedIn) {
        req.session.LoggedIn = false;
        await promisePool.query('DELETE FROM lgl23users WHERE name=?', req.session.userId);
        res.redirect('/');
    } else {
        return res.status(401).send("Access denied");
    }
});

router.post('/logout', async function(req, res, next) {
    console.log(req.session.LoggedIn);
    if(req.session.LoggedIn) {
    req.session.LoggedIn = false;
    delete nav[2];
    nav.push(    {
        url: "/register",
        title: "Register"
    },
    {
        url: "/login",
        title: "Login"
    })
    res.redirect('/');
    } else {
        return res.status(401).send("Access denied");
    }
});

router.get('/register', async function(req, res) {
    res.render('register.njk', { title: 'Register' })
});

router.post('/register', async function(req, res) {
    const { username, password, passwordConfirmation } = req.body;
    const errors = [];

    if (username === "") {
        console.log("Username is Required")
        errors.push("Username is Required")
        return res.json(errors)
    } else if (password === "") {
        console.log("Password is Required")
        errors.push("Password is Required")
        return res.json(errors)
    } else if(password !== passwordConfirmation ){
        console.log("Passwords do not match")
        errors.push("Passwords do not match")
        return res.json(errors)
    }

    const [users] = await promisePool.query("SELECT * FROM lgl23users WHERE name=?", username);
    console.log(users)

    if (users.length > 0) {
        console.log("Username is already taken")
        errors.push("Username is already taken")
        return res.json(errors)
    }

    await bcrypt.hash(password, 10, async function (err, hash) {

        console.log(hash);
        const [rows] = await promisePool.query('INSERT INTO lgl23users (name, password) VALUES (?, ?)', [username, hash])
        res.redirect('/login');

    });
});

router.get('/crypt/:pwd', async function (req, res, next) {
    const pwd = req.params.pwd;

    await bcrypt.hash(pwd, 10, function (err, hash) {

        console.log(hash);
        //return res.json(hash);
        return res.json({ hash });
    });

});

module.exports = router;






/*




require('dotenv').config();
//const pool = require('../utils/database.js');
const bcrypt = require('bcrypt');
const { post } = require('../app.js');
//const session = require('express-session');




router.get('/', function (req, res, next) {
    res.render('index.njk', { title: 'Login ALC' });
});


router.get('/login', function (req, res, next) {
    res.render('form.njk', { title: 'Login ALC' });
});

router.get('/profile', async function (req, res, next) {
    //console.log(req.session)
    
    //const [users] = await promisePool.query("SELECT * FROM unusers WHERE id=?", req.session.userId);
    //console.log(req.session)
    if (req.session.LoggedIn) {
        return res.render('profile.njk', {   
            title: 'Profile', 
            user: req.session.userId, 
        }
        );
    } else {
        
        return res.status(401).send("Access denied");
    }

    

});

router.post('/login', async function (req, res, next) {
    const { username, password } = req.body;
    const errors = [];
    console.log('test');

    if (username === "") {
        console.log("Username is Required")
        errors.push("Username is Required")
        return res.json(errors)
    } else if (password === "") {
        console.log("Password is Required")
        errors.push("Password is Required")
        return res.json(errors)
    }
    const [users] = await promisePool.query("SELECT * FROM unusers WHERE name=?", username);
    //console.log(users)
    if (users.length > 0) {

        bcrypt.compare(password, users[0].password, function (err, result) {
            // result == true logga in, annars buuuu 
            if (result) {
                //console.log(users[0].id)
                req.session.userId = username;
                req.session.LoggedIn = true;
                return res.redirect('/profile');
            } else {
                errors.push("Invalid username or password")
                return res.json(errors)
            }
        });
    } else {
        errors.push("Wrong credentials")
        return res.json(errors)
    }
    // if username inte är i db : login fail!
});

router.post('/delete', async function(req, res, next) {
    if(req.session.LoggedIn) {
        req.session.LoggedIn = false;
        await promisePool.query('DELETE FROM unusers WHERE name=?', req.session.userId);
        res.redirect('/');
    } else {
        return res.status(401).send("Access denied");
    }
});

router.post('/logout', async function(req, res, next) {
    console.log(req.session.LoggedIn);
    if(req.session.LoggedIn) {
    req.session.LoggedIn = false;
    res.redirect('/');
    } else {
        return res.status(401).send("Access denied");
    }
});

router.get('/register', async function(req, res) {
    res.render('register.njk', { title: 'Register' })
});

router.post('/register', async function(req, res) {
    const { username, password, passwordConfirmation } = req.body;
    const errors = [];

    if (username === "") {
        console.log("Username is Required")
        errors.push("Username is Required")
        return res.json(errors)
    } else if (password === "") {
        console.log("Password is Required")
        errors.push("Password is Required")
        return res.json(errors)
    } else if(password !== passwordConfirmation ){
        console.log("Passwords do not match")
        errors.push("Passwords do not match")
        return res.json(errors)
    }
    const [users] = await promisePool.query("SELECT * FROM unusers WHERE name=?", username);
    //console.log(users)

    if (users.length > 0) {
        console.log("Username is already taken")
        errors.push("Username is already taken")
        return res.json(errors)
    }

    await bcrypt.hash(password, 10, async function (err, hash) {

        console.log(hash);
        const [rows] = await promisePool.query('INSERT INTO unusers (name, password) VALUES (?, ?)', [username, hash])
        res.redirect('/login');

    });

    
    
});

router.get('/crypt/:pwd', async function (req, res, next) {
    const pwd = req.params.pwd;

    await bcrypt.hash(pwd, 10, function (err, hash) {

        console.log(hash);
        //return res.json(hash);
        return res.json({ hash });
    });

});


module.exports = router;
*/
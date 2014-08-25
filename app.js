var express = require('express'),
        exphbs = require('express-handlebars'),
        session = require('express-session'),
        MongoStore = require('connect-mongostore')(session),
        cookieParser = require('cookie-parser'),
        crypto = require('crypto'),
        mysql = require('mysql'),
        connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'dssc',
            port: 3306,
            supportBigNumbers: true
        }),
        bodyParser = require('body-parser'),
        app = express(),
        hbs = exphbs.create({defaultLayout: 'main', partialsDir: 'views/partials/'});

var singleServer = {
    db: "sessions",
    collection: "express_sessions",
    host: "localhost",
    port: 27017
};

connection.connect(function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('MySQL connected!');
    }
});

app.set('port', 8080);
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(cookieParser());
app.use(session({
    store: new MongoStore(singleServer),
    secret: '1234567890QWERTY',
    saveUninitialized: true,
    resave: true})
        );

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies

app.get('/', function(req, res) {
    res.redirect('/home');
});

app.get('/home', function(req, res) {
    res.render('home', {user: req.session.user});
});

app.get('/account', function(req, res) {
    res.render('account', {user: req.session.user});
});

app.get('/ranking', function(req, res) {
    res.render('ranking', {user: req.session.user});
});

app.get('/results', function(req, res) {
    res.render('results', {user: req.session.user});
});

app.get('/training', function(req, res) {
    res.render('training', {user: req.session.user});
});

app.get('/api/training/:season/:event', function(req, res) {
    var query = connection.query("SELECT * FROM heatsnode WHERE seasonName = '" + decodeURIComponent(req.params.season) + "' and eventName = '" + decodeURIComponent(req.params.event) + "' and driverNo = " + req.session.user.driverNo + " ORDER BY timeStamp asc");
    var heats = [];
    query.on('error', function(err) {
        console.log(err);
    }).on('result', function(user) {
        heats.push(user);
    }).on('end', function() {
        res.send(heats);
    });
});

//app.get('/api/results/:season/:event', function(req, res) {
//    var query = connection.query("SELECT * FROM heatsnode WHERE seasonName = '" + decodeURIComponent(req.params.season) + "' and eventName = '" + decodeURIComponent(req.params.event) + "' and racingType='WERTUNG' and raceStatus = 'OK' group by driverNo ORDER BY timeTotal asc, classShortName asc");
//    var heats = [];
//    query.on('error', function(err) {
//        console.log(err);
//    }).on('result', function(user) {
//        heats.push(user);
//    }).on('end', function() {
//        res.send(heats);
//    });
//});

//app.get('/api/results/:season/:event/:class', function(req, res) {
//    var query = connection.query("SELECT *, min(timeTotal) as fastest FROM heatsnode WHERE seasonName = '" + decodeURIComponent(req.params.season) + "' and eventName = '" + decodeURIComponent(req.params.event) + "' and racingType='WERTUNG' and raceStatus = 'OK' and classShortName = '" + decodeURIComponent(req.params.class) + "' group by driverNo ORDER BY fastest asc");
//    var heats = [];
//    query.on('error', function(err) {
//        console.log(err);
//    }).on('result', function(user) {
//        heats.push(user);
//    }).on('end', function() {
//        res.send(heats);
//    });
//});

app.get('/api/:season/events', function(req, res) {
    var query = connection.query("select distinct eventName from heatsnode where seasonName='" + decodeURIComponent(req.params.season) + "' order by timeStamp desc");//SELECT * FROM heatsnode WHERE seasonName = '"+decodeURIComponent(req.params.season)+"' and racingType='WERTUNG' and raceStatus = 'OK' GROUP BY driverNo ORDER BY classShortName asc, timeTotal asc LIMIT 100");
    var heats = [];
    query.on('error', function(err) {
        console.log(err);
    }).on('result', function(user) {
        heats.push(user);
    }).on('end', function() {
        res.send(heats);
    });
});

app.get('/api/:season/:event/races', function(req, res) {
    var query = connection.query("select distinct raceName from heatsnode where seasonName='" + decodeURIComponent(req.params.season) + "' and eventName='" + decodeURIComponent(req.params.event) + "' and racingType = 'WERTUNG' order by classShortName asc");//SELECT * FROM heatsnode WHERE seasonName = '"+decodeURIComponent(req.params.season)+"' and racingType='WERTUNG' and raceStatus = 'OK' GROUP BY driverNo ORDER BY classShortName asc, timeTotal asc LIMIT 100");
    var heats = [];
    query.on('error', function(err) {
        console.log(err);
    }).on('result', function(user) {
        heats.push(user);
    }).on('end', function() {
        res.send(heats);
    });
});

app.get('/api/:season/:event/:race/classes', function(req, res) {
    var query = connection.query("select distinct classShortName, className from heatsnode where seasonName='" + decodeURIComponent(req.params.season) + "' and eventName='" + decodeURIComponent(req.params.event) + "' and raceName='" + decodeURIComponent(req.params.race) + "' order by classShortName asc");//SELECT * FROM heatsnode WHERE seasonName = '"+decodeURIComponent(req.params.season)+"' and racingType='WERTUNG' and raceStatus = 'OK' GROUP BY driverNo ORDER BY classShortName asc, timeTotal asc LIMIT 100");
    var heats = [];
    query.on('error', function(err) {
        console.log(err);
    }).on('result', function(user) {
        heats.push(user);
    }).on('end', function() {
        res.send(heats);
    });
});

app.get('/news', function(req, res) {
    res.render('news', {user: req.session.user});
});

app.get('/about', function(req, res) {
    res.render('about', {user: req.session.user});
});

app.get('/classes', function(req, res) {
    res.render('classes', {user: req.session.user});
});

app.get('/procedure', function(req, res) {
    res.render('procedure', {user: req.session.user});
});

app.get('/rules', function(req, res) {
    res.render('rules', {user: req.session.user});
});

app.get('/media', function(req, res) {
    res.render('media', {user: req.session.user});
});

app.get('/crafts', function(req, res) {
    res.render('crafts', {user: req.session.user});
});

app.post('/login', function(req, res) {
    if (req.body.username === undefined || req.body.password === undefined) {
        res.render('home', {error: "Kein Benutzername eingegeben"});
        return;
    }
    var password = crypto.createHash('md5').update(req.body.password).digest('hex');
    if (req.body.username.length === 4) {
        query = connection.query("SELECT * FROM driversnode WHERE driverNo=" + req.body.username);
    } else {
        query = connection.query("SELECT * FROM driversnode WHERE driverMail='" + req.body.username + "'");
    }
    var users = [];
    query.on('error', function(err) {
        console.log(err);
    }).on('result', function(user) {
        users.push(user);
    }).on('end', function() {
        if (users.length < 1) {
            res.render('home', {error: 'Unbekannter Benutzer "' + req.body.username + '"'});
            return;
        }
        if (password !== users[0].password) {
            res.render('home', {error: 'Falsches Passwort'});
            return;
        }
        req.session.user = users[0];
        res.redirect('/home');
        return;
    });
});

app.get('/api/results/:season/:event/:race', function(req, res) {
    var query1 = connection.query("select distinct classShortName from heatsnode where racingType = 'WERTUNG' and seasonName='" + decodeURIComponent(req.params.season) + "' and eventName='" + decodeURIComponent(req.params.event) + "' and raceName='" + decodeURIComponent(req.params.race) + "' order by classShortName asc");
    var longQuery = [];
    query1.on('error', function(err) {
        // Handle error, and 'end' event will be emitted after this as well
        console.log(err);
    }).on('result', function(result) {
        longQuery.push("select  h.*, min(h.timeTotal) as fastest from heatsnode h where h.raceStatus = 'OK' and h.racingType = 'WERTUNG' and seasonName='" + decodeURIComponent(req.params.season) + "' and eventName='" + decodeURIComponent(req.params.event) + "' and raceName='" + decodeURIComponent(req.params.race) + "' and classShortName = '" + result.classShortName + "' group by h.driverNo");
        // it fills our array looping on each user row inside the db
    }).on('end', function() {
        var heats = [];
        var query2 = connection.query(longQuery.join(" union ").concat(" order by classShortName,fastest"));
        console.log(query2.sql);
        query2.on('error', function(err) {
            // Handle error, and 'end' event will be emitted after this as well
            console.log(err);
        }).on('result', function(heat) {
            // it fills our array looping on each user row inside the db
            heats.push(heat);
        }).on('end', function() {
            res.json(heats);
        });
    });
});

app.get('/api/crafts', function(req, res) {
    var query = connection.query("select * from scootersnode where driverNo=" + decodeURIComponent(req.session.user.driverNo));
    var crafts = [];
    query.on('err', function(err) {
        console.log(err);
    }).on('result', function(craft) {
        crafts.push(craft);
    }).on('end', function() {
        res.json(crafts);
    });
});

app.get('/api/classes', function(req, res) {
    var query = connection.query("select CAST(rc.id AS CHAR(50)) as id, rc.name from RacingClass rc join Season s on (s.id = rc.season_id and s.currentSeason = 1) where rc.showInWeb=1 and changeableByCustomer=1");
    var classes = [];
    query.on('err', function(err) {
        console.log(err);
    }).on('result', function(result) {
        classes.push(result);
    }).on('end', function() {
        res.json(classes);
    });
});

app.get('/api/manufacturers', function(req, res) {
    var query = connection.query("select m.id, m.name from Manufacturer m order by m.name asc");
    var manufacturers = [];
    query.on('err', function(err) {
        console.log(err);
    }).on('result', function(result) {
        manufacturers.push(result);
    }).on('end', function() {
        res.json(manufacturers);
    });
});

app.get('/api/models/:class', function(req, res) {
    var query = connection.query("select m.id, m.name from ScooterModel m where m.manufacturer_id=" + decodeURIComponent(req.params.class) + " order by m.name asc");
    var models = [];
    query.on('err', function(err) {
        console.log(err);
    }).on('result', function(result) {
        models.push(result);
    }).on('end', function() {
        res.json(models);
    });
});

app.post('/api/craft', function(req, res) {
    var post = {
        deleted: 0,
        scooterModel_id: parseInt(req.body.craft),
        seasonParticipation_id: req.session.user.seasonParticipationId,
        racingClass_id: req.body.class
    };
    connection.query("INSERT INTO Craft SET ?", post, function(err, result) {
        if (err) {
            console.log("Error while inserting craft: " + err);
        } else {
            res.json(result);
        }
    });
});

app.delete('/api/craft', function(req, res) {
    connection.query(mysql.format("DELETE FROM Craft WHERE id=?", req.body.id), function(err, result) {
        if (err) {
            console.log("Error while inserting craft: " + err);
        } else {
            res.json(result);
        }
    });
});

app.get('/api/image', function(req, res) {
    var query = connection.query("select bytes from DriverPicture where driver_id="+decodeURIComponent(req.session.user.driverId));
    var models = [];
    query.on('err', function(err) {
        console.log(err);
    }).on('result', function(result) {
        models.push(result.bytes);
    }).on('end', function() {
        res.contentType = 'image/jpg';
        res.send(models[0]);
    });
});

app.get('/api/driver', function(req, res){
    res.send(req.session.user);
});

app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/home');
});

app.listen(8080);
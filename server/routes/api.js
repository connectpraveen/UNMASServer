const express = require('express');
var cors = require('cors');
var app = express();
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'unmas.manager@gmail.com',
        clientId: '807007218164-urmbe1ni0kj3old04bhmk6ad0mdjsfk4.apps.googleusercontent.com',
        clientSecret: '8G8RpktpjXCIvX8BMkqiTPxQ',
        refreshToken: '1/GfUdp-4cfq6tLwf1WCneBJBD7ZpLomxe_nXcXtYXlQI'
    }
})

const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Connect
const connection = (closure) => {

    return MongoClient.connect('mongodb://connectpraveen:navya123@ds259245.mlab.com:59245/unmaslearning', (err, db) => {
        //return MongoClient.connect('mongodb://localhost:27017/mean', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};



router.get('/manageremail', cors(), (req, res) => {
    var pairs = req.url.split('?')[1].split('=')[1];
    console.log(pairs);
    connection((db) => {
        db.collection('programs').update(
            { _id: 1 },
            {
                $set: {
                    "training_program.program_manager_email": decodeURIComponent(pairs)
                }
            }
        ).then((users) => {
            response.data = users;
            res.json(response);
        })
    });

});

router.get('/manageradd', cors(), (req, res) => {
    var pairs = req.url.split('?')[1].split('=')[1];
    console.log('calling from manager add-' +pairs);
    connection((db) => {
        db.collection('users').update(
            { _id: 1 },
            {
                $set: {
                    "training_program.users.3.username": pairs
                }
            }
        ).then((users) => {
            response.data = users;
            res.json(response);
        })
    });
});
router.get('/sendemail', cors(), (req, res) => {
    var pairs = req.url.split('?')[1].split('=')[1];
    var mailOptions = {
        from: 'unmas.manager@gmail.com',
        to: pairs,
        subject: 'UNMAS Training manager',
        html: 'You have invited by UNMAS admin. <br> Your current role is training manager. Kindly click <a href=http://braintechsolution.in/>here</a> to access the application. <br> Thanks <br> UNMAS'        
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })

});

router.get('/sendemailstudent', cors(), (req, res) => {
    var pairs = req.url.split('?')[1].split('=')[1];
    var mailOptions = {
        from: 'unmas.manager@gmail.com',
        to: pairs,
        subject: 'UNMAS Student',
        html: 'You have invited by UNMAS manager. <br> Your current role is student. Kindly click <a href=http://braintechsolution.in/>here</a> to access the application. <br> Thanks <br> UNMAS'        
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })

});

router.get('/managername', cors(), (req, res) => {
    var pairs = req.url.split('?')[1].split('=')[1];
    console.log(pairs);
    connection((db) => {
        db.collection('programs').update(
            { _id: 1 },
            {
                $set: {
                    "training_program.program_manager": decodeURIComponent(pairs)
                }
            }
        ).then((users) => {
            response.data = users;
            res.json(response);
        })
    });
});

router.get('/studentname', cors(), (req, res) => {
    var name = decodeURIComponent(req.url.split('?')[1].split('&')[0].split('=')[1]);
    var email = decodeURIComponent(req.url.split('?')[1].split('&')[1].split('=')[1]);    
        connection((db) => {
        db.collection('programs').update( { _id : 1},
        { $push: {"training_program.students": {
               userId:'_' + Math.random().toString(36).substr(2, 9),
               Name: name,
               Email:email
        }}});
     })   
        connection((db) => {
            db.collection('users').update( { _id : 1},
            { $push: {"training_program.users": {
                   username:email,
                   type: "gmail",
                   role:"student"
            }}});
    })
    
    var mailOptions = {
        from: 'unmas.manager@gmail.com',
        to: email,
        subject: 'UNMAS Student',
        html: 'You have invited by UNMAS manager. <br> Your current role is student. Kindly click <a href=http://braintechsolution.in/>here</a> to access the application. <br> Thanks <br> UNMAS'        
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })

});
// Get users
router.get('/users', cors(), (req, res) => {
    connection((db) => {
        db.collection('catalogue')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

router.get('/roles', cors(), (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

router.get('/trainings', cors(), (req, res) => {
    connection((db) => {
        db.collection('programs')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});
module.exports = router;
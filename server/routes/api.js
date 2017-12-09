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
    //Prod connection
    //mongodb://connectpraveen:navya123@ds259245.mlab.com:59245/unmaslearning
    return MongoClient.connect('mongodb://connectpraveen:navya123@ds129966.mlab.com:29966/unmaslearning_dev', (err, db) => {
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
    console.log('calling from manager add-' + pairs);
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

router.get('/regsave', cors(), (req, res) => {
    var email = req.url.split('?')[1].split('=')[1];
    console.log(email);
    connection((db) => {
        db.collection('programs').find({ _id: 1 })
        .forEach(function (doc) {                
          doc.training_program.forEach(function (event) {
            event.students.forEach(function (student) {
                if (student.Email === email) {
                    student.Registered='Yes';
                  }
               });
          });
          db.collection('programs').save(doc);
        })
    });
});

router.get('/enrollsave', cors(), (req, res) => {
    var email = req.url.split('?')[1].split('=')[1];
    console.log(email);
    connection((db) => {
        db.collection('programs').find({ _id: 1 })
        .forEach(function (doc) {                
          doc.training_program.forEach(function (event) {
            event.students.forEach(function (student) {
                if (student.Email === email) {
                    student.Enrolled='Yes';
                  }
               });
          });
          db.collection('programs').save(doc);
        })
    });
});

router.get('/programcreate', cors(), (req, res) => {
    var currentDate = new Date();
    var trainingname = "";
    var programname = decodeURIComponent(req.url.split('?')[1].split('&')[0].split('=')[1]);;
    var startdate = decodeURIComponent(req.url.split('?')[1].split('&')[1].split('=')[1]);;
    var enddate = decodeURIComponent(req.url.split('?')[1].split('&')[2].split('=')[1]);;;
    var managername = decodeURIComponent(req.url.split('?')[1].split('&')[3].split('=')[1]);;;
    var manageremail = decodeURIComponent(req.url.split('?')[1].split('&')[4].split('=')[1]);;;

    console.log(programname+','+startdate+','+enddate+','+managername+','+manageremail);
    connection((db) => {
        db.collection('programs').update({ _id: 1 },
            {
                $push: {
                    "training_program": {
                        name: programname,
                        category: "Safety Training",
                        created_date: currentDate.toDateString(),
                        created_by: "Kishor Voderhobli",
                        organization: "UNMAS New York, NY",
                        start_date: startdate,
                        end_date: enddate,
                        total_days: "",
                        type: "online",
                        about: "The Landmines, Explosive Remnants of War and Improvised Explosive Devices Safety Training draws upon information found in International Guidelines for Landmine and Unexploded Ordnance Awareness Education developed by the United Nations Children\u2019s Fund (UNICEF) in 1999, and International Mine Action Standards published by the United Nations (www.mineactionstandards.org). The Landmine, Explosive Remnants of War and Improvised Explosive Devices Safety Traning is part of the Landmine Safety Project of the United Nations Mine Action Service (UNMAS).",
                        course: "Course is to raise awareness and provide basic safety information concerning the threat of landmines, ERW and IEDs to organizations and individuals working in a ected areas",
                        exam: "At the end of the course students will be asked to answer questions to evaluate their knowledge to issue certifications to qualify them for more indepth handson class room based trainings. ",
                        quiz: "Random quiz questions to check students engagement with the training to help improve the quality of the training.",
                        detail: "This trainnig is the 1st edition of the Landmine and Unexploded Ordnance Safety Traning produced by the United Nations in 2005, which was originally based on the Land Mine Safety Traning developed and published by CARE in 1997. The Traning has been substantially revised, including its title, to re ect latest terminology. Also new developments in the  eld of Demining, Explosive Ordnance Disposal (EOD) and Improvised Explosive Device Disposal (IEDD) as well as emergency medical assistance were considered. The increasing threat by IEDs led to further additions in the present chapters",
                        program_manager_id: "",
                        program_manager: managername,
                        program_manager_dept: "Libya Women",
                        program_manager_location: "Tunis, Tunasia",
                        program_manager_email: manageremail,
                        students: []
                    }
                }
            });
    })

    connection((db) => {
        db.collection('users').update({ _id: 1 },
            {
                $push: {
                    "training_program.users": {
                        username: manageremail,
                        type: "gmail",
                        role: "manager"
                    }
                }
            });
    })
    var mailOptions = {
        from: 'unmas.manager@gmail.com',
        to: manageremail,
        subject: 'UNMAS Manager',
        html: 'You have invited by UNMAS Admin. <br> Your current role is training manager. Kindly click <a href=http://braintechsolution.in/>here</a> to access the application. <br> Thanks <br> UNMAS'
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })

});
router.get('/studentname', cors(), (req, res) => {
    var name = decodeURIComponent(req.url.split('?')[1].split('&')[0].split('=')[1]);
    var email = decodeURIComponent(req.url.split('?')[1].split('&')[1].split('=')[1]);
    var manageremail = decodeURIComponent(req.url.split('?')[1].split('&')[2].split('=')[1]);
    var position = decodeURIComponent(req.url.split('?')[1].split('&')[3].split('=')[1]);
    console.log(name);
    console.log(email);
    console.log(manageremail);
    var upd='training_program.'+position+'.students';
    connection((db) => {

        db.collection('programs').update({"training_program.program_manager_email": manageremail},
            {
                $push: {
                    "training_program.$.students" : {
                        userId: '_' + Math.random().toString(36).substr(2, 9),
                        Name: name,
                        Email: email,
                        Registered:"No",
                        Enrolled:"No"
                    }
                }
            })

    })
      
    connection((db) => {
        db.collection('users').update({ _id: 1 },
            {
                $push: {
                    "training_program.users": {
                        username: email,
                        type: "gmail",
                        role: "student"
                    }
                }
            });
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
var router = require('express').Router();
var pg = require('pg'); //need to install if starting from scratch npm install pg --save check json file dependencies

var config ={       //to access database
    database:'rho'
};

//initialize the database connection pool defaults at 10 connection
var pool = new pg.Pool(config);


router.get('/', function(req, res){
    //err -an error object, will not be null if there was an error connecting
    //possible errors, db not running, config is wrong
    //client object to make queries against the database
    pool.connect(function(err, client, done){
        if(err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);
            done();
            return; //stops execution of the function
        }


//takes input as 1. SQL string 2(optional)-input parameters 3. callback function to execute once query is finished takes an error object
// and a result object as arguments
        client.query('SELECT * FROM owner', function(err, result){
            done();
            if(err){
                console.log('Error connecting to the DB', err);
                res.sendStatus(500);

                return;
            }

            console.log('Got rows from the DB:',result.rows);
            res.send(result.rows);

        });                                        //done - function to call when connection is done.returns connection back to the pool

    });
});




router.post('/', function(req, res){
    console.log(req.body);
    var firstName =req.body.first_name;
    var lastName = req.body.last_name;

    pool.connect(function(err, client, done){
        if(err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);
            done();
            return;
        }
//creating new row into the table , $1 - placeholder for the paramaters // returning a



    client.query('INSERT INTO owner (first_name, last_name) VALUES ($1, $2) returning *;', [firstName,lastName],  function(err, result){
        done();
        if(err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);

            return;
        }

        console.log('Got rows from the DB:',result.rows);
        res.send(result.rows);

    });
    });
    });




module.exports=router

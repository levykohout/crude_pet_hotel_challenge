var router = require('express').Router();
var pg = require('pg'); //need to install if starting from scratch npm install pg --save check json file dependencies

var config ={       //to access database
    database:'rho'
};

//initialize the database connection pool defaults at 10 connection
var pool = new pg.Pool(config);


router.post('/IN', function(req, res){
    var check_in = req.body.check_in;
    var pet_id=req.body.pet_id;
    var status=req.body.status;

    console.log(check_in);


    pool.connect(function(err, client, done){

        try{  //try block and finally useful way to clean up system resources
        if(err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);

            return; //stops execution of the function
        }
        //Update database

        client.query('INSERT INTO visits (check_in, pet_id,status) VALUES ($1, $2, $3) returning *;',
                    [check_in, pet_id,status], function(err, result){
                        if(err){
                            console.log('Error querying database',err);
                            res.sendStatus(500);

                        } else {

                        res.send(result.rows);
                         //very important to call done everytime
                     }
                    });
                } finally {
                    done();
                }

            });
    });





router.put('/:id', function(req, res){
    var check_out = req.body.check_out;
    var id=req.params.id;
    var pet_id = req.body.pet_id;
    var status=req.body.status;


    pool.connect(function(err, client, done){

        try{  //try block and finally useful way to clean up system resources
        if(err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);

            return; //stops execution of the function
        }
        //Update database

        client.query('UPDATE visits SET check_out=$1, status=$2 WHERE id=$3 RETURNING *;',
                    [check_out, status, id], function(err, result){
                        if(err){
                            console.log('Error querying database',err);
                            res.sendStatus(500);

                        } else {

                        res.send(result.rows);
                         //very important to call done everytime
                     }
                    });
                } finally {
                    done();
                }

            });
    });






module.exports=router;

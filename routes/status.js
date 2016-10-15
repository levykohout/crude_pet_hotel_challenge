var router = require('express').Router();
var pg = require('pg'); //need to install if starting from scratch npm install pg --save check json file dependencies

var config ={       //to access database
    database:'rho'
};

router.post('/IN', function(req, res){
    var check_in = req.body.check_in;
    var pet_id=req.body.pet_id;

    console.log(check_in);


    pool.connect(function(err, client, done){

        try{  //try block and finally useful way to clean up system resources
        if(err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);

            return; //stops execution of the function
        }
        //Update database

        client.query('INSERT INTO visits (check_in, pet_id) VALUES ($1, $2) returning *;',
                    [check_in, pet_id], function(err, result){
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





router.put('/OUT/:id', function(req, res){
    var date = req.body.date;

    var id = req.params.id;
    
console.log(date);

    pool.connect(function(err, client, done){

        try{  //try block and finally useful way to clean up system resources
        if(err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);

            return; //stops execution of the function
        }
        //Update database

        client.query('UPDATE visits SET check_out=$1, pet_id=$2 WHERE id=$3 RETURNING *;',
                    [date, id, id], function(err, result){
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



//initialize the database connection pool defaults at 10 connection
var pool = new pg.Pool(config);

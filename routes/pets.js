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
        client.query('SELECT pet.id AS petID, visits.id AS visitId, visits.status, pet.name, pet.breed, pet.color,pet.owner_id,owner.first_name,owner.last_name FROM pet LEFT JOIN visits ON visits.pet_id=pet.id JOIN owner ON pet.owner_id=owner.id', function(err, result){
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
    var name=req.body.pet_name;
    var breed = req.body.pet_breed;
    var color = req.body.pet_color;
    var owner_id = req.body.owner_id;

    pool.connect(function(err, client, done){
        if(err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);
            done();
            return;
        }
//creating new row into the table , $1 - placeholder for the paramaters // returning all


//OWNER AND PET TABLE BEFORE QUERY?
        client.query('INSERT INTO pet (name, breed,color,owner_id) VALUES ($1, $2, $3,$4) returning *;', [name, breed, color,owner_id],  function(err, result){
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

    router.delete('/:id', function(req, res){
        var id = req.params.id;

        pool.connect(function(err, client, done){
            try{

                if(err){
                    console.log('Error in connection to the database', err);
                    res.sendStatus(500);
                    return;
                }

                client.query('DELETE FROM pet where id=$1',[id], function(err){
                    if(err){
                        console.log('Error querying the DB',err);
                        res.sendStatus(500);
                        return;
                    }
                        res.sendStatus(204); //status code

                });


            }finally{
                done();
            }

        });

    });

    router.put('/:id', function(req, res){

        var id = req.params.id; //takes the value from /:id
        var name=req.body.pet_name;
        var breed = req.body.pet_breed;
        var color = req.body.pet_color;
        var owner_id = req.body.owner_id;


        pool.connect(function(err, client, done){
            try{  //try block and finally useful way to clean up system resources
            if(err){
                console.log('Error connecting to the DB', err);
                res.sendStatus(500);

                return; //stops execution of the function
            }
            //Update database
            client.query('UPDATE pet SET name=$1, breed=$2, color=$3, owner_id=$4 WHERE id=$5 RETURNING *;',
                        [name, breed, color, owner_id, id], function(err, result){
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

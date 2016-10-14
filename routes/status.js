var router = require('express').Router();
var pg = require('pg'); //need to install if starting from scratch npm install pg --save check json file dependencies

var config ={       //to access database
    database:'rho'
};

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



//initialize the database connection pool defaults at 10 connection
var pool = new pg.Pool(config);

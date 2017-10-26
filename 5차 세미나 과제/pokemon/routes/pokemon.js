const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const async = require('async');
const pool = require('./dbConfig');

router.get('/:id', function(req, res) {
  let query1 = 'select t.name t_name , p.name p_name, p.character, p.id from trainer t left join owns o on t.id = o.trainer_id left join pokemon p on o.pokemon_id = p.id where t.id = ?';

  const task_pokemon = [
    function(callback) {
      pool.getConnection(function(err, connection) {
        if (err) {
          console.log("getConnection : ", err);
          callback(err, null);
        } else {
          callback(null, connection);
        }
      });
    },
    function(connection, callback) {
      connection.query(query1, req.params.id, function(err, data) {
        if(err) {
          console.log("query error: ", err);
          connection.release();
          callback(err, null);
        }else {
          let name = data[0].t_name;
          const pokemon = [];
          for(i = 0; i < data.length; i++) {
            let json = {
              "id" : data[i].id,
              "name" : data[i].p_name,
              "character" : data[i].character
            };
            pokemon.push(json);
          }
          callback(null, pokemon, name);
        }
      });
    },
    function(pokemon, name, callback) {
      fs.readFile('views/pokemon.ejs', 'utf-8', function(err, result) {
        if(err) {
          console.log("reading ehs error", err);
          callback(err, null);
        }
        else {
          res.status(200).send(ejs.render(result, {
            "trainer_name" : name,
            "pokemon" : pokemon
          }));
        }
      });
    }
  ];

  async.waterfall(task_pokemon, function(err, result) {
    if (err) console.log(err);
    else console.log(result);
  });

});

module.exports = router;

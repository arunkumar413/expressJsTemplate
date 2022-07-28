const { Pool, Client } = require("pg");

var client;

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "expresstemplate",
  password: "postgres",
  port: 5432,
});
// pool.query("SELECT NOW()", (err, res) => {
//   console.log(err, res);
//   pool.end();
// });

module.exports.pgConfig = {
  createClient: function () {
    client = new Client({
      user: "postgres",
      host: "127.0.0.1",
      database: "expresstemplate",
      password: "postgres",
      port: 5432,
    });

    client.connect(function (err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('connected to the database');
      }

    });
  },

  getClient: function () {
    return client;
  },
};

// client.query("SELECT NOW()", (err, res) => {
//   console.log(err, res);
//   client.end();
// });

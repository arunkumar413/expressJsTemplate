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
      user: process.env.DATABASE_USER_NAME,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT
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

const { Pool, Client } = require("pg");

var client;

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "expressAuth",
  password: "kumar",
  port: 5433,
});
pool.query("SELECT NOW()", (err, res) => {
  console.log(err, res);
  pool.end();
});

module.exports.pgConfig = {
  createClient: function () {
    client = new Client({
      user: "postgres",
      host: "127.0.0.1",
      database: "expressAuth",
      password: "kumar",
      port: 5433,
    });

    client.connect();
  },

  getClient: function () {
    return client;
  },
};

// client.query("SELECT NOW()", (err, res) => {
//   console.log(err, res);
//   client.end();
// });

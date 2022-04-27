// Update with your config settings.

require("dotenv").config({ path: "../.env" });


module.exports.knexConfig = {
  development: {
    client: "postgresql",
    connection: {
      host: "127.0.0.1",

      port: 5433,
      user: "postgres",
      password: "kumar",
      database: "expressAuth",
    },
    migrations: {
      tableName: "expressAuthMigration",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      port: 5433,
      database: "expressAuth",
      user: "postgres",
      password: "kumar",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

module.exports.createKnexSession = function () {
  knexSession = require("knex")(knexConfig[process.env.NODE_ENV]);
  console.log(knexSesion);
};

module.exports.getKnexSession = function () {
  return knexSesion;
};

exports.up = function (knex) {
  return knex.schema.createTable("authentication", (t) => {
    t.increments();
    t.string("firstName");
    t.integer("lastName");
  });
};

exports.down = function (knex) {};

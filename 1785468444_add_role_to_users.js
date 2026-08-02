/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    if (!users.fields.getByName("role")) {
      users.fields.add(
        new SelectField({
          name: "role",
          required: false,
          maxSelect: 1,
          values: ["admin", "komite", "membre"],
        })
      );
      app.save(users);
    }
    // Seed existing users (created before this migration) as admin
    app.db().newQuery("UPDATE users SET role = 'admin' WHERE role IS NULL OR role = ''").execute();
  },
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    users.fields.removeByName("role");
    app.save(users);
  }
);

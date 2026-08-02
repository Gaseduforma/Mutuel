/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    if (users.fields.getByName("membre_lie")) return;
    users.fields.add(
      new RelationField({
        name: "membre_lie",
        required: false,
        maxSelect: 1,
        collectionId: users.id,
      })
    );
    app.save(users);
  },
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    users.fields.removeByName("membre_lie");
    app.save(users);
  }
);

/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("members");

    if (collection.fields.getByName("email_contact")) return;

    collection.fields.add(
      new TextField({
        name: "email_contact",
        required: false,
        max: 200,
      })
    );
    app.save(collection);
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("members");
      collection.fields.removeByName("email_contact");
      app.save(collection);
    } catch (_) {}
  }
);

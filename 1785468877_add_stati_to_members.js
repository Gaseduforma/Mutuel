/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("members");
    if (collection.fields.getByName("stati")) return;
    collection.fields.add(
      new SelectField({
        name: "stati",
        required: true,
        maxSelect: 1,
        values: ["Manb", "Sispann", "Radye"],
      })
    );
    app.save(collection);

    // Set all existing members to "Manb"
    app.db().newQuery("UPDATE members SET stati = 'Manb' WHERE stati IS NULL OR stati = ''").execute();
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("members");
    collection.fields.removeByName("stati");
    app.save(collection);
  }
);

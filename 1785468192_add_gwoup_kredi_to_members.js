/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("members");
    if (collection.fields.getByName("gwoup_kredi")) return;
    collection.fields.add(
      new SelectField({
        name: "gwoup_kredi",
        required: true,
        maxSelect: 1,
        values: ["Kredi Entèn", "Kredi Exten"],
      })
    );
    app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("members");
    collection.fields.removeByName("gwoup_kredi");
    app.save(collection);
  }
);

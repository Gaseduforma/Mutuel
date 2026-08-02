/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("loans");
    const existing = collection.fields.getByName("nimewo_dosye");
    if (existing) return;
    collection.fields.add(
      new TextField({
        name: "nimewo_dosye",
        required: false,
        max: 50,
      })
    );
    app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("loans");
    collection.fields.removeByName("nimewo_dosye");
    app.save(collection);
  }
);

/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("kotizasyon_config");

    if (!collection.fields.getByName("to_entere_intern")) {
      collection.fields.add(new NumberField({ name: "to_entere_intern", min: 0 }));
    }
    if (!collection.fields.getByName("to_entere_extern")) {
      collection.fields.add(new NumberField({ name: "to_entere_extern", min: 0 }));
    }
    app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("kotizasyon_config");
    collection.fields.removeByName("to_entere_intern");
    collection.fields.removeByName("to_entere_extern");
    app.save(collection);
  }
);

/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("kotizasyon_config");
    collection.fields.add(new NumberField({ name: "kes_vet_mansyel", min: 0 }));
    collection.fields.add(new NumberField({ name: "kes_rouj_mansyel", min: 0 }));
    app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("kotizasyon_config");
    collection.fields.removeByName("kes_vet_mansyel");
    collection.fields.removeByName("kes_rouj_mansyel");
    app.save(collection);
  },
);

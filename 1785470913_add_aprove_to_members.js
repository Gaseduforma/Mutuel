/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("members");

    const existing = collection.fields.getByName("aprove");
    if (existing) return;

    collection.fields.add(
      new SelectField({
        name: "aprove",
        required: true,
        maxSelect: 1,
        values: ["An atant", "Aprove", "Rejte"],
      })
    );
    app.save(collection);

    // Backfill existing members as Aprove (they were already accepted)
    const records = app.findRecordsByFilter("members", "aprove = ''", "", 0, 0);
    for (const r of records) {
      r.set("aprove", "Aprove");
      app.save(r);
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("members");
      collection.fields.removeByName("aprove");
      app.save(collection);
    } catch (_) {}
  }
);

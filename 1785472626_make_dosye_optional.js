/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("members");

    // Make nimewo_dosye optional
    const field = collection.fields.getByName("nimewo_dosye");
    field.required = false;

    // Update unique index to partial (allow multiple empty strings)
    collection.indexes = collection.indexes.filter(
      (idx) => !idx.includes("idx_members_dosye")
    );
    collection.indexes.push(
      "CREATE UNIQUE INDEX idx_members_dosye ON members (nimewo_dosye) WHERE nimewo_dosye != ''"
    );

    app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("members");
    const field = collection.fields.getByName("nimewo_dosye");
    field.required = true;

    collection.indexes = collection.indexes.filter(
      (idx) => !idx.includes("idx_members_dosye")
    );
    collection.indexes.push(
      "CREATE UNIQUE INDEX idx_members_dosye ON members (nimewo_dosye)"
    );

    app.save(collection);
  }
);

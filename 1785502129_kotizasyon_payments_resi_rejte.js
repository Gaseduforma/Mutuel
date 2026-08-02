/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const col = app.findCollectionByNameOrId("kotizasyon_payments");

    // Update status field to include "Rejte"
    const statuField = col.fields.getByName("statu");
    statuField.values = ["An atant", "Peye", "Pasyel", "Rejte"];
    col.fields.add(
      new Field({
        name: "resi_imaj",
        type: "file",
        maxSelect: 1,
        maxSize: 5242880,
        mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      })
    );
    app.save(col);
  },
  (app) => {
    const col = app.findCollectionByNameOrId("kotizasyon_payments");
    const statuField = col.fields.getByName("statu");
    statuField.values = ["An atant", "Peye", "Pasyel"];
    col.fields.removeByName("resi_imaj");
    app.save(col);
  },
);

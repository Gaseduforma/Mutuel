/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const col = app.findCollectionByNameOrId("kotizasyon_config");
    col.fields.add(new BoolField({ name: "entere_re_envesti" }));
    col.fields.add(new BoolField({ name: "pataj_entere_egal" }));
    col.fields.add(new BoolField({ name: "pataj_entere_desizyon" }));
    app.save(col);
  },
  (app) => {
    const col = app.findCollectionByNameOrId("kotizasyon_config");
    col.fields.removeByName("entere_re_envesti");
    col.fields.removeByName("pataj_entere_egal");
    col.fields.removeByName("pataj_entere_desizyon");
    app.save(col);
  }
);

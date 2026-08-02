/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    if (users.fields.getByName("tit_komite")) return;
    users.fields.add(
      new SelectField({
        name: "tit_komite",
        required: false,
        maxSelect: 1,
        values: ["Prezidan", "Trezorye", "Sekretè"],
      })
    );
    app.save(users);
  },
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    users.fields.removeByName("tit_komite");
    app.save(users);
  }
);

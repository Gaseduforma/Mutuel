/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const loans = app.findCollectionByNameOrId("loans");
    const members = app.findCollectionByNameOrId("members");

    if (!loans.fields.getByName("avek_avalize")) {
      loans.fields.add(new BoolField({ name: "avek_avalize" }));
    }
    if (!loans.fields.getByName("avalize_member")) {
      loans.fields.add(new RelationField({
        name: "avalize_member",
        required: false,
        maxSelect: 1,
        collectionId: members.id,
        cascadeDelete: false,
      }));
    }
    app.save(loans);
  },
  (app) => {
    const loans = app.findCollectionByNameOrId("loans");
    loans.fields.removeByName("avek_avalize");
    loans.fields.removeByName("avalize_member");
    app.save(loans);
  }
);

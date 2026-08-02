/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const members = app.findCollectionByNameOrId("members");
    const collection = new Collection({
      type: "base",
      name: "kane_transactions",
      listRule: "@request.auth.id != '' && (@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = '' || member.owner = @request.auth.id)",
      viewRule: "@request.auth.id != '' && (@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = '' || member.owner = @request.auth.id)",
      createRule: "@request.auth.id != '' && (member.owner = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = '')",
      updateRule: "@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = ''",
      deleteRule: "@request.auth.role = 'admin' || @request.auth.role = ''",
      fields: [
        {
          name: "member",
          type: "relation",
          required: true,
          maxSelect: 1,
          collectionId: members.id,
          cascadeDelete: true,
        },
        {
          name: "type",
          type: "select",
          required: true,
          maxSelect: 1,
          values: ["Depo", "Retre"],
        },
        { name: "montant", type: "number", required: true, min: 0.01 },
        { name: "dat_transaksyon", type: "date", required: true },
        { name: "note", type: "text", max: 500 },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
      indexes: [
        "CREATE INDEX idx_kane_member ON kane_transactions (member)",
        "CREATE INDEX idx_kane_type ON kane_transactions (type)",
        "CREATE INDEX idx_kane_dat ON kane_transactions (dat_transaksyon)",
      ],
    });
    app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("kane_transactions");
    app.delete(collection);
  },
);

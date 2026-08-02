/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const members = app.findCollectionByNameOrId("members");
    const users = app.findCollectionByNameOrId("users");

    const col = new Collection({
      type: "base",
      name: "avalize_eksten_requests",
      // komite/admin can list/view all; guarantor member can view their own
      listRule: "@request.auth.id != '' && (@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = '' || avalize_member.owner = @request.auth.id)",
      viewRule: "@request.auth.id != '' && (@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = '' || avalize_member.owner = @request.auth.id)",
      createRule: "@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = ''",
      updateRule: "@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = '' || avalize_member.owner = @request.auth.id",
      deleteRule: "@request.auth.role = 'admin' || @request.auth.role = ''",
      fields: [
        {
          name: "avalize_member",
          type: "relation",
          required: true,
          maxSelect: 1,
          collectionId: members.id,
          cascadeDelete: false,
        },
        { name: "non_moun", type: "text", required: true, max: 200 },
        { name: "montant", type: "number", required: true, min: 0.01 },
        { name: "dire_mwa", type: "number", min: 1, onlyInt: true },
        { name: "rezon", type: "text", max: 500 },
        {
          name: "statu",
          type: "select",
          required: true,
          maxSelect: 1,
          values: ["An atant", "Konfime", "Rejte"],
        },
        {
          name: "kreye_pa",
          type: "relation",
          maxSelect: 1,
          collectionId: users.id,
          cascadeDelete: false,
        },
        { name: "created", type: "autodate", onCreate: true, onUpdate: false },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
      indexes: [
        "CREATE INDEX idx_avalize_eksten_member ON avalize_eksten_requests (avalize_member)",
        "CREATE INDEX idx_avalize_eksten_statu ON avalize_eksten_requests (statu)",
      ],
    });
    app.save(col);
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId("avalize_eksten_requests");
      app.delete(col);
    } catch (_) {}
  },
);

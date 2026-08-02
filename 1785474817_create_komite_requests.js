/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let members;
    try {
      members = app.findCollectionByNameOrId("members");
    } catch (_) {
      throw new Error("members collection not found");
    }

    let col;
    try {
      col = app.findCollectionByNameOrId("komite_requests");
    } catch (_) {
      col = new Collection({
        type: "base",
        name: "komite_requests",
        listRule: "@request.auth.id != '' && (@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = '' || member.owner = @request.auth.id)",
        viewRule: "@request.auth.id != '' && (@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = '' || member.owner = @request.auth.id)",
        createRule: "@request.auth.id != '' && member.owner = @request.auth.id",
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
          { name: "motif", type: "text", max: 1000 },
          {
            name: "statu",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["An atant", "Aprove", "Rejte"],
          },
          { name: "note_admin", type: "text", max: 500 },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
        indexes: [
          "CREATE INDEX idx_komite_req_member ON komite_requests (member)",
          "CREATE INDEX idx_komite_req_statu ON komite_requests (statu)",
        ],
      });
      app.save(col);
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId("komite_requests");
      app.delete(col);
    } catch (_) {}
  }
);

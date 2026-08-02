/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");

    const staffOnly = {
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
    };

    let members;
    try {
      members = app.findCollectionByNameOrId("members");
    } catch (_) {
      members = new Collection({
        type: "base",
        name: "members",
        ...staffOnly,
        fields: [
          { name: "nom", type: "text", required: true, max: 100 },
          { name: "prenom", type: "text", required: true, max: 100 },
          {
            name: "sexe",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["Fi", "Gason"],
          },
          { name: "dat_nesans", type: "date" },
          { name: "nimewo_dosye", type: "text", required: true, max: 50 },
          { name: "nimewo_kane", type: "text", required: true, max: 50 },
          { name: "telefon", type: "text", max: 40 },
          { name: "adres", type: "text", max: 300 },
          {
            name: "owner",
            type: "relation",
            maxSelect: 1,
            collectionId: users.id,
            cascadeDelete: false,
          },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
        indexes: [
          "CREATE UNIQUE INDEX idx_members_dosye ON members (nimewo_dosye)",
          "CREATE UNIQUE INDEX idx_members_kane ON members (nimewo_kane)",
        ],
      });
      app.save(members);
    }

    let loans;
    try {
      loans = app.findCollectionByNameOrId("loans");
    } catch (_) {
      loans = new Collection({
        type: "base",
        name: "loans",
        ...staffOnly,
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
            name: "gwoup",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["Kredi Entèn", "Kredi Exten"],
          },
          { name: "montan", type: "number", required: true, min: 1 },
          { name: "to_entere", type: "number", min: 0 },
          { name: "dire_mwa", type: "number", required: true, min: 1, onlyInt: true },
          { name: "rezon", type: "text", max: 500 },
          {
            name: "statu",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["An atant", "Apwouve", "Rejte", "Fini"],
          },
          { name: "not_admin", type: "text", max: 500 },
          { name: "dat_apwobasyon", type: "date" },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
        indexes: ["CREATE INDEX idx_loans_statu ON loans (statu)"],
      });
      app.save(loans);
    }

    try {
      app.findCollectionByNameOrId("repayments");
    } catch (_) {
      const repayments = new Collection({
        type: "base",
        name: "repayments",
        ...staffOnly,
        fields: [
          {
            name: "loan",
            type: "relation",
            required: true,
            maxSelect: 1,
            collectionId: loans.id,
            cascadeDelete: true,
          },
          { name: "mwa", type: "text", required: true, max: 20 },
          { name: "montan_atann", type: "number", min: 0 },
          { name: "montan_peye", type: "number", min: 0 },
          { name: "dat_peman", type: "date" },
          {
            name: "statu",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["An atant", "Peye", "An reta"],
          },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
        indexes: ["CREATE INDEX idx_repayments_loan ON repayments (loan)"],
      });
      app.save(repayments);
    }
  },
  (app) => {
    ["repayments", "loans", "members"].forEach((name) => {
      try {
        app.delete(app.findCollectionByNameOrId(name));
      } catch (_) {
        /* noop */
      }
    });
  },
);

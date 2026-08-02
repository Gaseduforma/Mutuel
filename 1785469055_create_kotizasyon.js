/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const staffCond = "@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = ''";

    // kotizasyon_config: single-record store for monthly/annual amounts
    try {
      app.findCollectionByNameOrId("kotizasyon_config");
    } catch (_) {
      const config = new Collection({
        type: "base",
        name: "kotizasyon_config",
        listRule: `@request.auth.id != '' && (${staffCond})`,
        viewRule: `@request.auth.id != '' && (${staffCond})`,
        createRule: staffCond,
        updateRule: staffCond,
        deleteRule: staffCond,
        fields: [
          { name: "montant_mansyel", type: "number", min: 0 },
          { name: "montant_anyel", type: "number", min: 0 },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
      });
      app.save(config);

      // Seed default config record
      const configCol = app.findCollectionByNameOrId("kotizasyon_config");
      const rec = new Record(configCol);
      rec.set("montant_mansyel", 0);
      rec.set("montant_anyel", 0);
      app.save(rec);
    }

    // kotizasyon_payments: track per-member dues payments
    const members = app.findCollectionByNameOrId("members");
    try {
      app.findCollectionByNameOrId("kotizasyon_payments");
    } catch (_) {
      const payments = new Collection({
        type: "base",
        name: "kotizasyon_payments",
        listRule: `@request.auth.id != '' && (${staffCond} || member.owner = @request.auth.id)`,
        viewRule: `@request.auth.id != '' && (${staffCond} || member.owner = @request.auth.id)`,
        createRule: staffCond,
        updateRule: staffCond,
        deleteRule: staffCond,
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
            name: "type_kotizasyon",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["Mansyel", "Anyel"],
          },
          // e.g. "2025-07" for monthly, "2025" for annual
          { name: "periode", type: "text", required: true, max: 10 },
          { name: "montant_du", type: "number", min: 0 },
          { name: "montant_peye", type: "number", min: 0 },
          { name: "dat_peman", type: "date" },
          {
            name: "statu",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["An atant", "Peye", "Pasyel"],
          },
          { name: "note", type: "text", max: 500 },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
        indexes: [
          "CREATE INDEX idx_kotiz_member ON kotizasyon_payments (member)",
          "CREATE INDEX idx_kotiz_periode ON kotizasyon_payments (periode)",
          "CREATE UNIQUE INDEX idx_kotiz_unique ON kotizasyon_payments (member, type_kotizasyon, periode)",
        ],
      });
      app.save(payments);
    }
  },
  (app) => {
    ["kotizasyon_payments", "kotizasyon_config"].forEach((name) => {
      try { app.delete(app.findCollectionByNameOrId(name)); } catch (_) {}
    });
  }
);

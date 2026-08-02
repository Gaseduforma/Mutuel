/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const col = app.findCollectionByNameOrId("kotizasyon_payments");
    col.createRule = "@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = '' || (member.owner = @request.auth.id)";
    app.save(col);
  },
  (app) => {
    const col = app.findCollectionByNameOrId("kotizasyon_payments");
    col.createRule = "@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = ''";
    app.save(col);
  },
);

/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const members = app.findCollectionByNameOrId("members");
    // Allow self-registration for both Kredi Entèn and Kredi Exten
    members.createRule = `(@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = '') || (@request.auth.id != '' && @request.body.owner = @request.auth.id)`;
    app.save(members);
  },
  (app) => {
    const members = app.findCollectionByNameOrId("members");
    members.createRule = `(@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = '') || (@request.auth.id != '' && @request.body.gwoup_kredi = 'Kredi Entèn' && @request.body.owner = @request.auth.id)`;
    app.save(members);
  }
);

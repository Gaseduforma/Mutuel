/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("repayments");
    collection.updateRule = "@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = '' || loan.member.owner = @request.auth.id";
    app.save(collection);
  },
  (app) => {
    const collection = app.findCollectionByNameOrId("repayments");
    collection.updateRule = "@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = ''";
    app.save(collection);
  }
);

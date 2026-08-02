/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const loans = app.findCollectionByNameOrId("loans");
    const staffCond = "@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = ''";
    // Membre can only create a loan if their member record has stati = 'Manb'
    loans.createRule = `(${staffCond}) || (member.owner = @request.auth.id && member.stati = 'Manb')`;
    app.save(loans);
  },
  (app) => {
    const loans = app.findCollectionByNameOrId("loans");
    const staffCond = "@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = ''";
    loans.createRule = `(${staffCond}) || member.owner = @request.auth.id`;
    app.save(loans);
  }
);

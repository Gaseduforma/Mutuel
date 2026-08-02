/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // Members: staff (admin/komite/empty=legacy admin) can do everything;
    // membre can self-register only as Kredi Entèn with owner = themselves
    const members = app.findCollectionByNameOrId("members");
    const staffCond = "@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = ''";
    members.listRule   = `@request.auth.id != '' && (${staffCond} || owner = @request.auth.id)`;
    members.viewRule   = `@request.auth.id != '' && (${staffCond} || owner = @request.auth.id)`;
    members.createRule = `(${staffCond}) || (@request.auth.id != '' && @request.body.gwoup_kredi = 'Kredi Entèn' && @request.body.owner = @request.auth.id)`;
    members.updateRule = staffCond;
    members.deleteRule = "@request.auth.role = 'admin' || @request.auth.role = ''";
    app.save(members);

    // Loans: staff can do everything; membre can list/view/create for their own member record
    const loans = app.findCollectionByNameOrId("loans");
    loans.listRule   = `@request.auth.id != '' && (${staffCond} || member.owner = @request.auth.id)`;
    loans.viewRule   = `@request.auth.id != '' && (${staffCond} || member.owner = @request.auth.id)`;
    loans.createRule = `(${staffCond}) || member.owner = @request.auth.id`;
    loans.updateRule = staffCond;
    loans.deleteRule = "@request.auth.role = 'admin' || @request.auth.role = ''";
    app.save(loans);

    // Repayments: staff can do everything; membre can view their own via loan relation
    const repayments = app.findCollectionByNameOrId("repayments");
    repayments.listRule   = `@request.auth.id != '' && (${staffCond} || loan.member.owner = @request.auth.id)`;
    repayments.viewRule   = `@request.auth.id != '' && (${staffCond} || loan.member.owner = @request.auth.id)`;
    repayments.createRule = staffCond;
    repayments.updateRule = staffCond;
    repayments.deleteRule = "@request.auth.role = 'admin' || @request.auth.role = ''";
    app.save(repayments);
  },
  (app) => {
    // Revert to original staff-only rules
    const staffOnly = "@request.auth.id != ''";
    ["members", "loans", "repayments"].forEach((name) => {
      try {
        const col = app.findCollectionByNameOrId(name);
        col.listRule   = staffOnly;
        col.viewRule   = staffOnly;
        col.createRule = staffOnly;
        col.updateRule = staffOnly;
        col.deleteRule = staffOnly;
        app.save(col);
      } catch (_) { /* noop */ }
    });
  }
);

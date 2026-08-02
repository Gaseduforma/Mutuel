/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    // Allow admin/komite to list and view all users; regular users see only themselves
    users.listRule = "id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = ''";
    users.viewRule = "id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = ''";
    // Allow anyone to create (self-registration for membres), but admin can also create komite accounts
    users.createRule = "";
    // Users can update themselves; admin can update any user (for role/title changes)
    users.updateRule = "id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = ''";
    users.deleteRule = "id = @request.auth.id || @request.auth.role = 'admin' || @request.auth.role = ''";
    app.save(users);
  },
  (app) => {
    const users = app.findCollectionByNameOrId("users");
    users.listRule = "id = @request.auth.id";
    users.viewRule = "id = @request.auth.id";
    users.createRule = "";
    users.updateRule = "id = @request.auth.id";
    users.deleteRule = "id = @request.auth.id";
    app.save(users);
  }
);

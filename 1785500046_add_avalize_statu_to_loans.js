/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const loans = app.findCollectionByNameOrId("loans");

    // Add avalize_statu field
    if (!loans.fields.getByName("avalize_statu")) {
      loans.fields.add(new SelectField({
        name: "avalize_statu",
        required: false,
        maxSelect: 1,
        values: ["An atant", "Konfime", "Rejte"],
      }));
    }

    // Update rule to allow avalizè to update their own avalize status
    loans.updateRule = "@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = '' || avalize_member.owner = @request.auth.id";

    app.save(loans);
  },
  (app) => {
    const loans = app.findCollectionByNameOrId("loans");
    loans.fields.removeByName("avalize_statu");
    loans.updateRule = "@request.auth.role = 'admin' || @request.auth.role = 'komite' || @request.auth.role = ''";
    app.save(loans);
  }
);

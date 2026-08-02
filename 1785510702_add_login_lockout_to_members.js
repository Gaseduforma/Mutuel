/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const col = app.findCollectionByNameOrId("members");

    const existingAttempts = col.fields.getByName("failed_attempts");
    if (!existingAttempts) {
      col.fields.add(new NumberField({
        name: "failed_attempts",
        min: 0,
        required: false,
      }));
    }

    const existingLocked = col.fields.getByName("is_locked");
    if (!existingLocked) {
      col.fields.add(new BoolField({
        name: "is_locked",
        required: false,
      }));
    }

    app.save(col);
  },
  (app) => {
    const col = app.findCollectionByNameOrId("members");
    try { col.fields.removeByName("failed_attempts"); } catch (_) {}
    try { col.fields.removeByName("is_locked"); } catch (_) {}
    app.save(col);
  }
);

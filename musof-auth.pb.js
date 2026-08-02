/// <reference path="../pb_data/types.d.ts" />

// POST /api/musof/dosye-email
// Returns PocketBase email for a member; checks lockout status
routerAdd("POST", "/api/musof/dosye-email", (e) => {
  // Helper: find member records by identifier (kane number or name)
  function findMembersByIdentifier(identifier) {
    let records = [];
    // 1. Try nimewo_kane exact match
    try {
      const r = $app.findRecordsByFilter(
        "members",
        "nimewo_kane = {:id}",
        "", 5, 0,
        { id: identifier }
      );
      if (r && r.length) records = r;
    } catch (_) {}

    // 1b. Case-insensitive nimewo_kane fallback
    if (!records.length) {
      try {
        const ids = $app.db()
          .newQuery("SELECT id FROM members WHERE LOWER(TRIM(nimewo_kane)) = LOWER(TRIM({:id})) LIMIT 5")
          .bind({ id: identifier })
          .column();
        if (ids && ids.length) {
          for (const rid of ids) {
            try { records.push($app.findRecordById("members", rid)); } catch (_) {}
          }
        }
      } catch (_) {}
    }

    // 2. Try email_contact field
    if (!records.length) {
      try {
        const r = $app.findRecordsByFilter(
          "members",
          "email_contact = {:id}",
          "", 5, 0,
          { id: identifier }
        );
        if (r && r.length) records = r;
      } catch (_) {}
    }

    // 3. Try looking up by users email -> owner relation
    if (!records.length) {
      try {
        const user = $app.findFirstRecordByFilter(
          "users",
          "email = {:email}",
          { email: identifier }
        );
        if (user) {
          const r = $app.findRecordsByFilter(
            "members",
            "owner = {:uid}",
            "", 1, 0,
            { uid: user.id }
          );
          if (r && r.length) records = r;
        }
      } catch (_) {}
    }

    // 4. Try nom or prenom (case-insensitive LIKE)
    if (!records.length) {
      try {
        const r = $app.findRecordsByFilter(
          "members",
          "nom ~ {:id} || prenom ~ {:id}",
          "", 10, 0,
          { id: identifier }
        );
        if (r && r.length) records = r;
      } catch (_) {}
    }

    return records;
  }

  // Helper: check if identifier belongs to a komite/staff user
  function isKomiteUser(identifier) {
    try {
      const user = $app.findFirstRecordByFilter(
        "users",
        "email = {:email}",
        { email: identifier }
      );
      if (user) {
        const role = user.getString("role");
        if (role === "admin" || role === "komite") return true;
      }
    } catch (_) {}
    return false;
  }

  const info = e.requestInfo();
  const body = info.body || {};
  const identifier = String(body.identifier || body.nimewo_dosye || "").trim();

  if (!identifier) throw new BadRequestError("Idantite obligatwa");

  $app.logger().info("dosye-email: rechèch manm", "identifier", identifier);

  const records = findMembersByIdentifier(identifier);

  if (!records.length) {
    // Return 200 with error field to avoid PocketBase error log entries
    if (isKomiteUser(identifier)) {
      return e.json(200, { error: "komite", message: "Ou se manm Komite a. Itilize fòm koneksyon Komite a (klike 'Ou se manm komite? Konekte isit')." });
    }
    return e.json(200, { error: "not_found", message: "Manm pa jwenn. Tcheke nimewo kane ou, non ou, oswa imèl ou a." });
  }

  if (records.length > 1) {
    return e.json(200, { error: "multiple", message: "Plizyè manm jwenn ak non sa a. Tanpri itilize nimewo kane ou pou pi presizyon." });
  }

  const member = records[0];

  // Check lockout
  if (member.getBool("is_locked")) {
    return e.json(200, { error: "locked", message: "Kont ou bloke. Kontakte yon manm komite pou debloke pou ou." });
  }

  const ownerId = member.getString("owner");
  if (!ownerId) {
    return e.json(200, { error: "no_user", message: "Kont itilizatè pa jwenn pou manm sa a" });
  }

  const user = $app.findRecordById("users", ownerId);

  return e.json(200, {
    email: user.getString("email"),
    member_id: member.id,
  });
});

// POST /api/musof/failed-login
// Called by frontend after a failed authWithPassword; increments failed_attempts, locks after 3
routerAdd("POST", "/api/musof/failed-login", (e) => {
  // Helper: find member records by identifier (kane number or name)
  function findMembersByIdentifier(identifier) {
    let records = [];
    try {
      const r = $app.findRecordsByFilter(
        "members",
        "nimewo_kane = {:id}",
        "", 5, 0,
        { id: identifier }
      );
      if (r && r.length) records = r;
    } catch (_) {}

    if (!records.length) {
      try {
        const ids = $app.db()
          .newQuery("SELECT id FROM members WHERE LOWER(TRIM(nimewo_kane)) = LOWER(TRIM({:id})) LIMIT 5")
          .bind({ id: identifier })
          .column();
        if (ids && ids.length) {
          for (const rid of ids) {
            try { records.push($app.findRecordById("members", rid)); } catch (_) {}
          }
        }
      } catch (_) {}
    }

    if (!records.length) {
      try {
        const r = $app.findRecordsByFilter(
          "members",
          "nom ~ {:id} || prenom ~ {:id}",
          "", 10, 0,
          { id: identifier }
        );
        if (r && r.length) records = r;
      } catch (_) {}
    }

    return records;
  }

  const info = e.requestInfo();
  const body = info.body || {};
  const identifier = String(body.identifier || "").trim();

  if (!identifier) throw new BadRequestError("Idantite obligatwa");

  const records = findMembersByIdentifier(identifier);
  if (!records.length) {
    return e.json(200, { failed_attempts: 1, is_locked: false });
  }

  const member = records[0];

  if (member.getBool("is_locked")) {
    return e.json(200, {
      failed_attempts: member.getInt("failed_attempts"),
      is_locked: true,
    });
  }

  const attempts = (member.getInt("failed_attempts") || 0) + 1;
  member.set("failed_attempts", attempts);

  if (attempts >= 3) {
    member.set("is_locked", true);
  }

  $app.save(member);

  return e.json(200, {
    failed_attempts: attempts,
    is_locked: attempts >= 3,
  });
});

// POST /api/musof/aktive
// Activates a member account: verifies identity via dosye+kane, sets password
routerAdd("POST", "/api/musof/aktive", (e) => {
  const info = e.requestInfo();
  const body = info.body || {};
  const dosye = String(body.nimewo_dosye || "").trim();
  const kane = String(body.nimewo_kane || "").trim();
  const password = String(body.password || "");
  const passwordConfirm = String(body.passwordConfirm || "");

  if (!dosye || !kane || !password) throw new BadRequestError("Tout chan obligatwa");
  if (password !== passwordConfirm) throw new BadRequestError("Modpas yo pa matche");
  if (password.length < 8) throw new BadRequestError("Modpas dwe gen omwen 8 karaktè");

  let records;
  try {
    records = $app.findRecordsByFilter(
      "members",
      "nimewo_dosye = {:dosye} && nimewo_kane = {:kane}",
      "", 1, 0,
      { dosye, kane }
    );
  } catch (_) {
    throw new BadRequestError("Nimewo dosye oswa kane enkòrèk");
  }

  if (!records || !records.length) throw new BadRequestError("Nimewo dosye oswa kane enkòrèk");

  const member = records[0];
  const aprove = member.getString("aprove");

  if (aprove === "Rejte") throw new BadRequestError("Kont ou te rejte pa Komite a. Kontakte administratè a.");
  if (aprove !== "Aprove") throw new BadRequestError("Kont ou pa aprove ankò. Tann otorizasyon Komite a.");

  const ownerId = member.getString("owner");
  if (!ownerId) throw new BadRequestError("Kont itilizatè pa jwenn");

  const user = $app.findRecordById("users", ownerId);

  user.set("password", password);
  user.set("passwordConfirm", password);
  $app.save(user);

  // Reset lockout on activation
  member.set("failed_attempts", 0);
  member.set("is_locked", false);
  $app.save(member);

  return e.json(200, {
    message: "Modpas defini avèk siksè",
    email: user.getString("email"),
  });
});

// onRecordAuthWithPasswordRequest — reset failed_attempts on successful login
onRecordAuthWithPasswordRequest((e) => {
  e.next();

  try {
    const user = e.record;
    if (!user) return;

    const userId = user.getId();
    const memberRecords = $app.findRecordsByFilter(
      "members",
      "owner = {:uid}",
      "", 1, 0,
      { uid: userId }
    );

    if (memberRecords && memberRecords.length) {
      const member = memberRecords[0];
      if (member.getInt("failed_attempts") > 0 || member.getBool("is_locked")) {
        if (!member.getBool("is_locked")) {
          member.set("failed_attempts", 0);
          $app.save(member);
        }
      }
    }
  } catch (_) {}
}, "users");

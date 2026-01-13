const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const PgSession = require("connect-pg-simple")(session);

dotenv.config();

const app = express();

function isValidPassword(password) {
  if (password.length >= 15) return true;

  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (password.length >= 8 && hasLowercase && hasNumber) return true;

  return false;
}

// ----- DB connection -----
const pool = new Pool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "yolo",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
});

// ----- middleware -----
app.use(express.urlencoded({ extended: true })); // read HTML form data

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

const FRONTEND_DIR = path.join(__dirname, "..", "Projekt_yolo");

app.get("/pages/Profile_page/Profile_index.html", requireAuth, (req, res) =>
  res.sendFile(path.join(FRONTEND_DIR, "pages/Profile_page/Profile_index.html"))
);

app.use(express.static(FRONTEND_DIR));

// ----- helpers -----
function requireAuth(req, res, next) {
  if (!req.session.userId) return res.redirect("/login");
  next();
}

function preventAuthPagesForLoggedIn(req, res, next) {
  if (req.session.userId) return res.redirect("/");
  next();
}

// ----- pages (HTML) -----
app.get("/", (req, res) => 
  res.sendFile(path.join(FRONTEND_DIR, "main_index.html"))
);

app.get("/login", preventAuthPagesForLoggedIn, (req, res) =>
  res.sendFile(path.join(FRONTEND_DIR, "pages/Login_Registracija_Yolo/login_index.html"))
);

app.get("/register", preventAuthPagesForLoggedIn, (req, res) =>
  res.sendFile(path.join(FRONTEND_DIR, "pages/Login_Registracija_Yolo/register_index.html"))
);

app.get("/profile", requireAuth, (req, res) =>
  res.sendFile(path.join(FRONTEND_DIR, "pages/Profile_page/Profile_index.html"))
);

app.get("/api/me", requireAuth, async (req, res) => {
  const r = await pool.query(
    "SELECT first_name, last_name, birth_date, gender, country, email FROM users WHERE id=$1",
    [req.session.userId]
  );
  res.json({ ok: true, user: r.rows[0] });
});

// ----- AUTH: register -----
app.post("/register", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      birth_date,
      gender,
      country,
      email,
      password,
    } = req.body;


if (!isValidPassword(password)) {
  return res.status(400).send(
    "Lozinka mora imati najmanje 15 znakova ILI najmanje 8 znakova s barem jednim malim slovom i jednim brojem."
  );
}


    if (!email || !password) return res.status(400).send("Email i lozinka su obavezni.");

    // Email unique
    const exists = await pool.query("SELECT 1 FROM users WHERE email=$1", [email]);
    if (exists.rowCount > 0) return res.status(400).send("Email već postoji.");

    const password_hash = await bcrypt.hash(password, 10);

    const q = `
      INSERT INTO users (first_name, last_name, birth_date, gender, country, email, password_hash)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id;
    `;
    const result = await pool.query(q, [
      first_name,
      last_name,
      birth_date,
      gender,
      country,
      email,
      password_hash,
    ]);

    // Auto-login after register
    req.session.userId = result.rows[0].id;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Greška na serveru (register).");
  }
});

// ----- AUTH: login (email + password) -----
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT id, password_hash FROM users WHERE email=$1", [email]);
    if (result.rowCount === 0) return res.status(400).send("Krivi email ili lozinka.");

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).send("Krivi email ili lozinka.");

    req.session.userId = user.id;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Greška na serveru (login).");
  }
});

// ----- AUTH: logout -----
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

// ----- RESERVATION: save dates for logged-in user -----
app.post("/reserve", requireAuth, async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

const today = new Date();
today.setHours(0, 0, 0, 0);

const start = new Date(start_date);
const end = new Date(end_date);

if (start < today || end < today) {
  return res.status(400).send("Ne možete rezervirati datume u prošlosti.");
}

if (end < start) {
  return res.status(400).send("Datum završetka mora biti nakon datuma početka.");
}

    await pool.query(
      "INSERT INTO reservations (user_id, start_date, end_date) VALUES ($1,$2,$3)",
      [req.session.userId, start_date, end_date]
    );

    res.redirect("/");
  }catch (err) {
  console.error(err);

  if (err.code === "23P01") {
    return res.status(400).send("Termin je već rezerviran.");
  }

  res.status(500).send("Greška kod spremanja rezervacije.");
}

});

app.post("/api/reserve", requireAuth, async (req, res) => {
  try {
    const { start_date, end_date } = req.body;

    await pool.query(
      "INSERT INTO reservations(user_id, start_date, end_date) VALUES($1,$2,$3)",
      [req.session.userId, start_date, end_date]
    );

    return res.json({ ok: true });
  } catch (err) {
    // overlap constraint error (daterange exclude)
    if (err.code === "23P01") {
      return res.status(409).json({
        ok: false,
        message: "Those dates are already reserved."
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Server error."
    });
  }
});

// ----- simple healthcheck -----
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Running: http://localhost:${PORT}`));

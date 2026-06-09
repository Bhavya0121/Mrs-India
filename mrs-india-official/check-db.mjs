
const m = require("mongoose");

const fs = require("fs");

const uri = fs.readFileSync(".env.local","utf8").split("\n").find(l=>l.startsWith("MONGODB_URI=")).split("=").slice(1).join("=").trim();

m.connect(uri).then(async()=>{

  const d = await m.connection.db.collection("site_content").findOne({});

  console.log("=== about.highlights ===");

  console.log(JSON.stringify(d?.about?.highlights, null, 2));

  process.exit();

});


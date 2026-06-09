
const m = require("mongoose");

const fs = require("fs");

const uri = fs.readFileSync(".env.local","utf8").split("\n").find(l=>l.startsWith("MONGODB_URI=")).split("=").slice(1).join("=").trim();

m.connect(uri).then(async()=>{

  const d = await m.connection.db.collection("site_content").findOne({ key: "singleton" });

  console.log("=== keys ===", Object.keys(d || {}));
  console.log("=== about ===");
  console.log(JSON.stringify(d?.about, null, 2));

  process.exit();

});

const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dns.setDefaultResultOrder("ipv4first");
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://sameerkumar074518_db_user:Sameer123@cluster0.mymr82j.mongodb.net/admin?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log("Connecting...");
    await client.connect();
    console.log("Connected!");
    const result = await client.db("admin").command({ ping: 1 });
    console.log(result);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
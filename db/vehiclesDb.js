// db/vehiclesDb.js
// The ONLY place that talks to MongoDB for the Vehicles feature (Nipun's
// feature). Same factory + per-call connection style as db/servicesDb.js, but
// self-contained: its own getClient so it has no dependency on the services db.
//
// For now it only needs to LIST vehicles (the Services page uses this to show
// nicknames and fill the vehicle dropdowns). More methods get added here as
// the Vehicles feature grows.

import { MongoClient } from "mongodb";

// Same database as the services side ("garage"); both teammates share it.
const DEFAULT_DB_NAME = "garage";

function createVehiclesDb() {
  // Open a fresh connection and hand back the client (to close) and the
  // "vehicles" collection. Connection string comes from .env via --env-file.
  async function getClient() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
    const client = await MongoClient.connect(uri);
    const vehicles = client.db(DEFAULT_DB_NAME).collection("vehicles");
    return { client, vehicles };
  }

  const me = {};

  // Return all vehicles.
  me.getVehicles = async function () {
    const { client, vehicles } = await getClient();
    try {
      return await vehicles.find({}).toArray();
    } finally {
      await client.close();
    }
  };

  return me;
}

// Export ONE shared instance, same as the services db.
export default createVehiclesDb();

// db/database.js
// This module is the ONLY place that talks directly to MongoDB.
// It connects once when the server starts, then hands the database
// back to whoever needs it (the routes) through getDatabase().
//
// It's built as a "factory": createDatabase() builds an object with the
// methods below. `client` and `db` live inside the factory (a closure),
// so they're private — nothing outside this file can touch them directly.
// We export ONE shared instance, so the whole app uses the same connection.

import { MongoClient } from "mongodb";

// The database name inside the MongoDB server. This isn't a secret,
// so it's fine to keep here as a default (both teammates use "garage").
const DEFAULT_DB_NAME = "garage";

function createDatabase() {
  // Private state — one shared client and one shared database handle.
  // They start as null and get filled in by init().
  let client = null;
  let db = null;

  // The object we build up and return. Methods get attached below, then
  // we return `me` at the end.
  const me = {};

  // Call this ONCE, when the server starts up.
  // It reads the secret connection string from the environment (.env),
  // connects to MongoDB, and remembers the database so getDatabase() can return it.
  me.init = async function ({ dbName = DEFAULT_DB_NAME } = {}) {
    // The connection string lives in .env (never in the code) so we don't
    // expose our credentials. server.js loads .env via `node --env-file=.env`.
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

    client = new MongoClient(uri);

    // Try to connect. If it fails, print the reason and re-throw so the
    // caller (server.js) can decide what to do (it stops the server).
    try {
      await client.connect();
    } catch (error) {
      console.error("Could not connect to MongoDB:", error.message);
      throw error;
    }

    // Pick the database to use inside the MongoDB server.
    // (A single MongoDB server can hold many databases.)
    db = client.db(dbName);

    console.log(`Connected to MongoDB (database: "${dbName}")`);
    return db;
  };

  // Routes call this to get the database so they can read/write collections.
  // If it's called before init() finished, we fail loudly
  // instead of silently returning null.
  me.getDatabase = function () {
    if (!db) {
      throw new Error("Database not connected yet. Call init() first.");
    }
    return db;
  };

  return me;
}

// Export ONE shared instance so the whole app uses the same connection.
export default createDatabase();

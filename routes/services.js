// routes/services.js
// All the URLs for service records live here. This is an Express "Router" —
// a mini-app that groups related routes. server.js mounts it under
// "/api/services", so the route below (GET "/") answers GET /api/services.

import express from "express";
import db from "../db/database.js";

const router = express.Router();

// Small helper: returns the "services" collection. Writing the collection
// name in one place avoids typos and repetition across the routes below.
function servicesCollection() {
  return db.getDatabase().collection("services");
}

// GET /api/services
// Return every service record in the "services" collection as a JSON array.
// (No filters yet — that comes in a later step.)
router.get("/", async (req, res) => {
  try {
    const services = await servicesCollection().find().toArray();
    res.json(services);
  } catch (error) {
    // If something goes wrong (e.g. the database read fails), send back a
    // 500 ("server error") with a short message instead of crashing.
    console.error("GET /api/services failed:", error.message);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

export default router;

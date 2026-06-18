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

// POST /api/services
// Create a new service record. The data comes in the request body as JSON
// (express.json() in server.js already parsed it into req.body).
router.post("/", async (req, res) => {
  try {
    const body = req.body;

    // Build the document from the fields we expect (our agreed shape).
    // Number(...) converts numeric fields, which often arrive as strings
    // from an HTML form, into real numbers before storing them.
    const newService = {
      vehicleId: body.vehicleId,
      date: body.date,
      serviceType: body.serviceType,
      mileage: Number(body.mileage),
      cost: Number(body.cost),
      recommendedInterval: Number(body.recommendedInterval),
      shopName: body.shopName,
      shopRating: Number(body.shopRating),
      notes: body.notes,
    };

    // A minimal sanity check: don't insert a record with no vehicle.
    if (!newService.vehicleId) {
      return res.status(400).json({ error: "vehicleId is required" });
    }

    // Insert it. MongoDB adds a unique _id automatically.
    const result = await servicesCollection().insertOne(newService);

    // Respond 201 ("created") with the new record, including its new _id.
    res.status(201).json({ _id: result.insertedId, ...newService });
  } catch (error) {
    console.error("POST /api/services failed:", error.message);
    res.status(500).json({ error: "Failed to create service" });
  }
});

export default router;

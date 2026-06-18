// routes/vehicles.js
// URLs for vehicles. This is an Express Router mounted at "/api/vehicles" in
// server.js. Like the services router, handlers do HTTP work only and call a
// db method; all MongoDB work lives in db/vehiclesDb.js.
//
// Minimal for now: just listing vehicles (the Services page needs it for
// nicknames + dropdowns). This is Nipun's feature area — more routes later.

import express from "express";
import vehiclesDb from "../db/vehiclesDb.js";

const router = express.Router();

// GET /api/vehicles
// Return all vehicles as a JSON array.
router.get("/", async (req, res) => {
  try {
    const vehicles = await vehiclesDb.getVehicles();
    console.log("GET /api/vehicles succeeded:", vehicles.length, "vehicles");
    res.json(vehicles);
  } catch (error) {
    console.error("GET /api/vehicles failed:", error.message);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

export default router;

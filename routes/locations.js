"use strict";

/** Routes for locations. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Location = require("../models/location");
const locationNewSchema = require("../schemas/locationNew.json");
const locationUpdateSchema = require("../schemas/locationUpdate.json");

const router = express.Router();


/** POST /  =>  { location }
 *
 * Authorization required: admin or same-user-as-:username
 * */

router.post("/", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(req.body, locationNewSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const location = await Location.create(req.body);
  return res.status(201).json({ location });
});


/** GET /  =>  { locations: [ { id, username, name, usgsId, decLat, decLong, fish, records }, ... ] }
 *
 * Returns list of all locations.
 **/

router.get("/", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const locations = await Location.findAllUserLocations();
  return res.json({ locations });
});


/** GET /[id]  =>  { location }
 *
 * Returns { id, username, name, usgsId, decLat, decLong, fish, records }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const location = await Location.get(req.params.id);
  return res.json({ location });
});


/** PATCH /[id] { location }  =>  { location }
 *
 * Data can include:
 *   { name, usgsId, decLat, decLong, fish }
 *
 * Returns { id, username, name, usgsId, decLat, decLong, fish }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(req.body, locationUpdateSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const location = await Location.update(req.params.id, req.body);
  return res.json({ location });
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  await Location.remove(req.params.id);
  return res.json({ deleted: req.params.id });
});


module.exports = router;
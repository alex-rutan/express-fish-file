"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Location = require("../models/location");
const Record = require("../models/record");
const Weather = require("../models/weather");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const locationNewSchema = require("../schemas/locationNew.json");
const locationUpdateSchema = require("../schemas/locationUpdate.json");
const recordNewSchema = require("../schemas/recordNew.json");
const recordUpdateSchema = require("../schemas/recordUpdate.json");


const router = express.Router();


/** POST / { user }  =>  { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});


/** GET /  =>  { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});


/** GET /[username]  =>  { user }
 *
 * Returns { username, firstName, lastName, email, isAdmin, locations, records }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[username] { user }  =>  { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});




/****************** LOCATION ROUTES ********************* */




/** POST /  =>  { location }
 *
 * Authorization required: admin or same-user-as-:username
 * */

router.post("/:username/locations", ensureCorrectUserOrAdmin, async function (req, res, next) {
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

router.get("/:username/locations", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const { onlyShowFavorites } = req.query;
  let locations;

  if (onlyShowFavorites) {
    locations = await Location.findAllUserFavoriteLocations(req.params.username, onlyShowFavorites);
  } else {
    locations = await Location.findAllUserLocations(req.params.username);
  }
  
  return res.json({ locations });
});


/** GET /[id]  =>  { location }
 *
 * Returns { id, username, name, usgsId, decLat, decLong, fish, records }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:username/locations/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
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

router.patch("/:username/locations/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
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

router.delete("/:username/locations/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  await Location.remove(req.params.id);
  return res.json({ deleted: req.params.id });
});




/****************** WEATHER ROUTES ********************* */




router.get("/:username/locations/:id/weather", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const { decLat, decLong } = req.query;
  const currWeather = await Weather.getCurrWeather(decLat, decLong);
  const forecastedWeather = await Weather.getForecastedWeather(decLat, decLong);

  currWeather.highTemp = forecastedWeather[0].highTemp;
  currWeather.lowTemp = forecastedWeather[0].lowTemp;
  currWeather.precipChance = forecastedWeather[0].precipChance;
  currWeather.minTempWeek = forecastedWeather.reduce((acc, day) => {
    acc = day.lowTemp < acc ? day.lowTemp : acc;
    return acc; 
  }, Infinity);

  const weather = { 
    current: currWeather, 
    forecast: forecastedWeather 
  };

  return res.json({ weather });
})




/****************** RECORD ROUTES ********************* */




/** POST /  =>  { record }
 *
 * Authorization required: admin or same-user-as-:username
 * */

router.post("/:username/records", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(req.body, recordNewSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const record = await Record.create(req.body);
  return res.status(201).json({ record });
});


/** GET /  =>  { records: [{ id, username, locationId, date, rating, description, flies, flow, waterTemp, pressure, weather, highTemp, lowTemp }, ...] }
 *
 * Returns list of all records for a user.
 **/

router.get("/:username/records", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const records = await Record.findAllUserRecords(req.params.username);
  return res.json({ records });
});


/** GET /  =>  { records: [{ id, username, locationId, date, rating, description, flies, flow, waterTemp, pressure, weather, highTemp, lowTemp }, ...] }
 *
 * Returns list of all records for a location.
 **/

router.get("/:username/locations/:id/records", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const records = await Record.findAllLocationRecords(req.params.id);
  return res.json({ records });
});


/** GET /[id]  =>  { record }
 *
 * Returns { id, username, locationId, date, rating, description, flies, flow, waterTemp, pressure, weather, highTemp, lowTemp }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:username/records/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const record = await Record.get(req.params.id);
  return res.json({ record });
});


/** PATCH /[id] { record }  =>  { record }
 *
 * Data can include:
 *   { locationId, date, rating, description, flies, flow, waterTemp, pressure, weather, highTemp, lowTemp }
 *
 * Returns { id, username, locationId, date, rating, description, flies, flow, waterTemp, pressure, weather, highTemp, lowTemp }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch("/:username/records/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  const validator = jsonschema.validate(req.body, recordUpdateSchema);
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const record = await Record.update(req.params.id, req.body);
  return res.json({ record });
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username/records/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  await Record.remove(req.params.id);
  return res.json({ deleted: req.params.id });
});


module.exports = router;
"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError
} = require("../expressError");


/** Related functions for records. */

class Record {

  /** Create record.
   *
   * Returns record: { id, username, locationId, date, rating, description, flies, flow, waterTemp, pressure, weather, highTemp, lowTemp }
   *
   * Throws NotFoundError if location doesn't exist in db and BadRequestError on duplicates.
   **/
  static async create(
    { username, locationId, date, rating, description, flies, flow, waterTemp, pressure, weather, highTemp, lowTemp }) {
    // TODO: do I need to create a user check??  
    // make sure user exists
    // const userCheck = await db.query(
    //   `SELECT username
    //   FROM users
    //   WHERE username = $1`, [username]);
    // const user = userCheck.rows[0];

    // if (!user) throw new NotFoundError(`No username: ${username}`);

    // make sure location exists
    const locationCheck = await db.query(
      `SELECT id
           FROM locations
           WHERE id = $1`, [locationId]);
    const location = locationCheck.rows[0];

    if (!location) throw new NotFoundError(`No location: ${locationId}`);

    // make sure there isn't a duplicate record for this location and date
    const duplicateCheck = await db.query(
      `SELECT id
      FROM records
      WHERE location_id = $1 AND date = $2`,
      [locationId, date],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate record for user: Location Id ${locationId} on ${date}`);
    }

    const result = await db.query(
      `INSERT INTO records
           (username,
            location_id,
            date,
            rating,
            description,
            flies,
            flow,
            water_temp,
            pressure,
            weather,
            high_temp,
            low_temp)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, username, location_id AS "locationId", date, rating, description, flies, flow, water_temp AS "waterTemp", pressure, weather, high_temp AS "highTemp", low_temp AS "lowTemp"`,
      [
        username, 
        locationId, 
        date, 
        rating, 
        description, 
        flies, 
        flow,
        waterTemp, 
        pressure, 
        weather, 
        highTemp, 
        lowTemp
      ],
    );

    const record = result.rows[0];

    return record;
  }


  /** Find all user's records.
   *
   * Returns [{ id, username, locationId, date, rating, description, flies, flow, waterTemp, pressure, weather, highTemp, lowTemp }, ...]
   **/
  static async findAllUserRecords(username) {
    const result = await db.query(
      `SELECT id, 
              username, 
              location_id AS "locationId", 
              date, 
              rating, 
              description, 
              flies,
              flow, 
              water_temp AS "waterTemp", 
              pressure, weather, 
              high_temp AS "highTemp", 
              low_temp AS "lowTemp
      FROM records
      WHERE username = $1
      ORDER BY id`, [username]
    );

    return result.rows;
  }


  /** Given an id, return data about record.
   *
   * Returns { id, username, locationId, date, rating, description, flies, flow, waterTemp, pressure, weather, highTemp, lowTemp }
   *
   * Throws NotFoundError if record not found.
   **/
  static async get(id) {
    const result = await db.query(
      `SELECT SELECT id, 
              username, 
              location_id AS "locationId", 
              date, 
              rating, 
              description, 
              flies,
              flow, 
              water_temp AS "waterTemp", 
              pressure, weather, 
              high_temp AS "highTemp", 
              low_temp AS "lowTemp
      FROM records
      WHERE id = $1`,
      [id],
    );

    const record = result.rows[0];

    if (!record) throw new NotFoundError(`No record with Id: ${id}`);

    return record;
  }


  /** Update record data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { locationId, date, rating, description, flies, flow, waterTemp, pressure, weather, highTemp, lowTemp }
   *
   * Returns { id, username, locationId, date, rating, description, flies, flow, waterTemp, pressure, weather, highTemp, lowTemp }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        locationId: "location_id",
        waterTemp: "water_temp",
        highTemp: "high_temp",
        lowTemp: "low_temp"
      });

    // data can't include id, so must build a variable index for it
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE records 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                      username, 
                      location_id AS "locationId", 
                      date, 
                      rating, 
                      description, 
                      flies,
                      flow, 
                      water_temp AS "waterTemp", 
                      pressure, 
                      weather, 
                      high_temp AS "highTemp", 
                      low_temp AS "lowTemp"`;
    const result = await db.query(querySql, [...values, id]);
    const record = result.rows[0];

    if (!record) throw new NotFoundError(`No record with Id: ${id}`);

    return record;
  }

  /** Delete given record from database; returns undefined. */

  static async remove(id) {
    let result = await db.query(
      `DELETE
      FROM records
      WHERE id = $1
      RETURNING id`,
      [id],
    );
    const record = result.rows[0];

    if (!record) throw new NotFoundError(`No record with Id: ${id}`);
  }
}


module.exports = Record;
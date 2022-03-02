"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");


/** Related functions for locations. */

class Location {

  /** Create location.
   *
   * Returns location: { id, username, name, usgsId, decLat, decLong, fish }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async create(
    { username, name, usgsId, decLat, decLong, fish }) {
    // TODO: do I need to create a user check??  
    // make sure user exists
    // const userCheck = await db.query(
    //   `SELECT username
    //   FROM users
    //   WHERE username = $1`, [username]);
    // const user = userCheck.rows[0];

    // if (!user) throw new NotFoundError(`No username: ${username}`);

    const duplicateCheck = await db.query(
      `SELECT name
      FROM locations
      WHERE username = $1 AND name = $2`,
      [username, name],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate location for user: ${name}`);
    }

    const result = await db.query(
      `INSERT INTO locations
           (username,
            name,
            usgs_id,
            dec_lat,
            dec_long,
            fish)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, name, usgs_id AS "usgsId", dec_lat AS "decLat", dec_long AS "decLong, fish"`,
      [
        username, 
        name,
        usgsId, 
        decLat, 
        decLong, 
        fish
      ],
    );

    const location = result.rows[0];

    return location;
  }

  /** Find all user's locations.
   *
   * Returns [{ id, username, name, usgsId, decLat, decLong, fish, records }, ...]
   **/

  static async findAllUserLocations(username) {
    const result = await db.query(
      `SELECT id,
              username,
              name,
              usgs_id AS "usgsId",
              dec_lat AS "decLat",
              dec_long AS "decLong",
              fish
      FROM locations
      WHERE username = $1
      ORDER BY name`, [username]
    );

    for (const row of result.rows) {
      const locationRecordsRes = await db.query(
        `SELECT r.id
        FROM records AS r
        WHERE r.location_id = $1`, [row.id]
      );

      row.records = locationRecordsRes.rows.map(r => r.id);
    }

    return result.rows;
  }

  /** Given an id, return data about location.
   *
   * Returns { id, username, name, usgsId, decLat, decLong, fish, records }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(id) {
    const locationRes = await db.query(
      `SELECT id,
              username,
              name,
              usgs_id AS "usgsId",
              dec_lat AS "decLat",
              dec_long AS "decLong",
              fish
      FROM locations
      WHERE id = $1`,
      [id],
    );

    const location  = locationRes.rows[0];

    if (!location ) throw new NotFoundError(`No location with locationId: ${id}`);

    // query for and add user's records to the user object
    const locationRecordsRes = await db.query(
      `SELECT r.id
      FROM records AS r
      WHERE r.location_id = $1`, [id]);

    location.records = locationRecordsRes.rows.map(r => r.id);

    return location;
  }

  /** Update location data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { name, usgsId, decLat, decLong, fish }
   *
   * Returns { id, username, name, usgsId, decLat, decLong, fish }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        usgsId: "usgs_id",
        decLat: "dec_lat",
        decLong: "dec_long",
      });

    // data can't include id, so must build a variable index for it
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE locations 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                username,
                                name,
                                usgs_id AS "usgsId",
                                dec_lat AS "decLat",
                                dec_long AS "decLong",
                                fish`;
    const result = await db.query(querySql, [...values, id]);
    const location = result.rows[0];

    if (!location) throw new NotFoundError(`No location with locationId: ${id}`);

    return location;
  }

  /** Delete given location from database; returns undefined. */

  static async remove(id) {
    let result = await db.query(
      `DELETE
      FROM locations
      WHERE id = $1
      RETURNING name`,
      [id],
    );
    const location = result.rows[0];

    if (!location) throw new NotFoundError(`No location with LocationId: ${id}`);
  }
}


module.exports = Location;
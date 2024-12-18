import { Hono } from "hono";
import { Location } from "../classes.ts";
import { sql } from "../main.ts";

const app = new Hono()
  .post("/", async (c) => {
    const body = await c.req.json();

    const [response] = await sql`
      INSERT INTO locations (name, lon, lat) 
      VALUES (${body.name}, ${body.lon}, ${body.lat})
      RETURNING id, name, lon, lat;
    `;

    return c.json({
      message: "Location successfully added!",
      newLocation: {
        id: response.id,
        name: response.name,
        lon: response.lon,
        lat: response.lat,
      },
    }, 201)
  })
  .get("/", async (c) => {
    const results = await sql`SELECT * FROM locations`;

    return c.json({
      message: "Locations successfully retrieved!",
      locations: results,
    }, 200)
  });

export default app;



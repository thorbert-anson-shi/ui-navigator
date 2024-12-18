import { Hono } from "hono";
import { Path } from "../classes.ts";
import { sql } from "../main.ts";

const app = new Hono()
  .post("/", async (c) => {
    const body = await c.req.json();

    const path = body.coordinates;

    return c.json(
      {
        message: "Path added successfully",
        id: path.id,
        distance: path.distance
      }
    );
  });

export default app;
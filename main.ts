import "jsr:@std/dotenv/load";
import { neon } from "jsr:@neon/serverless";

import { Hono } from "hono";
import locations from "./routes/locations.ts";
import paths from "./routes/paths.ts";

// Create instance of connection to database
export const sql = neon(Deno.env.get("DATABASE_URL"));

// Create app + router
const app = new Hono();

app.get("/", (c) => c.json({
  description: "UI Navigator is an API built to find the fastest route between any two points at the University of Indonesia.",
  availableEndpoints: availableEndpoints
}))

app.route("/locations", locations);
app.route("/paths", paths);

const availableEndpoints = app.routes.map((endpoint) => ({ method: endpoint.method, path: endpoint.path }));

app.onError((err, c) => {
  return c.json({
    message: `An internal server error has occurred: ${err}`,
  }, 500);
})

app.notFound((c) => {
  return c.json({
    message: "Page not found",
    availableEndpoints: availableEndpoints,
  }, 404);
});

Deno.serve(app.fetch);
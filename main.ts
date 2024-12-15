import { Hono } from "hono";
import { Location, Path } from "./data.ts";

const app = new Hono();

app.post("/add-location", async (c) => {
  const body = await c.req.json();
  const location = new Location(body.name, body.lat, body.lon);
  return c.text("Location added: " + location.id);
});

app.post("/add-path", async (c) => {
  const body = await c.req.json();
  const path = new Path(body.loc1, body.loc2, body.distance);
  return c.text("Path added: " + path.id);
});

app.notFound((c) => {
  return c.json({
    error: "Page not found",
    status: 404,
    availableEndpoints: app.routes.map((endpoint) =>
      endpoint.method + " " + c.req.header("Host")! + endpoint.path
    ),
  });
});

Deno.serve(app.fetch);

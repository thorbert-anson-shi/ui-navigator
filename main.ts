import { Hono } from "hono";
import { Location, Path } from "./data.ts";

const app = new Hono();

const kv = await Deno.openKv();

app.get("/", (c) =>
  c.json({
    description:
      "UI Navigator is an API built to find the fastest route between any two points at the University of Indonesia.",
    availableEndpoints: availableEndpoints,
  }));

app.post("/add-location", async (c) => {
  const body = await c.req.json();
  const location = new Location(body.name, body.lat, body.lon);
  // kv.set(["location", location.lat, location.lon], location);
  return c.json(
    {
      message: "Location added successfully",
      location: location.name,
      lat: location.lat,
      lon: location.lon,
    },
    200,
  );
});

app.post("/add-path", async (c) => {
  const body = await c.req.json();
  const path = new Path(body.loc1, body.loc2, body.distance);
  // kv.set(["path", path.id], path);
  return c.json(
    {
      message: "Path added successfully",
      id: path.id,
      endpoints: path.endpoints.values().map((endpoint) => endpoint.name),
      distance: path.distance,
    },
  );
});

const availableEndpoints = app.routes.map((endpoint) => ({
  method: endpoint.method,
  path: endpoint.path,
}));

app.notFound((c) => {
  return c.json({
    message: "Page not found",
    availableEndpoints: availableEndpoints,
  }, 404);
});

Deno.serve(app.fetch);

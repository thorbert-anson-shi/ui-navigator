import { Hono } from "hono";
import { Location, Path } from "./data.ts";

const app = new Hono();

app.get("/", (c) => c.json({
  description: "UI Navigator is an API built to find the fastest route between any two points at the University of Indonesia.",
  availableEndpoints: availableEndpoints
}))

// TODO: Fix add-location endpoint
app.post("/add-location", async (c) => {
  const body = await c.req.json();
  const location = new Location(body.name, body.lat, body.lon);
  return c.json(
    {
      message: "Location added successfully",
      location: location.name,
      lat: location.lat,
      lon: location.lon,
    }, 200
  );
});

// TODO: Fix add-path endpoint
app.post("/add-path", async (c) => {
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

const availableEndpoints = app.routes.map((endpoint) => ({ method: endpoint.method, path: endpoint.path }));

app.notFound((c) => {
  return c.json({
    message: "Page not found",
    availableEndpoints: availableEndpoints,
  }, 404);
});

Deno.serve(app.fetch);

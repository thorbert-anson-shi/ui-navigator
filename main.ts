import { Hono } from 'hono';
import { Location, Path } from './data.ts';

const app = new Hono()

app.post('/add-location', async (c) => {
    const body = await c.req.json();
    const location = new Location(body.name, body.lat, body.lon);
    return c.text("Location added: " + location.id);
})

Deno.serve(app.fetch)

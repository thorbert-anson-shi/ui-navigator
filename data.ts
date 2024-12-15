export class Location {
  id: string = crypto.randomUUID();
  name: string;
  lat: number;
  lon: number;

  constructor(name: string, lat: number, lon: number) {
    this.name = name;
    this.lat = lat;
    this.lon = lon;
  }
}

export class Path {
  id: string = crypto.randomUUID();
  endpoints: Set<Location>;
  distance: number;

  constructor(loc1: Location, loc2: Location, distance: number) {
    this.endpoints = new Set<Location>();
    this.endpoints.add(loc1);
    this.endpoints.add(loc2);
    this.distance = distance;
  }
}

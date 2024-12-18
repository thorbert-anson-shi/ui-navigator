export class Location {
  name: string;
  lat: number;
  lon: number;

  /**
   * Constructs a new Location object.
   * @param name The name of the location.
   * @param lat The latitude coordinate of the location.
   * @param lon The longitude coordinate of the location.
   */
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

  /**
   * Construct a new Path object.
   * @param loc1 the first location this path connects
   * @param loc2 the second location this path connects
   * @param distance the distance between the two locations
   */
  constructor(loc1: Location, loc2: Location, distance: number) {
    this.endpoints = new Set<Location>();
    this.endpoints.add(loc1);
    this.endpoints.add(loc2);
    this.distance = distance;
  }
}
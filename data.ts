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

/**
 * A function that takes a number of points, and simplifies the path between the two ends
 * using the Ramer-Douglas-Peucker algorithm
 * @param points - A 2D array consisting of coordinates in the form `[x, y]`
 * @param epsilon - The error term that decides whether a point is too far away from the simplified path
 * @returns a 2D array consisting of the simplified version of the path
 */
function simplifyPath(points: number[][], epsilon: number): number[][] {
  if (points.length < 2) {
    throw new Error("A path must consist of at least 2 points");
  }

  const start = points[0];
  const end = points[points.length - 1];

  let maxDistIndex = 0;
  let maxDist: number = Number.MIN_VALUE;

  for (let i = 1; i < points.length - 1; i++) {
    const newDist = perpendicularDistance(points[i], [start, end]);

    if (newDist > maxDist) {
      maxDistIndex = i;
      maxDist = newDist;
    }
  }

  console.log("Max dist between " + start.toString() + " and " + end.toString() + " is " + maxDist)

  if (maxDist > epsilon) {
    const left = simplifyPath(points.slice(0, maxDistIndex + 1), epsilon);
    const right = simplifyPath(points.slice(maxDistIndex), epsilon);

    return left.concat(right.slice(1));
  } else {
    return [start, end]
  }
}

/**
 * #### DEPRECATED - Use perpendicularDistance() instead
 * 
 * Calculates the perpendicular distance from a point to a line segment in a 2D space.
 * 
 * @param point - An array containing two numbers representing the x and y coordinates of the point.
 * @param ends - A 2D array consisting of two points, each represented by an array with two numbers (x and y coordinates).
 * @returns The perpendicular distance from the point to the line segment.
 * 
 * @throws Will throw an error if the input point does not have exactly two numbers or if the line
 *         does not consist of exactly two distinct endpoints, each with two numbers.
 * 
 * The function handles special cases where the line is vertical or horizontal by calculating
 * the distance directly based on the point's deviation along the corresponding axis.
 * Otherwise, it computes the perpendicular distance using the slope-intercept form of the line
 * and the perpendicular line equation intersecting the point.
 */
function distFromLine(point: number[], ends: number[][]): number {
  if (
    point.length !== 2 || ends.length !== 2 || ends[0].length !== 2 ||
    ends[1].length !== 2
  ) {
    throw new Error(
      "Invalid input: point must be an array of two numbers and line must be an array of two points.",
    );
  }

  const [x1, y1] = ends[0];
  const [x2, y2] = ends[1];
  const [xt, yt] = point;

  if (x1 === x2 && y1 === y2) {
    throw new Error(
      "Invalid line: endpoints of the line must not be the same.",
    );
  }

  if (y1 === y2) {
    return Math.abs(yt - y1);
  } else if (x1 === x2) {
    return Math.abs(xt - x1);
  }

  // Find equation of first line
  const slope = (y2 - y1) / (x2 - x1);
  const c = y1 - slope * x1;

  // Find equation of perpendicular line
  const perpSlope = -1 / slope;
  const cPerp = yt - perpSlope * xt;

  // Find point of intersection
  const xi = (cPerp - c) / (slope - perpSlope);
  const yi = slope * xi + c;

  // Return euclidean distance of the target point and the intersection
  return Math.sqrt((xt - xi) ** 2 + (yt - yi) ** 2);
}

/**
 * Calculates the perpendicular distance from a point to a line segment in a 2D space.
 *
 * @param point - An array containing two numbers representing the x and y coordinates of the point.
 * @param ends - A 2D array consisting of two points, each represented by an array with two numbers (x and y coordinates),
 *               defining the endpoints of the line segment.
 * @returns The perpendicular distance from the point to the line segment.
 * 
 * @throws Will throw an error if the input point does not have exactly two numbers or if the line
 *         does not consist of exactly two distinct endpoints, each with two numbers.
 */
function perpendicularDistance(point: number[], ends: number[][]): number {
  const [x1, y1] = ends[0];
  const [x2, y2] = ends[1];
  const [xt, yt] = point;

  const numerator = Math.abs(xt * (y1 - y2) + yt * (x2 - x1) + (x1 * y2) - (x2 * y1));
  const denominator = Math.sqrt((y1 - y2) ** 2 + (x1 - x2) ** 2);

  return numerator / denominator;
}

const simplifiedPath = simplifyPath([
  [3, 0], [1, 1], [3, 2], [4, 3], [2, 4], [3, 5]
], 1e-30);

simplifiedPath.forEach((point, index) => {
  console.log(index + ". [" + point[0] + ", " + point[1] + "]");
})

// Ambient type shims for d3-geo / topojson-client / world-atlas — loaded via tsconfig include, not imported.
declare module "d3-geo" {
  export interface GeoProjection {
    (coordinates: readonly [number, number]): [number, number] | null;
    fitExtent(extent: readonly [readonly [number, number], readonly [number, number]], object: unknown): GeoProjection;
  }

  export function geoNaturalEarth1(): GeoProjection;
  export function geoPath(projection: GeoProjection): (object: unknown) => string | null;
}

declare module "topojson-client" {
  export function feature(topology: unknown, object: unknown): unknown;
}

declare module "topojson-specification" {
  export interface Topology {
    objects: Record<string, unknown>;
  }

  export interface GeometryCollection {
    type?: "GeometryCollection";
  }
}

declare module "geojson" {
  export interface FeatureCollection {
    type?: "FeatureCollection";
    features?: unknown[];
  }
}

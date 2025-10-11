// Location entity (already in locationApi.ts, but should be here)
export interface Location {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  workingHours?: string;
  description?: string;
}
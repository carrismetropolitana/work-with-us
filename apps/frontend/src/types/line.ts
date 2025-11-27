export interface Line {
  id: string;
  short_name: string;
  long_name: string;
  color: string;
  text_color: string;
  tts_name: string;
  facilities: string[];
  district_ids: string[];
  municipality_ids: string[];
  locality_ids: string[];
  region_ids: string[];
  route_ids: string[];
  pattern_ids: string[];
  stop_ids: string[];
  url?: string;
}

export interface Favorite extends Line {
  _id?: string;
  createdAt: number;
  operationalDate: string;
  lineId: string;
}
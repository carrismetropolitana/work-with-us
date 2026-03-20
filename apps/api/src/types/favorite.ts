import { ObjectId } from "mongodb";

export interface FavoriteDocument {
    _id?: ObjectId;
    line_id: string;
    createdAt: number;
    operationalDate: string;
  }
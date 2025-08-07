import * as mongodb from "mongodb";

export interface Employee {
  first_name: string;
  last_name: string;
  date_of_joining: string;
  years_of_experience: number;
  background_info: string;
  departments?: string[];
  _id?: mongodb.ObjectId | string;
}

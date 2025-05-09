import mongoose from "mongoose";

export interface User {
  _id?: mongoose.Schema.Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
}

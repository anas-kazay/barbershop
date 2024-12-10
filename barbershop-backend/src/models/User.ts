import { UserRole } from "./UserRole";
import { WorkingSchedule } from "./WorkingSchedule";
import mongoose, { Document, Schema } from "mongoose";

// User interface for MongoDB with Mongoose
export interface User extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  profilePicture?: string;
  portfolio?: string[];
  workingSchedule?: WorkingSchedule[];
}

// Mongoose Schema for User
const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: false },
    role: { type: String, enum: Object.values(UserRole), required: true },
    profilePicture: { type: String },
    portfolio: { type: [String], default: undefined },
    workingSchedule: {
      type: [
        {
          dayOfWeek: { type: Number, required: false },
          startTime: { type: String, required: false },
          endTime: { type: String, required: false },
          isWorking: { type: Boolean },
        },
      ],
      default: undefined,
    },
  },
  { timestamps: true }
);

// Map _id to id for Mongoose documents (this allows you to use `id` instead of `_id` in the returned data)
userSchema.virtual("id").get(function (this: any) {
  return this._id.toHexString();
});

// Ensure virtuals are included in toJSON output
userSchema.set("toJSON", {
  virtuals: true,
});

// Create and export the model
const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;

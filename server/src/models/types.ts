import {Types} from "mongoose";

export interface ISchema {
    _id: Types.ObjectId;
}

/**
 * Add onto an interface if timestamps is true,
 * and left with default named fields
 */
export interface ITimeStamps {
    createdAt: Date;
    updatedAt: Date;
}

import mongoose from "mongoose";
import { usersModel } from "./models/users.model.js";

export class UsersMongoDAO {
    constructor() {
    }

    async get(filter = {}) {
        if(filter["_id"] && !mongoose.Types.ObjectId.isValid(filter["_id"]))
            throw new Error('Invalid user ID.');

        return await usersModel.find(filter);
    }

    async create(user) {
        return await usersModel.create(user);
    }

    async update(id, user) {
        if(!mongoose.Types.ObjectId.isValid(id))
            throw new Error('Invalid user ID.');

        return await usersModel.updateOne({_id: id}, {$set: changes});
    }

}
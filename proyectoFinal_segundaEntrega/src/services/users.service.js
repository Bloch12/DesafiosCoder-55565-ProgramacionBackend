import { UsersMongoDAO as DAO } from "../dao/userMongoDAO.js";

class UsersService {
    constructor(dao) {
        this.dao = new dao();
    }

    async getUsers() {
        return await this.dao.get()
    }

    async getUserById(id) {
        return await this.dao.get({_id:id})
    }

    async getUserByEmail(email) {
        return await this.dao.get({email})
    }

    async createUser(name, email) {
        return await this.dao.create({name, email})
    }

    async checkUserCredentials(email, password) {
        const user = await this.dao.get({email, password});
        return user ? user[0] : null;
    }

    async updateUser(id, changes) {
        return await this.dao.update(id, changes);
    }
}

export const usersService = new UsersService(DAO);
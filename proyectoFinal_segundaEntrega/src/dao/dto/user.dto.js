import { createPassword } from "../../utils/util.js";

export default class UserDTO{
    constructor(user) {
        const { first_name, last_name, email, age, password } = user;
    
        if (!first_name || !last_name || !email || !age)
            throw new Error("Missing data");
        
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.age = parseInt(age);
        this.password = password ? createPassword(password): null;
    }
}
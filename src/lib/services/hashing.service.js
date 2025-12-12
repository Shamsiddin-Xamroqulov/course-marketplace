import bcrypt from "bcrypt";

const hashService = {
    hashingPassword: (password) => bcrypt.hash(password, 10),
    comparePassword: (password, hashPassword) => bcrypt.compare(password, hashPassword)
};

export default hashService;
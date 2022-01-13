import { checkPassword, hashPassword } from './../utils/crypt';

import jwt from "jsonwebtoken";
import UserRepositories from '../db/repositories/UserReponsitories'
import env from '../config/env';
import { getUserIdFromReq, isAuthenticated } from '../utils/isAuthenticated';
class User {

}

const UserController = new User();

export default UserController;

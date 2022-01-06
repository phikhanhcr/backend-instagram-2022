import axios from "axios";
import { errorLog } from "../../../utils/logger";
import jwt from 'jsonwebtoken'
import UserRepositories from '../../../db/repositories/UserReponsitories';

class Login {
  public isExistingIdUser = (id: string) => {
    return UserRepositories.get(id).then((r) => r);
  }
}

const LoginPresenter = new Login();

export default LoginPresenter;

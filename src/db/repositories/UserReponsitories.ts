import { errorLog } from "../../utils/logger";
import { promiseNull } from "../../utils/rowRecord";
import { ICrud } from "../contracts/ICrud";
import User from "../models/User/UserModel";

interface IUserFilterType {
  username?: string;
  ids?: string,
  email?: string
}

const getCondition = (filter: IUserFilterType) => {
  let condition = {};
  if (filter.username) {
    condition = Object.assign(condition, {
      username: new RegExp(filter.username, "i"),
    });
  }

  if (filter.email) {
    condition = Object.assign(condition, {
      email: new RegExp(filter.email, "i"),
    });
  }

  if (filter.ids) {
    condition = Object.assign(condition, { _id: filter.ids });
  }

  return condition;
};

class UserRepository implements ICrud {
  public create = (data: any) => {
    try {
      return User.create(data);
    } catch (e) {
      errorLog(`User::create ${e.message}`);
      return promiseNull();
    }
  };

  public delete = (id: string) => {
    try {
      return User.findByIdAndRemove(id);
    } catch (e) {
      errorLog(`User::delete ${e.message}`);
      return promiseNull();
    }
  };

  public get = (id: string) => {
    try {
      return User.findById(id, { password: 0, password_old: 0 });
    } catch (e) {
      errorLog(`User::find ${e.message}`);
      return promiseNull();
    }
  };

  public update = (data: any) => {
    try {
      return User.findByIdAndUpdate(data.user_id, data, { new: true });
    } catch (e) {
      errorLog(`User::update ${e.message}`);
      return promiseNull();
    }
  };

  public findByEmail = (email: string) => {
    try {
      return User.findOne({ email }, { password: 0, password_old: 0 });
    } catch (e) {
      errorLog(`User::findByEmail ${e.message}`);
      return promiseNull();
    }
  };




  public count = (filter: IUserFilterType) => {
    try {
      const condition = getCondition(filter);
      if (JSON.stringify(condition) === JSON.stringify({})) {
        return User.estimatedDocumentCount();
      } else {
        return User.countDocuments(condition);
      }
    } catch (e) {
      errorLog(`User::count ${e.message}`);
      return promiseNull();
    }
  };

  public getAllData = () => {
    try {
      return User.find().then((data) => {
        return data;
      });
    } catch (e) {
      errorLog(`User::getAllData ${e.message}`);
      return promiseNull();
    }
  };

  public getPasswordByEmail = (email: string) => {
    try {
      return User.findOne({ email });
    } catch (e) {
      errorLog(`AdSellLeaseComment::getPasswordByEmail ${e.message}`);
      return promiseNull();
    }
  };

  public getPasswordByUserName = (username: string) => {
    try {
      return User.findOne({ username });
    } catch (e) {
      errorLog(`AdSellLeaseComment::getPasswordByEmail ${e.message}`);
      return promiseNull();
    }
  };

  public getPasswordById = (id: string) => {
    try {
      return User.findById(id);
    } catch (e) {
      errorLog(`AdSellLeaseComment::getPasswordById ${e.message}`);
      return promiseNull();
    }
  };
}

const UserRepositoryPresenter = new UserRepository();
export default UserRepositoryPresenter;

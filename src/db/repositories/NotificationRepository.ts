import { errorLog } from "../../utils/logger";
import { promiseNull } from "../../utils/rowRecord";
import { ICrud } from "../contracts/ICrud";
import Notification from "../models/Notification";

interface INotificationFilterType {
  user_id?: string;
  ids?: string,
}

const getCondition = (filter: INotificationFilterType) => {
  let condition = {};
  if (filter.user_id) {
    condition = Object.assign(condition, { user_id: filter.user_id });
  }

  if (filter.ids) {
    condition = Object.assign(condition, { _id: filter.ids });
  }

  return condition;
};

class NotificationRepository implements ICrud {
  public create = (data: any) => {
    try {
      return Notification.create(data);
    } catch (e) {
      errorLog(`Notification::create ${e.message}`);
      return promiseNull();
    }
  };

  public delete = (id: string) => {
    try {
      return Notification.findByIdAndRemove(id);
    } catch (e) {
      errorLog(`Notification::delete ${e.message}`);
      return promiseNull();
    }
  };

  public get = (id: string) => {
    try {
      return Notification.findById(id)
        .populate('sender', 'avatar username')
        .populate('receiver', 'avatar username')
        .then((data) => {
          return data;
        });
    } catch (e) {
      errorLog(`Notification::find ${e.message}`);
      return promiseNull();
    }
  };

  public getMyNotify = (id: string) => {
    try {
      return Notification.find({ receiver: id })
        .populate('sender', 'avatar username')
        .then((data) => {
          return data;
        });
    } catch (e) {
      errorLog(`Notification::find ${e.message}`);
      return promiseNull();
    }
  };

  public update = (data: any) => {
    try {
      return Notification.findByIdAndUpdate(data.Notification_id, data, { new: true });
    } catch (e) {
      errorLog(`User::update ${e.message}`);
      return promiseNull();
    }
  };


  public deleteAll = (userId) => {
    try {
      return Notification.deleteMany({ receiver: userId });

    } catch (e) {
      errorLog(`User::update ${e.message}`);
      return promiseNull();
    }
  };

  public markAllRead = (userId) => {
    try {
      return Notification.updateMany({ receiver: userId, seen: false }, { "$set": { "seen": true } });

    } catch (e) {
      errorLog(`User::update ${e.message}`);
      return promiseNull();
    }
  };

  // public count = (filter: INotificationFilterType) => {
  //   try {
  //     const condition = getCondition(filter);
  //     if (JSON.stringify(condition) === JSON.stringify({})) {
  //       return Notification.estimatedDocumentCount();
  //     } else {
  //       return Notification.countDocuments(condition);
  //     }
  //   } catch (e) {
  //     errorLog(`Notification::count ${e.message}`);
  //     return promiseNull();
  //   }
  // };



}

const NotificationRepositoryPresenter = new NotificationRepository();
export default NotificationRepositoryPresenter;

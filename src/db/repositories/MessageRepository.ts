import { errorLog } from "../../utils/logger";
import { promiseNull } from "../../utils/rowRecord";
import Message from "../models/Message";

class MessageRepository {
  public create = (data: any) => {
    try {
      return Message.create(data);
    } catch (e) {
      errorLog(`Message::create ${e.message}`);
      return promiseNull();
    }
  };

  static delete = (id: string) => {
    try {
      return Message.findByIdAndRemove(id);
    } catch (e) {
      errorLog(`Message::delete ${e.message}`);
      return promiseNull();
    }
  };

  public get = (id: string) => {
    try {
      return Message.findById(id).populate('reply_to', 'username');
    } catch (e) {
      errorLog(`Message::find ${e.message}`);
      return promiseNull();
    }
  };

  public update = (data: any) => {
    try {
      return Message.findByIdAndUpdate(data.Message_id, data, { new: true });
    } catch (e) {
      errorLog(`User::update ${e.message}`);
      return promiseNull();
    }
  };

  public getMyMessage = (conversationId: string) => {
    try {
      return Message.find({
        conversationId: conversationId
      })
      .limit(10)
      .sort({ created_at: -1 })
    } catch (error) {
      console.log({ error })
    }
  }

  public getMoreMessage = (conversationId: string, lastDate) => {
    try {
      return Message.find({
        conversationId,
        created_at: {
          $lt: new Date(lastDate).toISOString(),
        }
      })
      .limit(20)
      .sort({ created_at: -1 })
    } catch (error) {
      console.log({ error })
    }
  }

  public getMyList = (senderId: string) => {
    try {

    } catch (error) {
      console.log({ error })
    }
  }
}

const MessageRepositoryPresenter = new MessageRepository();
export default MessageRepositoryPresenter;

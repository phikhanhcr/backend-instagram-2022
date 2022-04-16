import { errorLog } from "../../utils/logger";
import { promiseNull } from "../../utils/rowRecord";
import Conversation from "../models/Conversation";

class ConversationRepository {
  public create = (data: any) => {
    try {
      return Conversation.create(data);
    } catch (e) {
      errorLog(`Conversation::create ${e.Conversation}`);
      return promiseNull();
    }
  };

  public delete = (id: string) => {
    try {
      return Conversation.findByIdAndDelete(id);
    } catch (e) {
      errorLog(`Conversation::delete ${e.Conversation}`);
      return promiseNull();
    }
  };

  public get = (id: string) => {
    try {
      return Conversation.findById(id);
    } catch (e) {
      errorLog(`Conversation::find ${e.Conversation}`);
      return promiseNull();
    }
  };

  public update = (id: string, data) => {
    try {
      return Conversation.findByIdAndUpdate(id, data, { new: true });
    } catch (e) {
      errorLog(`User::update ${e.Conversation}`);
      return promiseNull();
    }
  };

  public getMyConversation = (userId: string) => {
    try {
      return Conversation.find({
        members: { $in: [userId] },
      }).populate("members", 'username avatar')
    } catch (error) {
      console.log({ error })
    }
  }
}

const ConversationRepositoryPresenter = new ConversationRepository();
export default ConversationRepositoryPresenter;

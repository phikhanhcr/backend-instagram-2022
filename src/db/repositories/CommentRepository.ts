import { errorLog } from "../../utils/logger";
import { promiseNull } from "../../utils/rowRecord";
import { ICrud } from "../contracts/ICrud";
import Comment from "../models/Comment";

interface ICommentFilterType {
  post_id?: string;
  ids?: string,
}

const getCondition = (filter: ICommentFilterType) => {
  let condition = {};
  if (filter.post_id) {
    condition = Object.assign(condition, { post_id: filter.post_id });
  }

  if (filter.ids) {
    condition = Object.assign(condition, { _id: filter.ids });
  }

  return condition;
};

class CommentRepository implements ICrud {
  public create = (data: any) => {
    try {
      return Comment.create(data);
    } catch (e) {
      errorLog(`Comment::create ${e.message}`);
      return promiseNull();
    }
  };

  public delete = (id: string) => {
    try {
      return Comment.findByIdAndRemove(id);
    } catch (e) {
      errorLog(`Comment::delete ${e.message}`);
      return promiseNull();
    }
  };

  public get = (id: string) => {
    try {
      return Comment.findById(id);
    } catch (e) {
      errorLog(`Comment::find ${e.message}`);
      return promiseNull();
    }
  };

  public update = (data: any) => {
    try {
      return Comment.findByIdAndUpdate(data.comment_id, data, { new: true });
    } catch (e) {
      errorLog(`User::update ${e.message}`);
      return promiseNull();
    }
  };

  public count = (filter: ICommentFilterType) => {
    try {
      const condition = getCondition(filter);
      if (JSON.stringify(condition) === JSON.stringify({})) {
        return Comment.estimatedDocumentCount();
      } else {
        return Comment.countDocuments(condition);
      }
    } catch (e) {
      errorLog(`Comment::count ${e.message}`);
      return promiseNull();
    }
  };

  public getAllData = () => {
    try {
      return Comment.find().then((data) => {
        return data;
      });
    } catch (e) {
      errorLog(`Comment::getAllData ${e.message}`);
      return promiseNull();
    }
  };

  public getCommentLv1 = (data: any) => {
    try {
      return Comment.find({
        post_id: data.post_id,
        reply_to: { $eq: "" }
      }, { comment_replied : 0})
        .then((data) => {
          return data;
        });
    } catch (e) {
      errorLog(`Comment::getAllData ${e.message}`);
      return promiseNull();
    }
  }

  public getCommentLv2 = (data: any) => {
    try {
      return Comment.findById(data.comment_id).then((data) => {
        return data.comment_replied;
      });
    } catch (e) {
      errorLog(`Comment::getAllData ${e.message}`);
      return promiseNull();
    }
  }

}

const CommentRepositoryPresenter = new CommentRepository();
export default CommentRepositoryPresenter;

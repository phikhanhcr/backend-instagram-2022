import { errorLog } from "../../utils/logger";
import { promiseNull } from "../../utils/rowRecord";
import { ICrud } from "../contracts/ICrud";
import Post from "../models/Post";
import User from "../models/User/UserModel";

interface IPostFilterType {
  username?: string;
  ids?: string,
}

const getCondition = (filter: IPostFilterType) => {
  let condition = {};
  if (filter.username) {
    condition = Object.assign(condition, {
      username: new RegExp(filter.username, "i"),
    });
  }

  if (filter.ids) {
    condition = Object.assign(condition, { _id: filter.ids });
  }
  return condition;
};



class PostRepository implements ICrud {
  public create = (data: any) => {
    try {
      return Post.create(data);
    } catch (e) {
      errorLog(`Post::create ${e.message}`);
      return promiseNull();
    }
  };

  public delete = (id: string) => {
    try {
      return Post.findByIdAndRemove(id);
    } catch (e) {
      errorLog(`Post::delete ${e.message}`);
      return promiseNull();
    }
  };

  public get = (id: string) => {
    try {
      return Post.findById(id);
    } catch (e) {
      errorLog(`Post::find ${e.message}`);
      return promiseNull();
    }
  };

  public getMyPost = (id: string) => {
    try {
      return Post.find({ userId : id });
    } catch (e) {
      errorLog(`Post::find ${e.message}`);
      return promiseNull();
    }
  };


  public getByType = (data: any) => {
    try {
      return Post.find({
        userId : data.userId,
        type : data.type
      })
    } catch (e) {
      errorLog(`Post::find ${e.message}`);
      return promiseNull();
    }
  };

  public update = (data: any) => {
    try {
      return Post.findByIdAndUpdate(data.post_id, data, { new: true });
    } catch (e) {
      errorLog(`Post::update ${e.message}`);
      return promiseNull();
    }
  };

  public count = (filter: IPostFilterType) => {
    try {
      const condition = getCondition(filter);
      if (JSON.stringify(condition) === JSON.stringify({})) {
        return Post.estimatedDocumentCount();
      } else {
        return Post.countDocuments(condition);
      }
    } catch (e) {
      errorLog(`Post::count ${e.message}`);
      return promiseNull();
    }
  };

  public getAllData = () => {
    try {
      return Post.find().then((data) => {
        return data;
      });
    } catch (e) {
      errorLog(`Post::getAllData ${e.message}`);
      return promiseNull();
    }
  };

  // show up on new feeds
  public getPostFollowing = (me: string) => {
    try {
      // get all user who you are following
      // save redis, limit , 100 
      return User.findById(me).then(data => {
        return data.following;
      }).then(followers => {
        // list user 
        // find their post
        followers.push(me)
        return Post.find({ userId: { $in: followers } })
          .limit(20)
          .then(data => {
            return data;
          }).catch(e => {
            errorLog(`Post::find ${e.message}`);
            return promiseNull();
          })
      }).catch(e => {
        errorLog(`Post::find ${e.message}`);
        return promiseNull();
      })

    } catch (e) {
      errorLog(`Post::find ${e.message}`);
      return promiseNull();
    }
  }


  // full text search description
}

const PostRepositoryPresenter = new PostRepository();
export default PostRepositoryPresenter;

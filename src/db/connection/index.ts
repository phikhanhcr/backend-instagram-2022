// tslint:disable-next-line:no-var-requires
import mongoose from "mongoose";
import env from "../../config/env";
class Connection {
  public connect = () => {
    mongoose.connect(env.database.connection, (error) => {
      if (error) {
        console.log("Error " + error);
      } else {
        console.log("Connected mongodb successfully");
      }
    });
  };
}

const ConnectionPresenter = new Connection();
export default ConnectionPresenter;

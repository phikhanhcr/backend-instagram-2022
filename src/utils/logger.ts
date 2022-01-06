// tslint:disable-next-line:no-var-requires
const fs = require("fs");
import path from "path";
import axios from "axios";
import { yyyy_mm_dd_hh_mi_ss } from "./date";

export const errorLog = (message) => {
  fs.appendFile(path.resolve(process.env.ERROR_LOG), yyyy_mm_dd_hh_mi_ss(new Date()) + ": " + message + "\n", (err) => {
    if (err) {
      throw err;
    }
  });

  if (process.env.ENVIRONMENT == "production") {
    let payload = {
      "text": message.toString(),
      "username": "Ins Backend Bot"
    }
    axios.post(process.env.LOG_WEBHOOK, payload).then(r => {
    }).catch(e => {
      console.log(e.toString())
    })
  }
};

export const accessLog = (message) => {
  fs.appendFile(
    path.resolve(process.env.ACCESS_LOG),
    yyyy_mm_dd_hh_mi_ss(new Date()) + ": " + message + "\n",
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
};

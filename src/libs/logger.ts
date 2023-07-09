import winston from "winston";
import { omit } from "lodash";

const { combine, timestamp, colorize, align, printf, json } = winston.format;

let format: winston.Logform.Format;

format = combine(
  timestamp(),
  colorize(),
  align(),
  printf((info) => {
    return `${info.timestamp} ${info.level} ${info.message} ${JSON.stringify(
      omit(info, ["timestamp", "level", "message"])
    )}`;
  })
);

const logger = winston.createLogger({
  level: "debug",
  format,
  transports: [new winston.transports.Console()],
});

export default logger;

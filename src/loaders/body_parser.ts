import bodyParser from "body-parser";
import cookieParser from 'cookie-parser'
const bodyCookiesParserLoader = app => {
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  app.use(cookieParser("cookie-secret"))
}
export {
  bodyCookiesParserLoader
}
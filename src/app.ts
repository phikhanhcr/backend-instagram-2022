
import { bodyCookiesParserLoader } from './loaders/body_parser'
import { helmetLoader } from './loaders/helmet'
import { corsLoader } from './loaders/cors'
import { configSession } from './loaders/session'
import { initialRouter } from "./routes"
import { Passport as PassportService } from "./utils/passport";
// import { winstonConfig } from './loaders/winston'

const initApp = (app) => {

   // winstonConfig();
   bodyCookiesParserLoader(app);

   helmetLoader(app);
   
   configSession(app);
   
   corsLoader(app);

   PassportService(app);
   
   initialRouter(app);
}

export {
   initApp,
}



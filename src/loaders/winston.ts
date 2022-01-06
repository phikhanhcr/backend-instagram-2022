import {configure, transports, format} from 'winston'

import env from '../config/env'

const winstonConfig = () => {
  configure({
      transports: [
          new transports.Console({
              level: env.log.level,
              handleExceptions: true,
              format:
                  env.node !== 'development'
                      ? format.combine(format.json())
                      : format.combine(format.colorize(), format.simple()),
          }),
      ],
  })
}

export {
  winstonConfig
}

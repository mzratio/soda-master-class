import winston from 'winston'

export default function (name) {
  winston.loggers.add(name, {
    console: {
      colorize: false,
      timestamp: false,
      silent: process.env.SUPPRESS_LOGGER === 'true',
      label: `${name}`,
      level: process.env.LOG_LEVEL || 'info'
    }
  })
  return winston.loggers.get(name)
};

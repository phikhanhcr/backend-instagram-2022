const { join } = require('path')

const getOsEnv = (key) => {
    if (typeof process.env[key] === 'undefined') {
        throw new Error(`Environment variable ${key} is not set.`)
    }

    return process.env[key]
}

const getOsEnvOptional = (key) => {
    return process.env[key]
}

const getPath = (path) => {
    return process.env.NODE_ENV === 'production'
        ? join(process.cwd(), path.replace('src/', 'dist/').slice(0, -3) + '.js')
        : join(process.cwd(), path)
}

const getPaths = (paths) => {
    return paths.map((p) => getPath(p))
}

const getOsPath = (key) => {
    return getPath(getOsEnv(key))
}

const getOsPaths = (key) => {
    return getPaths(getOsEnvArray(key))
}

const getOsEnvArray = (key, delimiter = ',') => {
    return (process.env[key] && process.env[key].split(delimiter)) || []
}

const toNumber = (value) => {
    return parseInt(value, 10)
}

const toBool = (value) => {
    return value === 'true'
}

const normalizePort = (port) => {
    const parsedPort = parseInt(port, 10)
    if (isNaN(parsedPort)) {
        // named pipe
        return port
    }
    if (parsedPort >= 0) {
        // port number
        return parsedPort
    }
    return false
}

export {
    getOsEnv,
    getOsEnvOptional,
    getPath,
    getPaths,
    getOsPath,
    getOsPaths,
    getOsEnvArray,
    toNumber,
    toBool,
    normalizePort,
}

# You can review my code at:
```bash
https://github1s.com/phikhanhcr/backend-instagram-2022
```

env example

ERROR_LOG=src/storage/logs/error.log
ACCESS_LOG=src/storage/logs/access.log
ENVIRONMENT=dev
NODE_ENV=test
APP_NAME=Instagram
APP_PORT=3001
SOCKET_PORT=8080



COOKIE_DOMAIN=localhost
COOKIE_AGE=2592000000
JWT_SECRET=b4f6aae97a2cecb24e1e90f6d0e84aaff529d80d

#
# APPLICATION
#
APP_SCHEMA=http
APP_HOST=localhost
APP_ROUTE_PREFIX=/api
APP_BANNER=true

#
# LOGGING
#
LOG_LEVEL=debug
LOG_OUTPUT=dev

#
# DATABASE
#
DB_CONNECTION=mongodb://localhost:27017/instagram2022
DB_DATABASE=mongodb
DB_LOGGING=error
DB_LOGGER=advanced-console

#
# PASSPORT
#
PASSPORT_JWT=jwt_example
PASSPORT_JWT_ACCESS_EXPIRED=900
PASSPORT_JWT_REFRESH_EXPIRED=259200

#
# Swagger
#
SWAGGER_ENABLED=true
SWAGGER_ROUTE=/swagger
SWAGGER_USERNAME=admin
SWAGGER_PASSWORD=1234

#
# Status Monitor
#
MONITOR_ENABLED=true
MONITOR_ROUTE=/monitor
MONITOR_USERNAME=admin
MONITOR_PASSWORD=1234

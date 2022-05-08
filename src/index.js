const app = require('./app.js');
const config = require('./config.js');
const logger = require('./lib/logger.js');

const startServer = ({
    serverStartLogger,
    config,
    app,
}) => {
    app.listen(config.getPort(),() => {
        serverStartLogger.info({
            msg: `Server listening on ${config.getPort()}`,
        });
    })
}

startServer({
    serverStartLogger: logger({
        tag: 'server_logger',
    }),
    config,
    app,
})
const homeRouter = require('./home');
const queryRouter = require('./query');

function route(app) {
    app.use('/query',queryRouter);
    app.use('/',homeRouter);
}   

module.exports = route;
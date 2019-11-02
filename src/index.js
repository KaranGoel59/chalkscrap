import bodyParser from 'body-parser';
import logger from 'morgan';

import {chalkPadRoutes} from '@app/routes';
import {chalkPadEvents} from '@app/events';

import {ENV} from '@app/config';
import app from './app';

const { NODE_ENV, PORT } = ENV;

app.express.use(bodyParser.json());
app.express.use(bodyParser.urlencoded({ extended: true })); // for parsing form data

if (NODE_ENV == 'development') {
    app.express.use(logger('dev'));
}

(async () => {
    // await app.startBrowser();
    app.mountScrapRoutes(chalkPadRoutes);
    app.mountScrapEvents(chalkPadEvents);
    await app.start(PORT);
})();

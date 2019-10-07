import bodyParser from 'body-parser';
import logger from 'morgan';

import {studentRoutes} from '@app/routes';

import {ENV} from '@app/config';
import app from './app';

const { NODE_ENV, PORT } = ENV;

app.express.use(bodyParser.json());
app.express.use(bodyParser.urlencoded({ extended: true })); // for parsing form data

if (NODE_ENV == 'development') {
    app.express.use(logger('dev'));
}

app.mountRoutes(studentRoutes);
app.start(PORT);

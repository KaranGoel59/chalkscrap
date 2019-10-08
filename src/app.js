import express from 'express';
import puppeteer from 'puppeteer';

import { errorHandler, undefinedRoute } from  '@app/middlewares';

class App {
    constructor() {
        this.express = express();
        this.router = express.Router();
        this.browser = null;
    }

    mountScrapper(routes) {
        routes(this.router, this.browser);
    }

    async startBrowser() {
        this.browser = await puppeteer.launch({devtools: true}); 
    }

    start(port) {
        const app = this.express;
        
        app.use('/',this.router);

        //undefine handler middlewares
        app.use(undefinedRoute);
        app.use(errorHandler);

        app.listen(port,() => {
            console.log(`🚀 Server ready at ${port}`);
        });
    }
}

export default new App();

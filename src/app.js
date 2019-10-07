import express from 'express';

import { errorHandler, undefinedRoute } from  '@app/middlewares';

class App {
    constructor() {
        this.express = express();
        this.router = express.Router();
    }

    mountRoutes(routes) {
        routes(this.router);
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

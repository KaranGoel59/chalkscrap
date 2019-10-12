import express from 'express';
import puppeteer from 'puppeteer';
import http from 'http';
import socket from 'socket.io';

import { errorHandler, undefinedRoute } from  '@app/middlewares';

class App {
    constructor() {
        //express (REST API)
        this.express = express();
        this.router = express.Router();

        //crawler
        this.browser = null;

        //web sockets
        this.http = http.createServer(this.express)
        this.io = socket(this.http);
        this.eventLoop = [];
    }

    mountScrapRoutes(routes) {
        routes(this.router, this.browser);
    }
    
    mountScrapEvents(events) {
        this.eventLoop.push(events);
    }
    // start browser window
    async startBrowser() {
        this.browser = await puppeteer.launch(); 
    }

    start(port) {
        const app = this.express;
        const server = this.http;

        app.use('/',this.router);

        //undefine handler middlewares
        app.use(undefinedRoute);
        app.use(errorHandler);

        server.listen(port,() => {
            console.log(`🚀 Scrapper ready at ${port}`);
        });

        this.io.on('connection', (socket) => {
            console.log(`👤 Client connected`);

            this.eventLoop.forEach((events) => {
                events(socket);
            })
        });
    }
}

export default new App();

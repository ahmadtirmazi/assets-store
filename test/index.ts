import express, { Express, Request, Response, request } from 'express';

const initializeServer = () => {
    const app: Express = express();
    app.use(express.json());

    return app;
}

export default initializeServer;

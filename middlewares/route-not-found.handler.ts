import { Request, Response } from 'express';

export const RouteNotFoundHandler = (req: Request, res: Response) => {
    res.status(404).send('Not Found');
}
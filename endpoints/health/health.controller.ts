import { Request, Response } from 'express';

const healthHandler = async (req: Request, res: Response) => {
    res.json({ info: 'App is running!' })
}

export default healthHandler;
import { Request, Response } from 'express';

import { Asset } from '@prisma/client';
import { RESPONSE_STATUS } from '../../common/enums';
import handleError from '../error.handler';
import prisma from '../../prisma/client.prisma';

const getAssetHandler = async (req: Request, res: Response) => {
    try {
        const uuid = req.params.uuid;

        const asset = await getAssetWorker(uuid);

        if (asset) {
            return res.send(prepareResponse(asset));
        } else {
            return res.status(404).send({
                status: RESPONSE_STATUS.FAILED,
                message: 'asset not found',
            });
        }
    }
    catch (error: any) {
        return handleError(res, error);
    }
}

const getAssetWorker = async (uuid: string): Promise<Asset | null> => {
    const asset = await prisma.asset.findUnique({
        where: {
            id: uuid,
        }
    });

    return asset;
}

const prepareResponse = (asset: Asset): Object => {
    const result = {
        status: RESPONSE_STATUS.OK,
        data: {
            ...asset,
        }
    }

    return result;
}

export default getAssetHandler;
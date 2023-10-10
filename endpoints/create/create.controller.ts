import { Request, Response } from 'express';

import { Asset } from '@prisma/client';
import { RESPONSE_STATUS } from '../../common/enums';
import handleError from '../error.handler';
import prisma from '../../prisma/client.prisma';
import requestSchema from './request.schema';

const createAssetHandler = async (req: Request, res: Response) => {
    try {
        const { error } = requestSchema.validate(req.body);
        if (error) { throw error }

        const asset = await createAssetWorker(req.body);
        const result = prepareResponse(asset);

        return res.send(result);
    }
    catch (error: any) {
        return handleError(res, error);
    }
}

const createAssetWorker = async (asset: Asset): Promise<Asset> => {
    const { type, name, description } = asset

    const newAsset = await prisma.asset.create({
        data: {
            type,
            name,
            description,
        },
    });

    return newAsset;
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

export default createAssetHandler;
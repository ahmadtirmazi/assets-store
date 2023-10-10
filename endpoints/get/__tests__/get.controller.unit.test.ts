import { Request, Response } from 'express';

import { Asset } from '@prisma/client';
import { RESPONSE_STATUS } from '../../../common/enums';
import getAssetHandler from '../get.controller';
import prisma from '../../../prisma/client.prisma';

jest.mock('../../../prisma/client.prisma', () => ({
    asset: {
        findUnique: jest.fn(),
    },
}));

describe('getAssetHandler', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const uuid = '5bda5f3e-33bf-4cb9-8e02-0cd427a27e31';
    const req = { params: { uuid } } as unknown as Request;
    const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    it('should return the asset when found', async () => {

        const mockAsset: Asset = {
            id: uuid,
            type: 'Image',
            name: 'asset-name',
            description: 'an example asset',
            createdAt: new Date(),
        };

        (prisma.asset.findUnique as jest.Mock).mockResolvedValue(mockAsset);

        await getAssetHandler(req, res);

        expect(res.send).toHaveBeenCalledWith({
            status: RESPONSE_STATUS.OK,
            data: mockAsset,
        });
    });

    it('should return a 404 response when asset is not found', async () => {
        (prisma.asset.findUnique as jest.Mock).mockResolvedValue(null);

        await getAssetHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith({
            status: RESPONSE_STATUS.FAILED,
            message: 'asset not found',
        });
    });
});

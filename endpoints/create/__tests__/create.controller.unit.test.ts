import { Request, Response } from 'express';

import { Asset } from '@prisma/client';
import createAssetHandler from '../create.controller';
import prisma from '../../../prisma/client.prisma';
import requestSchema from '../request.schema';

jest.mock('../../../prisma/client.prisma', () => ({
    asset: {
        create: jest.fn(),
    },
}));

describe('createAssetHandler', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create and return the asset when valid data is provided', async () => {
        const mockRequest = {
            body: {
                type: 'Image',
                name: 'TestName',
                description: 'TestDescription',
            },
        } as Request;

        const mockAsset: Asset = {
            id: 'test-id',
            ...mockRequest.body,
        };

        const validateSpy = jest.spyOn(requestSchema, 'default').mockReturnValue({ error: null } as any);

        (prisma.asset.create as jest.Mock).mockResolvedValue(mockAsset);

        const res = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as unknown as Response;

        await createAssetHandler(mockRequest, res);

        expect(res.send).toHaveBeenCalledWith({
            status: 'OK',
            data: mockAsset,
        });

        validateSpy.mockRestore();
    });
});

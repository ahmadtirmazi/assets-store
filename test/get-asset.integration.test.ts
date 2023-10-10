import { Asset } from '@prisma/client';
import { RESPONSE_STATUS } from '../common/enums';
import getAssetController from '../endpoints/get/get.controller';
import initializeServer from '.';
import prisma from '../prisma/client.prisma';
import request from 'supertest';

const app = initializeServer();
app.get('/assets/:uuid', getAssetController);

jest.mock('../prisma/client.prisma', () => ({
    asset: {
        findUnique: jest.fn(),
    },
}));

describe('Integration Tests: getAssetController', () => {
    it('should return an asset when it exists', async () => {
        const mockAsset: Asset = {
            id: 'test-id',
            type: 'Image',
            name: 'TestName',
            description: 'TestDescription',
            createdAt: new Date("2023-10-10T20:07:23.793Z"),
        };

        (prisma.asset.findUnique as jest.Mock).mockResolvedValue(mockAsset);

        const response = await request(app).get('/assets/test-id');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: RESPONSE_STATUS.OK,
            data: {
                ...mockAsset,
                createdAt: "2023-10-10T20:07:23.793Z",
            },
        });
    });

    it('should return a 404 response when the asset is not found', async () => {
        (prisma.asset.findUnique as jest.Mock).mockResolvedValue(null);

        const response = await request(app).get('/assets/nonexistent-id');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            status: RESPONSE_STATUS.FAILED,
            message: 'asset not found',
        });
    });

    it('should handle errors by returning a 500 response', async () => {
        const error = new Error('Test error');

        (prisma.asset.findUnique as jest.Mock).mockRejectedValue(error);

        const response = await request(app).get('/assets/test-id');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: RESPONSE_STATUS.FAILED,
            message: 'an error occurred: Test error',
        });
    });
});

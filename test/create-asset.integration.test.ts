import { Asset } from '@prisma/client';
import { RESPONSE_STATUS } from '../common/enums';
import createAssetController from '../endpoints/create/create.controller';
import initializeServer from '.';
import prisma from '../prisma/client.prisma';
import request from 'supertest';

const app = initializeServer();
app.post('/assets', createAssetController);

jest.mock('../prisma/client.prisma', () => ({
    asset: {
        create: jest.fn(),
    },
}));

describe('Integration Tests: createAssetController', () => {
    const API_URL = '/assets';

    it('should create an asset when valid data is provided', async () => {
        const mockAsset: Asset = {
            id: 'test-id',
            type: 'Image',
            name: 'TestName',
            description: 'TestDescription',
            createdAt: new Date("2023-10-10T20:07:23.793Z"),
        };

        (prisma.asset.create as jest.Mock).mockResolvedValue(mockAsset);

        const requestData = {
            type: 'Image',
            name: 'TestName',
            description: 'TestDescription',
        };

        const response = await request(app)
            .post(API_URL)
            .send(requestData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: RESPONSE_STATUS.OK,
            data: {
                ...mockAsset,
                createdAt: "2023-10-10T20:07:23.793Z",
            },
        });
    });

    it('should handle validation errors when invalid data is provided', async () => {
        const requestData = {
            "type": "invalid-type",
            "name": "My Image",
            "description": "An example image"
        };

        const response = await request(app)
            .post(API_URL)
            .send(requestData);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: RESPONSE_STATUS.FAILED,
            message: expect.any(String),
        });
    });

    it('should handle errors during asset creation', async () => {
        const error = new Error('Test error');

        (prisma.asset.create as jest.Mock).mockRejectedValue(error);

        const requestData = {
            type: 'Image',
            name: 'TestName',
            description: 'TestDescription',
        };

        const response = await request(app)
            .post(API_URL)
            .send(requestData);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            status: RESPONSE_STATUS.FAILED,
            message: 'an error occurred: Test error',
        });
    });
});

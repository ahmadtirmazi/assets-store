import { AssetType } from '@prisma/client';
import Joi from 'joi'

const schema = Joi.object({
    type: Joi.string().valid(AssetType.Image, AssetType.Video).required(),
    name: Joi.string().required(),
    description: Joi.string().required()
});

export default schema;
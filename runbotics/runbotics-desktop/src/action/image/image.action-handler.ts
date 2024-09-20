import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { ImageAction } from 'runbotics-common';
import { resolve } from 'path';
import { Jimp } from 'jimp';

import { FilePath, GrayScaleActionInput, ImageActionRequest } from './types';

@Injectable()
export class ImageActionHandler extends StatelessActionHandler {

    async grayscale(input: GrayScaleActionInput): Promise<FilePath> {
        const resultPath = input.resultImagePath && input.resultImagePath.trim() !== ''
            ? input.resultImagePath
            : input.imagePath;

        const image = await Jimp.read(input.imagePath);
        const [ path, extension ] = resultPath.split('.');
        await image
            .greyscale()
            .write(`${path}.${extension}`);
        return resolve(resultPath);
    }

    run(request: ImageActionRequest) {
        switch (request.script) {
            case ImageAction.GRAY_SCALE:
                return this.grayscale(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}


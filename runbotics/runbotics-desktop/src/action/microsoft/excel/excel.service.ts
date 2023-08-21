import { Injectable } from '@nestjs/common';
import { RunboticsLogger } from '#logger';

import { MicrosoftGraphService } from '../microsoft-graph';

@Injectable()
export class ExcelService {
    private readonly logger = new RunboticsLogger(ExcelService.name);

    constructor(
        private readonly microsoftGraphService: MicrosoftGraphService,
    ) {}

    /**
     * 1. Open file id/path
     * 2. Close session
     * 3. Get cell
     * 4. Get Range
     * 5. Set Cell
     * 6. Set Range
     */

}

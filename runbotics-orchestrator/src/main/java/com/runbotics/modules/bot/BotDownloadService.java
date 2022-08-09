package com.runbotics.modules.bot;

import com.runbotics.modules.bot.entity.BotDownloadRequestDTO;
import com.runbotics.modules.bot.entity.BotDownloadResponseDTO;
import com.runbotics.modules.bot.entity.BotGetInstallationFileResponseDTO;
import java.io.FileNotFoundException;

public interface BotDownloadService {
    BotDownloadResponseDTO download(BotDownloadRequestDTO request);
    BotGetInstallationFileResponseDTO getInstallationFile(String fileId) throws FileNotFoundException;
}

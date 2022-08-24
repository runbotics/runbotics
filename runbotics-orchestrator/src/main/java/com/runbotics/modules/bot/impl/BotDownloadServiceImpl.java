package com.runbotics.modules.bot.impl;

import com.runbotics.modules.bot.BotDownloadService;
import com.runbotics.modules.bot.entity.BotDownloadRequestDTO;
import com.runbotics.modules.bot.entity.BotDownloadResponseDTO;
import com.runbotics.modules.bot.entity.BotGetInstallationFileResponseDTO;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
public class BotDownloadServiceImpl implements BotDownloadService {

    private final Logger log = LoggerFactory.getLogger(BotDownloadServiceImpl.class);

    @Value("${bot.installation.file}")
    private String botInstallationFilePath;

    private Map<String, BotDownload> downloads = new HashMap<>();

    @Scheduled(fixedDelay = 10000)
    public void cleanDownloads() {
        log.debug("Cleaning downloads");
        Map<String, BotDownload> filtered = downloads
            .entrySet()
            .stream()
            .filter(
                entry -> {
                    BotDownload botDownload = entry.getValue();
                    return !ZonedDateTime.now().isAfter(botDownload.getExpires());
                }
            )
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        downloads = filtered;
    }

    @Override
    public BotDownloadResponseDTO download(BotDownloadRequestDTO request) {
        String fileId = UUID.randomUUID().toString();
        BotDownload botDownload = new BotDownload();
        botDownload.setExpires(ZonedDateTime.now().plusMinutes(1));
        downloads.put(fileId, botDownload);
        BotDownloadResponseDTO responseDTO = new BotDownloadResponseDTO();
        responseDTO.setFileId(fileId);
        return responseDTO;
    }

    @Override
    public BotGetInstallationFileResponseDTO getInstallationFile(String fileId) throws FileNotFoundException {
        if (!downloads.containsKey(fileId)) {
            throw new AccessDeniedException("Not authorized");
        }
        downloads.remove(fileId);
        File file = new File(botInstallationFilePath);
        Resource resource = new InputStreamResource(new FileInputStream(file));
        return new BotGetInstallationFileResponseDTO(file, resource);
    }

    public static class BotDownload {

        private ZonedDateTime expires;

        public ZonedDateTime getExpires() {
            return expires;
        }

        public void setExpires(ZonedDateTime expires) {
            this.expires = expires;
        }
    }
}

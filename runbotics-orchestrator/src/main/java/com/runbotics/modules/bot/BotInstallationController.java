package com.runbotics.modules.bot;

import com.runbotics.modules.bot.entity.BotDownloadRequestDTO;
import com.runbotics.modules.bot.entity.BotDownloadResponseDTO;
import com.runbotics.modules.bot.entity.BotGetInstallationFileResponseDTO;
import com.runbotics.service.BotService;
import java.io.IOException;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bot-installation")
public class BotInstallationController {

    private final BotService botService;
    private final BotDownloadService botDownloadService;

    public BotInstallationController(
        BotService botService,
        BotDownloadService botDownloadService
    ) {
        this.botService = botService;
        this.botDownloadService = botDownloadService;
    }

    @RequestMapping(path = "/download", method = RequestMethod.POST)
    @PreAuthorize("isAuthenticated()")
    public BotDownloadResponseDTO download(@RequestBody BotDownloadRequestDTO request) {
        return botDownloadService.download(request);
    }

    @RequestMapping(path = "/files/{fileId}", method = RequestMethod.GET)
    public ResponseEntity<Resource> getInstallationFile(@PathVariable String fileId) throws IOException {
        BotGetInstallationFileResponseDTO response = botDownloadService.getInstallationFile(fileId);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + response.getFile().getName());
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");

        return ResponseEntity
            .ok()
            .headers(headers)
            .contentLength(response.getFile().length())
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(response.getResource());
    }
}

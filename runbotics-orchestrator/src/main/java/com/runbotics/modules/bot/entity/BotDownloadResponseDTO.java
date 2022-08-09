package com.runbotics.modules.bot.entity;

import java.io.Serializable;

public class BotDownloadResponseDTO implements Serializable {

    String fileId;

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }
}

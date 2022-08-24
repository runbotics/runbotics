package com.runbotics.modules.bot.entity;

import java.io.File;
import java.io.Serializable;
import org.springframework.core.io.Resource;

public class BotGetInstallationFileResponseDTO implements Serializable {

    File file;
    Resource resource;

    public BotGetInstallationFileResponseDTO(File file, Resource resource) {
        this.file = file;
        this.resource = resource;
    }

    public File getFile() {
        return file;
    }

    public void setFile(File file) {
        this.file = file;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }
}

package com.runbotics.web.rest.vm;

import javax.validation.constraints.Size;

public class GuestVM {
    @Size(min = 2, max = 10)
    private String langKey;

    public GuestVM() {
    }

    public String getLangKey() {
        return langKey;
    }

    public void setLangKey(String langKey) {
        this.langKey = langKey;
    }
}

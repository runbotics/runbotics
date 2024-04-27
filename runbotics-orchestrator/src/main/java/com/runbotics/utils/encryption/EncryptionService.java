package com.runbotics.utils.encryption;

public interface EncryptionService {
    String encrypt(String secret);
    String decrypt(String encryptedSecret);
}

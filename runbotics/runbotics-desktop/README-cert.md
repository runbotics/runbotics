# Windows bot certificate

## Check current certificate

Current certificate files can be found under [[RunBotics] PFX Windows bot certificate]() **// TODO: change after secret added to Secret Server**

To check current certificate from Secret Server:

```sh
certutil -p $CERT_PASSWORD -dump selfsigncert.pfx
```

**CERT_PASSWORD** can be found under [[RunBotics] PFX Certificate Password env](https://protection.clouddc.eu/SecretServer/app/#/secrets/57663/general) secret on Secret Server

## Latest certificate

The certificate was generated on **20.08.2025**:

```sh
================ Certificate 0 ================
================ Begin Nesting Level 1 ================
Element 0:
Serial Number: 71a80b236c87dd28d3dc65d7120421e0b921308d
Issuer: E=runbotics@all-for-one.com, CN=RunBotics, OU=Software Development, O=All for One Poland sp. z o.o., L=PoznaÅ, S=Poland, C=PL
 NotBefore: 20.08.2025 13:42
 NotAfter: 20.08.2027 13:42
Subject: E=runbotics@all-for-one.com, CN=RunBotics, OU=Software Development, O=All for One Poland sp. z o.o., L=PoznaÅ, S=Poland, C=PL
Signature matches Public Key
Root Certificate: Subject matches Issuer
Cert Hash(sha1): 7cb7db1e1cd1bc83273271344bc062ef03eafa7f
----------------  End Nesting Level 1  ----------------
  Provider = Microsoft Enhanced Cryptographic Provider v1.0
Encryption test passed
CertUtil: -dump command completed successfully.
```

## Steps to get a new certificate

### Generate new private key

Used to encrypt certificate

```sh
openssl genrsa -out runbotics.key 2048
```

### Generate a certificate signing request (CSR)

Contains information about the entity requesting a certificate

```sh
openssl req -new -sha256 -key runbotics.key -out runbotics.csr
```

### Generate a public certificate (CRT)

Used to establish secure connections

```sh
openssl x509 -req -sha256 -days 730 -in runbotics.csr -signkey runbotics.key -out runbotics.crt
```

### Generate a Personal Information Exchange (PFX)

Binary file bundling private key and associated certificate

```sh
openssl pkcs12 -export -out selfsigncert.pfx -inkey runbotics.key -in runbotics.crt
```

### Encode PFX to Base64

Used to pass it to code-sign-action or signtool.exe

```sh
certutil -encode ./selfsigncert.pfx ./runbotics.base64.txt
```

## What's next

### Update secret in GH Actions

After you receive `runbotics.base64.txt` you need to take its contents and update CERT_BASE64 secret in GH actions.

### Update secret in Secret Server

You need to update [[RunBotics] PFX Certificate Base64 env](https://protection.clouddc.eu/SecretServer/app/#/secrets/57664/general) secret on Secret Server.

### Update 'Latest certificate' section

Run `certutil` and paste the response into this README **Latest certificate** section to keep it updated.

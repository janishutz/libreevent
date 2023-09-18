# Security best practices

Whilst libreevent uses modern security features, no Software is perfect when it comes to security. This is why it is important to keep libreevent updated, as potential security issues are addressed with them, as well as potential bugs. Next to that, an incorrectly set up instance of libreevent might pose a security problem, but we try to make the attack surface as small as possible. The most significant security risk that can arise from improperly setting up libreevent is not using HTTPS for the server. 

## Reverse Proxy
For simplicity reasons, libreevent does not (yet) natively support SSL-Certificates. This is why libreevent should be put behind a reverse proxy to ensure that all users use SSL (Secure Sockets Layer) or TLS (Transport Layer Security) when connecting to it. Most webhosting plans are already behind a reverse proxy, you will just need to force a HTTPS redirect in the settings of the admin panel of the webhosting account. If you are manually deploying libreevent on a server without a reverse proxy, we urge you to use a reverse proxy with e.g. nginx or apache. There are a lot of guides out there on how to set a such up. Please also get yourself a Certificate for your domain and activate it. A common methods for acquiring such Certificates is to use the "Certbot" CLI application on Linux. It works with both apache and nginx and can automatically renew the certificate for you once it expires if set to run on a cronjob (highly recommended).

## HTTPS
As mentioned previously in the Reverse Proxy section, you should always have HTTPS enabled using a reverse proxy. Since most hosting accounts already have a reverse proxy installed, you just need to set it to automatically redirect HTTP to HTTPS in the webhosting admin panel.

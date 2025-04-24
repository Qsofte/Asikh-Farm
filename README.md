<img align="center" alt="Haproxy" width="800" src="https://assets.digitalocean.com/articles/letsencrypt/haproxy-letsencrypt.png">
**Design File**
https://www.figma.com/design/OTeMdk28DZpoX10nd0iBDC/Ashik-Farms?node-id=2-8&t=jk98QrKEBYyLx0oY-1


 ### Steps to Renew SSL Certificate with Certbot and HAProxy :


1. **Ensure Certbot is Installed:**  
   Certbot should be installed on your server to manage Let's Encrypt certificates. You can check the Certbot version to ensure it’s installed:
   ```bash
   certbot --version
   ```
   If it’s not installed, you can install Certbot on Ubuntu/Debian with:
   ```bash
   sudo apt update
   sudo apt install certbot
   ```

2. **Use Certbot in Standalone Mode:**  
   Since HAProxy is running, you may need to stop HAProxy temporarily to let Certbot use port 80 (HTTP) for certificate renewal. Certbot’s **standalone** mode runs its own temporary web server to handle the certificate renewal process.

   To renew the certificate, run the following steps:
   - **Stop HAProxy temporarily** to free up port 80:
     ```bash
     sudo systemctl stop haproxy
     ```

   - **Renew the certificate**:  
     Run Certbot in standalone mode to renew your certificate:
     ```bash
     sudo certbot certonly --standalone -d yourdomain.com
     ```
     Replace `yourdomain.com` with your actual domain name.

   - **Start HAProxy again** after the renewal is complete:
     ```bash
     sudo systemctl start haproxy
     ```

3. **Update HAProxy Configuration with the Renewed Certificate:**  
   After the certificate is renewed, the new certificates are typically placed in the `/etc/letsencrypt/live/yourdomain.com/` directory. You need to make sure HAProxy is pointing to the correct certificate files.

   - Open your HAProxy configuration file (typically located at `/etc/haproxy/haproxy.cfg`):
     ```bash
     sudo nano /etc/haproxy/haproxy.cfg
     ```

   - Ensure HAProxy is using the renewed certificate:
     ```bash
     bind *:443 ssl crt /etc/letsencrypt/live/yourdomain.com/fullchain.pem
     ```

4. **Reload HAProxy Configuration:**  
   After updating your configuration, reload HAProxy to apply the changes:
   ```bash
   sudo systemctl reload haproxy
   ```

5. **Automate Renewal (Optional):**  
   To automate the renewal process, you can create a cron job or systemd timer for Certbot. Certbot is usually set to automatically renew certificates 30 days before expiration.

   To verify that automatic renewal is set up, check if a cron job exists:
   ```bash
   sudo crontab -l
   ```
   If it's not set up, you can add a cron job to renew certificates and reload HAProxy:
   ```bash
   sudo crontab -e
   ```

   Add the following line to renew the certificate daily:
   ```bash
   0 0 * * * certbot renew --quiet && systemctl reload haproxy
   ```

This will ensure that your SSL certificates are automatically renewed and HAProxy is reloaded with the new certificates.

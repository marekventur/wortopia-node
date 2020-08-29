[Unit]
Description=wortopia.de
After=network.target

[Service]
Environment=NODE_ENV=production
Type=simple
User=wortopia
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=wortopia-de
ExecStart=/usr/bin/node /var/www/wortopia/app.js /etc/wortopia/config.js
Restart=on-failure

[Install]
WantedBy=multi-user.target

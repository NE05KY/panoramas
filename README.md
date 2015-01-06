#PANORAMAS

Description

##Install

First of all install Node.js

### npm

    npm install bower
    bower install



### nginx:

	location ~ ^/api/(.*)$ {
		rewrite ^/api/(.*)$ /api/index.php/$1 break;
		include fastcgi_params;
		fastcgi_param SCRIPT_FILENAME /var/www/api/index.php;
		fastcgi_param SCRIPT_NAME /api/index.php;
		fastcgi_pass unix:/var/run/php5-fpm.sock;
	}

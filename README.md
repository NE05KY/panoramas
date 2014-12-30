#PANORAMAS

Description

##Install

First of all install Node.js

### npm

    npm install bower
    bower install



### nginx:

    location / {
		if (!-e $request_filename){
			rewrite ^(.*)$ /index.php/$1 break;
		}
	}
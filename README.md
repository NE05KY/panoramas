VSU PANORAMOS
=============

Description

Requirements
------------

- PHP 5.4+ & PDO
- SQLite

Installation
------------

Nginx:

	location / {
		if (!-e $request_filename){
			rewrite ^(.*)$ /index.php/$1 break;
		}
	}
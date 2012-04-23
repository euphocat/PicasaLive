PicasaLive - a fancy Picasa Album display for jQuery
====================================================

Version 0.1 by Nicolas Baptiste - http://www.nicolasbaptiste.com

A word
--------------------------------------

I created this plugin for [jQuery](http://www.jquery.com) 1.5+. It retrieves a list of pictures from a Picasa album of your choice and displays them in a html element on your webpage.


Dependencies
--------------------------------------

 - jQuery 1.5+ : http://www.jquery.com
 - jQuery 2D Transformation Plugin : https://github.com/heygrady/transform
 - option : an easing library


Uses
--------------------------------------

	var paramPicasaLive = {
		'speed'		: 2000,
		'user'		: 'euphocat',
		'idGallery' : '5304248779436058001',
		'thumbsize'	: '200c',
		'shuffle'	: true,
		'animate'	: 'elastic',
		'style'		: 'polaroid'
	};
	
	$("#myDivElement").picasalive(paramPicasaLive);


Example
--------------------------------------

http://www.nicolasbaptiste.com/#perso
PicasaLive - a fancy Picasa Album display for jQuery
====================================================

A word
--------------------------------------

I created this plugin for [jQuery](http://www.jquery.com) 1.5+. It retrieves a list of picture from a Picasa Album and displays it in one html element on you webpage.


Dependencies
--------------------------------------

 - jQuery 1.5+ : http://www.jquery.com
 - jQuery 2D Transformation Plugin : https://github.com/heygrady/transform


Usages
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

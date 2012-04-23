/**
 * JQuery plugin Picasa Live
 * 
 * @version 0.1
 * @author Nicolas Baptiste - nicolas.baptiste [at] gmail.com
 * @see http://www.nicolasbaptiste.com
 * 
 * @requires jQuery 2D Transformation Plugin : https://github.com/heygrady/transform
 * @requires jQuery 1.5+
 */
;(function($){
	
	/**
	 * Default values
	 * 
	 * For thumbsize and imgmax, please refers to Picasa API doc
	 * @see http://code.google.com/intl/fr-FR/apis/picasaweb/docs/2.0/reference.html#Parameters
	 */
	var defaults = {
		idGallery 			: null,
		user				: null,
		speed				: 2000,
		thumbsize			: 200,
		imgmax				: 800,
		style				: null,
		shuffle				: false,
		animate				: null
	};
		
	var oPicasaLive = function(){};
	
	oPicasaLive.prototype = {
		$elem 				: null,
		images 				: new Array(),
		opts 				: null,
		frame				: null,
		currentThumb	 		: 0,
		turns 				: 0,
		interval 			: null,
		
		/**
		 * Retrieve the photo feed from Picasa data API via JSONP 
		 * (JSONP is used to not get worried with cross-domain security)
		 * and popultate the array to work with
		 */
		_parseJSON : function(){
			var self = this;
			var url = "http://picasaweb.google.com/data/feed/api/user/"+this.opts.user+"/albumid/"+this.opts.idGallery+"?alt=json&kind=photo&hl=fr&thumbsize="+this.opts.thumbsize+"&imgmax="+this.opts.imgmax;
				
			$.ajax({
				  url: url,
				  dataType: 'jsonp',
				  success: function(data){
					  $(data.feed.entry).each(function(){
						  var row = {
								  big 	: this.media$group.media$content[0].url,
								  mini	: this.media$group.media$thumbnail[0].url
						  }
						  self.images.push(row);
					  });
					
					  if(self.opts.shuffle){
						  self.images = shuffle(self.images);
					  }
					  
					  self._display();
				  },
				  error : function(){
					  //$.error( 'Erreur dans le chargement de la galerie Picasa' );
				  }
				});
		},
		
		/**
		 * Display the images and the animations after
		 * the photo feed has arrived
		 */
		_display : function(){
			this.frame.html("");
			this._loadAnImage();
			this._launchAnimation();
		},
		
		/**
		 * Load the current image from the feed and put it
		 * in the frame display.
		 * 
		 * The images are transformed via an other plugin
		 * @see https://github.com/heygrady/transform/wiki
		 */
		_loadAnImage : function(){
			
			var rotation = Math.floor((Math.random()*2-1) *30) ;
			var halfThumb = getThumbsizeInPx(this.opts.thumbsize) / 2;
					
			var image = $("<a href='"+this.images[this.currentThumb]["big"]+"' rel='gallery'><img src='"+this.images[this.currentThumb]["mini"]+"' alt='script Picasa live'></a>")
				.appendTo(this.frame)
				.css({
					'marginTop'		: ((this.frame.height()/2) - halfThumb)+(lessOrMore() * random((this.frame.height()/3)))+"px",
					'marginLeft'	: ((this.frame.width()/2) - halfThumb)+(lessOrMore() * random((this.frame.width()/3)))+"px"
				})
				
			if(this.opts.animate == 'slide'){
				image.css({
					marginTop : '-'+(this.frame.height()/16) +'em'
				})
				.animate({
					marginTop : "+="+(this.frame.height()/16 + random(this.frame.height()/16))+"em",
					rotate: rotation+'deg'
				})
			}else if(this.opts.animate == 'fadein'){
				image.css({
					opacity : 0,	
					rotate: rotation+'deg'
				})
				.animate({
					opacity : 1	
				})
			}else if(this.opts.animate == 'elastic'){
				image.css({
					scale : [0,0]
				})
				.animate({
					scale : [1,1],
					rotate: rotation+'deg'
				},
				"slow","easeOutElastic");
			}else{
				image.css({
					rotate: rotation+'deg'
				})
			}
			if(this.turns > 0){
				this.frame.find("img:first").fadeOut(200,function(){
					$(this).remove();
				});
			}
			
			if(this.currentThumb < (this.images.length-1)){
				this.currentThumb++;
			}else{
				this.currentThumb = 0;
				this.turns++;
			}	
		},
		
		/**
		 * Create the interval to execute the animation
		 */
		_launchAnimation : function(){
			var self = this;
			this.interval = setInterval(function(){self._loadAnImage();}, this.opts.speed);			
		}
	};
	
	/**
	 * Helper function to get a random number from 0 to max
	 * 
	 * @var max int
	 * 
	 * @returns int
	 */
	function random(max){
		return  Math.floor(Math.random()*max);
	}
	
	/**
	 * Helper function to shuffle an array
	 * 
	 * @var arr Array
	 * 
	 * @returns Array
	 */
	function shuffle(arr){
		for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
		return arr;
	}
	/**
	 * Returns the size of thumbsize without the final letter if there is one.
     *
	 * @var thumbsize Int
	 *
	 * @returns thumbsize
	 */
	function getThumbsizeInPx(thumbsize){
		if(typeof(thumbsize) == "string"){
			if(thumbsize[thumbsize.length-1] == 'c' || thumbsize[thumbsize.length-1] == 'c'){
				return thumbsize.substring(0,thumbsize.length-1);
			}
		}
		return thumbsize;
	}
	function lessOrMore(){
		var signs = new Array(-1,1);
		return signs[Math.round(Math.random())];
	}
	/**
	 * Public method callable by the plugin
	 */
	var methods = {
			init : function(options){
			
				return this.each(function(){
					
					// cast the object
					var myPicasa 	= new oPicasaLive();
					
					// save the caller
					myPicasa.$elem	= this;
					
					// create the frame for displaying the plugin and save it
					myPicasa.frame 	= $("<div class='picasalive'></div>").appendTo(myPicasa.$elem);
					
					// parse options, mix them with defaults
					myPicasa.opts 	= $.extend(defaults, options); 
					
					// apply a style if defined by user
					if(myPicasa.opts.style == 'polaroid'){
						myPicasa.frame.addClass('picasalive-polaroid');
						myPicasa.opts.thumbsize = "160c";
					}
					
					// beguining the work by retrieving the feed
					myPicasa._parseJSON();
					
					// saving the object in the datas of the caller element
					$(this).data("picasalive",myPicasa);
				
				}); 
			},
			stop : function(){
				return this.each(function(){
					var instance = $(this).data("picasalive");
					if(instance){
						window.clearInterval(instance.interval);
					}
				});
			},
			play : function(){
				return this.each(function(){
					var instance = $(this).data("picasalive");
					if(instance){
						instance._launchAnimation();
					}
				});
			},
			changeAnimation : function (animate) {
				return this.each(function() {
				 	var instance = $(this).data("picasalive");
					if(instance){
						instance.opts.animate = animate;
					}
				});
			}
	}
		
	$.fn.picasalive = function (method){
		// Method calling logic
	    if ( methods[method] ) {
	    	return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	    	return methods.init.apply( this, arguments );
	    } else {
	    	$.error( 'Method ' +  method + ' doesn\'t exist in PicasaLive' );
	    }  
	    return $(this);
	}
})(jQuery);
(function( $ ){
	
	
	////////////////////////////
	//
	// Plugin methods
	//
	////////////////////////////
	
	var methods = {

 		//////////////////////////////
 		//
 		// Initialize
 		//
 		//////////////////////////////

		init : function( options ) { 
			
			var self = this;
			return this.each(function(){

				var settings = $.extend(
					true, 
					{
						template: "<div class='top_of_page_status'><div class='message alert'>{{message}}</div>",
						close_template : "<a class='close' data-dismiss='alert' href='#'>x</a></div>",
						loading: 
						{
							message : "Loading...",
							className : 'loading'
						},
						success :
						{
							message : "Saved.",
							className : 'success'
						},
						error :
						{
							message : "Sorry, we couldn't complete your request.",
							className : 'error'
						}
					}, 
					options
				);
				self.data('settings', settings);
				
				
				
			});
 		},
 		success : function(message, className)
 		{
 			var self = this;
			return this.each(function(){
				var messageItem = {};
				messageItem.message = (message)? message : self.data('settings')['success'].message
				messageItem.className = (className) ? className : self.data('settings')['success'].message
				console.log(message)
				if(self.data('loading_box'))self.data('loading_box').remove(); 
				self.data(
					'loading_box', 
					$(Mustache.to_html(self.data('settings')['template'], messageItem))
				);
				self.data('loading_box').appendTo($('body'))
				self.data('loading_box').find('.message').addClass('alert-success')
				var close = $(Mustache.to_html(self.data('settings')['close_template'], {})).click(function(){self.data('loading_box').remove();}).appendTo(self.data('loading_box').find('.message'))
			});
 		},
 		loading : function(message, className)
 		{
 			var self = this;
			return this.each(function(){
				console.log('in loading')
				var messageItem = {};
				messageItem.message = (message)? message : self.data('settings')['loading'].message
				messageItem.className = (className) ? className : self.data('settings')['loading'].message
				console.log(message)
				if(self.data('loading_box'))self.data('loading_box').remove(); 
				self.data(
					'loading_box', 
					$(Mustache.to_html(self.data('settings')['template'], messageItem))
				);
				self.data('loading_box').appendTo($('body'))
				self.data('loading_box').find('.message')
			});
 		},
 		clear : function()
 		{
 			var self = this;
			return this.each(function(){
				self.data('loading_box').remove();
			});
 		},
		error : function(){
			var self = this;
			return this.each(function(){
				if(self.data('loading_box'))self.data('loading_box').remove(); 
				self.data(
					'loading_box', 
					$(Mustache.to_html(self.data('settings')['template'], self.data('settings')['error']))
				);
				self.data('loading_box').appendTo($('body'));
				self.data('loading_box').find('.message').addClass('alert-error')
				var close = $(Mustache.to_html(self.data('settings')['close_template'], {})).click(function(){self.data('loading_box').remove();}).appendTo(self.data('loading_box').find('.message'))
			});
		}
	};

	$.fn.top_of_page_status = function( method ) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +method + ' does not exist on jQuery.top_of_page_status' );
		}
	};

})( jQuery );
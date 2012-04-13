///////////////////////////////////////////////////////////////
//
//  This hack was design to test if the FPA breaks frame
//  It needs to open a new window to do so.
//  In order for it to work, the for must use the name 'variation[destination_url]' and 
//  id of 'destination_url' for the relevant input 
//
///////////////////////////////////////////////////////////////

var FPAHack = function (varForm){
	this.w = '';
	this.checkURL = function () {
	   if (!this.w.closed && this.w.location) {
	      this.w.close();
	   } else {
	      this.w = window.open('/pop_test2.html','w','height=1,width=1,location=no,resizeble=yes,scrollbars=no,status=no,titlebar=no');
	      this.w.opener = self;
	      window.top.focus();
	   }
	};
	this.enableForm = function(){
		console.log('in enable form')
		$(varForm.currentForm).find('input').removeProp('disabled')
	};
	
	this.checkLoc = function (duration,popout) {
		w = this.w;
		console.log(varForm)
		
		this.enableForm();
	   if (!w.closed) {
	      w.onunload = '';
	      w.close();
	      
	      if (popout) {
	         console.log('popout')
				varForm.showErrors({"variation[destination_url]" : 'This URL "breaks out" of the iframe. Please <a href="#" onclick="showIframePopup();return false;" style="color:#00F;">fix the webpage</a> or enter a different URL.'});
	         console.log($(varForm.currentForm).find('input'))
	         document.getElementById('save-ad-clicked').value = '';
	      } else if (parseInt(duration) > 5000) {
	         console.log('in long duration')
	         var seconds = Math.round(duration/10)/100;
	         if (seconds >= 15) seconds = seconds + ' seconds or more';
	         else seconds = seconds + ' seconds';
	         var conf = confirm('Your ad took ' + seconds + ' to fully load.\nWe recommend that your ad takes no\nlonger than 5 seconds to load in order\nto increase your ad\'s effectiveness.\n\nDo you wish to continue?');
	        if (conf) $(varForm.currentForm).submit();
	         
//	         else document.getElementById('save-ad-clicked').value = '';
	      } else {
	         console.log('all good')
	         $(varForm.currentForm).submit();
	      }
	   }
	};
	
	this.ensure_close = function()
	{
		window.onunload = function() {
			if (!fpa_hack.w.closed && fpa_hack.w.location) {
				this.w.close();
			}	
		};
	}
	
};


var fpa_hack = {};









(function($){
	/////////////////////////////////////////////
	// 
	//
	//  Plugin methods definitions
	//  --------------------------
	//
	///////////////////////////////////////////// 	
	var VT = {
		Views : {},
		Collections : {},
		Models : {}
	};
	
	
	
	
	
	
	
	var methods = 
	{
		//Variation : Backbone.Model.extend(),
		/*
		VariationView : function(args){
			var self = this;
			var View = Backbone.View.extend();
			_.extend(View.prototype, ActionTable.RowView);
			console.log(args)
			var dink = new View(args);
			console.log(dink)
			return dink;
		},
		Variations : function(banner_id) 
		{
			var Variations = Backbone.Collection.extend({ 
				model : Variation,
				url:'/banners/' + banner_id + '/variations' 
			})
			_.extend(Variations.prototype, ActionTable.Rows);
			return new Variations
		},
		VariationsView : function(args){
			console.log(args)
			var self = this;
			var View = Backbone.View.extend({
				
				/*
				initialize: function(){
					console.log('in VariationsView init')
					_.bindAll(this, 'render', 'appendItem');
					this.collection.bind('add', this.appendItem); 
					this.collection.bind('reset', this.render);// collection event binder
					this.collection.bind('change', this.changed);
					console.log('VaritionsView init')
					console.log(this.collection)
					this.collection.fetch();
					//this.render();
				},
            changed : function() {
            	console.log(this);
            },
            RowView : self.create_variations('VariationView'),
				render: function(){
					$(this.el).html('');
					$(this.el).append("<ul class='targeting_list " + this.options.template + "'></ul>");
					_(this.collection.models).each(function(item){ // in case collection is not empty
						this.appendItem(item);
					}, this);
				}/*,
				
				appendItem: function(variation){
					var view = this;
					var dink = {
							model   : variation,
							template : this.options.template
						};
					console.log('here')
					console.log(dink)
					var variationView = $(self).create_variations(
						'VariationView',
						dink
					);
					$(this.el).prepend(variationView.render().el);
				}
			});
			
			_.extend(View.prototype, ActionTable.RowsView);
			return new View(args);
		},
		
		*/
		init : function(params)
		{
			var self = this;
			return this.each(function(){
				$('<input type="button" value="test" />').click(function(){
					console.log('checkURL is')
					$(self).find('input').prop('disabled','disabled')
					fpa_hack.checkURL();
				}).appendTo('body');
				
				
				
				VT.Models.Variation = Backbone.Model.extend();
				_.extend(VT.Models.Variation.prototype, ActionTable.Row);
				
				VT.Collections.Variations = Backbone.Collection.extend({
					model : VT.Models.Variation,
					url : '/banners/' + params.banner_id + '/variations'
				});
				
				_.extend(VT.Collections.Variations.prototype, ActionTable.Rows);
				
				VT.Views.Variation = Backbone.View.extend({
					template : $('#'+ params.ad_type + '_variation_template').html(),
					rowFunction : function()
					{
						var view = this;
						console.log(view.model)
						$(view.el).find('span.delete_variation').click(function(){view.model.destroy();});
					}
				});
				_.extend(VT.Views.Variation.prototype, ActionTable.RowView)
				
				VT.Views.Variations = Backbone.View.extend({
					type:'table',
					RowView : VT.Views.Variation
				})
				_.extend(VT.Views.Variations.prototype, ActionTable.RowsView); 
				
				self.data('params', params)
				
				
				console.log('init')
				self.data('banner_id',params.banner_id)
				$('#variations_ui').remove();		
				//var add_banner_details = $('#banner_details_template').tmpl(response).appendTo(this);
				
				//insert the form based on ad_type
				
				$(Mustache.to_html($('#' + params.ad_type + '_variations_template').html(),{banner_id:banner_id})).appendTo(this);
		/*
				if (typeof(self.data('variations')) == 'undefined')
				{
					console.log('should be defining self data vars')
					/*self.data({
						variations : self.create_variations('Variations', params.banner_id),
						uid : Math.random() * 100
					});
				}
				
				*/
				console.log('bink')
				var collection = new VT.Collections.Variations()
				console.log(collection)
				
				self.data('variations', collection);
				
				self.data({
					variationsView : new VT.Views.Variations({
							el : $('#variations_table'),
							collection : collection,
							template : $('#' + params.ad_type + '_variation_template').html(),
							statusDiv : params.statusDiv
					})
				});
				self.data('variationsView').numericalSort('id',-1);
				self.data('variationsView').pager();
				
											console.log('werwerwrwers')

				var banner_specs_table = $('#banner_specs table');
				/*
				for (var i=0; i < response.ad_sizes.length; i++)
				{
					var size_display = $('#ad_size_template').tmpl(response.ad_sizes[i]).appendTo(banner_specs_table);
				}
				*/
				$(this).create_variations('make_form');	
				
				$(self).data({ad_type: params.ad_type});
				switch ($(self).data('ad_type') )
				{
					case "text"  : $(self).create_variations('text_init');
					case "image" : $(self).create_variations('image_init');
				} 
				
				////////////////////////
				//
				//  load related campaigns
				//
				///////////////////////
				
				
				var bulk_load_area = $('#bulk_load_area');
				var bulk_load_options = $('#bulk_load_options');
				var bulk_load_option = $('#bulk_load_option');
				
				
				
				
				$.ajax(
					{
						url		: "/banners/" + params.banner_id + '/importable_banners.json', 
						data		: {ad_type: params.ad_type, bid_type : params.bid_type},
						dataType : 'json',
						type		: 'GET',
						success	: function(response)
						{
							if (response)
							{
								console.log(response)
								function toggle_load_upload(el, target)
								{
									el.click(function(){
										bulk_load_area.find('.load_upload_sections').hide();
										if (el.hasClass('import_options_expanded')) 
										{
											el.removeClass('import_options_expanded').addClass('import_options_contracted');
										} else {
											bulk_load_options.find('.import_options_expanded').removeClass('import_options_expanded').addClass('import_options_contracted');
											el.removeClass('import_options_contracted').addClass('import_options_expanded');
											target.slideDown();
										}
									});
								}
								if (params.ad_type == 'text') {
									var import_ads = $(Mustache.to_html($('#import_ads_template').html(), {})).appendTo(bulk_load_area);
									var bulk_option = $(Mustache.to_html($('#bulk_load_option').html(), {name : 'Import ads'})).appendTo(bulk_load_options);
									
									
									toggle_load_upload(bulk_option, import_ads);
								}
								console.log(response)
								if (response.length > 0) {
									var load_ads_section = $(Mustache.to_html($('#load_from_previous_campaigns_template').html(), {})).appendTo(bulk_load_area);
									var load_campaigns = $('#load_campaigns');
									var bulk_option = $(Mustache.to_html($('#bulk_load_option').html(), {name : 'Load ads from another campaign'})).appendTo(bulk_load_options);
									toggle_load_upload(bulk_option,load_ads_section);
									
									for (var j=0; j<response.length; j++)
									{
										var previous_campaign = $(Mustache.to_html($('#previous_campaign').html(), response[j])).appendTo(load_campaigns);
									}
									$('#load-btn').click(function(){
										$.ajax(
											{
												url		: "/banners/"+ load_campaigns.val()+"/variations.json", 
												dataType : 'json',
												type		: 'GET',
												success	: function(vars)
												{
													console.log('vars: ')
													console.log(vars)
													if (vars)
													{
														for (var k=0; k<vars.length; k++)
														{
															var variation = new VT.Models.Variation({
																headline        : vars[k]['headline'],
																adtext          : vars[k]["adtext"],
																destination_url : vars[k]["destination_url"],
																display_url     : vars[k]["display_url"],
																img_src         : vars[k]["img_src"],
																fpa_url         : vars[k]["fpa_url"]
															})
															//var variation = new VT.Models.Variation(vars[k]);
															self.data('variations').add(variation);
														}
													}
												},
												error    : function(response){}
											}
										);
									});
								}
								
								
							} 
							else
							{
								load_ads_section.remove();
							}
						},
						error    : function(response){}
					}	
				);
				
				
				////////////////////////
				//
				//  character counter
				//
				///////////////////////
				
				$('.char_count').each(function(){  
					var input_field = $(this);
					var length = input_field.val().length;
					var maxlength =  input_field.prop('maxlength');
					$(this).parent().find('.char_remaining').html( (maxlength - length));  
					$(this).keyup(function(){  
						var new_length = $(this).val().length;  
						$(this).parent().find('.char_remaining').html( (maxlength - new_length));  
					});  
				});  
				
			});
			console.log('deeeeeee')
		},
		/*
		checkURL : function () {
			var self = this;
			console.log('in checkURL')
			console.log(self.data())
			if (fpa_hack.w && !fpa_hack.w.closed && fpa_hack.w.location) {
				fpa_hack.w.close();
			} else {
				fpa_hack.w = window.open('/pop_test.html','w','height=1,width=1,location=no,resizeble=yes,scrollbars=no,status=no,titlebar=no');
				//if (!w.opener) w.opener = self;
				window.top.focus();
			}
		},
		checkLoc :function (duration,popout) {
			console.log('in checkLoc')
			var self = this;
			var w = fpa_hack.w;
			console.log(self.data())
			if (w && !w.closed) {
				w.onunload = '';
				//w.close();
				if (popout) {
					console.log('shit broke out')
					clearErrorMsgs();
					var d1 = document.getElementById('target_url_desc');
					var d2 = document.createElement('div');
					d2.className = 'input-desc error-background';
					d2.innerHTML = 'This URL "breaks out" of the iframe. Please <a href="#" onclick="showIframePopup();return false;" style="color:#00F;">fix the webpage</a> or enter a different URL.';
					d1.parentNode.insertBefore(d2,d1);
					enableForm();
					  
					document.getElementById('save-ad-clicked').value = '';
				} else if (parseInt(duration) > 5000) {
					enableForm();
					var seconds = Math.round(duration/10)/100;
					if (seconds >= 15) seconds = seconds + ' seconds or more';
					else seconds = seconds + ' seconds';
					var conf = confirm('Your ad took ' + seconds + ' to fully load.\nWe recommend that your ad takes no\nlonger than 5 seconds to load in order\nto increase your ad\'s effectiveness.\n\nDo you wish to continue?');
					if (conf) document.getElementById('create_fpa').submit();
					else document.getElementById('save-ad-clicked').value = '';
				} else {
					console.log('all good')
					//document.getElementById('create_fpa').submit();
				}
			}
		},
		*/
		wink : function(w)
		{
			//w.close();
			console.log('yea!')
		},
		
		clear_errors : function()
		{
			var self = this;
			return this.each(function(){
				$(this).find('.variation_errors').fadeOut('fast', function(){$(this).html();});
			});
		},
		make_form : function() 
		{
			console.log('in make Form')
			
			var self = this;
			$('#save_ad').click(function(){
				if($(self).valid())
				{
					console.log(self)
					$(self).submit();
				}
			});
			$(self).find('.variations_input').keyup(function(){
				var input_el = $(this);
				var error_feedback = input_el.parent().find('.error_feedback');
				if (input_el.val().length < 2 && error_feedback.is(':visible'))
				{
					error_feedback.hide();
				}
			});
			return this.each(function(){
				$(self).submit(function(){
					$(self).create_variations('clear_errors');
				});
				
				$(self).ajaxForm({
					clearForm : false,
					
					success : function(data){
						console.log('ajaxForm submit success')
						//console.log(responseText)
						var $out = $('#uploadOutput');
		            //$out.html('Form success handler received: <strong>' + typeof data + '</strong>');
		            data = JSON.parse($(data).text())
		           
		           

		            
		            self.data('variations').add(data)
		           /* if (typeof data == 'object' && data.nodeType)
		                data = elementToString(data.documentElement, true);
		            else if (typeof data == 'object')
		                data = objToString(data);
		            
		            //$out.append('<div><pre>'+ data +'</pre></div>');
						/*
						var response = $.parseJSON(responseText);
						$(self).create_variations('update',response);
						if(response.success) $(self).resetForm();*/
					}
				});
			});
			
		},
		update : function(response)
		{
			var self = this;
			return this.each(function(){
				$(self).create_variations('clear_errors');
				if (response.success) 
				{
					var variation = new Variation(response);
					self.data('variations').add(variation);
					if($(self).data('ad_type') == 'text')
					{
						$(self).create_variations('text_set_adpreview_input',false)
					}
				}
				else
				{
					
					for (var index in response.errors)
					{
						$('#' + index).html(response.errors[index]).fadeIn();
					}
				}
			});
		},
		image_init : function() 
		{
			var image_file = $('#image_file');
			image_file.click(
				function(){ image_file.parent().find('.error_feedback').hide();}
			)
		},
		text_set_adpreview_input :  function(display_default_values)
		{
			var self = this;
			
			return this.each(function(){ 
				var ad_preview_destination_url = $('#ad_preview_destination_url');
				var ad_preview_headline        = $('#ad_preview_headline');
				var ad_preview_text            = $('#ad_preview_text');
				var ad_preview_display_url     = $('#ad_preview_display_url');
				var destination_url            = $('#destination_url');
				var headline                   = $('#headline');
				var text                       = $('#text');
				var display_url                = $('#display_url');
				var manual_display_url         = $('#manual_display_url');
				var auto_display_url           = $('#auto_display_url');
				var auto_display_url_text      = $('#auto_display_url_text');
				var edit_display_url           = $('#edit_display_url');
				
				edit_display_url.click(function(){
					auto_display_url.fadeOut('fast',function(){manual_display_url.fadeIn();});
				});
				
				var ad_preview = 
				[
					{ 
						source      : destination_url, 
						preview     : ad_preview_destination_url, 
						default_val : "http://" 
					},
					{ 
						source      : headline,        
						preview     : ad_preview_headline, 
						default_val : "This is a sample headline" 
					},
					{ 
						source      : text,
						preview     : ad_preview_text, 
						default_val : "This is sample text. You get seventy characters. Have fun with them"  
					},
					{ 
						source : display_url,
						preview : ad_preview_display_url, 
						default_val : "www.sample-site.com"
					}
				];
				
				for (var i = 0; i < ad_preview.length; i++)
				{
					(function() {
						
						var source         = ad_preview[i].source;
						var preview        = ad_preview[i].preview;
						var char_default   = source.parent().find('.char_default');
						var char_remaining = source.parent().find('.char_remaining');
						var default_val    = ad_preview[i].default_val;
						
						char_default.html(source.prop('maxlength'));
						if(display_default_values) source.val(default_val);
						preview.html(default_val);
						char_remaining.hide();
						char_default.show();
						function reset_val(source, default_val){
							if (source.val()=='')
							{
								preview.html(default_val);
							}
						}
						
						reset_val(source, default_val);
						source.click(function(){
							if(source.val() == default_val)
							{
								if (default_val != 'http://') { source.val(''); }
							} 
							
						});
						source.blur(function(){
							reset_val(source, default_val);
						});
						
						source.keyup(function(){
							preview.html(source.val());
							char_remaining.show();
							char_default.hide();
						});
					})();
				}
				auto_display_url_text.html(ad_preview[3].default_val)
				auto_display_url.show();
				manual_display_url.hide();
				destination_url.keyup(function(){
					update_display_url()
				});
				destination_url.change(function(){
					update_display_url()
				});
				function update_display_url()
				{
					targetToDisplayURL();
					//display_url.val(destination_url.val());
					//ad_preview_display_url.html(destination_url.val())
				}
				function targetToDisplayURL() {
				   if (manual_display_url.is(':hidden') && destination_url.val() != '') {
				      var url = destination_url.val();
				      if (url.slice(0,7) == 'http://') url = url.slice(7,url.length);
				      if (url.slice(0,8) == 'https://') url = url.slice(8,url.length);
				      if (url.indexOf('/') > -1) 
				         if (url.slice(url.indexOf('/'), url.length)) url = url.slice(0,url.indexOf('/'));
				      if (url.length > 35) url = url.slice(0,35);
				      display_url.val(url);
				      ad_preview_display_url.html(url);
				      auto_display_url_text.html(url);
				   }
				}
				
			});
		},
		text_init : function()
		{
			/////////////////////////
			//
			//  Set up the functions needed for text variations
			//
			/////////////////////////
			
			var self = this;
			
			return this.each(function(){ 
				$(self).create_variations('text_set_adpreview_input',true);
			});
		}
		
	};
		
	/////////////////////////////////////////////
	// 
	//
	//  initiate function scope
	//  --------------------------
	//
	///////////////////////////////////////////// 
	
	$.fn.create_variations = function(method)
	{
		if ( methods[method] ) 
		{
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} 
		else if ( typeof method === 'object' || ! method ) 
		{
			return methods.init.apply( this, arguments );
		} 
		else 
		{
			$.error( 'Method ' +  method + ' does not exist on jQuery.ad_options' );
		}    
		
	}
})(jQuery);
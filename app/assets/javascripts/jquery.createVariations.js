(function($){
	/////////////////////////////////////////////
	// 
	//
	//  Plugin methods definitions
	//  --------------------------
	//
	///////////////////////////////////////////// 	
	var Variation = Backbone.Model.extend();


	var methods = 
	{
		//Variation : Backbone.Model.extend(),
		
		VariationView : function(args){
			var self = this;
			var View = Backbone.View.extend({
				tagName: 'tr', 
				events: 
				{ 
					'click span.delete_variation' : 'remove'
				},		
				initialize: function()
				{
					_.bindAll(this, 'render', 'unrender', 'remove'); 
					this.model.bind('remove', this.unrender);
				},
				render: function()
				{
					$(this.options.template).tmpl(this.model.attributes).appendTo(this.el);
					return this; 
				},
				unrender: function()
				{
					$(this.el).fadeOut('fast', function(){$(this).remove();});
				},
				remove: function()
				{
					this.model.destroy();
					return false;
				}
			});
			return new View(args);
		},
		Variations : Backbone.Collection.extend({ 
			model : Variation,
			url:'/banners/' + self.data('banner_id') + '/variations' 
		}),
		VariationsView : function(args){
			var self = this;
			var View = Backbone.View.extend({
				initialize: function(){
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
				render: function(){
					$(this.el).html('');
					$(this.el).append("<ul class='targeting_list " + this.options.template + "'></ul>");
					_(this.collection.models).each(function(item){ // in case collection is not empty
						this.appendItem(item);
					}, this);
				},
				appendItem: function(variation){
					var view = this;
					var variationView = new $(self).create_variations(
						'VariationView',
						{
							model   : variation,
							template : this.options.template
						}
					);
					$(this.el).prepend(variationView.render().el);
				}
			});
			return new View(args);
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
			var self = this;
			$('#save_ad').click(function(){
				if($(self).valid())
				{
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
					success : function(responseText){
						
						var response = $.parseJSON(responseText);
						$(self).create_variations('update',response);
						if(response.success) $(self).resetForm();
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
		},
		init : function(params)
		{
			var self = this;
			console.log('werwerwrwers')
			//return this.each(function(){
				
				console.log('init')
				self.data('banner_id',params.banner_id)
				console.log(self.data('banner_id'))
				$('#variations_ui').remove();		
				//var add_banner_details = $('#banner_details_template').tmpl(response).appendTo(this);
				//var template_display = $('#' + response.ad_type.id + '_variations_template').tmpl().appendTo(this);
		
				if (typeof(self.data('variations')) == 'undefined')
				{
					console.log('should be defining self data vars')
					self.data({
						variations : new self.create_variations('Variations'),
						uid : Math.random() * 100
					});
				}
				
				console.log('hi')
				console.log(self.data('variations'))
				self.data({
					variationsView : $(self).create_variations(
						'VariationsView',
						{
							el : $('#variations_table'),
							collection : self.data('variations'),
							template : '#' + params.ad_type + '_variation_template'
						}
					)
				});
				var banner_specs_table = $('#banner_specs table');
				for (var i=0; i < response.ad_sizes.length; i++)
				{
					var size_display = $('#ad_size_template').tmpl(response.ad_sizes[i]).appendTo(banner_specs_table);
				}
				$(this).create_variations('make_form');	
				
				$(self).data({ad_type: response.ad_type.id});
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
						url		: "api/create_variations/upload_load_variations.php", 
						data		: params,
						dataType : 'json',
						type		: 'POST',
						success	: function(response)
						{
							if (response.success)
							{
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
								if (response.allow_csv) {
									var import_ads = $('#import_ads_template').tmpl().appendTo(bulk_load_area);
									var bulk_option = $('#bulk_load_option').tmpl({name : 'Import ads'}).appendTo(bulk_load_options);
									toggle_load_upload(bulk_option, import_ads);
								}
								if (response.campaigns.length > 0) {
									var load_ads_section = $('#load_from_previous_campaigns_template').tmpl().appendTo(bulk_load_area);
									var load_campaigns = $('#load_campaigns');
									var bulk_option = $('#bulk_load_option').tmpl({name : 'Load ads from another campaign'}).appendTo(bulk_load_options);
									toggle_load_upload(bulk_option,load_ads_section);
									
									for (var j=0; j<response.campaigns.length; j++)
									{
										var previous_campaign = $('#previous_campaign').tmpl(response.campaigns[j]).appendTo(load_campaigns);
									}
									$('#load-btn').click(function(){
										$.ajax(
											{
												url		: "api/create_variations_load_ads.php", 
												data		: { campaign_id : load_campaigns.val()},
												dataType : 'json',
												type		: 'POST',
												success	: function(response)
												{
													if (response.success)
													{
														for (var k=0; k<response.variations.length; k++)
														{
															var variation = new Variation(response.variations[k]);
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
				
			//});
			console.log('deeeeeee')
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
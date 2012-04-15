$(document).ready(function() {
/*
	window.App = {
		Views: {},
		Collections : {},
		Routers: {},
		init : function()
		{
			console.log('start App init')
			var selectorsCollection = new App.Collections.Selectors();
			var holdersCollection = new App.Collections.Holders();
			var selectorsView = new App.Views.Selectors({ 
				holders : holdersCollection,
				collection: selectorsCollection,
				el : $('#selectors')
			});
			var holdersView = new App.Views.Holders({ 
				selectors: selectorsCollection,
				collection: holdersCollection,
				el : $('#holders')
			});
		}
	};
	
	window.App.init();
/*
 * 
 * need to feed the js Source API and segment API
 * 
 */
	
	var Workspace = Backbone.Router.extend({
		routes: {
			"banners/:banner_id" : "create_ui"    
		},
		create_ui : function(banner_id)
		{
			console.log('in createUI')
			var buckets = 
			[
				{
					name : "contextual",
					el   : $('#autoComplete1')
				},
				{
					name : "geographical",
					el   : $('#autoComplete2')
				}
			]
			for (var b=0; b< buckets.length; b++)
			{
				buckets[b]["el"].empty();
				var autoCompleteParams = 
				{
					selector :
					{
						url : '/source_segments',
						size : 10
					},
					holder :
					{ 
						url : '/banners/' + banner_id + '/segments'
					},
					el : buckets[b]["el"],
					input_min_size : 1,
					maxitems : 10000,
					delay : 5,
					bucket : buckets[b]["name"]
				}
				new AutoComplete(autoCompleteParams);
			}
			
		}
	});
	

	
	
	new Workspace;
	Backbone.history.start()	
	
	
});
$(document).ready(function() {

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
	
	
/*
 * 
 * need to feed the js Source API and segment API
 * 
 */
	
	var autoCompleteParams1 = 
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
		el : $('#autoComplete1'),
		input_min_size : 1,
		maxitems : 10000,
		delay : 5,
		bucket : 'contextual'
		  
	}
	
	var autoComplete1 = new AutoComplete(autoCompleteParams1);
	
	var autoCompleteParams2 = 
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
		el : $('#autoComplete2'),
		input_min_size : 1,
		maxitems : 10000,
		delay : 5,
		bucket : 'geographical'
		  
	}
	
	var autoComplete2 = new AutoComplete(autoCompleteParams2);
	
});
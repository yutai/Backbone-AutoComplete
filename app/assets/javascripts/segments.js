$(document).ready(function() {

	window.App = {
		Views: {},
		Collections : {},
		Routers: {},
		init : function()
		{
			console.log('start App init')
			var selectorsCollection = new App.Collections.Selectors();
			var holdersCollection = new App.Collections.Holders([
				{"id":"e555","name":"Financial > Pays Bills Online - $0.50"}
			]);
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
			console.log('ddd')
			console.log(holdersCollection);
		}
	};
	
	
/*
 * 
 * need to feed the js Source API and segment API
 * 
 */
	
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
		el : $('#autoComplete'),
		input_min_size : 1,
		maxitems : 10000,
		delay : 5,
		bucket : 'contextual'
		  
	}
	
	var autoComplete1 = new AutoComplete(autoCompleteParams);
	console.log('about to print from autoComplete1')
	console.log(autoComplete1.holdersCollection.toJSON())
	
	
});
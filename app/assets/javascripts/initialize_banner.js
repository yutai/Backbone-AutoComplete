//= require backbone.actionTable.js

$(document).ready(function() {

var Workspace = Backbone.Router.extend({
	routes: {
		"banners/:banner_id" : "fetch_banner"    
	},
	fetch_banner: function(banner_id) {
		console.log('in fetch ' + banner_id)
		var self = this;
		$.ajax({
			url		: "/banners/" + banner_id, 
			dataType : 'json',
			type		: 'GET',
			success	: function(banner)
			{
				self.create_ui(banner)
			}
		});
	},
	create_ui : function(banner)
	{
		this.statusDiv = $('<div></div>');
		this.statusDiv.top_of_page_status();
		this.create_banner_details_ui(banner)
		this.create_variations_ui(banner)
		this.create_segments_ui(banner.id)
		this.create_day_parting_ui(banner)
	},
	create_day_parting_ui : function(banner)
	{
		$('#day_parting_details').day_parting('init', banner);
	},
	create_banner_details_ui : function(banner)
	{
		var self = this;
		var banner_details = $('#banner_details');
		var save_button = $('#save_banner');
		var bannerName = $('input#bannerName').val(banner.name);
		var bannerBid = $('input#bannerBid').val(banner.max_bid);
		var bannerDailyBudget = $('input#bannerDailyBudget').val(banner.daily_budget);
		banner_details.prop('action','/banners/'+banner.id+'.json');
		banner_details.ajaxForm({success:function(){self.statusDiv.top_of_page_status('clear');self.statusDiv.top_of_page_status('success','Banner saved.');console.log('success')}}).validate();
		save_button.click(function(){
			self.statusDiv.top_of_page_status('loading','Saving...');
			banner_details.submit()
		});
	},
	create_variations_ui : function(banner)
	{
		
		varForm = $("#newVariationsForm");
		varForm.html('');
		
		var params = 
		{
			banner : banner,
			statusDiv : this.statusDiv
		}
		varForm = varForm.create_variations(params).validate();
		fpa_hack = new FPAHack(varForm);
	},
	create_segments_ui : function(banner_id)
	{
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

var varForm = {};


new Workspace;
Backbone.history.start()


});
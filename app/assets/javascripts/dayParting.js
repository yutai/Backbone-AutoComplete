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
		this.create_day_parting_ui(banner)
	},
	create_day_parting_ui : function(banner)
	{
		$('#day_parting_details').day_parting('init', banner);
	}
});

var varForm = {};


new Workspace;
Backbone.history.start()


});
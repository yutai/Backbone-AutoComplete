//= require backbone.actionTable.js

$(document).ready(function() {
/*
  $("#uploadForm").create_variations(banner_id, response).validate({
    submitHandler: function(form) {
      $(form).ajaxSubmit();
    }
  });
*/  
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
		console.log('in createUI')
		varForm = $("#newVariationsForm");
		varForm.html('');
		var statusDiv = $('<div></div>');
		statusDiv.top_of_page_status();
		var params = 
		{
			banner : banner,
			statusDiv : statusDiv
		}
		varForm = varForm.create_variations(params).validate();
		fpa_hack = new FPAHack(varForm);
	}
});

var varForm = {};


new Workspace;
Backbone.history.start()

/*
var VariationsTable = function(){
	
	var VT = 
	{
		Views : {},
		Collections : {},
		Models : {},
		statusDiv : $('<div></div>').top_of_page_status()
	};
	
	VT.Models.Variation = Backbone.Model.extend();
	_.extend(VT.Models.Variation.prototype, ActionTable.Row);
	
	VT.Collections.Variations = Backbone.Collection.extend({
		model : VT.Models.Variation,
		url   : '/banners/' + banner_id + '/variations'
	});
	_.extend(VT.Collections.Variations.prototype, ActionTable.Rows);
	
	

	VT.Views.Variation = Backbone.View.extend({
		tagName : 'tr',
		template : "<td>{{id}}</td><td><strong>{{headline}}</strong><br />{{adtext}}</td>",
		rowFunction : function(){}
	});
	_.extend(VT.Views.Variation.prototype, ActionTable.RowView)
	
	VT.Views.Variations = Backbone.View.extend({
		RowView : VT.Views.Variation
	})
	_.extend(VT.Views.Variations.prototype, ActionTable.RowsView);
	
	this.variations = new VT.Collections.Variations();
	
	this.variationsView = new VT.Views.Variations({
		el : $('#variations_table'),
		collection : this.variations,
		statusDiv  : VT.statusDiv
	});
	
	

}
var variationsTable = new VariationsTable();
console.log('about to print variations')
console.log(variationsTable.variations)
	*/
	

});
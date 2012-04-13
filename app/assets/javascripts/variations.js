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
    ":banner_id" : "fetch_banner"    
  },

  fetch_banner: function(banner_id) {
  	
  },
  create_ui : function(banner)
  {
	  	var statusDiv = $('<div></div>');
		statusDiv.top_of_page_status();
		
		var params = 
		{
			banner : banner,
			statusDiv : statusDiv
		}
		var varForm = $("#newVariationsForm");
		var varForm = varForm.create_variations(params).validate();
		fpa_hack = new FPAHack(varForm);
  }

});


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
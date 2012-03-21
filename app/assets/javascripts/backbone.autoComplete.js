
//
// should not be dependent on id and name for display, should be passed in by config
//

function AutoComplete(params){
	
	var App = this;
	
	App.Models = {
		Selector : Backbone.Model.extend(),
		Holder   : Backbone.Model.extend()
	};
	
	
	App.init = function()
	{
		var selectorWrapper = $("<div class='facebook-auto' style='width: 512px;'></div>").appendTo(params.el)
		var selectorsEl = $("<ul id='selectors' style='width: 512px; height: auto; display: block;'></ul>").appendTo(selectorWrapper);
		var holdersEl = $("<ul id='holders' class='holder'></ul>").insertBefore(selectorWrapper)

		App.selectorsCollection = new App.Collections.Selectors();
		App.holdersCollection = new App.Collections.Holders();
		App.selectorsView = new App.Views.Selectors({ 
			holders : App.holdersCollection,
			collection: App.selectorsCollection,
			el : selectorsEl
		});
		App.holdersView = new App.Views.Holders({ 
			selectors: App.selectorsCollection,
			collection: App.holdersCollection,
			el : holdersEl
		});

	};

	//////////////////////////////
	//
	// Collection
	//
	//////////////////////////////

	App.Collections = {};
	App.Collections.Selectors = Backbone.Collection.extend({
		model : App.Models.Selector,
		url   : params.selector.url
	});
	App.Collections.Holders = Backbone.Collection.extend({
		model : App.Models.Holder,
		url   : params.holder.url
	});
	
	//////////////////////////////
	//
	// Views
	//
	//////////////////////////////
	
	App.Views = {};
	
	App.Views.Selectors = Backbone.View.extend({
		initialize : function()
		{
			console.log('AutoComplete.Views.Selectors started');
			console.log(this.collection)
			_.bindAll(this,'render','appendItem');
			this.collection.bind('add',this.appendItem);
			this.collection.bind('change',this.render);
			this.collection.bind('destory', this.removeItem);
			this.collection.bind('reset',this.render);
			this.collection.fetch();
		},
		removeItem: function(){
			console.log('removeItem')
		},
		render : function(){
			console.log('in AutoComplete.Views.Collection render')
			var el = $(this.el);
			el.html('');
			var domFrag = document.createDocumentFragment();
			var view = this;
			var non_selected = this.collection.reject(
				function(model){ 
					console.log('wewe')
					console.log(view.options.holders)
					if( view.options.holders.find(function(m) { console.log('hihi');console.log(m.get('id'));if (m.get('id') == model.get('id'))  return m}) )
					return model 
				}
			);
			for(var i=0; i<non_selected.length; i++) // in case collection is not empty
			{
				this.appendItem(non_selected[i], domFrag);
			}
			el.append(domFrag)
		},
		appendItem : function(model, domFrag)
		{
			console.log('in appendItem')
			console.log(model)
			var view = this;
			var modelView = new App.Views.Selector({
				model : model,
				collectionView : this
			});
			if(modelView) domFrag.appendChild(modelView.render().el);
		}
	});
	
	this.Views.Holders = Backbone.View.extend({
		initialize : function()
		{
			console.log('AutoComplete.Views.Holders started');
			console.log(this.collection)
			_.bindAll(this,'render','appendItem');
			this.options.selectors.bind('reset', this.dink)
			this.collection.bind('create',this.appendItem);
			this.collection.bind('change',this.render);
			this.collection.bind('reset',this.render);
			this.bitInput = this.addInput(false);
			this.collection.fetch();
		},
		dink : function()
		{
			console.log('Selctors reset!')
		},
		render : function(){
			console.log('in AutoComplete.Views.holders render')
			var el = $(this.el);
			el.html('');
			
			this.bitInput.appendTo(el)
	
			var domFrag = document.createDocumentFragment();
			_(this.collection.models).each(function(model){ // in case collection is not empty
				this.appendDomFrag(model, domFrag);
			}, this);
			$(domFrag).insertBefore(this.bitInput);
	
		},
		appendDomFrag : function(model, domFrag)
		{
			console.log('in appendItem')
			console.log(model)
			var view = this;
			var modelView = new App.Views.Holder({
				model : model,
				collectionView : this
			});
			if(modelView) domFrag.appendChild(modelView.render().el);
		},
		addInput : function(focusme) {
	     var li = $('<li class="bit-input">');
	     var input = $('<input type="text" class="maininput"  autocomplete="off">');
	   	var el = $(this.el);
	     li.append(input);
	
	     input.focus( function() {
	       isactive = true;
	       /*
	       if (maxItems()) {
	         complete.fadeIn("fast");
	       }
	       */
	     });
	     
	     input.blur( function() {
	       isactive = false;
	       if (complete_hover) {
	         complete.fadeOut("fast");
	       } else {
	         input.focus();
	       }
	     });
	     
	     el.click( function() {
	       console.log('hi')
	       /*
	       if (options.input_min_size < 0 && feed.length) {
	         load_feed(xssPrevent(input.val(), 1));
	       }
	       input.focus();
	       if (feed.length && input.val().length > options.input_min_size) {
	         feed.show();
	       } else {
	         clear_feed(1);
	         complete.children(".default").show();
	       }
	       */
	     });
	     
	     input.keypress( function(event) {
	       if (event.keyCode == _key.enter) {
	         return false;
	       }
	       //auto expand input
	       var newsize = (options.input_min_size > input.val().length) ? options.input_min_size : (input.val().length + 1);
	       input.attr("size", newsize).width(parseInt(input.css('font-size')) * newsize);
	     });
	
	     input.keyup( function(event) {
	
	       var etext = xssPrevent(input.val(), 1);
	       
	       if (event.keyCode == _key.backspace && etext.length == 0) {
	         clear_feed(1);
	         if (!holder.children("li.bit-box:last").hasClass('locked')) {
	           if (holder.children("li.bit-box.deleted").length == 0) {
	             holder.children("li.bit-box:last").addClass("deleted");
	             return false;
	           } else {
	             if (deleting) {
	               return;
	             }
	             deleting = 1;
	             holder.children("li.bit-box.deleted").fadeOut("fast", function() {
	               removeItem($(this));
	               return false;
	             });
	           }
	         }
	       }
	
	       if (event.keyCode != _key.downarrow && event.keyCode != _key.uparrow && event.keyCode!= _key.leftarrow && event.keyCode!= _key.rightarrow && etext.length > options.input_min_size) {
	         load_feed(etext);
	         complete.children(".default").hide();
	         feed.show();
	       }
	     });
	    
	     if (focusme) {
	       setTimeout( function() {
	         input.focus();
	         complete.children(".default").show();
	       }, 1);
	     }
	     return li
	   },
	
		appendItem : function(model)
		{
			this.options.selectors.remove(model)
			var modelView = new App.Views.Holder({
				model : model,
				collectionView : this
			});
			$(modelView.render().el).insertBefore(this.bitInput);
		}
	});
	
	this.Views.Selector = Backbone.View.extend(
	{
		template : "<span>{{name}}</span>",
		tagName : 'li', 
		initialize : function()
		{
			_.bindAll(this,'render','select');
		},
		events :
		{
			'click' : 'select'
		},
		select : function()
		{
			console.log(this.options.collectionView.options.holders)
			console.log(this.model)
			this.options.collectionView.options.holders.create({segment_id:this.model.get('id'), name: this.model.get('name')})
			this.remove();
		},
		render: function()
		{
			var el = $(this.el);
			el.html('');
			$(Mustache.to_html(this.template, this.model.toJSON())).appendTo(this.el);
			return this
		}
	});
	
	this.Views.Holder = Backbone.View.extend(
	{
		template : "<span>{{name}}</span><span class='unselect'>x</span>",
		tagName : 'li', 
		initialize : function()
		{
			_.bindAll(this,'render','unselect');
		},
		events :
		{
			'click span.unselect' : 'unselect'
		},
		unselect : function()
		{
			this.remove();
		},
		render: function()
		{
			var el = $(this.el).addClass('bit-box');
			el.html('');
			$(Mustache.to_html(this.template, this.model.toJSON())).appendTo(this.el);
			return this
		}
	});
	
	App.init();
};




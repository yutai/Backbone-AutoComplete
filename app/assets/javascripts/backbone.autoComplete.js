
//
// should not be dependent on id and name for display, should be passed in by config
//

function AutoComplete(params){
	
	var AC = this;
	var getBoxTimeout = 0;
	var _key = { 'enter': 13,
                'tab': 9,
                'comma': 188,
                'backspace': 8,
                'leftarrow': 37,
                'uparrow': 38,
                'rightarrow': 39,
                'downarrow': 40,
                'exclamation': 33,
                'slash': 47,
                'colon': 58,
                'at': 64,
                'squarebricket_left': 91,
                'apostrof': 96
              };
	var prompt = $('<li>Start typing to search...</li>');
	    
	function xssPrevent(string, flag) {
		if (typeof flag != "undefined") {
			for(i = 0; i < string.length; i++) {
				var charcode = string.charCodeAt(i);
				if ((_key.exclamation <= charcode && charcode <= _key.slash) ||
				(_key.colon <= charcode && charcode <= _key.at) ||
				(_key.squarebricket_left <= charcode && charcode <= _key.apostrof)) {
					string = string.replace(string[i], escape(string[i]));
				}
			}
			string = string.replace(/(\{|\}|\*)/i, "\\$1");
		}
		return string.replace(/script(.*)/g, "");
	}           
	AC.Models = {
		Selector : Backbone.Model.extend(),
		Holder   : Backbone.Model.extend()
	};
	
	AC.init = function()
	{
		var selectorWrapper = $("<div class='facebook-auto' style='width: 512px;'></div>").appendTo(params.el)
		var selectorsEl = $("<ul id='selectors' style='width: 512px; height: auto; display: block;'></ul>").appendTo(selectorWrapper);
		var holdersEl = $("<ul id='holders' class='holder'></ul>").insertBefore(selectorWrapper)
		AC.selectorsCollection = new AC.Collections.Selectors();
		AC.holdersCollection = new AC.Collections.Holders();
		AC.selectorsView = new AC.Views.Selectors({ 
			holders : AC.holdersCollection,
			collection: AC.selectorsCollection,
			el : selectorsEl
		});
		AC.holdersView = new AC.Views.Holders({ 
			selectors: AC.selectorsCollection,
			selectorsView : AC.selectorsView,
			collection: AC.holdersCollection,
			el : holdersEl
		});
		getBoxTimeout = 0;

	};

	//////////////////////////////
	//
	// Collection
	//
	//////////////////////////////

	AC.Collections = {};
	AC.Collections.Selectors = Backbone.Collection.extend({
		model : AC.Models.Selector,
		url   : params.selector.url
	});
	AC.Collections.Holders = Backbone.Collection.extend({
		model : AC.Models.Holder,
		url   : params.holder.url
	});
	
	//////////////////////////////
	//
	// Views
	//
	//////////////////////////////
	
	AC.Views = {};
	
	AC.Views.Selectors = Backbone.View.extend({
		initialize : function()
		{
			console.log('AutoComplete.Views.Selectors started');
			_.bindAll(this,'render','appendItem');
			this.collection.bind('add',this.appendItem);
			this.collection.bind('change',this.render);
			this.collection.bind('reset',this.render);
		},
		render : function(){
			console.log('in AutoComplete.Views.Collection render')
						

			var el = $(this.el);
			el.html('');
			var domFrag = document.createDocumentFragment();
			var view = this;
			
			var nonSelectedCounter = 0;
			for (var i = 0; (nonSelectedCounter < 10) && (i < view.collection.length) ; i++)
			{
				console.log(this.collection.models[i].get('id'))
				var id = this.collection.models[i].get('id')
				if( !view.options.holders.find(function(m) { 
					if (m.get('otex_id') == id)  return m
				}) ) 
				{
					this.appendItem(view.collection.models[i], domFrag);
					nonSelectedCounter++;
				}
				//nonSelected.push(view.collection.models[i])
			}
			/*
			var non_selected = this.collection.reject(
				function(model){ 
					if( view.options.holders.find(function(m) { 
						if (m.get('otex_id') == model.get('id'))  return m
					}) )
					return model 
				}
			);
			console.log('non_selected is ' + non_selected.length + ' and selectors is ' + this.collection.length + '. and nonSelected is ' + nonSelected.length)
			
			for(var i=0; i<nonSelected.length; i++) // in case collection is not empty
			{
				this.appendItem(non_selected[i], domFrag);
			}
			*/
			el.append(domFrag)
			el.fadeIn()
		},
		appendItem : function(model, domFrag)
		{
			console.log('in appendItem')
			var view = this;
			var modelView = new AC.Views.Selector({
				model : model,
				collectionView : this
			});
			if(modelView) domFrag.appendChild(modelView.render().el);
		}
	});
	
	AC.Views.Holders = Backbone.View.extend({
		initialize : function()
		{
			console.log('AutoComplete.Views.Holders started');
			console.log(this.collection)
			_.bindAll(this,'render','appendItem');
			this.collection.bind('add',this.appendItem);
			this.collection.bind('destory', this.bink)
			this.collection.bind('reset',this.render);
			this.bitInputWrapper = $('<li class="bit-input">');
			this.bitInput = this.addInput(false).appendTo(this.bitInputWrapper);
			this.collection.fetch();
		},
		bink : function(){console.log('bink')},
		render : function(){
			console.log('in AutoComplete.Views.holders render')
			var el = $(this.el);
			el.html('');
			this.bitInput.val('');
			this.bitInputWrapper.appendTo(el)
	
			var domFrag = document.createDocumentFragment();
			_(this.collection.models).each(function(model){ // in case collection is not empty
				this.appendDomFrag(model, domFrag);
			}, this);
			$(domFrag).insertBefore(this.bitInputWrapper);
	
		},
		appendItem : function(model)
		{
			console.log('in append item');
			this.bitInput.val('');
			this.options.selectors.remove(model)
			var modelView = new AC.Views.Holder({
				model : model,
				collectionView : this
			});
			$(modelView.render().el).insertBefore(this.bitInputWrapper);
			this.options.selectors.reset();
		},
		appendDomFrag : function(model, domFrag)
		{		
			var view = this;
			var modelView = new AC.Views.Holder({
				model : model,
				collectionView : this
			});
			if(modelView) domFrag.appendChild(modelView.render().el);
		},
		addInput : function(focusme) {
			var view = this;
			var input = $('<input type="text" class="maininput"  autocomplete="off">');
	   	var el = $(this.el);
	   	
	   	input.focus( function() {
	   		isactive = true;
	   		console.log('in focus')
	   		if(view.options.selectors.length == 0) $(view.options.selectorsView.el).prepend(prompt);
	   		 $(view.options.selectorsView.el).fadeIn();
	   		
   /*
   if (maxItems()) {
     complete.fadeIn("fast");
   }
   */
			});
			input.blur( function() {
				isactive = false;
				$(view.options.selectorsView.el).fadeOut('fast');
				/*
				isactive = false;
				if (complete_hover) {
					complete.fadeOut("fast");
				} else {
					input.focus();
				}
				*/
			});
 
			el.click( function() {
				setSize();
				input.focus();
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
				console.log('in keypress')
				//auto expand input
				setSize();
			});
			function setSize ()
			{
				var newsize = (params.input_min_size > input.val().length) ? params.input_min_size : (input.val().length + 1);
				input.prop("size", newsize).width(parseInt(input.css('font-size')) * newsize);
			}
			
			
			input.keyup( function(event) {
				var etext = xssPrevent(input.val(), 1);
				if (event.keyCode == _key.backspace && etext.length == 0) {
					view.options.selectors.reset();
					$(view.options.selectorsView.el).prepend(prompt);
					console.log('to print holder last')
					console.log(view.collection.last())
					/*
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
						
					}*/
				}
				if (event.keyCode != _key.downarrow && event.keyCode != _key.uparrow && event.keyCode!= _key.leftarrow && event.keyCode!= _key.rightarrow && etext.length > params.input_min_size) {
					view.load_feed(etext);
					//complete.children(".default").hide();
					//feed.show();
				}
			});
			    
			view.load_feed = function(etext){
				counter = 0;
				
				///////////////
				//
				// Look into what reachingMax items means 
				//
				//////////////
				if ( maxItems()) {
					getBoxTimeout++;
					var getBoxTimeoutValue = getBoxTimeout;
					setTimeout( function() {
						if (getBoxTimeoutValue != getBoxTimeout) return;
						
						view.options.selectors.fetch({data: {search: etext, per_page : view.collection.length + 10, bucket:params.bucket}});
					}, params.delay);
				} else {
					//addMembers(etext);
					//bindEvents();
				}
			}

			function maxItems() {
				return params.maxitems != 0 && (view.collection.length < params.maxitems);
			}

			if (focusme) {
				setTimeout( function() {
					input.focus();
					complete.children(".default").show();
				}, 1);
			}
			return input
	   }
	});
	
	this.Views.Selector = Backbone.View.extend(
	{
		template : "<span>{{name}} ${{price}}</span>",
		tagName : 'li', 
		initialize : function()
		{
			_.bindAll(this,'render','select');
		},
		events :
		{
			'click' : 'select',
			'hover' : 'hover'
		},
		hover : function()
		{
			console.log('hover')
		},
		select : function()
		{
			console.log('in Selector selection action')
			this.options.collectionView.options.holders.create({otex_id:this.model.get('id'), name: this.model.get('name'), price: this.model.get('price')})
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
		template : "<span>{{name}}  ${{price}}</span><a class='closebutton' href='#'></a>",
		tagName : 'li', 
		initialize : function()
		{
			_.bindAll(this,'render','unselect','remove');
			
			this.model.bind('destory', this.remove, this)
		},
		dink : function(){console.log('h9i')},
		events :
		{
			'click a.closebutton' : 'unselect'
		},
		unselect : function()
		{
			this.model.destroy();
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
	
	AC.init();
};




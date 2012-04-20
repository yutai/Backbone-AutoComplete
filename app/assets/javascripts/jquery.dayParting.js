(function($){
	var methods = 
	{
		init : function(banner) 
		{
			var self = this;
			return this.each(function(){
				//self.data('selected_dayhours', selected_dayhours);
				self.data('sourceHours',[])
				$.ajax({
					url		: "/ui/mock_dayparting_segments_api.json", 
					dataType : 'json',
					type		: 'GET',
					success	: function(response)
					{
						function sortfunc(a,b)
						{
						return a.nodeId - b.nodeId;
						}
						sourceHours = response.segments.sort(sortfunc)
						self.data('sourceHours',sourceHours)
						
						self.data(
							'days',
							[
								{ id : 0, name : "Sun" },
								{ id : 1, name : "Mon" },
								{ id : 2, name : "Tues"},
								{ id : 3, name : "Wed"},
								{ id : 4, name : "Thur"}, 
								{ id : 5, name : "Fri"}, 
								{ id : 6, name :"Sat"}
							]
						);
						var day_parting_table = $(Mustache.to_html($('#day_parting_tmpl').html(),banner)).appendTo($(self));
						self.data('dayhours',{days : []});
						self.data('days_collection', self.day_parting('days',(self.data('days'))));
						self.data(
							'day_parting_details_view', 
							$(self).day_parting(
								'daysview',
								{
									el : $('#day_parting_table'),
									collection : self.data('days_collection')
								}
							)
						);
						
						function filter_selected(selected)
						{
							var filtered = [];
							_.each(selected,function(hour){
								filtered.push(hour.id)
							})
							return filtered
						}
						
						$.ajax({
							url : '/ui/mock_dayparting_selected.json',
							type : 'GET',
							success : function(response)
							{
								var selected = filter_selected(response)
								for (var d=0; d < self.data('days_collection').length; d++)
								{
									self.data('days_collection').models[d]['hours'].each(function(hour){
										if(_.indexOf(selected,hour.get('_id')) != -1) hour.set('selected', true)
									});
								}
							}
						});
						
						
						
						
						
					}
				});
				
				
				
			});
		},
		
		/////////////////////////////////////////////
		//
		// Models
		//
		///////////////////////////////////////////// 		
		
		day : function()
		{
			var self = this;
			var Day = Backbone.Model.extend({
				initialize : function()
				{
					
					var hours = [];
					for (var n = 0; n < 24; n++) {
						var dn = this.id * 24 + n;
						
						
						hours.push(
							{
								_id : self.data('sourceHours')[dn]['id'],
								nodeId : dn,
								hour: ((n % 12) == 0)? 12 : n%12, 
								selected: false
							}
						);
						
					}
					this.hours = self.day_parting('hours', hours);
				}
				
			});
			return  Day;
		},
		
		hour : function()
		{
			var Hour = Backbone.Model.extend();
			return  Hour;
		},
		
		/////////////////////////////////////////////
		//
		// Collections
		//
		///////////////////////////////////////////// 
				
		days : function(args) 
		{
			var self = this;
			var Days = Backbone.Collection.extend({ 
				model : $(self).day_parting('day') 
			});
			return  new Days(args)
		},
		hours : function(args)
		{
			var self = this;
			var Hours = Backbone.Collection.extend({
			  model: self.day_parting('hour')
			});
			return new Hours(args)
		},

	
			
		/////////////////////////////////////////////
		//
		// Views
		//
		///////////////////////////////////////////// 
		daysview : function(args)
		{
			var self = this;
			var View = Backbone.View.extend({
				initialize: function(){
					_.bindAll(this, 'render', 'appendItem');
					this.collection.bind('add', this.appendItem); 
					this.collection.bind('reset', this.render);// collection event binder
					this.counter = 0;
					this.render();
				},
				clear_selection : function(){
					this.collection.reset();
				},
				render: function(){
					$(this.el).html('');
					_(this.collection.models).each(function(day){ // in case collection is not empty
						this.appendItem(day);
					}, this);
				},
				appendItem: function(day){
					var view = this;
					var dayView = $(self).day_parting('dayview', {
						model : day,
					});
			
					$('table.day_parting_table').append(dayView.render().el);
				}
			});
			return new View(args);
		},
		dayview : function(args) 
		{
			var self = this;
			
			var View = Backbone.View.extend({
				tagName: 'tr', 
				initialize: function()
				{
					_.bindAll(this, 'render', 'unrender', 'remove'); 
					this.model.bind('remove', this.unrender);
				},
				render: function()
				{
					
					var tr = $(Mustache.to_html($("#day_parting_day_tmpl").html(),{day: args.model.get('name')})).appendTo(this.el);
					var hours = $(self).day_parting('hoursview',{							
						el : tr,
						collection : this.model.hours
					});
					
					return this; 
				},
				unrender: function()
				{
					$(this.el).remove();
				},
				
				remove: function()
				{
					this.model.destroy();
				}
				
			});
			return new View(args);
		},

		hourview : function(args) 
		{
			
			var self = this;
			var View = Backbone.View.extend({
				tagName: 'td', 
				events: 
				{ 
					'mouseover' : 'mouse_over_option',
					'mousedown' : 'toggle_selection'
				},		
				toggle_selection : function()
				{
					self.data('selectionState', !this.model.get('selected'));
					this.model.set('selected', self.data('selectionState'))
				},
				mouse_over_option : function()
				{
					if(self.data('isDown')) 
					{
						$(this.el).find('input.day_parting_checkbox').prop('checked', function(){return !$(this).prop('checked')})
						var selection = $(this.el).find('input.day_parting_checkbox').prop('checked');
						this.model.set({"selected" : self.data('selectionState')});
					} 
				},
			
				initialize: function()
				{
					_.bindAll(this, 'render', 'unrender', 'remove','update_checkbox_selection','mouse_over_option','updateView'); 
					this.model.bind('remove', this.unrender);
					this.model.bind('change',this.updateView);
					self.data('isDown',false);   // Tracks status of mouse button
					$(document).mousedown(function() {
						self.data('isDown', true);      // When mouse goes down, set isDown to true
					})
					.mouseup(function() {
						self.data('isDown', false);    // When mouse goes up, set isDown to false
					});

				},
				render: function()
				{
					$(Mustache.to_html($("#day_parting_item_tmpl").html(),{id: args.model.attributes.id, name: args.model.attributes.hour})).appendTo(this.el);
					this.updateView();
					return this; 
				},
				unrender: function()
				{
					$(this.el).remove();
				},
				updateView: function()
				{
					if(this.model.get('selected'))
					{
						$(this.el).addClass('day_parting_on');
					} 
					else 
					{
						$(this.el).removeClass('day_parting_on');
					}
					$(this).day_parting('toggle_summary',this.options );
				},
				remove: function()
				{
					this.model.destroy();
				},
				update_checkbox_selection : function () 
				{
					var selection = $(this.el).find('input.day_parting_checkbox').prop('checked');
					this.model.set({"selected" : selection});
				}
			});
			return new View(args);
		},
		
		hoursview : function(args)
		{
			
			var View = Backbone.View.extend({
				initialize: function(){
					_.bindAll(this, 'render', 'appendHour','dink');
					this.collection.bind('add', this.appendItem); 
					this.collection.bind('change',this.dink)
					this.collection.bind('reset', this.render);// collection event binder
					this.counter = 0;
					this.render();
				},
				dink : function()
				{
					var period = $(this.el).parent('tr').find('.period')
					var selected = this.collection.filter(function(model) {if (model.get('selected')) return model});
					selected.sort(function(a,b){return a.get('nodeId') - b.get('nodeId') })
				},
				clear_selection : function(){
					this.collection.reset();
				},
				render: function(){
					_(this.collection.models).each(function(hour){ // in case collection is not empty
						this.appendHour(hour);
					}, this);
				},
				appendHour: function(hour){
					var view = this;
					var hourView = $(self).day_parting('hourview',{
						model   : hour,
					});
					$(this.el).parent('tr').append(hourView.render().el);
				}
				
			});
			return new View(args);
		},
		
		/////////////////////////////////////////////
		// 
		//  Summary related functions
		//
		///////////////////////////////////////////// 	
	
		summarylistview : function(args)
		{
			var View = Backbone.View.extend({
				initialize: function()
				{
					
					_.bindAll(this, 'render'); 
					var view = this;
					
					$.each(
						this.collection.models, 
						function()
						{ 
							this.bind(
								'change',
								function()
								{
									view.render();
								}
							);
							this.bind(
								'add',
								function()
								{
									view.render();
								}
							);
						}
					);
					this.collection.bind('change',this.render);
					this.collection.bind('reset',this.render);
					this.collection.bind('add',this.render);
					this.render();
				},
				render: function()
				{
					var data     = this.collection.invoke('toJSON');
					var element  = $(this.el);
					element.html('').hide();
					console.log(data);
					for (var i=0; i < data.length; i++)
					{
						if (data[i].selected && data[i].id) 
						{
							//var li = $('<li><span>'+data[i].name+'</span></li>');
							//element.append(li);
							//console.log(data[i])
							//$.tmpl('summaryview_template_' + this.options.pricing_type, data[i]).appendTo(element);
						}
					}
					if (element.html() != '')
					{
						element.show();
					} 
					$(self).adgroup_targeting('toggle_summary',this.options);
				}
			});
			return new View(args);
		},
		toggle_summary : function (params)
		{
			/*var section_empty = true;
			var subsections   = $('#' + params.targeting_type + ' .summary_subsection');
			var none          = $('#' + params.targeting_type + ' .none');
			for (var i=0; i < subsections.length; i++)
			{
				var subsection = $(subsections[i]);
				var subsection_empty = true;
				var lists = subsection.find('ul.summary');
				for (var j=0; j<lists.length; j++)
				{
					if ($(lists[j]).html() != '') 
					{
						$(lists[j]).show();
						subsection_empty = false;
						section_empty = false;
					} 
					else
					{
						$(lists[j]).hide();
					} 
				}
				if (subsection_empty)
				{
					subsection.hide()
				}
				else
				{
					subsection.show();
				}
			}
			if (section_empty)
			{
				none.show()
			}
			else
			{
				none.hide();
			}
		*/	
		}
		
	};
	
	
	
	/////////////////////////////////////////////
	// 
	//
	//  initiate function scope
	//  --------------------------
	//
	///////////////////////////////////////////// 
	
	$.fn.day_parting = function(method)
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
			$.error( 'Method ' +  method + ' does not exist on jQuery.number_to_day_hour' );
		}    
		
	}
})(jQuery);
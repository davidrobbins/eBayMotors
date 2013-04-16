
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

	function loadVehiclesSelectBox(variantId, variantTitle, modelTitle, makeTitle) {
		ds.Vehicle.query("variant.ID == :1", variantId, {
			onSuccess: function(ev1) {
				if (ev1.entityCollection.length > 0) {
					ev1.entityCollection.forEach({
						onSuccess: function(ev2) {
							$('<div>', {
								html: "<strong>" + makeTitle + "</strong>" + " • " + modelTitle + " • " + variantTitle + "<span class='quiet'>" + " • " + "no vehicles selected" + "</span>",
								"class" : "vehicleTitle",
								"data-id" : ev2.entity.ID.getValue()
							}).appendTo('#selectVehiclesContainer');
						}
					}); //ev1.entityCollection.forEach
				} //if (ev1.entityCollection.length > 0)
			} //onSuccess: function(ev1)
		});
		
		/*
		$('<div>', {
			text: "test",
			"class": "vehicleContainer"
		}).appendTo('#selectVehiclesContainer');
		*/
		
		/*
		var divHandle = $('<div>', {
			text: "one"
		});
		
		var divHandle2 = $('<div>', {
			text: "two"
		});
		
		var divHandle3 = $('<div>', {
			
		});
		
		
		divHandle3.append(divHandle);
		divHandle3.append(divHandle2);
		$('#selectVehiclesContainer').append(divHandle3);
		*/
		
	}
	
	function loadVariantSelectBox(modelId, modelTitle, makeTitle) {
		ds.Variant.query("model.ID == :1", modelId, {
			onSuccess: function(ev1) {
				$('#filterVariantContainer').empty();
				if (ev1.entityCollection.length > 0) {
					ev1.entityCollection.forEach({
						onSuccess: function(ev2) {
							var title = ev2.entity.title.getValue();
							$('<div>', {
								text: title,
								"class" : "selectionElement",
								"data-id" : ev2.entity.ID.getValue(),
								"data-title" : title,
								"data-model" : modelTitle,
								"data-make" : makeTitle
							}).appendTo('#filterVariantContainer');
						}
					});
				}
			}
		});
	}
	
	function loadModelSelectBox(makeId, makeTitle) {
		ds.Model.query("make.ID == :1", makeId, {
			onSuccess: function(ev1) {
				$('#filterModelContainer').empty();
				if (ev1.entityCollection.length > 0) {
					ev1.entityCollection.forEach({
						onSuccess: function(ev2) {
							var title = ev2.entity.title.getValue();
							$('<div>', {
								text: title,
								"class" : "selectionElement",
								"data-id" : ev2.entity.ID.getValue(),
								"data-title" : title,
								"data-make" : makeTitle
							}).appendTo('#filterModelContainer');
						}
					});
				}
			}
		});
	}


	function loadMakeSelectBox() {
		ds.Make.all({
			onSuccess: function(ev1) {
				ev1.entityCollection.forEach({
					onSuccess: function(ev2) {	
						//Use jQuery to build the Definition Titles.
						var title = ev2.entity.title.getValue();
						$('<div>', {
							text: title,
							"class" : "selectionElement",
							"data-id" : ev2.entity.ID.getValue(),
							"data-title" : title
						}).appendTo('#filterMakeContainer');	
					}
				});
			} //end - onSuccess: function(ev1)
		});
	}
// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		loadMakeSelectBox();
		
			//Create event handler for our Make select.
			//#filterMakeContainer
			//div.filterContainer
		/*
		$('#filterMakeContainer').on('click', 'div', function() {
			$this = $(this);
			loadModelSelectBox($this[0].innerHTML);
		});	
		*/
		
		
		$('div.filterContainer').on('click', 'div', function() {
			$this = $(this);
			$this.addClass('selected');
			
			if ($this.parent().attr("id") == "filterMakeContainer") {
				loadModelSelectBox($this.data("id"), $this.data("title")); //$this[0].innerHTML
			}
			
			if ($this.parent().attr("id") == "filterModelContainer") {
				loadVariantSelectBox($this.data("id"), $this.data("title"), $this.data("make"));
			}
			
			if ($this.parent().attr("id") == "filterVariantContainer") {
				loadVehiclesSelectBox($this.data("id"), $this.data("title"), $this.data("model"), $this.data("make"));
			}
		});	
		
		$('div.filterContainer').on('mouseenter', 'div', function() {
			$this = $(this);
			$this.addClass('inFocus');
		});	
		
		$('div.filterContainer').on('mouseleave', 'div', function() {
			$this.removeClass('inFocus');
		});	
		
		
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock

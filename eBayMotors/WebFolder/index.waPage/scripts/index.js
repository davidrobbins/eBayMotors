
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

	function loadVehiclesSelectBox(variantId) {
		/*
		$('<div>', {
			text: "test",
			"class": "vehicleContainer"
		}).appendTo('#selectVehiclesContainer');
		*/
		
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
		
		
	}
	
	function loadVariantSelectBox(modelId) {
		ds.Variant.query("model.ID == :1", modelId, {
			onSuccess: function(ev1) {
				$('#filterVariantContainer').empty();
				if (ev1.entityCollection.length > 0) {
					ev1.entityCollection.forEach({
						onSuccess: function(ev2) {
							$('<div>', {
								text: ev2.entity.title.getValue(),
								"class" : "selectionElement",
								"data-id" : ev2.entity.ID.getValue()
							}).appendTo('#filterVariantContainer');
						}
					});
				}
			}
		});
	}
	
	function loadModelSelectBox(makeId) {
		ds.Model.query("make.ID == :1", makeId, {
			onSuccess: function(ev1) {
				$('#filterModelContainer').empty();
				if (ev1.entityCollection.length > 0) {
					ev1.entityCollection.forEach({
						onSuccess: function(ev2) {
							$('<div>', {
								text: ev2.entity.title.getValue(),
								"class" : "selectionElement",
								"data-id" : ev2.entity.ID.getValue()
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
						$('<div>', {
							text: ev2.entity.title.getValue(),
							"class" : "selectionElement",
							"data-id" : ev2.entity.ID.getValue()
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
				loadModelSelectBox($this.data("id")); //$this[0].innerHTML
			}
			
			if ($this.parent().attr("id") == "filterModelContainer") {
				loadVariantSelectBox($this.data("id"));
			}
			
			if ($this.parent().attr("id") == "filterVariantContainer") {
				loadVehiclesSelectBox($this.data("id"));
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

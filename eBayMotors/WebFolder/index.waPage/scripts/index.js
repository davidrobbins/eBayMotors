
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock
	
	var permModelIds = [],
		permVariantIds = [];
	
	function addToVehiclesSelectBox(variantId, variantTitle, modelTitle, makeTitle) {
		var divVehicleWrapper = $('<div>', {});
		var vehicleHeader = $('<div>', {
			html: "<strong>" + makeTitle + "</strong>" + " • " + modelTitle + " • " + variantTitle + "<span class='quiet'>" + " • " + "no vehicles selected" + "</span>",
			"class" : "vehicleGroupHeader",
			"data-id" : variantId
		}).appendTo(divVehicleWrapper);					
							
		ds.Vehicle.query("variant.ID == :1", variantId, {
			autoExpand: "manufactureCollection",
			onSuccess: function(ev1) {
				if (ev1.entityCollection.length > 0) {	
					ev1.entityCollection.forEach({
						onSuccess: function(ev2) {
							var vehicleItemDiv = $('<div>', {
								html: "<strong>" + ev2.entity.name.getValue() + "</strong>" + " • " + ev2.entity.engineDisplacement.getValue() + "ccm " + ev2.entity.horsePower.getValue() + "HP",
								"class" : "vehicleGroupItem",
								"data-id" : ev2.entity.ID.getValue()
							}).appendTo(divVehicleWrapper);
							
							//Get manufacturer collection for current vehicle
							var manufactureCollection = ev2.entity.manufactureCollection.relEntityCollection;
							if (manufactureCollection.length > 0) {
								var yearString = "",
									count = 0;
								manufactureCollection.forEach({
									onSuccess: function(ev3) {
										count += 1;
										yearString += "<input type='checkbox'>";
										yearString += " " + ev3.entity.year.getValue() + "&nbsp;&nbsp;&nbsp;";
										if (count > 7) {
											yearString += "<br/>";
											count = 0;
										}
									}, //onSuccess: function(ev3)
									atTheEnd: function(ev4) {
										$('<div>', {
											html: yearString,
											"class" : "vehicleManufacture"
										}).appendTo(divVehicleWrapper);		
									}	
								}); //manufactureCollection.toArray("year"
							} //if (manufactureCollection.length > 0)
						} //onSuccess: function(ev2)
					}); //ev1.entityCollection.forEach
				} //if (ev1.entityCollection.length > 0)
			} //onSuccess: function(ev1)
		});
	
		$('#selectVehiclesContainer').append(divVehicleWrapper);
	}
	
	function loadVariantSelectBox(modelId, modelTitle, makeTitle, makeId) {
		ds.Variant.query("model.ID == :1", modelId, {
			onSuccess: function(ev1) {
				//$('#filterVariantContainer').empty();
				if (ev1.entityCollection.length > 0) {
					ev1.entityCollection.forEach({
						onSuccess: function(ev2) {
							var theClassesString = permVariantIds.indexOf(ev2.entity.ID.getValue()) != -1 ? "selectionElement selectedPerm" : "selectionElement"; 
							var title = ev2.entity.title.getValue();
							$('<div>', {
								text: title,
								"class" : theClassesString,
								"data-id" : ev2.entity.ID.getValue(),
								"data-title" : title,
								"data-model" : modelTitle,
								"data-make" : makeTitle,
								"data-makeid" : makeId,
								"data-modelid" : modelId
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
							//permModelIds
							var theClassesString = permModelIds.indexOf(ev2.entity.ID.getValue()) != -1 ? "selectionElement selectedPerm" : "selectionElement"; 
							
							var title = ev2.entity.title.getValue();
							$('<div>', {
								text: title,
								"class" : theClassesString,
								"data-id" : ev2.entity.ID.getValue(),
								"data-title" : title,
								"data-make" : makeTitle,
								"data-makeid" : makeId
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
		
		$('div.filterContainer').on('click', 'div', function() {
			$this.siblings().removeClass('inFocus selected');
			$this = $(this);
			$this.addClass('selected');
			
			if ($this.parent().attr("id") == "filterMakeContainer") {
				$('#filterModelContainer').empty();
				$('#filterVariantContainer').empty();
				loadModelSelectBox($this.data("id"), $this.data("title"));
			}
			
			if ($this.parent().attr("id") == "filterModelContainer") {
				$('#filterVariantContainer').empty();
				loadVariantSelectBox($this.data("id"), $this.data("title"), $this.data("make"), $this.data("makeid"));
			}
			
			if ($this.parent().attr("id") == "filterVariantContainer") {
				addToVehiclesSelectBox($this.data("id"), $this.data("title"), $this.data("model"), $this.data("make"));
				
				//add Perm Select to the make and model for this session.
				$('#filterMakeContainer').find("div[data-id='" + $this.data("makeid") +"']").addClass('selectedPerm');
				$('#filterModelContainer').find("div[data-id='" + $this.data("modelid") +"']").addClass('selectedPerm');
				$this.addClass('selectedPerm');
				permModelIds.push($this.data("modelid"));
				permVariantIds.push($this.data("id"));
			}
		});	
		
		$('div.filterContainer').on('mouseenter', 'div', function() {
			$this = $(this);
			$this.addClass('inFocus');
		});	
		
		$('div.filterContainer').on('mouseleave', 'div', function() {
			$this.removeClass('inFocus');
		});	
		
		//Event handler for vehicle disclosure
		$('#selectVehiclesContainer').on('click', '.vehicleGroupHeader', function() {
			$this = $(this);
			$this.siblings().toggle();
//			$this.nextUntil('dt').slideDown(300);
//			$this.siblings('dt').nextUntil('dt').slideUp(300);
		});

	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock

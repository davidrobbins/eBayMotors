
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock
	
	var makesFilterList,
		modelsFilterList,
		variantsFilterList;
	
	
	//Let's make a FilterListBox constructor.
	function FilterListBox(el) {
		this.el = document.getElementById(el);
	}
	
	
	FilterListBox.prototype.load = function(getListItemsFn, paramtersObj) {
		getListItemsFn(this.el, paramtersObj);
	};
	
	FilterListBox.prototype.unload = function() {
		$(this.el).empty();
	};	
	
	var permModelIds = [],
		permVariantIds = [];
	
	function addToVehiclesSelectBox(variantId, variantTitle, modelTitle, makeTitle, makeId, modelId) {
		var divVehicleWrapper = $('<div>', {
			"class" : "vehicleGroupWrapper notSelected"
		});
		var vehicleHeader = $('<div>', {
			html: "<strong>" + makeTitle + "</strong>" + " • " + modelTitle + " • " + variantTitle + "<span class='quiet'>" + " • " + "no vehicles selected" + "</span>",
			"class" : "vehicleGroupHeader",
			"data-id" : variantId,
			"data-count" : 0,
			"data-makeid" : makeId,
			"data-modelid" : modelId
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
										yearString += "<input type='checkbox' data-id='" + ev3.entity.ID.getValue() +  
														"' data-makeid='" + makeId + "' " +
														" data-modelid='" + modelId + "' " +
														" data-variantid='" + variantId 
														+ "'>";
										yearString += " " + ev3.entity.year.getValue() + "&nbsp;&nbsp;&nbsp;";
										if (count > 7) {
											yearString += "<br/>";
											count = 0;
										}
									}, //onSuccess: function(ev3)
									atTheEnd: function(ev4) {
										$('<div>', {
											html: yearString,
											"class" : "vehicleManufacture" //,
											//"data-id" : ev4.entity.ID.getValue()
										}).appendTo(divVehicleWrapper);		
									}	
								}); //manufactureCollection.toArray("year"
							} //if (manufactureCollection.length > 0)
						} //onSuccess: function(ev2)
					}); //ev1.entityCollection.forEach
				} //if (ev1.entityCollection.length > 0)
			} //onSuccess: function(ev1)
		});
	
		$('#selectVehiclesContainer').append(divVehicleWrapper) //.find('.notSelected').effect("highlight");
		
	}
	
	function getMakes(listBox) {
		var frag = document.createDocumentFragment();
		
		ds.Make.all({
			onSuccess: function(ev1) {
				ev1.entityCollection.forEach({
					onSuccess: function(ev2) {
						var title = ev2.entity.title.getValue(),
						    newDiv = document.createElement('div'),
							newDiv$ = $(newDiv);
						
						newDiv$.attr("text", title);
						newDiv$.attr("class", "selectionElement");
						newDiv$.attr("data-id", ev2.entity.ID.getValue());
						newDiv$.attr("data-title", title);
						newDiv$.text(title);
						frag.appendChild(newDiv);
					}, //end - onSuccess.
					atTheEnd: function() {
						listBox.appendChild(frag);
					}
				}); //end - forEach.
			} //end - onSuccess: function(ev1)
		});
	} //end - injectMakes
	
	//function getModels(listBox, makeId, makeTitle) {
	function getModels(listBox, paramtersObj) {
		var frag = document.createDocumentFragment();
		
		ds.Model.query("make.ID == :1", paramtersObj.makeId, {
			onSuccess: function(ev1) {
				ev1.entityCollection.forEach({
					onSuccess: function(ev2) {
					 	//permModelIds
						var theClassesString = permModelIds.indexOf(ev2.entity.ID.getValue()) != -1 ? "selectionElement selectedPerm" : "selectionElement",
							title = ev2.entity.title.getValue(),
						    newDiv = document.createElement('div'),
							newDiv$ = $(newDiv);
						
						newDiv$.attr("class", theClassesString);
						newDiv$.attr("data-id", ev2.entity.ID.getValue());
						newDiv$.attr("data-title", title);
						newDiv$.attr("data-make", paramtersObj.makeTitle);
						newDiv$.attr("data-makeid", paramtersObj.makeId);
						newDiv$.text(title);
						frag.appendChild(newDiv);
						
					}, //end - onSuccess.
					atTheEnd: function() {
						listBox.appendChild(frag);
					}
				}); //end - forEach.
			} //end - ds.Model.query {onSuccess: }.
		}); //end - ds.Model.query.
		
	} //end - getModels()
	
	//function getVariants(listBox, makeId, makeTitle, modelId, modelTitle) {
	function getVariants(listBox, paramtersObj) {
		var frag = document.createDocumentFragment();
		
		ds.Variant.query("model.ID == :1", paramtersObj.modelId, {
			onSuccess: function(ev1) {
				ev1.entityCollection.forEach({
					onSuccess: function(ev2) {
						var theClassesString = permVariantIds.indexOf(ev2.entity.ID.getValue()) != -1 ? "selectionElement selectedPerm" : "selectionElement",
							title = ev2.entity.title.getValue(),
							newDiv = document.createElement('div'),
							newDiv$ = $(newDiv);
							
						newDiv$.attr("class", theClassesString);
						newDiv$.attr("data-id", ev2.entity.ID.getValue());
						newDiv$.attr("data-title", title);
						newDiv$.attr("data-make", paramtersObj.makeTitle);
						newDiv$.attr("data-makeid", paramtersObj.makeId);
						newDiv$.attr("data-model", paramtersObj.modelTitle);
						newDiv$.attr("data-modelid", paramtersObj.modelId);
						newDiv$.text(title);
						frag.appendChild(newDiv);	
					},
					atTheEnd: function() {
						listBox.appendChild(frag);
					}		
				}); //end - forEach
			} //end - ds.Variant.query({onSuccess: });
		}); //end - ds.Variant.query();
	} //end - getVariants().
// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		//First instantiate our Filter containers.
		makesFilterList = new FilterListBox('filterMakeContainer');
		modelsFilterList = new FilterListBox('filterModelContainer');
		variantsFilterList = new FilterListBox('filterVariantContainer');
		
		makesFilterList.load(getMakes); //Load the Makes.
		
		$('div.filterContainer').on('click', 'div', function(event) {
			$this.siblings().removeClass('inFocus selected');
			$this = $(this);
			$this.addClass('selected');
			
			//M A K E
			if ($this.parent().attr("id") == "filterMakeContainer") {
				variantsFilterList.unload();
				modelsFilterList.unload();
				modelsFilterList.load(getModels, {makeId: $this.data("id"), makeTitle: $this.data("title")}); //Load the Models.
				
				//remove vehicle variant group that are not checked.
				var notSelectedVehicles = $('#selectVehiclesContainer').children('.notSelected');
				notSelectedVehicles.remove();
		
				var selectedVehicles = $('#selectVehiclesContainer').children('.someSelected');
				selectedVehicles.each(function(obj) {$(this).children('.vehicleGroupHeader').siblings().slideUp(400);});
			}
			
			//M O D E L
			if ($this.parent().attr("id") == "filterModelContainer") {
				variantsFilterList.unload();
				variantsFilterList.load(getVariants, {makeId: $this.data("makeid"), makeTitle: $this.data("make"), modelId: $this.data("id"), modelTitle: $this.data("title")});
		
				//remove vehicles that are not checked.
				var notSelectedVehicles = $('#selectVehiclesContainer').children('.notSelected');
				notSelectedVehicles.remove();
				
				var selectedVehicles = $('#selectVehiclesContainer').children('.someSelected');
				selectedVehicles.each(function(obj) {$(this).children('.vehicleGroupHeader').siblings().slideUp(400);});
			}
			
			//V A R I A N T
			if ($this.parent().attr("id") == "filterVariantContainer") {
				var selectedVehicles = $('#selectVehiclesContainer').children();
				selectedVehicles.each(function(obj) {$(this).children('.vehicleGroupHeader').siblings().slideUp(400);});
				
				addToVehiclesSelectBox($this.data("id"), $this.data("title"), $this.data("model"), $this.data("make"), $this.data("makeid"), $this.data("modelid"));
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
			var selectedVehicles = $('#selectVehiclesContainer').children();
				selectedVehicles.each(function(obj) {$(this).children('.vehicleGroupHeader').siblings().slideUp(400);});
				
			$this = $(this);
			$this.siblings().toggle();
		});
				
		$('#selectVehiclesContainer').on('click', '.vehicleManufacture', function(event) {
			var this$ = $(this),
				eventTarget$ = $(event.target),
				wrapper = eventTarget$.parent().parent(),
				vehicleGroupHeader = wrapper.children(':first'),
				vehiclesSelectedText = wrapper.find('span'),
				vehicleCheckedCount = +vehicleGroupHeader.attr("data-count");
			
			if (eventTarget$.prop('checked')) {
				wrapper.removeClass('notSelected');
				wrapper.addClass('someSelected');
				//update vehicle selected text
				vehicleCheckedCount += 1;
				vehiclesSelectedText.text(" • " + vehicleCheckedCount + " vehicles selected");
				vehicleGroupHeader.attr("data-count", vehicleCheckedCount);
				
				//add Perm Select to the make and model and variant for this session.
				$('#filterMakeContainer').find("div[data-id='" + eventTarget$.data("makeid") +"']").addClass('selectedPerm');
				$('#filterModelContainer').find("div[data-id='" + eventTarget$.data("modelid") +"']").addClass('selectedPerm');
				$('#filterVariantContainer').find("div[data-id='" + eventTarget$.data("variantid") +"']").addClass('selectedPerm');
				//keep track of the permanently selected models and variants.
				permModelIds.push($this.data("modelid"));
				permVariantIds.push($this.data("id"));
			
			} else {
				vehicleCheckedCount -= 1;
				vehicleCheckedCount > 0 ? vehiclesSelectedText.text(" • " + vehicleCheckedCount + " vehicles selected") : vehiclesSelectedText.text(" • no vehicles selected");
				vehicleGroupHeader.attr("data-count", vehicleCheckedCount);
				
				if (vehicleCheckedCount == 0) {
					eventTarget$.parent().parent().addClass('notSelected');
					wrapper.removeClass('someSelected');
					//remove Perm Select to the make and model and variant for this session.
					$('#filterMakeContainer').find("div[data-id='" + eventTarget$.data("makeid") +"']").removeClass('selectedPerm');
					$('#filterModelContainer').find("div[data-id='" + eventTarget$.data("modelid") +"']").removeClass('selectedPerm');
					$('#filterVariantContainer').find("div[data-id='" + eventTarget$.data("variantid") +"']").removeClass('selectedPerm');

				}
								
				var permModelIndex = permModelIds.indexOf($this.data("modelid")),
					permVariantIndex = permVariantIds.indexOf($this.data("modelid"));
				permModelIds.splice(permModelIndex,1);
				permVariantIds.splice(permVariantIndex,1);
			}
			
		});
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock

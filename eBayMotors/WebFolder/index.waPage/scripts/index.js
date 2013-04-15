
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

	function loadModelSelectBox(make) {
		ds.Model.query("make.title = :1", make, {
			onSuccess: function(ev1) {
				$('#filterModelContainer').empty();
				if (ev1.entityCollection.length > 0) {
					ev1.entityCollection.forEach({
						onSuccess: function(ev2) {
							$('<div>', {
								text: ev2.entity.title.getValue(),
								"class" : "make"
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
							"class" : "make"
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
				loadModelSelectBox($this[0].innerHTML);
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

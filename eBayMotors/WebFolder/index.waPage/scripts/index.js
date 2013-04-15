
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock
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
		$('#filterMakeContainer').on('click', 'div', function() {
			$this = $(this);
			$this.addClass('selected');
		});	
		
		$('#filterMakeContainer').on('mouseenter', 'div', function() {
			$this = $(this);
			$this.addClass('inFocus');
		});	
		
		$('#filterMakeContainer').on('mouseleave', 'div', function() {
			$this.removeClass('inFocus');
		});	
		
		
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock

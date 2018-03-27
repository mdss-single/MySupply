$.fn.regionSearch = function() {
	this.each(function() {
		var $this = $(this),
		fSearch = $this.find('.js-region-search-input'),
		fSection = $this.find('.category-filter__region-section'),
		fItem = fSection.find('.category-filter__region-item'),
		fNotFound = $this.find('.category-filter__region-notFound');
		if (fSearch.length) {
			fSearch.val('').keyup();
			fSearch.keyup(function() {
				var fQuery = fSearch.val();
				fItem.each(function() {
					if (!$(this).html().match(new RegExp('.*?' + fQuery + '.*?', 'i'))) {
						$(this).hide();
					} else {
						$(this).show();
						fSection.removeClass('category-filter__region-section--hidden');
					}
				});
				fSection.each(function() {
					if ($(this).children(':visible').length == 0) {
						$(this).addClass('category-filter__region-section--hidden');
					} else {
						$(this).removeClass('category-filter__region-section--hidden');
					}
				});
				if (fItem.filter(':visible').length < 1) {
					fNotFound.addClass('category-filter__region-notFound--active');
				} else {
					fNotFound.removeClass('category-filter__region-notFound--active');
				}
			});
		}
	});
}

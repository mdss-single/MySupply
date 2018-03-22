	$.fn.spinner = function() {
		this.each(function() {
			var el = $(this);
			el.after('<a href="#" class="category-product__toCart-plus js-category-product-spinner-plus" role="button"></a>');
			el.after('<a href="#" class="category-product__toCart-minus js-category-product-spinner-minus" role="button"></a>');
			el.parent().on('click', '.js-category-product-spinner-minus', function (e) {
				e.preventDefault();
				if (el.val() > parseInt(el.attr('min')))
					el.val( function(i, oldval) { return --oldval; });
			});
			el.parent().on('click', '.js-category-product-spinner-plus', function (e) {
				e.preventDefault();
				if (el.val() < parseInt(el.attr('max')))
					el.val( function(i, oldval) { return ++oldval; });
			});
			el.on('focusout', function() {
				if (el.val() > parseInt(el.attr('max'))) {
					el.val(el.attr('max'));
				} else if (el.val() < parseInt(el.attr('min'))) {
					el.val(el.attr('min'));
				}
			});
		});
	};
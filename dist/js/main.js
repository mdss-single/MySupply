(function($){
	"use strict";

	// sticky header
	$('.js-header-attach').stick_in_parent({
		parent: 'body',
	});

	// styling inputs
	$('.checkbox, .radio, .select').styler();

	// collapse category filter block
	$('.js-category-block-title-collapse').on('click', function(e) {
		e.preventDefault();
		$(this).toggleClass('category-sidebar__block-title--collapsed').next().toggleClass('category-sidebar__block--hidden').closest('.category-sidebar__block').toggleClass('category-sidebar__block--collapsed');
	});

	// hide/show rows in category sidebar
	toggleSidebarRows();

	// add to cart spinner
	$('.js-category-spinner').spinner();

	// category-filter range slider
	$('.js-range-slider').each(function() {
		var parent = $(this).closest('.category-filter__range');
		var minValue = $(this).data('min');
		var maxValue = $(this).data('max');
		var setMin = $(this).data('set-start');
		var setMax = $(this).data('set-end');
		var step = $(this).data('step');
		var isRange = $(this).data('range');
		$(this).jRange({
			from: minValue,
			to: maxValue,
			step: 1,
			scale: false,
			format: '%s',
			showLabels: true,
			isRange : isRange,
			onstatechange: function(value) {
				var value = value.split(',');
				parent.find('.js-range-from').val(value[0]).unmask();
				parent.find('.js-range-to').val(value[1]).unmask();
				$('.js-mask-money').mask("# ##0", {reverse: true});
			}
		});
		$(this).jRange('setValue', setMin+','+setMax);
	});

	// money format value to input
	$('.js-mask-money').mask("# ##0", {reverse: true});

	// input-text dynamic width
	$('.js-input-dynamic-width').on('input', function() {
		var inputWidth = $(this).textWidth();
		$(this).css({
			width: inputWidth
		})
	}).trigger('input');
	var targetElem = $('.js-input-dynamic-width');
	inputWidth(targetElem);

	// modal windows
	$('.js-modal').fancybox({
		touch: false,
		lang : 'ru',
		i18n : {
			'ru' : {
				CLOSE: 'Закрыть',
				ERROR: 'Невозможно загрузить данные. Попробуйте еще раз.',
			}
		},
		afterLoad: function(current) {
			$(this).find('input[autofocus]').focus();
		}
	});

	function inputWidth(elem, minW, maxW) {
		elem = $(this);
	}

	function toggleSidebarRows() {
		var $this = $('.js-category-sidebar-hiderows'),
		rowCount = $this.children('div').length,
		rowShowed = $this.data('default-rows'),
		rowChildren = $('.js-category-sidebar-hiderows').children('div').attr('class');
		if (rowCount > rowShowed) {
			$this.find('.category-sidebar__showrows').removeClass('category-sidebar__showrows--hidden');
			$this.children('div:nth-child(n+4)').addClass(rowChildren+'--hidden');
			$this.find('.js-category-sidebar-showrows-count').text(+rowCount - rowShowed);
		}
		$this.find('.js-category-sidebar-togglerows').on('click', function(e) {
			e.preventDefault();
			$(this).toggleClass('category-sidebar__showrows--collapsed');
			var $text = $(this).find('.js-category-sidebar-showrows-text');
			$text.text(function(i, text) {
				return text == $text.data('default-text') ? $text.data('new-text') : $text.data('default-text');
			});
			$this.children('div:nth-child(n+4)').toggleClass(rowChildren+'--hidden');
		});
	}

})(jQuery);
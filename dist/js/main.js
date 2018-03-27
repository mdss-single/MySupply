(function($){
	"use strict";

	// sticky header
	$('.js-header-attach').stick_in_parent({
		parent: 'body',
	});

	// header search autocomplete
	$('.js-header-autocomplete').easyAutocomplete({
		/*
		url: function(phrase) {
			return 'api/result.php?phrase=' + phrase + '&format=json';
		},*/
		url: 'js/autocomplete.json',
		getValue: 'name',
		highlightPhrase: false,
		list: {
			maxNumberOfElements: 10,
			match: {
				enabled: true
			}
		},
		template: {
			type: 'links',
			fields: {
				link: 'url'
			}
		}
	});

	// styling inputs
	$('.checkbox, .radio, .select').styler();

	// collapse category filter block
	$('.js-category-block-title-collapse').on('click', function(e) {
		e.preventDefault();
		$(this).toggleClass('category-sidebar__block-title--collapsed').next().toggleClass('category-sidebar__block--hidden').closest('.category-sidebar__block').toggleClass('category-sidebar__block--collapsed');
	});

	// hide/show rows in category sidebar
	$('.js-category-sidebar-hiderows').toggleSidebarRows();

	// find region in category sidebar
	$('.js-region-search').regionSearch();

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

	// product photos
	$('.js-product-gallery').productCarousel();
	$('.js-product-photo-big').fancybox({
		lang : 'ru',
		i18n : {
			'ru' : {
				FULL_SCREEN: 'Во весь экран',
				CLOSE: 'Закрыть',
				ERROR: 'Невозможно загрузить данные. Попробуйте еще раз.',
			}
		},
		loop : true,
		buttons : [
			'fullScreen',
			'thumbs',
			'close'
		],
		image: true,
		thumbs : {
			autoStart : true
		}
	});

	// dialog
	$('.js-dialog').on('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		var $this = $(this),
		thisTarget = $this.data('target'),
		thisPos = $this.position(),
		thisWidth = $this.width(),
		thisHeight = $this.height();
		$(thisTarget).css({
			'top': +thisPos.top + thisHeight,
			'left': thisPos.left
		}).toggleClass('dialog--active');
		// close dialog
		$(document).click(function(e) {
			if (!$(e.target).closest('.dialog').length) {
				$('.dialog').removeClass('dialog--active');
			}
		});
	});

	// sticky cart sidebar
	$('.js-cart-sticky').stick_in_parent({
		parent: '.cart',
		offset_top: 15,
	});

	// sticky cabinet sidebar
	$('.js-cabinet-sticky').stick_in_parent({
		parent: '.cabinet',
		offset_top: 15,
	});

	// product offer map
	if ($('#productOffersMap').length) {
		ymaps.ready(productOffersMap);
		function productOffersMap () {
			var myMap = new ymaps.Map('productOffersMap', {
				center: [55.76, 37.64],
				zoom: 10
			}, {
				searchControlProvider: 'yandex#search'
			}),
			objectManager = new ymaps.ObjectManager({
				// Чтобы метки начали кластеризоваться, выставляем опцию.
				clusterize: true,
				// ObjectManager принимает те же опции, что и кластеризатор.
				gridSize: 32,
				clusterDisableClickZoom: true
			});
			// Чтобы задать опции одиночным объектам и кластерам,
			// обратимся к дочерним коллекциям ObjectManager.
			objectManager.objects.options.set('preset', 'islands#greenDotIcon');
			objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
			myMap.geoObjects.add(objectManager);
			$.ajax({
				url: "js/data.json"
			}).done(function(data) {
				objectManager.add(data);
			});
		}
	}

	// choose city map
	if ($('#modalCityMap').length) {
		ymaps.ready(chooseCity);
		function chooseCity() {
			var geolocation = ymaps.geolocation,
			myMap = new ymaps.Map('modalCityMap', {
				center: [55, 34],
				zoom: 14,
			}, {
				searchControlProvider: 'yandex#search'
			});
			geolocation.get({
				provider: 'yandex',
				mapStateAutoApply: true
			}).then(function (result) {
				myMap.geoObjects.add(result.geoObjects);
				showAddress(firstGeoObject.getAddressLine());
				getAddress(coords);
			});
			$('.js-city-get').on('click', function(e) {
				e.preventDefault();
				navigator.geolocation.getCurrentPosition(function(position) {
					// Get the coordinates of the current possition.
					var lat = position.coords.latitude;
					var lng = position.coords.longitude;
					//myMap.setCenter([lat, lng]);
					myMap.panTo([lat, lng], {
						delay: 1500
					});
				});
			});
			$('.js-city-manual').on('keyup', function() {
				var thisVal = $(this).val();
				ymaps.geocode(thisVal, {
					results: 1
				}).then(function (res) {
					// Выбираем первый результат геокодирования.
					var firstGeoObject = res.geoObjects.get(0),
					// Координаты геообъекта.
					coords = firstGeoObject.geometry.getCoordinates(),
					// Область видимости геообъекта.
					bounds = firstGeoObject.properties.get('boundedBy');
					firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
					// Получаем строку с адресом и выводим в иконке геообъекта.
					firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());
					// Добавляем первый найденный геообъект на карту.
					myMap.geoObjects.add(firstGeoObject);
					// Масштабируем карту на область видимости геообъекта.
					myMap.setBounds(bounds, {
						// Проверяем наличие тайлов на данном масштабе.
						checkZoomRange: true
					});
				});
			});
		}
	}

	// cabinet-settings map
	if ($('#cabinetSettingsMap').length) {
		ymaps.ready(cabinetMap);
		function cabinetMap() {
			var geolocation = ymaps.geolocation,
			myMap = new ymaps.Map('cabinetSettingsMap', {
				center: [55, 34],
				zoom: 14,
			}, {
				searchControlProvider: 'yandex#search'
			});
			geolocation.get({
				provider: 'yandex',
				mapStateAutoApply: true
			}).then(function (result) {
				myMap.geoObjects.add(result.geoObjects);
				showAddress(firstGeoObject.getAddressLine());
				getAddress(coords);
			});
			$('.js-settings-address').on('keyup', function() {
				var thisVal = $(this).val();
				ymaps.geocode(thisVal, {
					results: 1
				}).then(function (res) {
					// Выбираем первый результат геокодирования.
					var firstGeoObject = res.geoObjects.get(0),
					// Координаты геообъекта.
					coords = firstGeoObject.geometry.getCoordinates(),
					// Область видимости геообъекта.
					bounds = firstGeoObject.properties.get('boundedBy');
					firstGeoObject.options.set('preset', 'islands#darkBlueDotIconWithCaption');
					// Получаем строку с адресом и выводим в иконке геообъекта.
					firstGeoObject.properties.set('iconCaption', firstGeoObject.getAddressLine());
					// Добавляем первый найденный геообъект на карту.
					myMap.geoObjects.add(firstGeoObject);
					// Масштабируем карту на область видимости геообъекта.
					myMap.setBounds(bounds, {
						// Проверяем наличие тайлов на данном масштабе.
						checkZoomRange: true
					});
				});
			});
		}
	}
	// cabinet settings toggle map showing
	$('.js-cabinet-settings-togglemap').on('click', function(e) {
		e.preventDefault();
		$(this).text(function(i, text) {
			return text == $(this).data('default-text') ? $(this).data('new-text') : $(this).data('default-text');
		});
		$('.cabinet-settings__map').toggleClass('cabinet-settings__map--hidden');
	});

	// cabinet settings cloning
	$('.js-cabinet-cloning').on('click', '.js-cabinet-settings-clone', function(e) {
		e.preventDefault();
		$(this).closest('.cabinet-settings__cloning').find('.select').styler('destroy');
		var cloneContent = $(this).closest('.cabinet-settings__cloning').clone();
		cloneContent.find('input').each(function() {
			$(this).attr('id', this.id+ +length++).next('label').attr('for', this.id);
		}).val('');
		$(this).closest('.cabinet-settings__cloning').next('.cabinet-settings__cloning-place').append('<div class="cabinet-settings__cloning-row"></div>');
		$(this).closest('.cabinet-settings__cloning').next('.cabinet-settings__cloning-place').find('.cabinet-settings__cloning-row').last().append(cloneContent);
		$(this).closest('.cabinet-settings__cloning').find('.select').styler();
		cloneContent.find('.select').styler();
	});
	$('.js-cabinet-cloning').on('click', '.js-cabinet-settings-clone-remove', function(e) {
		e.preventDefault();
		$(this).closest('.cabinet-settings__cloning-row').remove();
	});

	// cabinet catalog nav
	$('.js-cabinet-catalog-nav').on('click', 'dt', function(e) {
		e.preventDefault();
		$(this).toggleClass('cabinet-catalog__nav-parent--active').next('dd').toggleClass('cabinet-catalog__nav-item--active');
	});

	// input file
	$('.js-input-file').change(function() {
		$('label[for="' + this.id + '"]').text($(this).val().replace(/^.*\\/, ""));
	});

	// input tags
	$('.js-input-tags').each(function() {
		var thisDefault = $(this).data('text-default');
		$(this).tagsInput({
			width: '100%',
			height: '122px',
			defaultText: thisDefault,
			placeholderColor: '#444',
		});
	});

})(jQuery);
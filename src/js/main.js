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
	productGallery();
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

	function productGallery() {
		var $carousel = $('.js-product-gallery');
		if ($carousel.length) {
			var $carouselCells = $carousel.find('.product-photos__thumbs-item');
			var navTop  = $carousel.position().top;
			var navCellHeight = $carouselCells.height();
			var navHeight = $carousel.height();
			$carousel.on( 'click', '.product-photos__thumbs-item', function( event ) {
				event.preventDefault();
				var index = $( event.currentTarget ).index();
				var thisBig = $(this).data('photo-big');
				$(this).addClass('product-photos__thumbs-item--active').siblings().removeClass('product-photos__thumbs-item--active');
				$('.js-product-photo-big').attr('href', thisBig).addClass('fadeIn');
				$('.js-product-photo-big img').attr('src', thisBig);
				setTimeout(function(){
					$('.js-product-photo-big').removeClass('fadeIn');
				}, 100);
				// scroll nav
				var scrollY = $(this).position().top + $carousel.scrollTop() - ( navHeight + navCellHeight) / 2;
				$carousel.animate({
					scrollTop: scrollY
				});
			});
			$('.js-product-gallery-arrow').on('click', function(e) {
				e.preventDefault();
				if ($(this).hasClass('product-photos__thumbs-arrow--up')) {
					$('.js-product-gallery').find('.product-photos__thumbs-item--active').prev().click();
				} else {
					$('.js-product-gallery').find('.product-photos__thumbs-item--active').next().click();
				}
			});
		}
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
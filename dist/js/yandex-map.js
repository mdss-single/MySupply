ymaps.ready(function () {
	var myMap,
	myMapContainer = $('#modalCityMap'),
	service = new GeolocationService(),
	myLocation = service.getLocation({
		// Режим получения наиболее точных данных.
		enableHighAccuracy: true,
		// Максимальное время ожидания ответа (в миллисекундах).
		timeout: 50000,
		// Максимальное время жизни полученных данных (в миллисекундах).
		maximumAge: 1000
	});

	// Перекрываем метод сервиса, чтобы пробросить размер карты.
	service.getMapSize = function () {
		return [
			myMapContainer.width(),
			myMapContainer.height()
		];
	};

	myLocation.then(function (loc) {
		var myCoords = [loc.latitude, loc.longitude],
		myPlacemark = new ymaps.Placemark(myCoords, loc, {
			iconImageHref: 'geolocation.png',
			iconImageSize: [24, 24],
			iconImageOffset: [-12, -12],
			balloonContentBodyLayout: ymaps.templateLayoutFactory.createClass([
				'<address>',
					'Широта: $[properties.latitude]<br/>',
					'Долгота: $[properties.longitude]<br/>',
					'Масштаб: $[properties.zoom]<br/>',
					'Город: $[properties.city|не найдено]<br/>',
					// '[if properties.city]Город: $[properties.city]<br/>[endif]',
					'Страна: $[properties.country|не найдено]<br/>',
					// '[if properties.country]Страна: $[properties.country]<br/>[endif]',
					'Регион: $[properties.region|не найдено]<br/>',
					// '[if properties.region]Регион: $[properties.region]<br/>[endif]',
					'Тип поиска: [if properties.isHighAccuracy]Geolocation API[else]IP-адрес[endif]',
				'</address>'
			].join(''))
		});
		myMap = new ymaps.Map(myMapContainer.get(0), {
			center: myCoords,
			zoom: loc.zoom || 9,
			behaviors: ['default', 'scrollZoom']
		}, {
			adjustZoomOnTypeChange: true
		});
		
		myMap.geoObjects.add(myPlacemark);
	});
});
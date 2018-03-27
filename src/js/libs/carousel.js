$.fn.productCarousel = function() {
	this.each(function() {
		var $carousel = $(this);
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
	});
}
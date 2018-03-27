$.fn.toggleSidebarRows = function() {
	this.each(function() {
		var $this = $(this);
		var rowCount = $this.children('div').length,
		rowShowed = $this.data('default-rows'),
		rowChildren = $this.children('div').attr('class'),
		$thisToggle = $this.find('.js-category-sidebar-togglerows');
		if (rowCount > rowShowed) {
			$this.find('.category-sidebar__showrows').removeClass('category-sidebar__showrows--hidden');
			$this.children('div:nth-child(n+4)').addClass(rowChildren+'--hidden');
			$this.find('.js-category-sidebar-showrows-count').text(+rowCount - rowShowed);
		}
		$thisToggle.on('click', function(e) {
			e.preventDefault();
			$(this).toggleClass('category-sidebar__showrows--collapsed');
			var $text = $this.find('.js-category-sidebar-showrows-text');
			$text.text(function(i, text) {
				return text == $text.data('default-text') ? $text.data('new-text') : $text.data('default-text');
			});
			$this.children('div:nth-child(n+4)').toggleClass(rowChildren+'--hidden');
		});
	});
}
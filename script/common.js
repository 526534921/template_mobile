$(function() {
	$('#page').removeClass("goout");
});
$(function() {
	var flag = 1;
	$('.lcbody').click(function() {
		if(flag == 1) { //展开
			$('body').addClass('open');
			$('#leftnav').show();
			flag = 0;

		} else { //闭合
			$('body').removeClass('open');
			var t = setTimeout("$('#leftnav').hide()", 400)
			flag = 1;
		}
	});
	$('#main').click(function() {
		if(flag == 0) {
			$('body').removeClass('open');
			var t = setTimeout("$('#leftnav').hide()", 400)
			flag = 1;
		}
	})
});
$(function() {
	$('.goback').click(function() {
		if(window.history.length > 1) {
				window.history.go(-1)
		} else {
			window.location.href = '/'
		}
	})
});
$(function() {
	$('.auto-img img').each(function() {
		var $width = $(this).width();
		$(this).css('height', $width * (3 / 4))
	})
});
$(window).load(function(){
	var IE6 = $.browser.msie && parseFloat($.browser.version) < 7;

	if(IE6==true && typeof mensajeNavegador != 'undefined'){
		alert(mensajeNavegador);
	}
});
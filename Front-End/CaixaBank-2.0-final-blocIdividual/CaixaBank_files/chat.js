function openchat(){
    var Message;
    Message = function (arg) {
        this.text = arg.text; 
	this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side, sendMessage;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            message_side = message_side === 'left' ? 'right' : 'left';
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        $('.send_message').click(function (e) {
            return sendMessage(getMessageText());
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendMessage(getMessageText());
            }
        });
 		console.log("començo a printar");
        sendMessage('Bienvenido soy CaixaBank Bot');
        setTimeout(function () {
            return sendMessage('Deseo ver la factura de la luz de este año en curso');
        }, 1000);
        return setTimeout(function () {
            return sendMessage('<img src="./index.png" alt="Minions" height="250" width="320">');
        }, 2000);
    });
}

$('#revealChat').click(function (){
	//$("chatSelect").toggle();
	//$("chatSelect").addClass('show');
	$("#chatSelect").css("display", "block");
	console.log("clickat");	
	openchat();
});

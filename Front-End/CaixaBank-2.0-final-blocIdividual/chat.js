
/*Molt rellevant la posició en la qual es posa la linea(90). Afecta a tots els elements i no ha un en concret*/
/*$('.messages .message.leftmessage .text_wrapper').css("background-color", '#FFF');*/



var ws;

if (!window.WebSocket) {
                alert("FATAL: WebSocket not natively supported. This Chat will not work!");
}

var sendMessage;

function openchat(){
    var Message;
    Message = function (arg) {
        this.text = arg.text; 
		this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass((_this.message_side+"message")).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, message_side/*, sendMessage*/;
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text, side) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            //message_side = message_side === 'left' ? 'right' : 'left';
            message = new Message({
                text: text,
                //message_side: message_side
				message_side: side
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };


        $('.send_message').click(function (e) {
            if (ws) {
              var text = getMessageText();
              ws.send(text);
            }
			return sendMessage(getMessageText(), 'right');
        });

        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
				if (ws){
					var text = getMessageText();
              		ws.send(text);
				}
            	return sendMessage(getMessageText(), 'right');
            }
        });
 		console.log("començo a printar");
        //sendMessage('Bienvenido soy Dory', 'left');
        /*setTimeout(function () {
            return sendMessage('Deseo ver la factura de la luz de este año en curso', 'right');
        }, 1000);
		return setTimeout(function () {
            return sendMessage('<img src="./index.png" alt="Minions" class="images">', 'left');
        }, 2000);*/
		setTimeout(function(){
			return sendMessage('<canvas id="myChart" width="310" height="250"></canvas><script> var data1= [34, 27, 27.5, 30, 62, 25, 26.2, 37, 31, 27, 38, 19]; var data2=[12, 20, 27, 35, 41, 12, 25, 36, 41, 13, 45, 32]; var data3 = [34-12, 27-20, 27.5-27, 30-35, 62-41, 25-12, 26.2-25, 37-36, 31-41, 27-13, 38-45, 19-32]; var labels1 = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio","Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]; var myChart = setTimeout(function(){new Chart(document.getElementById("myChart"), {type: "bar", options: {title: {display: false, text: "Gastos-Ingresos", fullWidth: true, fontSize: 45, padding:30}}, data: {labels: labels1, datasets: [{type: "line", label: "Balance", data: data3, fill: true, lineTension: 0, borderWidth: 3, borderColor: "rgba(255,60,20,0.8)", pointBorderColor: "rgba(20,20,20,0.8)", pointBackgroundColor:"rgba(255,255,255,1)", pointBorderWidth:2, pointRadius:4, pointHoverRadius:6, pointHoverBackgroundColor:"rgba(255,255,255,1)", pointHoverBorderColor: "rgba(0,0,0,1)", pointStyle: "circle", showLine: true, steppedLine: false }, {type: "bar", label: "Gastos",	data: data2, backgroundColor: "rgba(0,150,255,0.5)", borderColor: "rgba(0,0,0,0.5)", borderWidth: 1, hoverBackgroundColor: "rgba(0,150,255,1)", hoverBorderColor: "rgba(0,0,0,1)",	hoverBorderWidt: 1}, {type: "bar", label: "Ingresos",	data: data1, backgroundColor: "rgba(20,255,30,0.5)",	borderColor: "rgba(0,0,0,0.5)", borderWidth: 1, hoverBackgroundColor: "rgba(20,255,30,1)",	hoverBorderColor: "rgba(0,0,0,1)", hoverBorderWidt: 1} ]}})},0); </script>', 'left');
		}, 500);
		/*return setTimeout(function () {
            return sendMessage('<img src="./index.png" alt="Minions" class="images">', 'left');
        }, 3000);*/	
    });
}



$('#revealChat').click(function (){
	if (ws != null) {
      ws.close();
      ws = null;
	  console.log("closing WebSocket reveal");
    }
	
	$("#chatSelect").css("display", "block");
    $('#revealChat').css("display", "none"),
	$(document).ready(openchat());

    ws = new WebSocket("ws://localhost:8887");
    ws.onopen = function() {
		console.log("Open");
    }

    ws.onmessage = function(e) {
		console.log("onmessage");
		console.log(e.data);
		sendMessage(e.data, 'left');

    }

    ws.onclose = function() {
		//ws.send("EOF");
		console.log("onclose");
        //ws = null;
    }
});


//Close popup
$('#closePopup').click(function (){
	$("#chatSelect").css("display", "none");
    $('#revealChat').css("display", "block");

    //if (ws) {
      ws.close();
      //ws = null;
	  console.log("closing WebSocket close");
	  console.log(ws);
    //}	
});









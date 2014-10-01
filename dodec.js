var height = window.innerHeight;
var width = window.innerWidth;
var scale = 25;
var obsHeight = scale;
var obsWidth = scale;
var obsX = 5;
var obsY = height;
var horizMargin = (width)-(12*scale-5); 
var a = (12*scale);
var vertMargin = 0;
var move = 3;
var change = 2;
var score = 0;
var lives = 3;
var obsChange = 2;
var randobs = 1;
var searching = true;
var justUnder;
var red;
var hillY = 0;
var obsable = false;
var pts = 'pts';
var mobile = false;
var hurt = false;
var hurtCounter = 0;
$.mobile.loadingMessage = false;
if(typeof window.orientation !== 'undefined'){
	mobile = true;
}
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

$(document).ready(function(){
hill();
splash();
//obstacle/boulder canvas
var c3=document.getElementById("can3");
c3.setAttribute("height",height);
c3.setAttribute("width",width);
var ct=c3.getContext("2d");
ct.font="40px Courier";
ct.fillStyle='#E5E4E2';


function animate(){
	if(searching){
		getLow();
	}
	dodec();
        if(localStorage.getItem('hiscore') == null){
                localStorage.setItem('hiscore',0);
        }
	text();
	if(lives != 0){
		requestAnimationFrame(animate);
		if(score > hiscore){
			localStorage.setItem('hiscore',score);
		}
	}else{
		ct.clearRect(-width,-height,width*2,height*2);
		splash();
	}
}
var hiscore = localStorage.getItem('hiscore');


//draw hill down which boulder will roll as well as background
function hill(){
	var c2=document.getElementById("can2");
	var ctx2=c2.getContext("2d");
	c2.setAttribute("height",height);
	c2.setAttribute("width",width);
	ctx2.fillStyle="#151B54";
	ctx2.fillRect(0,0,width,height);

}
function text(){
	pts = 'pts';
	if(score == 1){
		pts = 'pt'
	}
	ct.fillText(score+" "+pts,100,100);
	ct.fillText(lives+" lives",300,100);
	ct.fillText("High score: "+hiscore,500,100);
}
function getLow(){
	justUnder = ct.getImageData(6*scale+horizMargin,12*scale+vertMargin+move,1,1);
	red = justUnder.data[0];
	if(red > 100){
		searching = false;
        hillY = move;
        obsable = true;
	}
}
function drawDodec(){
	ct.strokeStyle = "#E5E4E2";
	ct.beginPath();
	ct.moveTo(width, height/2)
	ct.lineTo(0,height);
	ct.stroke();
	if(hurt === false){
		ct.fillStyle="#E5E4E2";
	}else{
		ct.fillStyle="#FF0000";
		hurtCounter += 1;
	}
	if(hurtCounter > 45){
		hurt = false;
		hurtCounter = 0;
	}
	ct.beginPath();
	ct.moveTo(12*scale+horizMargin,6*scale+move);
	ct.lineTo(11*scale+horizMargin,9*scale+move);
	ct.lineTo(9*scale+horizMargin,11*scale+move);
	ct.lineTo(6*scale+horizMargin,12*scale+move);
	ct.lineTo(3*scale+horizMargin,11*scale+move);
	ct.lineTo(1*scale+horizMargin,9*scale+move);
	ct.lineTo(0*scale+horizMargin,6*scale+move);
	ct.lineTo(1*scale+horizMargin,3*scale+move);
	ct.lineTo(3*scale+horizMargin,1*scale+move);
	ct.lineTo(6*scale+horizMargin,0*scale+move);
	ct.lineTo(9*scale+horizMargin,1*scale+move);
	ct.lineTo(11*scale+horizMargin,3*scale+move);
	ct.closePath();
	ct.fill();
	ct.fillStyle="#E5E4E2";
	move += change;
	if(move >= hillY && searching == false){
		change = 0;
	}
	if(hillY - move >= height/8){
		change = 3;
	}
}
function dodec(){
	var decSquare = 12*scale;
	var degrees = 2;
	ct.clearRect(0,0,width,height);
	if(obsable){
		obs();
	}
	drawDodec();
	if(change == 0){
		$(document).on('vclick',function(){
			change = -3;
		});
	}
	document.addEventListener('keydown',function(event){
		var thekey=event.keyCode;
		if((thekey == 38 ||thekey == 32) && change == 0){
			change = -3;
		}
	});
}
function obs(){
    ct.strokeStyle="#E5E4E2";
    	if(randobs==1){
    		randobs = 0
    		obsWidth = Math.floor((Math.random() * 40) + 25);
    		obsHeight = Math.floor((Math.random() * 25) + 25);
    		obsX = 0;
		obsY = height-(obsHeight);
    	}
	ct.fillRect(obsX,obsY,obsWidth,obsHeight);
	ct.stroke();
	obsX += width*obsChange/400;
	obsY -= height*obsChange/800;
	if(ct.isPointInPath(obsX+obsWidth,obsY)||ct.isPointInPath(obsX,obsY)){
			hurt = true;
			if(obsChange>2){
 		        	obsChange-=1;
			}
 			if(lives < 1){
 				ct.clearRect(-width,-height,width*2,height*2);
 				splash();
                        
 			}
 			lives -= 1;
			randobs=1;
		}
	if (obsX>width){
			score += 1;
			if(obsChange<6){
			obsChange = Math.sqrt(score+1)+1;
			}
			randobs=1
	}
	
}

function splash(){
        score = 0;
	var splashCanvas=document.getElementById("splash");
	splashCanvas.setAttribute("height",height);
	splashCanvas.setAttribute("width",width);
	var sct = splashCanvas.getContext("2d");
	sct.font="70px Courier";
	sct.fillStyle='#E5E4E2';
	sct.strokeStyle='#E5E4E2';
	sct.lineWidth=5;
	function clickHandler(event){
		clickX = event.clientX;
		clickY = event.clientY;
		if(sct.isPointInPath(clickX,clickY)){
			sct.clearRect(0,0,width,height);
			document.removeEventListener('click',clickHandler);
			animate();
        	}
	}
	var clickX;
	var clickY;
	var title = "dodec";
	var play = "play"
	var titleWidth = sct.measureText(title).width;
	sct.fillText(title,100,height/2);
	sct.font="20px Courier";
	var playWidth = sct.measureText(play).width;
	sct.fillText(play,100+titleWidth+100+75-playWidth/2,height/2-20);
	sct.rect(200+titleWidth,height/2-50,150,50);
	sct.stroke();
	document.addEventListener('click',clickHandler);
	$(document).on('vclick',clickHandler);
	lives = 3;

}
});

//paint_centered_wrap(canvas, x, y, w, h, text, fh, spl)
var unitSize = 256;
var unitScale = 0.125;
var widthMax = 0;
var heightMax = 0;
var dataList = false;
var saveWhiteBg = true; // save white bg
function getRandomColor() {
	var letters = '0123456789ABCDEF';

	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function colorBrightness(color) {
	var r = parseInt(color.substr(1, 2), 16);
	var g = parseInt(color.substr(3, 2), 16);
	var b = parseInt(color.substr(5, 2), 16);
	return (r * 299 + g * 587 + b * 114) / 1000; // returns a value between 0 and 255
}

function getColorFromBrightness(color) {
	return colorBrightness(color) < 80 ? 'white' : 'black';
}

function getCoordString(x, y) {
	var size = "X: "+x +" Y: "+y;
	return size;
}

function draw() {
	var canvas = document.getElementById("canvas");
	if (!canvas.getContext) {
		console.log("Failed to get canvas context");
		return;
	}
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	if(dataList == false){
		canvas.width = 10*(unitSize*unitScale);
		canvas.height = 10*(unitSize*unitScale);
		for(y=0; y < 10; y++){
			for(x=0; x < 10; x++){
				var cellcolor = getRandomColor();
				var fontcolor = getColorFromBrightness(cellcolor);
				var paint = {
					RECTANGLE_STROKE_STYLE : 'black',
					RECTANGLE_LINE_WIDTH : 1,
					VALUE_FONT : '12px Arial',
					VALUE_FONT_COLOR : fontcolor,
					VALUE_FILL_STYLE : cellcolor
				}
				paint_centered_wrap(canvas, paint, (unitSize*unitScale)*x, (unitSize*unitScale)*y, unitSize*unitScale, unitSize*unitScale, "Load atlasinfo.txt to begin", 12, 2);
			}
		}
		return;
	}
	//
	//fillRect(x,y,width,height) - pieno
	//strokeRect(x,y,width,height) - vuoto
	//clearRect(x,y,width,height) - cancella
	canvas.width = widthMax * unitScale;
	canvas.height = heightMax * unitScale;
	log.value += "Canvas W: "+ canvas.width + " H: " + canvas.height + "\n";
	//draw base grid
	var xCount = Math.ceil(canvas.width / (unitSize*unitScale));
	var yCount = Math.ceil(canvas.height / (unitSize*unitScale));
	for(y=0;y<yCount;y++){
		for(x=0;x<xCount;x++){
			ctx.strokeStyle="darkblue";
			ctx.strokeRect(x*(unitSize*unitScale),y*(unitSize*unitScale),(unitSize*unitScale),(unitSize*unitScale))
			var paint = {
				RECTANGLE_STROKE_STYLE : "darkblue",
				RECTANGLE_LINE_WIDTH : 1,
				VALUE_FONT : '12px Arial',
				VALUE_FONT_COLOR : "darkblue",
				VALUE_FILL_STYLE : false
			}
			var coordString = getCoordString(x*(unitSize)*100, y*(unitSize)*100);
			console.log("GRID", coordString, x, y, x*(unitSize*unitScale),y*(unitSize*unitScale),(unitSize*unitScale),(unitSize*unitScale));
			paint_centered_wrap(canvas, paint, x*(unitSize*unitScale),y*(unitSize*unitScale),(unitSize*unitScale),(unitSize*unitScale), coordString, 10, 2);

		}
	}
	console.log("Drawing " + dataList.length + " items.");
	for(var i=0; i < dataList.length; i++){
		dataSet = dataList[i];
		//console.log( "["+(i+1) + "/" + dataList.length + "] map:" + dataSet.map + " bx:" + dataSet.base_x + " by:" + dataSet.base_y + " sx:" + dataSet.size_x + " sy:" + dataSet.size_y);
		var cellcolor = getRandomColor();
		var fontcolor = getColorFromBrightness(cellcolor);
		var paint = {
			RECTANGLE_STROKE_STYLE : 'black',
			RECTANGLE_LINE_WIDTH : 1,
			VALUE_FONT : '12px Arial',
			VALUE_FONT_COLOR : fontcolor,
			VALUE_FILL_STYLE : cellcolor
		}
		console.log("MAP", dataSet.map, dataSet.base_x, dataSet.base_y, dataSet.size_x, dataSet.size_y);
		paint_centered_wrap(canvas, paint, dataSet.base_x*unitScale, dataSet.base_y*unitScale, dataSet.size_x*unitScale, dataSet.size_y*unitScale, dataSet.map, 10, 2);
		var coordname = getCoordString(dataSet.base_x*100, dataSet.base_y*100);
		paint_text(canvas, paint, dataSet.base_x*unitScale, dataSet.base_y*unitScale, dataSet.size_x*unitScale, dataSet.size_y*unitScale, coordname, 10, 2);
	}

	//ctx.clearRect(45,45,60,60);
	//ctx.strokeRect(50,50,50,50);
}

function removeMapPrefix(str) {
	// var re = /^metin2_map_|^map_n_/;
	var re = /^((season[12]\/)?(metin2_map_n_|metin2_map_|map_n_|gm_guild_|metin2_|map_))/;
	return str.replace(re, "");
}

document.getElementById('file').onchange = function(){
	var file = this.files[0];
	var reader = new FileReader();
	//var textarea = document.getElementById('data');
	var canvas = document.getElementById("canvas");
	reader.onload = function(progressEvent){
		dataList = new Array();
		var lines = this.result.split('\n');
		var wMaxMap = "";
		var hMaxMap = "";
		for(var line = 0; line < lines.length; line++){
			if(lines[line] == "\n" || lines[line] == ""){
				continue;
			}
			cur = lines[line].split('\t');
			// if (parseInt(cur.length) != 5)
			if (parseInt(cur.length) < 5)
			{
				console.log("Malformed line", line, lines[line]);
				continue;
			}
			dataSet = {
				"map":		removeMapPrefix(cur[0]),
				"base_x":	(cur[1]/100),
				"base_y":	(cur[2]/100),
				"size_x":	(cur[3]*unitSize),
				"size_y":	(cur[4]*unitSize)
			}
			dataList.push(dataSet);

			log.value += "Map: "+cur[0]+" Base X: "+dataSet.base_x+" Base Y: "+dataSet.base_y+" Width: " + dataSet.size_x + " Height: "+dataSet.size_y+"\n";
			if(dataSet.base_x + dataSet.size_x > widthMax){
				widthMax = dataSet.base_x + dataSet.size_x;
				wMaxMap = dataSet.map;
			}
			if(dataSet.base_y + dataSet.size_y > heightMax){
				heightMax = dataSet.base_y + dataSet.size_y;
				hMaxMap = dataSet.map;
			}
			log.scrollTop = log.scrollHeight;
		}
		console.log("Max Height", hMaxMap, heightMax);
		console.log("Max Width", wMaxMap, widthMax);
		log.value += "Max width map: "+ wMaxMap + "\nMax height map: " + hMaxMap + "\n";
		log.scrollTop = log.scrollHeight;
		draw(dataList);
	};
	reader.readAsText(file);
};
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
function getImage() {
	var link = document.createElement("a");
	var canvas = document.getElementById("canvas");
	var imgData = canvas.toDataURL({
	  format: 'png',
	  multiplier: 4
	});
	var strDataURI = imgData.substr(22, imgData.length);
	var blob = dataURLtoBlob(imgData);
	var objurl = URL.createObjectURL(blob);

	// Create a new canvas with the same dimensions as the original canvas
	var newCanvas = document.createElement('canvas');
	newCanvas.width = canvas.width;
	newCanvas.height = canvas.height;

	// Paint the new canvas with white color
	var ctx = newCanvas.getContext('2d');
	if (saveWhiteBg) {
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
	}

	// Draw the original canvas on top of the new canvas
	ctx.drawImage(canvas, 0, 0);

	// Download the new canvas as an image
	link.download = "atlasinfo.png";
	link.href = newCanvas.toDataURL('image/png');
	link.click();
}

scale.onchange = function(){
	var newScale = this.value / 100;
	if(newScale == 0){
		newScale = 0.1;
	}
	setScale(newScale,false)
}
sel_scale.onchange = function(){
	setScale(this.value,true);
}
function setScale(newScale, updateSlider = true){
	unitScale = newScale;
	sel_scale.value = unitScale;
	if(updateSlider){
		scale.value = unitScale*100;
	}
	draw();
}
toggleLog.onclick = function() {
	if(logwrapper.style.display == 'block'){
		logwrapper.style.display = 'none';
	} else {
		logwrapper.style.display = 'block';
	}
}
download_image.addEventListener('click', getImage, false);
window.addEventListener("load", function(){ setScale(0.25); logwrapper.style.display = 'none'; }, false);
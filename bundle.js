function parseColor(color){return color.slice(0,2)+color.slice(3,4)+color.slice(5,6)}function printColor(a,b,c){color_full=document.getElementById("html5colorpicker").value,color=parseColor(color_full)}function fillrectangle(ctx,position,color){parsedx=10*Math.floor(position.x/10),parsedy=10*Math.floor(position.y/10),ctx.beginPath(),ctx.rect(parsedx,parsedy,10,10),ctx.fillStyle=color,ctx.fill(),ctx.closePath()}function onMouseMove(e){if(1==mouseDown){var xy=getMousePos(e);fillrectangle(ctx,{x:xy.mouseX,y:xy.mouseY},color)}else var xy=getMousePos(e)}function onMouseDown(e){mouseDown=1;var xy=getMousePos(e);fillrectangle(ctx,{x:xy.mouseX,y:xy.mouseY},color)}function onMouseUp(){mouseDown=0}function getMousePos(e){var o={};if(!e)var e=event;return e.offsetX?(o.mouseX=e.offsetX,o.mouseY=e.offsetY):e.layerX&&(o.mouseX=e.layerX,o.mouseY=e.layerY),o}function showSales(){document.getElementById("editPanel").style.display="block";for(var i in SQUARESINFO){var pos_info=SQUARESINFO[i];if(pos_info){var position=i,canvas_position=fromPositionToStartPixel(position);pos_info&&pos_info.onsale?fillrectangle(ctx_sales_board,{x:canvas_position.x,y:canvas_position.y},"rgba(0, 0, 255, 0.3)"):pos_info&&0==pos_info.onsale&&fillrectangle(ctx_sales_board,{x:canvas_position.x,y:canvas_position.y},"rgba(255, 0, 0, 0.3)")}}}function clearShowSales(){document.getElementById("editPanel").style.display="none",ctx_sales_board.fillStyle="rgba(0, 0, 0, 1.0)",ctx_sales_board.clearRect(0,0,canvas_sales.width,canvas_sales.height)}function fromPositionToStartPixel(position){return{x:position%128*10,y:10*Math.floor(position/128)}}function draw(img){ctx_main_board.drawImage(img,0,0),BASE_IMAGE_DATA=ctx.getImageData(0,0,canvas_main.width,canvas_main.height)}function updateImg(img,new_image,canvas_position){}function updateCanvas(position,lines){var canvas_position=fromPositionToStartPixel(position),new_image=processImage(lines);ctx_main_board.putImageData(new_image,canvas_position.x,canvas_position.y),updateImg(BASE_IMAGE_DATA,new_image,canvas_position)}function processImage(lines){var img=ctx.createImageData(10,10),data=img.data;current_id=0;for(var key=0;key<5;key++)for(var line=lines[key],i=0;i<20;i++){var r=getIntfromHex(line[3*i+2]),g=getIntfromHex(line[3*i+3]),b=getIntfromHex(line[3*i+4]);data[current_id]=r,current_id++,data[current_id]=g,current_id++,data[current_id]=b,current_id++,data[current_id]=255,current_id++}return img}function onMouseMoveMain(e){e.preventDefault(),e.stopPropagation();var xy=getMousePos(e);currentChunk=Math.floor(xy.mouseX/10)+128*Math.floor(xy.mouseY/10),displayChunkInformation(currentChunk)}function displayChunkInformation(currentChunk){var holder=document.getElementById("selected_title");SQUARESINFO[currentChunk]&&SQUARESINFO[currentChunk].title&&(holder.innerText=SQUARESINFO[currentChunk].title.replace(/[^\x01-\x7F]/g,""))}function updateChunkInfo(position){document.getElementById("buy_price").innerText=SQUARESINFO[position]&&SQUARESINFO[position].price||.5,SQUARESINFO[position]&&void 0!=SQUARESINFO[position].onsale?document.getElementById("on_sale").innerText=SQUARESINFO[position].onsale&&"Yes"||"No":document.getElementById("on_sale").innerText="Yes"}function drawSelectionChunk(position,x,y){ctx_selection.clearRect(0,0,canvas_selection.width,canvas_selection.height),SELECT_BLOCK?fillrectangle(ctx_selection,{x:x,y:y},"rgba(0, 255, 00, 0.3)"):SQUARESINFO[position]&&SQUARESINFO[position].url&&(location.href="http://goo.gl/"+SQUARESINFO[position].url)}function onMouseDownMain(e){e.preventDefault(),e.stopPropagation();var xy=getMousePos(e);currentChunk=Math.floor(xy.mouseX/10)+128*Math.floor(xy.mouseY/10),selectionDisplay.value=currentChunk,updateChunkInfo(currentChunk),drawSelectionChunk(currentChunk,xy.mouseX,xy.mouseY)}function getCanvasInformation(){var ctx=canvas.getContext("2d"),width=canvas.width,height=canvas.height;image=ctx.getImageData(0,0,width,height),content=[];for(var i=0;i<10;i++)for(var j=0;j<10;j++){pixel_start=4*(10*i*100+10*j);var r=image.data[pixel_start],g=image.data[pixel_start+1],b=image.data[pixel_start+2],a=image.data[pixel_start+3];if(0==a)content.push("#FFFFFF");else{var hex="#"+getHex(r)+getHex(g)+getHex(b);content.push(hex)}}return content}function getHex(nb){return(nb.toString(16).toUpperCase()+"0").slice(0,2)}function getIntfromHex(hex){return hexString=hex+hex,parseInt(hexString,16)}function getBytes32(a){for(var current=a.reduce(function(acum,elem){return acum+getSimpleRGB(elem)},""),bytes=[],i=0;i<5;i++)bytes.push("0x"+current.slice(60*i,60*(i+1))+"0000");return bytes}function getSimpleRGB(hex){return hex.slice(1,2)+hex.slice(3,4)+hex.slice(5,6)}function parseEvent(event){if(event&&"chunkEdited"==event.event){var args=event.args,position=args.position,title=args.title,url=args.url,parsed_url=web3.toAscii(url),parsed_title=web3.toAscii(title);SQUARESINFO[position]||(SQUARESINFO[position]={}),SQUARESINFO[position].url=parsed_url,SQUARESINFO[position].title=parsed_title;var lines=[];lines.push(args.line0),lines.push(args.line1),lines.push(args.line2),lines.push(args.line3),lines.push(args.line4),updateCanvas(position,lines),SQUARESINFO[position].url=parsed_url,SQUARESINFO[position].lines=lines,SQUARESINFO[position].title=parsed_title}else if(event&&"chunkSale"==event.event){var args=event.args,position=args.position;SQUARESINFO[position]||(SQUARESINFO[position]={}),SQUARESINFO[position].onsale=args.onsale,SQUARESINFO[position].price=args.price,SQUARESINFO[position].seller=args.seller}localStorage&&localStorage.setItem("squares",SQUARESINFO)}function switch_map(){console.log("switching map"),document.getElementById("switch_sale").checked?(showSales(),SELECT_BLOCK=!0):(clearShowSales(),ctx_selection.clearRect(0,0,canvas_selection.width,canvas_selection.height),SELECT_BLOCK=!1)}function loadJSON(callback){var xobj=new XMLHttpRequest;xobj.overrideMimeType("application/json"),xobj.open("GET","data.json",!0),xobj.onreadystatechange=function(){4==xobj.readyState&&"200"==xobj.status&&callback(xobj.responseText)},xobj.send(null)}var canvas=document.getElementById("myCanvas"),ctx=canvas.getContext("2d");localStorage.getItem("SQUARESINFO");var mouseX,mouseY,mouseDown=0,color="#000",currentChunk=0,img=new Image,BASE_IMAGE_DATA=null,BUYER_MODE=!1,LASTBLOCK=0,SQUARESINFO=[],SELECT_BLOCK=!1,CONTACT_ADDRESS="0xaf329eba72e828127bd32e85e70ad0f972a8960e";canvas.addEventListener("mousedown",onMouseDown,!1),canvas.addEventListener("mousemove",onMouseMove,!1),canvas.addEventListener("mouseup",onMouseUp,!1);var picker=document.getElementById("html5colorpicker");picker.addEventListener("change",printColor,!1);var canvas_sales=document.getElementById("salesCanvas"),ctx_sales_board=canvas_sales.getContext("2d"),canvas_main=document.getElementById("boardCanvas"),ctx_main_board=canvas_main.getContext("2d"),selectionDisplay=document.getElementById("selected"),canvas_selection=document.getElementById("selectionCanvas"),ctx_selection=canvas_selection.getContext("2d");draw(img),canvas_selection.addEventListener("mousedown",onMouseDownMain,!1),canvas_selection.addEventListener("mousemove",onMouseMoveMain,!1);var selected_input=document.getElementById("selected");selected_input.addEventListener("input",function(event){event.preventDefault(),event.stopPropagation();var position=document.getElementById("selected").value;console.log(position),updateChunkInfo(position);var canvas_position=fromPositionToStartPixel(position);drawSelectionChunk(position,canvas_position.x,canvas_position.y)},!1),window.addEventListener("load",function(){loadJSON(function(response){function buy(){var price=document.getElementById("buy_price").innerText,position=getCurrentPosition();board.buyChunk(position,{from:web3.eth.coinbase,value:web3.toWei(price,"ether")},function(err,res){console.log(err),console.log("tx: "+res)})}function edit(){var url=document.getElementById("url_input").value||" ",title=document.getElementById("title_input").value||" ",parsed_url=web3.fromAscii(url),parsed_title=web3.fromAscii(title),image_data=getCanvasInformation(),lines=getBytes32(image_data),position=getCurrentPosition();console.log(lines),board.editChunk(position,parsed_url,parsed_title,lines[0],lines[1],lines[2],lines[3],lines[4],{from:web3.eth.coinbase},function(err,res){console.log(err),console.log("edit tx: "+res)})}function getCurrentPosition(){return selectionDisplay.value}function sell(){var price=Number(document.getElementById("sell_price").value),position=getCurrentPosition();board.sellChunk(position,!0,price,{from:web3.eth.coinbase},function(err,res){console.log(err),console.log("tx: "+res)})}function withdraw(){board.withdraw({from:web3.eth.coinbase},function(err,res){console.log(err),console.log("tx: "+res)})}try{var actual_JSON=JSON.parse(response);LASTBLOCK=actual_JSON.lastblock,SQUARESINFO=actual_JSON.squares}catch(e){console.log(e)}if(img.onload=function(){draw(this)},img.src="base.png","undefined"!=typeof web3){var ele1=document.getElementById("noWeb3");ele1.style.display="none",window.web3=new Web3(web3.currentProvider)}else{var ele1=document.getElementById("withWeb3");ele1.style.display="none",console.log("No web3? You should consider trying MetaMask!")}const abi=JSON.parse('[{"constant":false,"inputs":[],"name":"withdraw","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"position","type":"uint256"}],"name":"buyChunk","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"position","type":"uint256"},{"name":"url","type":"bytes32"},{"name":"title","type":"bytes32"},{"name":"line0","type":"bytes32"},{"name":"line1","type":"bytes32"},{"name":"line2","type":"bytes32"},{"name":"line3","type":"bytes32"},{"name":"line4","type":"bytes32"}],"name":"editChunk","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"position","type":"uint256"},{"name":"sell","type":"bool"},{"name":"price","type":"uint256"}],"name":"sellChunk","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"position","type":"uint256"},{"indexed":false,"name":"url","type":"bytes32"},{"indexed":false,"name":"title","type":"bytes32"},{"indexed":false,"name":"line0","type":"bytes32"},{"indexed":false,"name":"line1","type":"bytes32"},{"indexed":false,"name":"line2","type":"bytes32"},{"indexed":false,"name":"line3","type":"bytes32"},{"indexed":false,"name":"line4","type":"bytes32"}],"name":"chunkEdited","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"position","type":"uint256"},{"indexed":false,"name":"onsale","type":"bool"},{"indexed":false,"name":"price","type":"uint256"},{"indexed":false,"name":"seller","type":"address"}],"name":"chunkSale","type":"event"}]'),contract=web3.eth.contract(abi),board=contract.at(CONTACT_ADDRESS);document.getElementById("switch_sale").addEventListener("click",switch_map,!1);var buy_button=document.getElementById("buyButton");buy_button.addEventListener("click",buy,!1);var buy_button=document.getElementById("editButton");buy_button.addEventListener("click",edit,!1),document.getElementById("sellButton").addEventListener("click",sell,!1),document.getElementById("withdrawButton").addEventListener("click",withdraw,!1),board.chunkEdited({},{fromBlock:LASTBLOCK,toBlock:"latest"}).watch(function(error,result){error||(console.log("Edited"),console.log(result),parseEvent(result))}),board.chunkSale({},{fromBlock:LASTBLOCK,toBlock:"latest"}).watch(function(error,result){console.log("Sale"),error||(console.log(result),parseEvent(result))})})});

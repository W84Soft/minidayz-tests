const style=document.createElement("style");
style.innerHTML=`
#map{
	visibility:visible;
	opacity:1;
	position:absolute;
	top:0;
	left:0;
	right:0;
	bottom:0;
	max-height:100%;
	display:-webkit-flex;
	justify-content:center;
	align-items:center;
	padding:16px;
	background:rgba(24,24,24,.8);
	-webkit-transition:.5s;
}
#map.hide{
	visibility:hidden;
	opacity:0;
}
#map img{
	max-width:100%;
	max-height:100%;
}
`;
document.head.append(style);

const div=document.createElement("div");
div.id="map";
div.className="hide";
div.addEventListener("click",function(event){
	event.preventDefault();
	this.classList.add("hide");
	
});
document.body.append(div);


const maps={
	"map_minidayz":"map_minidayz.png",
	"map_narva":"map_narva.jpg"
}
const mod={
	map(name){
		div.classList.remove("hide");
		div.innerHTML=`<img src="./${maps[name]}">`;
	}
}

// export
window.mod=mod;
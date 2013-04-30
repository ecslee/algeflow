atomList = [];
bondList = [];
l8 = [[-25, 100], [25, 100],
	  [100, 25], [100, -25],
	  [25, -100], [-25, -100],
	  [-100, -25], [-100, 25]];
l4 = [[58, 25], [58, -25],
	  [-58, -25], [-58, 25]];
l2 = [[50, 0], [-50, 0]];

/* MODE:
 *   0 = chemistry
 *   1 = multiplication
 *   2 = addition
*/

mode = 0;
function changeMode() {
	mode = (mode+1)%3;
	if (mode==0) {
		document.getElementById("mode").innerHTML ="Chem";
		$("#mode").switchClass("teal", "yellow", 200);
	} else if (mode==1) {
		document.getElementById("mode").innerHTML ="Mult";
		$("#mode").switchClass("yellow", "pink", 200);
	} else if (mode==2) { 
		document.getElementById("mode").innerHTML ="Add";
		$("#mode").switchClass("pink", "teal", 200);
	}
	
	if (mode) {
		for (var i=0; i<atomList.length; i++) {
			for (var j=0; j<atomList[i].lights.length; j++) {
				var l = atomList[i].lights[j];
				document.getElementById(l.id).innerHTML = j;
			}
		}
	} else {
		for (var i=0; i<atomList.length; i++) {
			for (var j=0; j<atomList[i].lights.length; j++) {
				var l = atomList[i].lights[j];
				document.getElementById(l.id).innerHTML = "";
			}
		}
	}
}

/* CHECK:
 * 
*/

function check() {
	if (document.getElementById("check").innerHTML=="Clear") {
		document.getElementById("check").innerHTML="Check";
		document.getElementById("result").innerHTML="";
		$("#result").switchClass("green", "grey", 200);
				
		for (var i=0; i<atomList.length; i++) {
			var a = atomList[i];
			document.getElementById(a.id+"-text").innerHTML = "";
			for (var j=0; j<a.lights.length; j++) {
				if (a.lights[j].on) { switchLight(a.lights[j].id); }
			}
		}
	} else {
		var result;
		if (mode==0) { result = chem(); }
		else if (mode==1) { result = mult(); }
		else if (mode==2) { result = add(); }
		
		if (result) {
			document.getElementById("result").innerHTML = "Correct!";
			document.getElementById("check").innerHTML = "Clear";
			$("#result").switchClass("grey", "green", 200);
		} else { document.getElementById("result").innerHTML = "Incorrect"; }
	}
}

function checkBonds() {
	
}

function chem() {
	
}

function mult() {
	var results = [];
	for (var i=0; i<atomList.length; i++) {
		var a = atomList[i];
		var num = 0;
		for (var j=0; j<a.lights.length; j++) {
			num += Math.pow(2, j)*a.lights[j].on;
		}
		document.getElementById(a.id+"-text").innerHTML = num;
		results[results.length] = num;
	}
	
	// assume first in the list is center atom
	var result = 1;
	for (var i=1; i<results.length; i++) {
		result *= results[i];
	}
	if (result==results[0]) { return true; }
	else { return false; }
}

function add() {
	var results = [];
	for (var i=0; i<atomList.length; i++) {
		var a = atomList[i];
		var num = 0;
		for (var j=0; j<a.lights.length; j++) {
			num += Math.pow(2, j)*a.lights[j].on;
		}
		document.getElementById(a.id+"-text").innerHTML = num;
		results[results.length] = num;
	}
	
	// assume first in the list is center atom
	var result = 0;
	for (var i=1; i<results.length; i++) {
		result += results[i];
	}
	if (result==results[0]) { return true; }
	else { return false; }
}

/* OBJECTS */

function Light(id, color) {
	this.id = id;
	this.color = color;
	this.on = 0;
}

/* TURN LIGHTS ON OR OFF
 * Find the html light and change its color.
 * Match to a javascript light and edit on info.
*/
function switchLight(id) {
	for (var a=0; a<atomList.length; a++) {
		if (atomList[a].id == id.substring(0, id.indexOf("-"))) {
			var light = atomList[a].lights[Number(id.substring(id.indexOf("-l")+2))];
			if (light.on) {
				$("#"+id).switchClass(light.color, "grey", 200);
				light.on = 0;
			} else {
				$("#"+id).switchClass("grey", light.color, 100);
				light.on = 1;
			}
		}
	}
}

function Atom(id, color, lcolor, numLights, atom, dx, dy) {
	this.id = id;
	this.color = color;
	this.lcolor = lcolor;
	this.numLights = numLights;
	this.radius = (numLights===8) ? 150 : 100;
	this.atom = atom;
	this.lights = [];
	this.htmlObject = 0;
	this.dx = dx;
	this.dy = dy;
}

function Bond(atom1, atom2) {
	this.atom1 = atom1;
	this.atom2 = atom2;
}


/* METHODS */

function display() {
    var ua = navigator.userAgent;
    var event = (ua.match(/iPad/i)) ? "touchstart" : "click";
 	event = "touchstart";
    	
	var canvas = document.getElementById("canvas");
	canvas.setAttribute("height", $(window).height());
	canvas.setAttribute("width", ($(window).width()<900) ? 900 : $(window).width());
	
	var buttonOffset = 51;
	document.getElementById("mode").style.top = $(window).height()-buttonOffset+"px";
	document.getElementById("check").style.top = $(window).height()-buttonOffset+"px";
	document.getElementById("result").style.top = $(window).height()-buttonOffset+"px";

	// Atoms
	oxygen =  new Atom( 'O',  'tomato',   'lemon', 8, 8,    0, 0);
	helium1 = new Atom('H1',    'plum',    'cyan', 4, 1, -300, 0);
	helium2 = new Atom('H2', 'spinach', 'magenta', 4, 1,  300, 0);
	atomList = [oxygen, helium1, helium2];
	
	var x = document.getElementById("canvas").getAttribute("width")/2.0;
	var y = (document.getElementById("canvas").getAttribute("height")-buttonOffset)/2.0;
	
	// Atoms
	for (var i=0; i<3; i++) {
		var a = atomList[i];
		var atom = document.createElement("div");
		atom.style.left = x+a.dx-a.radius+"px";
		atom.style.top = y+a.dy-a.radius+"px";
		atom.style.position = "absolute";
		var clas = " atom " + a.color + " ";
		clas += (a.radius===150) ? "atom-large" : "atom-small";
		atom.setAttribute("class", clas);
		atom.id = a.id;
		canvas.appendChild(atom);
		
		$(".atom").draggable();
		
	}

	// Lights
	for (var i=0; i<3; i++) {
		var a = atomList[i];
		var aDoc = document.getElementById(a.id);
		var w = Number(aDoc.style.left.substring(0, aDoc.style.left.search("px"))) + a.radius;
		var h = Number(aDoc.style.top.substring(0, aDoc.style.top.search("px"))) + a.radius;
		var coord;
		if (a.numLights==2) { coord = l2; }
		else if (a.numLights==4) { coord = l4; }
		else if (a.numLights==8) { coord = l8; }
		for (var l=0; l<a.numLights; l++) {
			var id = a.id+"-l"+l;
			var light = new Light(id, a.lcolor);
			a.lights[a.lights.length] = light;
			var li = document.createElement("button");
			li.id = id;
			aDoc.appendChild(li);
			li.style.left = a.radius+coord[l][0]-12+"px";
			li.style.top = a.radius+coord[l][1]-12+"px";
			li.style.position = "absolute";
			li.setAttribute("class", "grey light");
			
			$("#"+id).button();
			$(".light").unbind("click").click(function() {
				switchLight(this.id);
			});
		}
		
		// TEXT FOR RESULTS
		var text = document.createElement("button");
		text.id = a.id+"-text";
		aDoc.appendChild(text);
		text.style.left = (a.radius-20)+"px";
		text.style.top = (a.radius-25)+"px";
		text.style.position = "absolute";
		text.setAttribute("class", "num-text grey");
		text.disabled = true;
		$("#"+a.id+"-text").button();
	}
		
	// Bonds
	bond1 = new Bond(oxygen, helium1);
	bond2 = new Bond(oxygen, helium2);
	bondList = [bond1, bond2];
	
	for (var i=0; i<bondList.length; i++) {
		var b = bondList[i];
		var a1 = document.getElementById(b.atom1.id);
		var a1Left = Number(a1.style.left.substring(0, a1.style.left.search("px")));
		var a1Top = Number(a1.style.top.substring(0, a1.style.top.search("px")));
		var a2 = document.getElementById(b.atom2.id);
		var a2Left = Number(a2.style.left.substring(0, a2.style.left.search("px")));
		var a2Top = Number(a2.style.top.substring(0, a2.style.top.search("px")));
		
		var bond = document.createElement("div");
		var bw = Math.abs((a1Left+b.atom1.radius) - (a2Left+b.atom2.radius));
		var bh = Math.abs((a1Top+b.atom1.radius) - (a2Top+b.atom2.radius))+1;

		bond.style.width = bw+"px";
		bond.style.height = bh+"px";
		bond.style.left = ((a1Left<a2Left) ? a1Left+b.atom1.radius : a2Left+b.atom2.radius) + "px";
		bond.style.top = ((a1Top<a2Top) ? a1Top+b.atom1.radius : a2Top+b.atom2.radius) + "px";
		bond.style.position = "absolute";
		bond.style.zIndex = -10;
		bond.setAttribute("class", "orange");
		bond.id = "bond"+i;
		canvas.appendChild(bond);
	}
	
	
	changeMode();
}


// Global arrays
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
	
	// switch the Mode button depending on the mode
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
	
	// display numbers on the LEDs if in a math mode
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
 * Gets info from each LED and bond
 * Runs a certain function to check the result
*/

function check() {
	// if Check is pressed while it says "Clear," reset the board
	if (document.getElementById("check").innerHTML=="Clear") {
		document.getElementById("check").innerHTML="Check";
		document.getElementById("result").innerHTML="";
		$("#result").switchClass("green", "grey", 200);
		
		// remove numbers from center of atoms, turn off all LEDs
		for (var i=0; i<atomList.length; i++) {
			var a = atomList[i];
			document.getElementById(a.id+"-text").innerHTML = "";
			for (var j=0; j<a.lights.length; j++) {
				if (a.lights[j].on) { switchLight(a.lights[j].id); }
			}
		}
	} 
	
	// if Check says "Check" then run a checking function
	else {
		var result;
		if (mode==0) { result = chem(); }
		else if (mode==1) { result = mult(); }
		else if (mode==2) { result = add(); }
		
		// display Correct/Incorrect in the Result button
		if (result) {
			document.getElementById("result").innerHTML = "Correct!";
			document.getElementById("check").innerHTML = "Clear";
			$("#result").switchClass("grey", "green", 200);
		} else { document.getElementById("result").innerHTML = "Incorrect"; }
	}
}

function checkBonds() {
	
}

// Check electron configuration
function chem() {
	
}

// Check if outer atoms multiply together to produce the result atom
function mult() {
	var results = [];
	
	// get total per atom
	for (var i=0; i<atomList.length; i++) {
		var a = atomList[i];
		var num = 0;
		for (var j=0; j<a.lights.length; j++) {
			num += Math.pow(2, j)*a.lights[j].on;
		}
		document.getElementById(a.id+"-text").innerHTML = num;
		results[results.length] = num;
	}
	
	// assume first in the list is center atom, get total and compare to result atom
	var result = 1;
	for (var i=1; i<results.length; i++) {
		result *= results[i];
	}
	if (result==results[0]) { return true; }
	else { return false; }
}

// Check if outer atoms add together to produce the result atom
function add() {
	var results = [];
	
	// get total per atom
	for (var i=0; i<atomList.length; i++) {
		var a = atomList[i];
		var num = 0;
		for (var j=0; j<a.lights.length; j++) {
			num += Math.pow(2, j)*a.lights[j].on;
		}
		document.getElementById(a.id+"-text").innerHTML = num;
		results[results.length] = num;
	}
	
	// assume first in the list is center atom, get total and compare to result atom
	var result = 0;
	for (var i=1; i<results.length; i++) {
		result += results[i];
	}
	if (result==results[0]) { return true; }
	else { return false; }
}

/* OBJECTS */

/* Light
 * @param {String} id, color
 * @param {Bool} on
*/
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

/* Atom
 * @param {String} id, color, lcolor
 * @param {Number} numLights, atom, dx, dy
 * atom = atomic number, for chemistry mode
 * lights = array of lights associated with this atom
*/
function Atom(id, color, lcolor, numLights, atom, dx, dy) {
	this.id = id;
	this.color = color;
	this.radius = (numLights===8) ? 150 : 100;
	this.atom = atom;
	this.dx = dx;
	this.dy = dy;

	// lights
	this.lcolor = lcolor;
	this.numLights = numLights;
	this.lights = [];
}

/* Bond
 * @param {Atom} atom1, atom2
*/
function Bond(atom1, atom2) {
	this.atom1 = atom1;
	this.atom2 = atom2;
}


/* METHODS */

// run on window load
function display() {
    // iPad help...
    //var ua = navigator.userAgent;
    //var event = (ua.match(/iPad/i)) ? "touchstart" : "click";
    
    // set up the canvas	
	var canvas = document.getElementById("canvas");
	canvas.setAttribute("height", $(window).height());
	canvas.setAttribute("width", ($(window).width()<900) ? 900 : $(window).width());
	var buttonOffset = 51;
	var x = canvas.getAttribute("width")/2.0;
	var y = (canvas.getAttribute("height")-buttonOffset)/2.0;
	
	// place the buttons on the bottom of the screen
	document.getElementById("mode").style.top = $(window).height()-buttonOffset+"px";
	document.getElementById("check").style.top = $(window).height()-buttonOffset+"px";
	document.getElementById("result").style.top = $(window).height()-buttonOffset+"px";

	// Atoms
	oxygen =  new Atom( 'O',  'tomato',   'lemon', 8, 8,    0, 0);
	helium1 = new Atom('H1',    'plum',    'cyan', 4, 1, -300, 0);
	helium2 = new Atom('H2', 'spinach', 'magenta', 4, 1,  300, 0);
	atomList = [oxygen, helium1, helium2];
	
	for (var i=0; i<atomList.length; i++) {
		var atomJS = atomList[i];  // atom object
		var atomHtml = document.createElement("div");  // atom on screen
		
		// set up the onscreen atom
		atomHtml.id = atomJS.id;
		atomHtml.style.left = x+atomJS.dx-atomJS.radius+"px";
		atomHtml.style.top = y+atomJS.dy-atomJS.radius+"px";
		atomHtml.style.position = "absolute";
		
		// set its class
		var clas = " atom " + atomJS.color + " ";
		clas += (atomJS.radius===150) ? "atom-large" : "atom-small";
		atomHtml.setAttribute("class", clas);
		
		// add atom to the canvas and make it draggable
		canvas.appendChild(atomHtml);
		$(".atom").draggable();
	}

	// Lights
	for (var i=0; i<3; i++) {
		var atomJS = atomList[i];  // atom object
		var atomHtml = document.getElementById(atomJS.id);  // atom on screen
		var w = Number(atomHtml.style.left.substring(0, atomHtml.style.left.search("px"))) + atomJS.radius;
		var h = Number(atomHtml.style.top.substring(0, atomHtml.style.top.search("px"))) + atomJS.radius;
		
		// figure out coordinates for lights
		var coord;
		if (atomJS.numLights==2) { coord = l2; }
		else if (atomJS.numLights==4) { coord = l4; }
		else if (atomJS.numLights==8) { coord = l8; }
		
		for (var l=0; l<atomJS.numLights; l++) {
			var id = atomJS.id+"-l"+l;
			
			// light object
			var lightJS = new Light(id, atomJS.lcolor);
			atomJS.lights[atomJS.lights.length] = lightJS;
			
			// set up light on screen
			var lightHtml = document.createElement("button");
			lightHtml.id = id;
			atomHtml.appendChild(lightHtml);
			lightHtml.style.left = atomJS.radius+coord[l][0]-12+"px";
			lightHtml.style.top = atomJS.radius+coord[l][1]-12+"px";
			lightHtml.style.position = "absolute";
			lightHtml.setAttribute("class", "grey light");
			
			// make each light a clickable button that changes color on click
			$("#"+id).button();
			$(".light").unbind("click").click(function() {
				switchLight(this.id);
			});
		}
		
		// text display at center of each atom
		var text = document.createElement("button");
		text.id = atomJS.id+"-text";
		atomHtml.appendChild(text);
		text.style.left = (atomJS.radius-20)+"px";
		text.style.top = (atomJS.radius-25)+"px";
		text.style.position = "absolute";
		text.setAttribute("class", "num-text grey");
		
		// set text up as a button for style purposes but disable
		text.disabled = true;
		$("#"+atomJS.id+"-text").button();
	}
		
	// Bonds
	bond1 = new Bond(oxygen, helium1);
	bond2 = new Bond(oxygen, helium2);
	bondList = [bond1, bond2];
	
	for (var i=0; i<bondList.length; i++) {
		var bondJS = bondList[i];  // bond object
		var a1 = document.getElementById(bondJS.atom1.id);  // atom HTML
		var a1Left = Number(a1.style.left.substring(0, a1.style.left.search("px")));
		var a1Top = Number(a1.style.top.substring(0, a1.style.top.search("px")));
		var a2 = document.getElementById(bondJS.atom2.id);  // atom HTML
		var a2Left = Number(a2.style.left.substring(0, a2.style.left.search("px")));
		var a2Top = Number(a2.style.top.substring(0, a2.style.top.search("px")));
		
		// setup onscreen bond object
		var bondHtml = document.createElement("div");  // bond HTML
		bondHtml.id = "bond"+i;
		var bw = Math.abs((a1Left+bondJS.atom1.radius) - (a2Left+bondJS.atom2.radius));
		var bh = Math.abs((a1Top+bondJS.atom1.radius) - (a2Top+bondJS.atom2.radius))+1;
		bondHtml.style.width = bw+"px";
		bondHtml.style.height = bh+"px";
		bondHtml.style.left = ((a1Left<a2Left) ? a1Left+bondJS.atom1.radius : a2Left+bondJS.atom2.radius) + "px";
		bondHtml.style.top = ((a1Top<a2Top) ? a1Top+bondJS.atom1.radius : a2Top+bondJS.atom2.radius) + "px";
		bondHtml.style.position = "absolute";
		bondHtml.style.zIndex = -10;  // push it to the back
		bondHtml.setAttribute("class", "orange");
		canvas.appendChild(bondHtml);
	}
	
	// initially switch the mode to multiplication
	changeMode();
}


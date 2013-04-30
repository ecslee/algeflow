function Problem(equation, answer, blocks, correct) {
	this.equation = equation;
	this.answer = answer;
	this.blocks = blocks;
	this.correct = correct;
}

function Block(type, id, eq_clip) {
	this.type = type;
	this.id = id;
	this.eq_clip = eq_clip;
}

function checkOrder(onScreenOrder) {
	var problem = probList[counter];
	var correct = false
	
	// CHECK IF THE ON SCREEN ORDER IS ONE OF THE CORRECT ORDERS
	for (var i in problem.correct) {
		if (problem.correct[i] == onScreenOrder) {
			correct = true;
			break;
		}
	}
	
	// DISPLAY THE RESULT
	if (correct == false) {
		document.getElementById("result").innerHTML = "Not quite...";
	} else {
		document.getElementById("next").removeAttribute('disabled');
		document.getElementById("result").innerHTML = "Correct! " + problem.answer;
	}
}

function displayProblem() {
	counter++;
	
	// if the user has gone all the way through the list, reset the list.
	if (counter >= probList.length) {
		counter = 0;
	}
	var nextProb = probList[counter];
	var blocks = document.getElementById("blocks");
	var canvas = document.getElementById("canvas");
	document.getElementById("next").setAttribute('disabled', 'disabled');
	
	// remove the old blocks
	while (blocks.firstChild) {
		blocks.removeChild(blocks.firstChild);
	}
	while (canvas.firstChild) {
		canvas.removeChild(canvas.firstChild);
	}
	document.getElementById("result").innerHTML = "";
	
	// present the new equation
	document.getElementById("equation").innerHTML = nextProb.equation;
	
	// generate a random order for the new blocks	
	var order = new Array(nextProb.blocks.length);
	for (var i=0; i<nextProb.blocks.length; i++) {
		order[i] = String(i);
	}
	order = shuffleArray(order);
	
	// make the new blocks
	for (var i=0; i<nextProb.blocks.length; i++) {
		var index = order[i];
		var newChild = document.createElement("li");
		newChild.id = String(index);
		newChild.className = "ui-state-default";
		newChild.innerHTML = nextProb.blocks[index].eq_clip;
		blocks.appendChild(newChild);
	}
}

/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}



// PROBLEM 1
p1_b1 = new Block("distribute", "0", "Distribute 2");
p1_b2 = new Block("add", "1", "Both sides: Add x");
p1_b3 = new Block("subtract", "2", "Both sides: Subtract 12");
p1_b4 = new Block("divide", "3", "Both sides: Divide by 3");
p1 = new Problem("2(x + 6) = 9 - x",
				 "x = -1",
				 [p1_b1, p1_b2, p1_b3, p1_b4],
				 ["0,1,2,3", "0,2,1,3"]);


// PROBLEM 2
p2_b1 = new Block("subtract", "0", "Both sides: Subtract 1");
p2_b2 = new Block("divide", "1", "Both sides: Divide by 3");
p2_b3 = new Block("subtract", "2", "Both sides: Add 10");
p2 = new Problem("3x + 1 = 10",
				 "x = 3",
				 [p2_b1, p2_b2, p2_b3],
				 ["0,1"]);

// PROBLEM 3
p3_b1 = new Block("multiply", "0", "2 x 3");
p3_b2 = new Block("add", "1", "1 + 6");
p3_b3 = new Block("add", "2", "7 + 2");
p3_b4 = new Block("add", "3", "1 + 2");
p3_b5 = new Block("add", "4", "3 + 2");
p3 = new Problem("1 + 2 x 3 + 2",
				 "9",
				 [p3_b1, p3_b2, p3_b3, p3_b4, p3_b5],
				 ["0,1,2"]);

// PROBLEM LIST
var probList = [p3, p2, p1];
var counter = -1;

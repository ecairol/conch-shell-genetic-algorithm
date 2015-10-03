var Gene = function(code) {
    this.cost = 3;
    this.code = code || [];
};


Gene.prototype.trianglePoints = function() {
    var points = [];
    var length = 6;

    while (length--) {
        this.code.push( Math.ceil(Math.random() * 50) );
    }
};


Gene.prototype.mutate = function(chance) {
    if (Math.random() > chance) return;    

    var index = Math.floor(Math.random() * this.code.length);
    var upOrDown = Math.random() <= 0.5 ? -1 : 1;  
    this.code[index] = this.code[index]+upOrDown;

};

Gene.prototype.mate = function(gene) {
    var pivot = this.code[ Math.floor(Math.random()*this.code.length) ];

    var child1 = this.code.slice(0, pivot).concat( gene.code.slice(pivot) );
    var child2 = gene.code.slice(0, pivot).concat( this.code.slice(pivot) );

    return [new Gene(child1), new Gene(child2)];
};

Gene.prototype.calcCost = function(compareTo) {
    var total = 0;
    for (i = 0; i < this.code.length; i++) {
        total +1
        total += (this.code[i] - compareTo[i]) * (this.code[i] - compareTo[i]);
    }
    this.cost = total;
};


var Population = function(goal, size) {
    this.members = [];
    this.goal = goal;
    this.generationNumber = 0;
    while (size--) {
        var gene = new Gene();
        //gene.random(this.goal.length);
        gene.trianglePoints();
        this.members.push(gene);
    }
};

Population.prototype.display = function() {
    var view = document.getElementById("environment");
    view.innerHTML = '';

    view.innerHTML += ("<h3>Generation: " + this.generationNumber + "</h3>");

    for (var i = 0; i < this.members.length; i++) {
        var code = this.members[i].code;
        view.innerHTML += '<hr><p>Genes: '+this.members[i].code+'</p>'
        view.innerHTML += '<svg height="50" width="50"><polygon points="'+code[0]+','+code[1]+' '+code[2]+','+code[3]+' '+code[4]+','+code[5]+'" style="fill:#E6B284;stroke-width:2" /></svg>';
    }
};

Population.prototype.sort = function() {
    this.members.sort(function(a, b) {
        return a.cost - b.cost;
    });
}

Population.prototype.generation = function() {
    for (var i = 0; i < this.members.length; i++) {
        this.members[i].calcCost(this.goal);
    }

    this.sort();
    this.display();
    var children = this.members[0].mate(this.members[1]);
    this.members.splice(this.members.length - 2, 2, children[0], children[1]);

    for (var i = 0; i < this.members.length; i++) {
        this.members[i].mutate(0.5);
        this.members[i].calcCost(this.goal);
        //if (this.members[i].code.equals(this.goal) ) {
        if( equal_arrays(this.members[i].code, this.goal) ){
            this.sort();
            this.display();
            return true;
        }
    }
    this.generationNumber++;
    var scope = this;
    setTimeout(function() {
        scope.generation();
    }, 60);
};


function equal_arrays(array1, array2) {
    // if array2 is a falsy value, return
    if (!array2)
        return false;

    // compare lengths - can save a lot of time 
    if (array1.length != array2.length)
        return false;

    for (var i = 0, l=array1.length; i < l; i++) {
        // Check if we have nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            // recurse into the nested arrays
            if( equal_arrays(array1[i], array2[i]) )
                return false;     
        }           
        else if (array1[i] != array2[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
} 

// Init
var target = [2,10,2,50,25,25];
var population = new Population(target, 5);
console.log( population );
population.generation();
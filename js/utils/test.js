var verb = document.getElementById("test");

var plan = new SB2.Plan(20, 10);

plan.set(1, 1, 1);
plan.set(0, 0, 1);
plan.fill(1, 2, 2, 8, 4);
plan.clear(4, 4, 5, 1);
console.log(plan.toString());
verb.innerHTML = (plan.toString());

var rect = {x:2, y:2, width:1, height:1, value:1};

rect = plan.extendVertically(rect);
console.log(rect);
rect = plan.extendHorizontally(rect);
console.log(rect);
console.log(plan.optimise());

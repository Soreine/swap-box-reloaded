var verb = document.getElementById("test");

var plan = new SB2.Plan(20, 10);

plan.setMap(1, 1, 1);

plan.fill(1, 2, 2, 8, 4);
plan.clear(3, 3, 6, 2);
console.log(plan);
console.log(plan.toString());
verb.innerHTML = (plan.toString());

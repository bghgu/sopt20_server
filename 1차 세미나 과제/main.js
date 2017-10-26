const pocketmon = require("./pocketmon.js");

var thunder_stone = {
  color : "green",
  core : "thunder"
};

var fire_stone = {
  color : "yellow",
  core : "fire"
};

var water_stone = {
  color: "violet",
  core : "aqua"
};

pocketmon.add_monster("꼬부기");
pocketmon.add_monster("피카츄");
pocketmon.add_monster("파이리");
pocketmon.getNames();

pocketmon.is_evolved("꼬부기", water_stone);
pocketmon.is_evolved("피카츄", thunder_stone);
pocketmon.is_evolved("파이리", water_stone);
pocketmon.is_evolved("파이리", fire_stone);
pocketmon.getNames();

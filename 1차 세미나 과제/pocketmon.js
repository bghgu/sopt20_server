//모든 코드는 외부모듈로 쓰일 pocketmon객체 안에서 구현해주세요.
var pocketmon = {

  list: [],

  pokemonInfo: function(name){

    var 꼬부기 = {
      name : "꼬부기",
      evo_name : "어니부기",
      core : "aqua"
    };

    var 피카츄 = {
      name : "피카츄",
      evo_name : "라이츄",
      core : "thunder"
    };

    var 파이리 = {
      name : "파이리",
      evo_name : "리자드",
      core : "fire"
    };

    if(name == 꼬부기.name) {
      return 꼬부기;
    }
    else if(name == 피카츄.name) {
      return 피카츄;
    }
    else
      return 파이리;
  },

  //add_monster를 호출하면 list배열에 포켓몬객체가 저장됩니다.
  add_monster: function(name){
    this.list.push(this.pokemonInfo(name));
  },

  //포켓몬의 특성에 맞는 돌이 인자로 넘어오면 호출됩니다.
  jinwha: function(name){
    console.log(name+"(으)로 진화~!");
  },

  //list 배열 내에 저장됩 모든 포켓몬객체들의 이름 값을 출력합니다.
  getNames: function(){
    for(var i = 0; i < this.list.length; i++) {
      console.log(this.list[i].name);
    }
  },
  //진화
  is_evolved: function(name, stone) {
    for(var i = 0; i < this.list.length; i++) {
      //이름이 같은지 검사
      if(this.list[i].name == name) {
        //타입이 같은지 검사
        if(this.list[i].core == stone.core) {
          //진화 함수 호출
          this.jinwha(this.list[i].evo_name);
          //진화
          this.list[i].name = this.list[i].evo_name;
        }
        else
          console.log("아야!");
      }
    }
  }

};

module.exports = pocketmon;

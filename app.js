
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var myObj = JSON.parse(this.responseText);
    console.log(myObj.matches);
    var teamsDict = {};
    
    var container = document.querySelector('.list-container');
    if(myObj.hasOwnProperty('matches')){
		myObj.matches.forEach(match=> { setDict(match) });
	}else{
		myObj.rounds.forEach(round=> { 
			round.matches.forEach(match=>{setDict(match); console.log(match); });
		});
	};
	function setDict(match){
        if(!(match.team1 in teamsDict)){ teamsDict[match.team1]=0;}
        if(!(match.team2 in teamsDict)){ teamsDict[match.team2]=0;}
        if(match.hasOwnProperty('score')){
             const res = match.score.ft;
             if(res[0]>res[1]){ teamsDict[match.team1]+=3; }
             else if(res[1]>res[0]) {teamsDict[match.team2]+=3;}
             else{ teamsDict[match.team1]++; teamsDict[match.team2]++;} 
        }
       // var game = document.createElement('ul');
        //var homeTeam = document.createElement('li');
        //var awayTeam = document.createElement('li');

        //homeTeam.innerText = match.team1;
        //awayTeam.innerText = match.team2;
        //game.appendChild(homeTeam);
        //game.appendChild(awayTeam);

        //container.appendChild(game);
        //console.log(+' vs ' +match.team2);});
  };
  console.log(teamsDict);
  keysSorted = Object.keys(teamsDict).sort(function(a,b){return teamsDict[a]-teamsDict[b]}).reverse();
  var table = keysSorted.map(key=>[key,teamsDict[key]]);
  console.log(table); 
  for(var i=0; i<table.length;i++){
       var posI = document.createElement('ul');
       var teamAtI = document.createElement('li');
       var scoreAtI = document.createElement('li');
       var posNum = document.createElement('li');
       teamAtI.innerText=table[i][0];
       scoreAtI.innerText = table[i][1];
       posNum.innerText=i+1;

       posI.appendChild(posNum);
       posI.appendChild(teamAtI);
       posI.appendChild(scoreAtI);
       
       if(i<4){
         posI.classList.add('first-4');
       }else if(i<6){
         posI.classList.add('first-6');
       }else if(i+1>17){
         posI.classList.add('last-3');
       }
       container.appendChild(posI);
  }
}};

var yearSelector = document.querySelector('select');
//var yearChosen= yearSelector.options[yearSelector.selectedIndex].value;
yearSelector.addEventListener('change',(event)=>{
	document.querySelector('.list-container').innerHTML="";
	yearChosen=event.target.value;
	const url = "https://raw.githubusercontent.com/openfootball/football.json/master/"+yearChosen+"/en.1.json";

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
});
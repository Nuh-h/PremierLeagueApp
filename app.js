
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var myObj = JSON.parse(this.responseText);
    console.log(myObj.matches);
	
	//form a dictionary to count total points for each team
    var teamsDict = {};
	var teamsGA_GF = {}; //[goals conceded, goals scored]
	var teamMatches = {}; //[matches played, wins, losses, draws]
    
    var container = document.querySelector('.list-container');
	//setting the dictionary based on the JSON format for each year
	//There is two formats observed so far ... further testing to be done for earlier years
    if(myObj.hasOwnProperty('matches')){
		myObj.matches.forEach(match=> { setDict(match) });
	}else{
		myObj.rounds.forEach(round=> { 
			round.matches.forEach(match=>{ setDict(match); console.log(match); });
		});
	};
	function setDict(match){
        if(!(match.team1 in teamsDict)){
			teamsDict[match.team1]=0; 
			teamsGA_GF[match.team1]=[0,0];
			teamMatches[match.team1]=[0,0,0,0];
		}
        if(!(match.team2 in teamsDict)){
			teamsDict[match.team2]=0;
			teamsGA_GF[match.team2]=[0,0];
			teamMatches[match.team2]=[0,0,0,0];
		}
        if(match.hasOwnProperty('score')){
            const res = match.score.ft;
            if(res[0]>res[1]){
				teamsDict[match.team1]+=3;
				
				teamMatches[match.team1][1]+=1;
				teamMatches[match.team2][3]+=1;
			}
            else if(res[1]>res[0]){
				teamsDict[match.team2]+=3;
				
				teamMatches[match.team2][1]+=1;
				teamMatches[match.team1][3]+=1;
			}
            else{
				teamsDict[match.team1]++;
				teamsDict[match.team2]++;
				
				teamMatches[match.team1][2]+=1;
				teamMatches[match.team2][2]+=1;
			}
			
			teamMatches[match.team1][0]+=1;
			teamMatches[match.team2][0]+=1;
			
			teamsGA_GF[match.team1][0]+=res[0];
			teamsGA_GF[match.team1][1]+=res[1];
			 
			teamsGA_GF[match.team2][0]+=res[1];
			teamsGA_GF[match.team2][1]+=res[0];
			 
        }

	};
	
	console.log(teamsDict);
	keysSorted = Object.keys(teamsDict).sort(function(a,b){return teamsDict[a]-teamsDict[b]}).reverse();
	var table = keysSorted.map(key=>[key,teamsDict[key]]);
	console.log(table); 
	for(var i=0; i<table.length;i++){
		if(i==0){
			var header = document.createElement('ul');
			var pos = buildElement('li', 'pos.');
			var club = buildElement('li', 'Club');
			var matchesPlayed = buildElement('li', 'MP'); 
			var matchWins = buildElement('li', 'W');
			var matchDraws = buildElement('li', 'D');
			var matchLosses = buildElement('li', 'L');
			var gf = buildElement('li', 'GF');
			var ga = buildElement('li', 'GA');
			var gd = buildElement('li', 'GD');
			var pts = buildElement('li', 'Pts.');
			
			header.appendChild(pos);
			header.appendChild(club);
			header.appendChild(matchesPlayed);
			header.appendChild(matchWins);
			header.appendChild(matchDraws);
			header.appendChild(matchLosses);
			header.appendChild(gf);
			header.appendChild(ga);
			header.appendChild(gd);
			header.appendChild(pts);
			
			header.classList.add('table-header');
			
			container.appendChild(header);
			
		}
	    var posI = document.createElement('ul'); //position i of the table
	    var posNum = buildElement('li', i+1); //position i value 
		var teamAtI =buildElement('li', table[i][0]); //team at position i
		var matchesPlayed = buildElement('li', teamMatches[table[i][0]][0]); 
		var matchWins = buildElement('li', teamMatches[table[i][0]][1]);
		var matchDraws = buildElement('li', teamMatches[table[i][0]][2]);
		var matchLosses = buildElement('li', teamMatches[table[i][0]][3]);
		var ptsAtI = buildElement('li', table[i][1]); //points of team at i
		var teamGA = buildElement('li', teamsGA_GF[table[i][0]][1]); //goals conceded
		var teamGF = buildElement('li', teamsGA_GF[table[i][0]][0]); //goals scored
		
		var gd = teamsGA_GF[table[i][0]][0]-teamsGA_GF[table[i][0]][1];
		var teamGD = buildElement('li', gd); //goal difference
		
		posI.appendChild(posNum);
		posI.appendChild(teamAtI);
		posI.appendChild(matchesPlayed);
		posI.appendChild(matchWins);
		posI.appendChild(matchDraws);
		posI.appendChild(matchLosses);
		posI.appendChild(teamGF);
		posI.appendChild(teamGA);
		posI.appendChild(teamGD);
		posI.appendChild(ptsAtI);
		   
		if(i<4){
			posI.classList.add('first-4'); //Champions League slots
		}else if(i<5){
			posI.classList.add('first-6'); //Europa League slot
		}else if(i+1>17){
			posI.classList.add('last-3'); //Relegation zone
		}
		container.appendChild(posI);
	}
	function buildElement(type, insideText){
		var el = document.createElement(type);
		el.innerText=insideText;
		return el;
	}
}};

//add to selector the years that can be chosen
var selector = document.querySelector('select');
var currentYear = (new Date()).getFullYear();
var currentMonth = (new Date()).getMonth();
var fromYear = currentMonth > 7 ? currentYear : currentYear -1;
for(var i=fromYear;i>2009;i--){
    var option = document.createElement('option');
    var upperValue = ((i+1)%1000)%100;
    upperValue = upperValue > 9 ? upperValue.toString() : +'0'+upperValue.toString();
    option.value=i.toString()+'-'+upperValue;
    option.innerText=option.value;

    selector.appendChild(option);
}

//event-listeners to ensure we load the right league table for selected year
var yearSelector = document.querySelector('select');
yearSelector.addEventListener('change',(event)=>{
	yearChosen=event.target.value;
	loadTable(yearChosen);
});
function loadTable(yearChosen){
	document.querySelector('.list-container').innerHTML="";
	const url = "https://raw.githubusercontent.com/openfootball/football.json/master/"+yearChosen+"/en.1.json";

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
};
loadTable('2020-21');//load default-table to be 2020-21 league table
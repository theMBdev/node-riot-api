const express = require('express');
const request = require('request');
const app = express();
const ejs = require('ejs');
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


// routes
app.get('/', (req, res) => {

	const apiKey = 'RGAPI-8509e9fe-4177-487e-9f76-2d75a1749b18';
	let accountName = "sudofo";
	//	let accountId = 'wz3GXIlG2798lfGWUFPzhj7wlfBxF9J2QqTJhwPDmz0NTqQ';
	let accountId;
	let id;
	let participantId;
	let summonerName;
	let gameId;
	let championId;
	let matchInfo;

	let teamId;
	let winnerId;
	let matchCount;	

	let rankArray = [];
	let creepScoreArray = [];

	let gameDurationArray = [];

	let killsArray = [];
	let DeathsArray = [];
	let AssistsArray = [];
	let doubleKillsArray = [];
	let tripleKillsArray = [];
	let quadraKillsArray = [];
	let pentaKillsArray = [];

	let winArray = [];
	let dateNow = Date.now();
	let unix7daysAgo = Date.now() - 7*24*60*60*1000;
	let shortUnixTest2Days = Date.now();
				

	// winP, gamesPlayed, 
	let manyValues = {};


	let optionsGetName = {
		url: `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${accountName}?api_key=${apiKey}`
	};


	let winPercentage = 0;

	function callbackGetName(error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);

			accountId = info.accountId;
			id = info.id;
			summonerName = info.name;

			let value = 4*24*60*60*1000;
			console.log(value)
			console.log("old", shortUnixTest2Days);
			shortUnixTest2Days = shortUnixTest2Days - value;
			console.log("new", shortUnixTest2Days);
			
			let optionsGetMatches = {
				url: `https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?beginTime=${unix7daysAgo}&api_key=${apiKey}`		
			};

			let optionsGetRanks = {
				url: `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${apiKey}`
			};

			request(optionsGetMatches, callbackGetMatches);
			request(optionsGetRanks, callbackGetRanks);

		} else {
			console.log("error 1", error, body)
		}
	}	

	function callbackGetRanks(error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);

			let counter = 0;
			info.forEach(element => {
				
				rankArray.push({"queue": element.queueType,"tier":element.tier,"rank": element.rank});			
				counter++
			})

			manyValues["RankData"] = rankArray;

		}
		else {
			console.log("error 4", error, body)
		}
	}

	function callbackGetMatches(error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);

			matchCount = 0;

			manyValues["totalGames"] = info.totalGames;

			// FOR EACH MATCH GET IF IT WAS WIN OR LOST
			info.matches.forEach(element => {	

				matchInfo = info.matches[matchCount];
				gameId = info.matches[matchCount].gameId;

				let optionsGetOneMatch = {
					url: `https://euw1.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${apiKey}`
				};			

				request(optionsGetOneMatch, callbackGetOneMatch);

				matchCount++;					
			})


			// call 3

		} else {
			console.log("error 2", error, body)			
		}
	}		

	function callbackGetOneMatch(error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);
			//			console.log("GetOneMatch")

			info.participantIdentities.find(element => {
				if(element.player.summonerName === summonerName) {
					participantId = element.participantId;	
				}
			});

			// Get kills deaths assists
			info.participants.find(element => {
				if(element.participantId === participantId) {

					killsArray.push(element.stats.kills)
					DeathsArray.push(element.stats.deaths)
					AssistsArray.push(element.stats.assists)
					doubleKillsArray.push(element.stats.doubleKills)
					tripleKillsArray.push(element.stats.tripleKills)
					quadraKillsArray.push(element.stats.quadraKills)
					pentaKillsArray.push(element.stats.pentaKills)


					var objKey = "0-10";

					creepScoreArray.push(element.timeline.creepsPerMinDeltas[objKey])

				}
			});


			gameDurationArray.push(info.gameDuration);

			// return if the game was win or lost
			function gameResult() {

				let resultToReturn;

				// Get winner id so i can check if the player was on this team
				info.teams.find(element => {
					if(element.win === "Win") {
						winnerId = element.teamId;
					}
				})	

				let summonerTeam;
				// find what team the player was on
				// to compair with winingTeam Id to see if this game was a win
				info.participantIdentities.find(element => {

					if(element.player.summonerName === summonerName) {

						participantId = element.participantId;					

						if(element.participantId <= 5) {
							summonerTeam = 100
						} else {
							summonerTeam = 200
						}

						//						console.log("Win Id", winnerId , "Team id", summonerTeam)

						if (winnerId === summonerTeam) {
							//							console.log("Player Win");							
							resultToReturn = "Win"
						} else {
							//							console.log("Player Lost");							
							resultToReturn = "Loss"
						}
					}			

				});		

				winArray.push({resultToReturn, winnerId, summonerTeam});
				return resultToReturn;
			}

			gameResult()
			//			console.log( winArray );


			let counter = 0;
			if(winArray.length === matchCount) {				

				var counter2 = 0;
				winArray.forEach(element => {
					if(element.resultToReturn === "Win") {
						counter++	
						counter2++;
					} else {
						counter2++;

					}
					if(counter2 === winArray.length) {

						winPercentage = counter / winArray.length;
						winPercentage = winPercentage * 100;
						winPercentage = winPercentage.toFixed(0);

						gameDurationArray
						const arrSum = arr => arr.reduce((a,b) => a + b, 0)

						manyValues["summonerName"] = summonerName;

						manyValues["kills"] = arrSum(killsArray);
						manyValues["assists"] = arrSum(AssistsArray);
						manyValues["deaths"] = arrSum(DeathsArray);
						manyValues["doubleKills"] = arrSum(doubleKillsArray);
						manyValues["tripleKill"] = arrSum(tripleKillsArray);
						manyValues["quadraKills"] = arrSum(quadraKillsArray);
						manyValues["pentaKills"] = arrSum(pentaKillsArray);					


						let creepScoreAverage = arrSum(creepScoreArray) / creepScoreArray.length;	
						creepScoreAverage = creepScoreAverage.toFixed(2);
						manyValues["creepScore010"] = creepScoreAverage;



						// format unix time
						var date = new Date(arrSum(gameDurationArray) * 1000);
						var hours = date.getHours();
						var minutes = "0" + date.getMinutes();
						var formattedTime = hours + 'h ' + minutes.substr(-2)+ 'min';


						manyValues["timePlayed"] = formattedTime;
						manyValues["winP"] = winPercentage;

						console.log("MV", manyValues);	

						res.render('index', {manyValues: manyValues })
					}

				})
			}		


		} else {
			console.log("error 3", error, body)
		}
	}

	// first call
	request(optionsGetName, callbackGetName);

})



app.listen(port, ()=> console.log(`Listening at ${port}`));
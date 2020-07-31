const express = require('express');
const request = require('request');
const fetch = require('node-fetch');
const app = express();
const ejs = require('ejs');
const port = 3000;

var config = require('./config/config');
apikey = config.apiKey;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


// routes
app.get('/', (req, res) => {

	const apiKey = apikey;
	let accountName = "hazouzo";
	//	let accountId = 'wz3GXIlG2798lfGWUFPzhj7wlfBxF9J2QqTJhwPDmz0NTqQ';
	let accountId;
	let id;
	let participantId;
	let summonerName;
	let gameId;
	let championId;
	let matchInfo;

	let zoneCode = "euw1";
	
	let totalGames;

	let teamId;
	let winnerId;
	let matchCount;	

	let rankArray = [];
	let creepScoreArray = [];

	let gameDurationArray = [];

	let killsArray = [];
	let deathsArray = [];
	let assistsArray = [];
	let doubleKillsArray = [];
	let tripleKillsArray = [];
	let quadraKillsArray = [];
	let pentaKillsArray = [];


	let todaysDateFormated = new Date().toLocaleDateString('en-GB', {
		month: '2-digit',day: '2-digit',year: '2-digit'})
	let Days7AgoFormated = new Date(Date.now() - 7*24*60*60*1000).toLocaleDateString('en-GB', {
		month: '2-digit',day: '2-digit',year: '2-digit'})

	let winArray = [];
	let dateNow = Date.now();
	let unix7daysAgo = Date.now() - 7*24*60*60*1000;

	let championIdArray = [];

	let experementCount = 0;

	// winP, gamesPlayed, 
	let manyValues = {};


	let optionsGetName = {
		url: `https://${zoneCode}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${accountName}?api_key=${apiKey}`
	};


	let winPercentage = 0;

	function callbackGetName(error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);

			accountId = info.accountId;
			id = info.id;
			summonerName = info.name;

			let optionsGetMatches = {
				url: `https://${zoneCode}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?beginTime=${unix7daysAgo}&api_key=${apiKey}`		
			};

			let optionsGetRanks = {
				url: `https://${zoneCode}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${apiKey}`
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

			totalGames = info.totalGames;
			manyValues["totalGames"] = info.totalGames;





			var array = ['some', 'array', 'containing', 'words'];
			var interval = 60; // how much time should the delay between two iterations be (in milliseconds)?
			var promise = Promise.resolve();



			//			array.forEach(function (el) {
			//				promise = promise.then(function () {
			//					console.log(el);
			//					return new Promise(function (resolve) {
			//						setTimeout(resolve, interval);
			//					});
			//				});
			//			});
			//
			//			promise.then(function () {
			//				console.log('Loop finished.');
			//			});




			// FOR EACH MATCH GET IF IT WAS WIN OR LOST
			info.matches.forEach(element => {	
				promise = promise.then(function () {

					matchInfo = info.matches[matchCount];
					gameId = info.matches[matchCount].gameId;
					championIdArray.push(element.champion);

					let optionsGetOneMatch = {
						url: `https://${zoneCode}.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${apiKey}`
					};			

					request(optionsGetOneMatch, callbackGetOneMatch);

					matchCount++;	

					return new Promise(function (resolve) {
						setTimeout(resolve, interval);
					});


				})
			})


			// call 3

		} else {
			console.log("error 2", error, body)			
		}
	}		

	function callbackGetOneMatch(error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);

			experementCount++;

			info.participantIdentities.find(element => {
				if(element.player.summonerName === summonerName) {
					participantId = element.participantId;	
				}
			});

			// Get kills deaths assists
			info.participants.find(element => {
				if(element.participantId === participantId) {

					killsArray.push(element.stats.kills)
					deathsArray.push(element.stats.deaths)
					assistsArray.push(element.stats.assists)
					doubleKillsArray.push(element.stats.doubleKills)
					tripleKillsArray.push(element.stats.tripleKills)
					quadraKillsArray.push(element.stats.quadraKills)
					pentaKillsArray.push(element.stats.pentaKills)

					var objKey = "0-10";

					if(element.timeline.creepsPerMinDeltas){
						creepScoreArray.push(element.timeline.creepsPerMinDeltas[objKey])
					} else {
						console.log("ERROR", element.timeline);
					}

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


						let averageKda;
						let averageKills;
						let averageAssists;
						let averageDeaths;

						averageKda = (arrSum(killsArray) + arrSum(assistsArray))/ arrSum(deathsArray);

						averageKills = arrSum(killsArray)/ manyValues["totalGames"];
						averageAssists = arrSum(assistsArray)/ manyValues["totalGames"];
						averageDeaths = arrSum(deathsArray)/ manyValues["totalGames"];

						championIdArray;

						function getMax(arr, prop) {
							var max;
							for (var i=0 ; i<arr.length ; i++) {
								if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
									max = arr[i];
							}
							return max;
						}


						let arr = championIdArray;
						// pulled from stackoverflow
						let counts = arr.reduce((a, c) => {
							a[c] = (a[c] || 0) + 1;
							return a;
						}, {});
						let maxCount = Math.max(...Object.values(counts));
						let mostFrequent = Object.keys(counts).filter(k => counts[k] === maxCount);
					
						var championIdMostPlayed = mostFrequent[0];

						// needed to be async so that the champion name value got saved before the page rendered
						async function getMostPlayedChampionName(id) {
							// API call to leauges champion db
							let data = await fetch('http://ddragon.leagueoflegends.com/cdn/10.15.1/data/en_US/champion.json');		

							const res = await data.json();
							let championList = res.data;

							for (var i in championList) {

								if (championList[i].key == id) {
									manyValues["mostPlayedChampion"] = championList[i].id;
								}
							}
							//							console.log(res);
						}


						manyValues["summonerName"] = summonerName;
						manyValues["kills"] = arrSum(killsArray);
						manyValues["assists"] = arrSum(assistsArray);
						manyValues["deaths"] = arrSum(deathsArray);

						manyValues["averageKills"] = averageKills.toFixed(1);
						manyValues["averageAssists"] = averageAssists.toFixed(1);
						manyValues["averageDeaths"] = averageDeaths.toFixed(1);

						manyValues["doubleKills"] = arrSum(doubleKillsArray);
						manyValues["tripleKill"] = arrSum(tripleKillsArray);
						manyValues["quadraKills"] = arrSum(quadraKillsArray);
						manyValues["pentaKills"] = arrSum(pentaKillsArray);		

					
						manyValues["todaysDateFormated"] = todaysDateFormated;					
						manyValues["Days7AgoFormated"] = Days7AgoFormated;					


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


						async function renderPage() {
							await getMostPlayedChampionName(championIdMostPlayed);
							res.render('index', {manyValues: manyValues })
						}				

						if(experementCount === totalGames ) {
							renderPage();
						}



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
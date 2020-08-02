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


	
//	//
//	
//	// pass in two arrays
//	function getWinPercentage(infoTeams, infoParticipantIdentities) {
//
//		// GET WIN PERCENTAGE
//		// return if the game was win or lost
//		function gameResult() {
//
//			let resultToReturn;
//
//			// info.teams comes from the callbackGetOneMatch
//			// makes the request to getonematch 
//			// we have each roles matches saved in an array so make a new getOneMatch function and loop it like the getonematch we have
//			// do this for the 5 roles
//			// this will allow us to pull all the data we need for each role
//			// this will all happen outside this function and we will call this function inside the new getOneMatch
//			// then within getOneMatch we will add all our data to a new array such as manyValuesJungle, manyValuesMid... ect
//			
//			// Get winner id so i can check if the player was on this team
////			info.teams.find(element => {
//			infoTeams.find(element => {
//				if(element.win === "Win") {
//					winnerId = element.teamId;
//				}
//			})	
//
//			let summonerTeam;
//			// find what team the player was on
//			// to compair with winingTeam Id to see if this game was a win
////			info.participantIdentities.find(element => {
//			infoParticipantIdentities.find(element => {
//
//				if(element.player.summonerName === summonerName) {
//
//					participantId = element.participantId;					
//
//					if(element.participantId <= 5) {
//						summonerTeam = 100
//					} else {
//						summonerTeam = 200
//					}
//
//					if (winnerId === summonerTeam) {
//						//							console.log("Player Win");							
//						resultToReturn = "Win"
//					} else {
//						//							console.log("Player Lost");							
//						resultToReturn = "Loss"
//					}
//				}			
//
//			});		
//			
//			// dont need winnerid or summonerteam
//			winLoseArray.push({resultToReturn, winnerId, summonerTeam});
//			return resultToReturn;
//		}
//
//		gameResult().then(result => {
//
//			let gamesWinCounter = 0;
//
//			if(winLoseArray.length === matchCount) {				
//
//				var gameCounter = 0;
//				winLoseArray.forEach(element => {
//					if(element.resultToReturn === "Win") {
//						gamesWinCounter++	
//						counter++;
//					} else {
//						counter++;
//					}
//					if(gameCounter === winLoseArray.length) {
//
//						winPercentage = gamesWinCounter / winLoseArray.length;
//						winPercentage = winPercentage * 100;
//						winPercentage = winPercentage.toFixed(0);
//
//						// return winPercentage to top level
//						
//						
//						
//						// END GET WIN PERCENTAGE
//
//					}
//				})
//
//			}
//
//		})
//
//
//
//
//	}
//	
//	let jungleWinPercentage = 0;
//	
//	// will use this like          -  pass in jungle games data
//	jungleWinPercentage = getWinPercentage(infoTeams, infoParticipantIdentities)
//
//
//
//
//











	const apiKey = apikey;
	let accountName = "sudofo";
	//	let accountName = "hide on bush";
	//	let accountId = 'wz3GXIlG2798lfGWUFPzhj7wlfBxF9J2QqTJhwPDmz0NTqQ';
	let accountId;
	let id;
	let participantId;
	let summonerName;
	let gameId;
	let championId;
	let matchInfo;

	let zoneCode = "euw1";
	//	let zoneCode = "kr";

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

	let positionRole; 
	let positionLane;

	let topMatches = [];
	let jungleMatches = [];
	let midMatches = [];
	let adcMatches = [];
	let supportMatches = [];
	let duoNoneMatches = [];


	let todaysDateFormated = new Date().toLocaleDateString('en-GB', {
		month: '2-digit',day: '2-digit',year: '2-digit'})
	let Days7AgoFormated = new Date(Date.now() - 7*24*60*60*1000).toLocaleDateString('en-GB', {
		month: '2-digit',day: '2-digit',year: '2-digit'})

	let winLoseArray = [];
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
				url: `https://${zoneCode}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&queue=440&beginTime=${unix7daysAgo}&api_key=${apiKey}`		
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


			var interval = 60; // how much time should the delay between two iterations be (in milliseconds)?
			var promise = Promise.resolve();


			//			queueId: 420 = Ranked Solo
			//			queueId: 440 = Ranked Flex

			// FOR EACH MATCH GET IF IT WAS WIN OR LOST
			info.matches.forEach(element => {	
				promise = promise.then(function () {				

					matchInfo = info.matches[matchCount];
					gameId = info.matches[matchCount].gameId;
					championIdArray.push(element.champion);

					positionRole = element.role;
					positionLane = element.lane;

					
					if(positionLane === "TOP") {
						topMatches.push(element);
					}

					if(positionLane === "MID") {
						midMatches.push(element);
					}

					if(positionLane === "JUNGLE") {
						jungleMatches.push(element);
					}

					if(positionLane === "BOTTOM" && positionRole === "DUO_CARRY") {
						adcMatches.push(element);
					}

					if(positionRole === "DUO" && positionLane === "NONE") {
						duoNoneMatches.push(element);
					}

					if(positionRole === "DUO_SUPPORT") {
						supportMatches.push(element);
					}


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
						console.log("ERROR creeps", element.timeline);
					}

				}
			});


			gameDurationArray.push(info.gameDuration);
			console.log("GD", gameDurationArray)


			// GET WIN PERCENTAGE
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


						if (winnerId === summonerTeam) {
							//							console.log("Player Win");							
							resultToReturn = "Win"
						} else {
							//							console.log("Player Lost");							
							resultToReturn = "Loss"
						}
					}			

				});		

				winLoseArray.push({resultToReturn, winnerId, summonerTeam});
				return resultToReturn;
			}

			gameResult()


			let gamesWinCounter = 0;

			if(winLoseArray.length === matchCount) {				

				var gameCounter = 0;
				winLoseArray.forEach(element => {
					if(element.resultToReturn === "Win") {
						gamesWinCounter++	
						gameCounter++;
					} else {
						gameCounter++;
					}
					if(gameCounter === winLoseArray.length) {

						winPercentage = gamesWinCounter / winLoseArray.length;
						winPercentage = winPercentage * 100;
						winPercentage = winPercentage.toFixed(0);

						// END GET WIN PERCENTAGE





						// function to sum values in array
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





						console.log("topMatches", topMatches.length)
						console.log("jungleMatches", jungleMatches.length)
						console.log("midMatches", midMatches.length)
						console.log("adcMatches", adcMatches.length)
						console.log("supportMatches", supportMatches.length)
						console.log("duoNoneMatches", duoNoneMatches.length)







						let creepScoreAverage = arrSum(creepScoreArray) / creepScoreArray.length;	
						creepScoreAverage = creepScoreAverage.toFixed(2);
						manyValues["creepScore010"] = creepScoreAverage;


						var gameDurationSum = arrSum(gameDurationArray) * 1000;

						function msToTime(duration) {
							var milliseconds = parseInt((duration % 1000) / 100),
								minutes = Math.floor((duration / (1000 * 60)) % 60),
								hours = Math.floor((duration / (1000 * 60 * 60)));

							//							hours = (hours < 10) ? "0" + hours : hours;
							//							minutes = (minutes < 10) ? "0" + minutes : minutes;

							return hours + "h " + minutes + "min";
						}

						console.log(msToTime(gameDurationSum))


						manyValues["timePlayed"] = msToTime(gameDurationSum);
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
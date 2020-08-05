const express = require('express');
const request = require("request-promise");
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const app = express();
const ejs = require('ejs');
var path = require('path');
const port = 3000;


var config = require('./config/config');
apikey = config.apiKey;
user = config.userId;
pass = config.password;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, '/views'));



const transporter = nodemailer.createTransport({
	host: 'smtp.mailtrap.io',
	port: 2525,
	secure: false,
	auth: {
		user: user, // mailtrap.io username
		pass: pass  // mailtrap.io password
	}
});



// routes
app.get('/', (req, res) => {


	var apiCalls = 0;

	var allDataLoadedTrueFalse = false;	
	var midDataLoadedTrueFalse = false;	

	var getOneMatchDataDoneAll = false;
	var getOneMatchDataDoneMid = false;
	var getOneMatchDataDoneTop = false;
	var getOneMatchDataDoneJungle = false;
	var getOneMatchDataDoneAdc= false;
	var getOneMatchDataDoneSupport= false;

	var winLoseArrayDoneAll = false;
	var winLoseArrayMidDone = false;
	var winLoseArrayJungleDone = false;
	var winLoseArrayAdcDone = false;
	var winLoseArraySupportDone = false;
	var winLoseArrayTopDone = false;


	let killsArrayMid = [];
	let deathsArrayMid = [];
	let assistsArrayMid = [];
	let totalDamageDealtToChampionsArrayMid = [];
	let creepScoreArrayMid = [];
	let gameDurationArrayMid = [];
	let winLoseArrayMid = [];
	let championIdArrayMid = [];


	let killsArrayTop = [];
	let deathsArrayTop = [];
	let assistsArrayTop = [];
	let totalDamageDealtToChampionsArrayTop = [];
	let creepScoreArrayTop = [];
	let gameDurationArrayTop = [];
	let winLoseArrayTop = [];
	let championIdArrayTop = [];


	let killsArrayJungle = [];
	let deathsArrayJungle = [];
	let assistsArrayJungle = [];
	let totalDamageDealtToChampionsArrayJungle = [];
	let creepScoreArrayJungle = [];
	let gameDurationArrayJungle = [];
	let winLoseArrayJungle = [];
	let championIdArrayJungle = [];


	let killsArrayAdc = [];
	let deathsArrayAdc = [];
	let assistsArrayAdc = [];
	let totalDamageDealtToChampionsArrayAdc = [];
	let creepScoreArrayAdc = [];
	let gameDurationArrayAdc = [];
	let winLoseArrayAdc = [];
	let championIdArrayAdc = [];


	let killsArraySupport = [];
	let deathsArraySupport = [];
	let assistsArraySupport = [];
	let totalDamageDealtToChampionsArraySupport = [];
	let creepScoreArraySupport = [];
	let gameDurationArraySupport = [];
	let winLoseArraySupport = [];
	let championIdArraySupport = [];

	let info = "";
	var positionMod = "";

	var position = "def";
	const apiKey = apikey;
	//	let accountName = "Top%209th%20Sup%20LFL2";
	let accountName = "sudofo";
	//	let accountName = "hide on bush";
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

	// not in use but maybe a better way to store data
	let summonerDataAll = {
		killsArray: [],
		deathsArray: [],
		assistsArray: [],
		totalDamageDealtToChampionsArray: [],
		gameDurationArray: [],
		creepScoreArray: [],
		winLoseArray: [],
		totalGames: 0,		

		doubleKillsArray: [],
		tripleKillsArray: [],
		quadraKillsArray: [],
		pentaKillsArray: [],

		getOneMatchDataDone: false,
		winLoseArrayDone: false
	}

	let summonerDataMid = {
		killsArray: [],
		deathsArray: [],
		assistsArray: [],
		totalDamageDealtToChampionsArray: [],
		gameDurationArray: [],
		creepScoreArray: [],
		winLoseArray: [],		

		getOneMatchDataDone: false,
		winLoseArrayDone: false
	}


	let killsArray = [];
	let deathsArray = [];
	let assistsArray = [];
	let doubleKillsArray = [];
	let tripleKillsArray = [];
	let quadraKillsArray = [];
	let pentaKillsArray = [];

	let totalDamageDealtToChampionsArray = [];

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

	// winP, gamesPlayed, 
	let manyValues = {};
	let manyValuesMid = {};
	let manyValuesTop = {};
	let manyValuesJungle = {};
	let manyValuesAdc = {};
	let manyValuesSupport = {};

	let winPercentage = 0;
	let winPercentageMid = 0;
	let winPercentageJungle = 0;
	let winPercentageTop = 0;
	let winPercentageSupport = 0;
	let winPercentageAdc = 0;


	let optionsGetName = {
		url:  `https://${zoneCode}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${accountName}?api_key=${apiKey}`
	}

	let optionsGetMatches = {
		url: `https://${zoneCode}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&queue=440&beginTime=${unix7daysAgo}&api_key=${apiKey}`		
	};

	let optionsGetRanks = {
		url: `https://${zoneCode}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${apiKey}`
	};




	// UNSORTED FUNCTIONS

	// Populates wonLoseArray used to calculate wining percentage
	function gameResults(infoTeams, infoParticipantIdentities, position) {

		let resultToReturn;

		// Get winner id so i can check if the player was on this team
		infoTeams.find(element => {
			if(element.win === "Win") {
				winnerId = element.teamId;				
			} 			
		})	



		let summonerTeam;
		// find what team the player was on
		// to compair with winingTeam Id to see if this game was a win
		infoParticipantIdentities.find(element => {

			if(element.player.summonerName === summonerName) {

				participantId = element.participantId;					

				if(element.participantId <= 5) {
					summonerTeam = 100
				} else {
					summonerTeam = 200
				}

				console.log("summonerTeam", summonerTeam)

				if (winnerId === summonerTeam) {
					resultToReturn = "Win"
				} else {
					resultToReturn = "Loss"
				}
			}	
		});		


		if(position === "MID") {
			winLoseArrayMid.push({resultToReturn, winnerId, summonerTeam});
			winLoseArray.push({resultToReturn, winnerId, summonerTeam});
		} 
		if(position === "TOP") {
			winLoseArrayTop.push({resultToReturn, winnerId, summonerTeam});
			winLoseArray.push({resultToReturn, winnerId, summonerTeam});
		} 

		if(position === "JUNGLE") {
			winLoseArrayJungle.push({resultToReturn, winnerId, summonerTeam});
			winLoseArray.push({resultToReturn, winnerId, summonerTeam});
		} 

		if(position === "SUPPORT") {
			winLoseArraySupport.push({resultToReturn, winnerId, summonerTeam});
			winLoseArray.push({resultToReturn, winnerId, summonerTeam});
		} 
		if(position === "ADC") {
			winLoseArrayAdc.push({resultToReturn, winnerId, summonerTeam});
			winLoseArray.push({resultToReturn, winnerId, summonerTeam});
		} 

		if(position === "ALL") {
			winLoseArray.push({resultToReturn, winnerId, summonerTeam});
		}

		if(winLoseArray.length === totalGames && position === "ALL") {
			winLoseArrayDoneAll = true;
			checkValue();
		} else if (position != "ALL") {
			console.log("");
		} else {
			console.log("winLoseArray Finished? No", totalGames, winLoseArray.length)
			console.log("API CALLS", apiCalls)
		}

		if(winLoseArrayMid.length === midMatches.length && midFuncRun === false && position === "MID") {
			console.log("WINLOSEARRAY FINISHED MID")
			winLoseArrayMidDone = true;
			getTopData();
		} else if (position != "MID") {
			console.log("");
		} else {
			console.log("winLoseArrayMid Finished? No", midMatches.length, winLoseArrayMid.length)
		}	

		if(winLoseArrayTop.length === topMatches.length && topFuncRun === false && position === "TOP") {
			console.log("WINLOSEARRAY FINISHED TOP")
			winLoseArrayTopDone = true;
			getJungleData();
		} else if (position != "TOP") {
			console.log("");
		} else {
			console.log("winLoseArrayTop Finished? No", topMatches.length, winLoseArrayTop.length, topFuncRun)
		}	


		if(winLoseArrayJungle.length === jungleMatches.length && jungleFuncRun === false && position === "JUNGLE") {
			console.log("WINLOSEARRAY FINISHED JUNGLE")
			winLoseArrayJungleDone = true;
			getAdcData();
		} else if (position != "JUNGLE") {
			console.log("");
		} else {
			console.log("winLoseArrayJungle Finished? No", jungleMatches.length, winLoseArrayJungle.length)
		}	

		if(winLoseArrayAdc.length === adcMatches.length && adcFuncRun === false && position === "ADC") {
			console.log("WINLOSEARRAY FINISHED ADC")
			winLoseArrayAdcDone = true;
			getSupportData();
		} else if (position != "ADC") {
			console.log("");
		} else {
			console.log("winLoseArrayAdc Finished? No", adcMatches.length, winLoseArrayAdc.length)
		}	

		if(winLoseArraySupport.length === supportMatches.length && supportFuncRun === false && position === "SUPPORT") {
			console.log("WINLOSEARRAY FINISHED Support")
			winLoseArraySupportDone = true;
			compileManyValuesData();
		} else if (position != "SUPPORT") {
			console.log("");
		} else {
			console.log("winLoseArraySupport Finished? No", supportMatches.length, winLoseArraySupport.length)
		}	

		return resultToReturn;
	}


	// gets the champion name
	// needed to be async so that the champion name value got saved before the page rendered
	async function getMostPlayedChampionName(id, position) {
		//		console.log("getMostPlayedChampionName");
		// API call to leauges champion db
		let data = await fetch('http://ddragon.leagueoflegends.com/cdn/10.15.1/data/en_US/champion.json');		

		const res = await data.json();
		let championList = res.data;

		console.log(id);
		for (var i in championList) {

			if(position === "ALL") {
				if (championList[i].key == id) {
					manyValues["mostPlayedChampion"] = championList[i].id;
				}
			}

			if(position === "MID") {
				if (championList[i].key == id) {
					manyValuesMid["mostPlayedChampion"] = championList[i].id;
				}
			}

			if(position === "TOP") {
				if (championList[i].key == id) {
					manyValuesTop["mostPlayedChampion"] = championList[i].id;
				}
			}

			if(position === "JUNGLE") {
				if (championList[i].key == id) {
					manyValuesJungle["mostPlayedChampion"] = championList[i].id;
				}
			}

			if(position === "ADC") {
				if (championList[i].key == id) {
					manyValuesAdc["mostPlayedChampion"] = championList[i].id;
				}
			}

			if(position === "SUPPORT") {
				if (championList[i].key == id) {
					manyValuesSupport["mostPlayedChampion"] = championList[i].id;
				}
			}

		}
	}


	// return most played champion id, result will be used in getMostPlayedChampionName
	function getMostPlayedChampionId(array) {
		//		console.log("getMostPlayedChampionId");
		let counts = array.reduce((a, c) => {
			a[c] = (a[c] || 0) + 1;
			return a;
		}, {});
		let maxCount = Math.max(...Object.values(counts));
		let mostFrequent = Object.keys(counts).filter(k => counts[k] === maxCount);

		return mostFrequent[0];

	}


	// return readable hours and mins from millieconds
	function msToTime(duration) {
		var milliseconds = parseInt((duration % 1000) / 100),
			minutes = Math.floor((duration / (1000 * 60)) % 60),
			hours = Math.floor((duration / (1000 * 60 * 60)));

		//							hours = (hours < 10) ? "0" + hours : hours;
		//							minutes = (minutes < 10) ? "0" + minutes : minutes;

		return hours + "h " + minutes + "min";
	}




	// function to sum values in an array
	const arrSum = arr => arr.reduce((a,b) => a + b, 0)






















	// POPULATES
	// calls getonematchNEW
	// killsArray, assistsArray, deathsArray, gameDurationArray
	async function getPositionValues(position) {

		console.log("START GET POSITION VALUES", position);
		async function callbackGetOneMatchNew(error, response, body) {
			if (!error && response.statusCode == 200) {
				let info = JSON.parse(body);

				apiCalls++;
				console.log("API COUNTER", apiCalls);

				if(position === "MID") {
					gameDurationArrayMid.push(info.gameDuration);
					gameDurationArray.push(info.gameDuration);
					console.log("ADDING TO GAMES ARRRAY DURATION MID", gameDurationArrayMid)
				}

				if(position === "ALL") {
					gameDurationArray.push(info.gameDuration);
				}

				if(position === "TOP") {
					gameDurationArrayTop.push(info.gameDuration);
					gameDurationArray.push(info.gameDuration);
					console.log("ADDING TO GAMES ARRRAY DURATION TOP", gameDurationArrayTop)
				}

				if(position === "JUNGLE") {
					gameDurationArrayJungle.push(info.gameDuration);
					gameDurationArray.push(info.gameDuration);
				}

				if(position === "SUPPORT") {
					gameDurationArraySupport.push(info.gameDuration);
					gameDurationArray.push(info.gameDuration);
				}

				if(position === "ADC") {
					gameDurationArrayAdc.push(info.gameDuration);
					gameDurationArray.push(info.gameDuration);
					console.log("ADDING TO GAMES ARRRAY DURATION ADC", gameDurationArrayAdc)
				}

				info.participantIdentities.find(element => {
					if(element.player.summonerName === summonerName) {
						participantId = element.participantId;	
					}
				});

				// Get kills deaths assists
				info.participants.find(element => {
					if(element.participantId === participantId) {

						console.log("position", position)

						if(position === "MID") {
							killsArrayMid.push(element.stats.kills);
							deathsArrayMid.push(element.stats.deaths);
							assistsArrayMid.push(element.stats.assists);	
							totalDamageDealtToChampionsArrayMid.push(element.stats.totalDamageDealtToChampions);

							killsArray.push(element.stats.kills);
							deathsArray.push(element.stats.deaths);
							assistsArray.push(element.stats.assists);
							totalDamageDealtToChampionsArray.push(element.stats.totalDamageDealtToChampions);

							doubleKillsArray.push(element.stats.doubleKills)
							tripleKillsArray.push(element.stats.tripleKills)
							quadraKillsArray.push(element.stats.quadraKills)
							pentaKillsArray.push(element.stats.pentaKills)
						}

						if(position === "TOP") {
							killsArrayTop.push(element.stats.kills);
							deathsArrayTop.push(element.stats.deaths);
							assistsArrayTop.push(element.stats.assists);	
							totalDamageDealtToChampionsArrayTop.push(element.stats.totalDamageDealtToChampions);

							killsArray.push(element.stats.kills);
							deathsArray.push(element.stats.deaths);
							assistsArray.push(element.stats.assists);
							totalDamageDealtToChampionsArray.push(element.stats.totalDamageDealtToChampions);

							doubleKillsArray.push(element.stats.doubleKills)
							tripleKillsArray.push(element.stats.tripleKills)
							quadraKillsArray.push(element.stats.quadraKills)
							pentaKillsArray.push(element.stats.pentaKills)
						}

						if(position === "JUNGLE") {
							killsArrayJungle.push(element.stats.kills);
							deathsArrayJungle.push(element.stats.deaths);
							assistsArrayJungle.push(element.stats.assists);	
							totalDamageDealtToChampionsArrayJungle.push(element.stats.totalDamageDealtToChampions);

							killsArray.push(element.stats.kills);
							deathsArray.push(element.stats.deaths);
							assistsArray.push(element.stats.assists);
							totalDamageDealtToChampionsArray.push(element.stats.totalDamageDealtToChampions);

							doubleKillsArray.push(element.stats.doubleKills)
							tripleKillsArray.push(element.stats.tripleKills)
							quadraKillsArray.push(element.stats.quadraKills)
							pentaKillsArray.push(element.stats.pentaKills)
						}

						if(position === "SUPPORT") {
							killsArraySupport.push(element.stats.kills);
							deathsArraySupport.push(element.stats.deaths);
							assistsArraySupport.push(element.stats.assists);	
							totalDamageDealtToChampionsArraySupport.push(element.stats.totalDamageDealtToChampions);

							killsArray.push(element.stats.kills);
							deathsArray.push(element.stats.deaths);
							assistsArray.push(element.stats.assists);
							totalDamageDealtToChampionsArray.push(element.stats.totalDamageDealtToChampions);

							doubleKillsArray.push(element.stats.doubleKills)
							tripleKillsArray.push(element.stats.tripleKills)
							quadraKillsArray.push(element.stats.quadraKills)
							pentaKillsArray.push(element.stats.pentaKills)
						}

						if(position === "ADC") {
							killsArrayAdc.push(element.stats.kills);
							deathsArrayAdc.push(element.stats.deaths);
							assistsArrayAdc.push(element.stats.assists);	
							totalDamageDealtToChampionsArrayAdc.push(element.stats.totalDamageDealtToChampions);

							killsArray.push(element.stats.kills);
							deathsArray.push(element.stats.deaths);
							assistsArray.push(element.stats.assists);
							totalDamageDealtToChampionsArray.push(element.stats.totalDamageDealtToChampions);

							doubleKillsArray.push(element.stats.doubleKills)
							tripleKillsArray.push(element.stats.tripleKills)
							quadraKillsArray.push(element.stats.quadraKills)
							pentaKillsArray.push(element.stats.pentaKills)
						}

						if(position === "ALL") {

						}

						var objKey = "0-10";

						if(element.timeline.creepsPerMinDeltas){

							if(position === "MID") {
								creepScoreArrayMid.push(element.timeline.creepsPerMinDeltas[objKey]);
								creepScoreArray.push(element.timeline.creepsPerMinDeltas[objKey]);

							}
							if(position === "TOP") {
								creepScoreArrayTop.push(element.timeline.creepsPerMinDeltas[objKey]);
								creepScoreArray.push(element.timeline.creepsPerMinDeltas[objKey]);

							}
							if(position === "ALL") {
								creepScoreArray.push(element.timeline.creepsPerMinDeltas[objKey]);
							}
							if(position === "JUNGLE") {
								creepScoreArrayJungle.push(element.timeline.creepsPerMinDeltas[objKey]);
								creepScoreArray.push(element.timeline.creepsPerMinDeltas[objKey]);

							}
							if(position === "SUPPORT") {
								creepScoreArraySupport.push(element.timeline.creepsPerMinDeltas[objKey]);
								creepScoreArray.push(element.timeline.creepsPerMinDeltas[objKey]);

							}
							if(position === "ADC") {
								creepScoreArrayAdc.push(element.timeline.creepsPerMinDeltas[objKey]);
								creepScoreArray.push(element.timeline.creepsPerMinDeltas[objKey]);

							}

						} else {
							console.log("ERROR creeps", element.timeline);
						}

						if(position === "ALL") {
							if(totalGames === killsArray.length){
								getOneMatchDataDoneAll = true;
								checkValue();
							}
						}

						if(position === "MID") {
							if(totalGames === killsArrayMid.length){	
								getOneMatchDataDoneMid = true;
								getTopData();
							}
						}

						if(position === "TOP") {
							if(totalGames === killsArrayTop.length){	
								getOneMatchDataDoneTop = true;
								getJungleData();
							}
						}

						if(position === "JUNGLE") {
							if(totalGames === killsArrayJungle.length){	
								getOneMatchDataDoneJungle = true;
								getAdcData();
							}
						}

						if(position === "SUPPORT") {
							if(totalGames === killsArraySupport.length){	
								getOneMatchDataDoneSupport = true;
								compileManyValuesData();
							}
						}

						if(position === "ADC") {
							if(totalGames === killsArrayAdc.length){	
								getOneMatchDataDoneAdc = true;
								getSupportData();
							}
						}

						console.log("Total Games", totalGames);
					}	

				});	

				// populate WinLoseArray
				gameResults(info.teams, info.participantIdentities, position)	
			}
		}








		if(position === "MID") {
			position = "MID";		
			info = midMatches;

			if(info.length === 0) {
				console.log("ZERO MATCHES MID", info.length)
				console.log("CALL CHECKVALUE 1")
				getOneMatchDataDoneMid = true;
				winLoseArrayMidDone = true;
				getTopData();
				return;
				// this return value took you hours to add
				// this is what stops the current getPositionValues("MID") function running that was causing all sorts
				// of problems as you start running getPositionValues("TOP") here and they run beside each other and mess 
				// up your data
				// USE THE DEBUGGER 
				// all these console.logs kill me. And this bug could have not been found without it.
			}
		}

		if(position === "ALL") {
			position = "ALL";	
			info = allMatches;
			console.log("ALL MATCHES", allMatches)
		}

		if(position === "TOP") {
			position = "TOP";		
			info = topMatches;

			if(info.length === 0) {
				console.log("ZERO MATCHES TOPP", info.length)
				console.log("CALL CHECKVALUE 3")
				getOneMatchDataDoneTop = true;
				winLoseArrayTopDone = true;
				getJungleData();
				return;
			}
		}

		if(position === "JUNGLE") {
			position = "JUNGLE";		
			info = jungleMatches;

			if(info.length === 0) {
				console.log("ZERO MATCHES JUNGLE", info.length)
				console.log("CALL CHECKVALUE 4")
				getOneMatchDataDoneJungle = true;
				winLoseArrayJungleDone = true;
				getAdcData();
				return;
			}
		}

		if(position === "SUPPORT") {
			position = "SUPPORT";		
			info = supportMatches;

			if(info.length === 0) {
				console.log("ZERO MATCHES SUPPORT", info.length)
				console.log("CALL CHECKVALUE 6")
				getOneMatchDataDoneSupport = true;
				winLoseArraySupportDone = true;
				compileManyValuesData();
				return;
			}
		}

		if(position === "ADC") {
			position = "ADC";		
			info = adcMatches;

			if(info.length === 0) {
				console.log("ZERO MATCHES ADC", info.length)
				console.log("CALL CHECKVALUE 5")
				getOneMatchDataDoneAdc = true;

				winLoseArrayAdcDone = true;
				getSupportData();
				return;
			}
		}

		matchCount2 = 0;

		totalGames = info.length;	
		console.log("TG", totalGames)

		var interval = 100; // how much time should the delay between two iterations be (in milliseconds)?
		var promise = Promise.resolve();

		console.log("INFO", info)

		await info.forEach(element => {

			promise = promise.then(function () {	

				console.log("Match Count2 This Loop", matchCount2);
				console.log("GAME ID", element.gameId)

				matchInfo = element;
				gameId = element.gameId;


				if (position === "MID") {
					championIdArrayMid.push(element.champion);
					championIdArray.push(element.champion);
				}
				if (position === "ALL") {
					championIdArray.push(element.champion);

				}
				if (position === "TOP") {
					championIdArrayTop.push(element.champion);
					championIdArray.push(element.champion);
				}
				if (position === "JUNGLE") {
					championIdArrayJungle.push(element.champion);
					championIdArray.push(element.champion);
				}
				if (position === "SUPPORT") {
					championIdArraySupport.push(element.champion);
					championIdArray.push(element.champion);
				}
				if (position === "ADC") {
					championIdArrayAdc.push(element.champion);
					championIdArray.push(element.champion);
				}

				let optionsGetOneMatch = {
					url: `https://${zoneCode}.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${apiKey}`
				};			

				// call to get datailed info from each match such as kills
				request(optionsGetOneMatch, callbackGetOneMatchNew);

				if(matchCount2 === totalGames) {
					console.log("TOTAL REACHED DO THE THING NOW")
				}

				matchCount2++;				


				return new Promise(function (resolve) {
					setTimeout(resolve, interval);
				});
			})
		})
	}







	// ALL DATA SHOULD BE LOADED WHEN THIS FUCNTION IS CALLED
	async function finaliseData() {


		function getWinPercentage(arrayOfGamesWinLOss, winPercentageVariable, manyValuesPos) {
			let gamesWinCounter = 0;
			var gameCounter = 0;

			//			console.log("WIN LOSE ", arrayOfGamesWinLOss);

			arrayOfGamesWinLOss.forEach(element => {
				if(element.resultToReturn === "Win") {
					gamesWinCounter++	
					gameCounter++;
				} else {
					gameCounter++;
				}
			})

			//			console.log("COUNTRRD ADOIH  COUNTERS", gamesWinCounter, gameCounter)

			// used to make sure all games were loaded in the array
			if(gameCounter === arrayOfGamesWinLOss.length) {
				winPercentageVariable = gamesWinCounter / arrayOfGamesWinLOss.length;
				winPercentageVariable = winPercentageVariable * 100;
				winPercentageVariable = winPercentageVariable.toFixed(0);
				manyValuesPos["winP"] = winPercentageVariable;
			}
		}

		getWinPercentage(winLoseArrayMid, winPercentageMid, manyValuesMid)
		getWinPercentage(winLoseArrayTop, winPercentageTop, manyValuesTop)
		getWinPercentage(winLoseArrayAdc, winPercentageAdc, manyValuesAdc)
		getWinPercentage(winLoseArray, winPercentage, manyValues)
		getWinPercentage(winLoseArraySupport, winPercentageSupport, manyValuesSupport)
		getWinPercentage(winLoseArrayJungle, winPercentageJungle, manyValuesJungle)


		manyValues["summonerName"] = summonerName;
		manyValues["todaysDateFormated"] = todaysDateFormated;					
		manyValues["Days7AgoFormated"] = Days7AgoFormated;	

		manyValues["doubleKills"] = arrSum(doubleKillsArray);
		manyValues["tripleKill"] = arrSum(tripleKillsArray);
		manyValues["quadraKills"] = arrSum(quadraKillsArray);
		manyValues["pentaKills"] = arrSum(pentaKillsArray);	

		// KDA VALUES
		//	let averageKda;
		let averageKills;
		let averageAssists;
		let averageDeaths;

		averageKills = arrSum(killsArray)/ manyValues["totalGames"];
		averageAssists = arrSum(assistsArray)/ manyValues["totalGames"];
		averageDeaths = arrSum(deathsArray)/ manyValues["totalGames"];
		manyValues["averageKills"] = averageKills.toFixed(1);
		manyValues["averageAssists"] = averageAssists.toFixed(1);
		manyValues["averageDeaths"] = averageDeaths.toFixed(1);

		// length of killsArrayMid should be total games played mid
		manyValuesMid["averageKills"] = (arrSum(killsArrayMid)/ killsArrayMid.length).toFixed(1);
		manyValuesMid["averageAssists"] = (arrSum(assistsArrayMid)/ killsArrayMid.length).toFixed(1);
		manyValuesMid["averageDeaths"] = (arrSum(deathsArrayMid)/ killsArrayMid.length).toFixed(1);

		manyValuesAdc["averageKills"] = (arrSum(killsArrayAdc)/ killsArrayAdc.length).toFixed(1);
		manyValuesAdc["averageAssists"] = (arrSum(assistsArrayAdc)/ killsArrayAdc.length).toFixed(1);
		manyValuesAdc["averageDeaths"] = (arrSum(deathsArrayAdc)/ killsArrayAdc.length).toFixed(1);

		manyValuesSupport["averageKills"] = (arrSum(killsArraySupport)/ killsArraySupport.length).toFixed(1);
		manyValuesSupport["averageAssists"] = (arrSum(assistsArraySupport)/ killsArraySupport.length).toFixed(1);
		manyValuesSupport["averageDeaths"] = (arrSum(deathsArraySupport)/ killsArraySupport.length).toFixed(1);

		manyValuesJungle["averageKills"] = (arrSum(killsArrayJungle)/ killsArrayJungle.length).toFixed(1);
		manyValuesJungle["averageAssists"] = (arrSum(assistsArrayJungle)/ killsArrayJungle.length).toFixed(1);
		manyValuesJungle["averageDeaths"] = (arrSum(deathsArrayJungle)/ killsArrayJungle.length).toFixed(1);

		manyValuesTop["averageKills"] = (arrSum(killsArrayTop)/ killsArrayTop.length).toFixed(1);
		manyValuesTop["averageAssists"] = (arrSum(assistsArrayTop)/ killsArrayTop.length).toFixed(1);
		manyValuesTop["averageDeaths"] = (arrSum(deathsArrayTop)/ killsArrayTop.length).toFixed(1);


		manyValues["KDAaverage"] = ((arrSum(killsArray) + arrSum(assistsArray)) / arrSum(deathsArray)).toFixed(2);;
		manyValuesMid["KDAaverage"] = ((arrSum(killsArrayMid) + arrSum(assistsArrayMid)) / arrSum(deathsArrayMid)).toFixed(2);
		manyValuesSupport["KDAaverage"] = ((arrSum(killsArraySupport) + arrSum(assistsArraySupport)) / arrSum(deathsArraySupport)).toFixed(2);
		manyValuesJungle["KDAaverage"] = ((arrSum(killsArrayJungle) + arrSum(assistsArrayJungle)) / arrSum(deathsArrayJungle)).toFixed(2);
		manyValuesTop["KDAaverage"] = ((arrSum(killsArrayTop) + arrSum(assistsArrayTop)) / arrSum(deathsArrayTop)).toFixed(2);
		manyValuesAdc["KDAaverage"] = ((arrSum(killsArrayAdc) + arrSum(assistsArrayAdc)) / arrSum(deathsArrayAdc)).toFixed(2);


		manyValues["totalDamageDealtToChampions"] = arrSum(totalDamageDealtToChampionsArray);
		manyValuesMid["totalDamageDealtToChampions"] = arrSum(totalDamageDealtToChampionsArrayMid);
		manyValuesAdc["totalDamageDealtToChampions"] = arrSum(totalDamageDealtToChampionsArrayAdc);
		manyValuesSupport["totalDamageDealtToChampions"] = arrSum(totalDamageDealtToChampionsArraySupport);
		manyValuesJungle["totalDamageDealtToChampions"] = arrSum(totalDamageDealtToChampionsArrayJungle);
		manyValuesTop["totalDamageDealtToChampions"] = arrSum(totalDamageDealtToChampionsArrayTop);


		manyValues["kills"] = arrSum(killsArray);
		manyValues["assists"] = arrSum(assistsArray);
		manyValues["deaths"] = arrSum(deathsArray);

		manyValuesMid["kills"] =  arrSum(killsArrayMid);
		manyValuesMid["assists"] = arrSum(assistsArrayMid);
		manyValuesMid["deaths"] = arrSum(deathsArrayMid);

		manyValuesTop["kills"] =  arrSum(killsArrayTop);
		manyValuesTop["assists"] = arrSum(assistsArrayTop);
		manyValuesTop["deaths"] = arrSum(deathsArrayTop);

		manyValuesJungle["kills"] =  arrSum(killsArrayJungle);
		manyValuesJungle["assists"] = arrSum(assistsArrayJungle);
		manyValuesJungle["deaths"] = arrSum(deathsArrayJungle);

		manyValuesSupport["kills"] =  arrSum(killsArraySupport);
		manyValuesSupport["assists"] = arrSum(assistsArraySupport);
		manyValuesSupport["deaths"] = arrSum(deathsArraySupport);

		manyValuesAdc["kills"] =  arrSum(killsArrayAdc);
		manyValuesAdc["assists"] = arrSum(assistsArrayAdc);
		manyValuesAdc["deaths"] = arrSum(deathsArrayAdc);

		manyValuesMid["totalGames"] = killsArrayMid.length;
		manyValuesTop["totalGames"] = killsArrayTop.length;
		manyValuesAdc["totalGames"] = killsArrayAdc.length;
		manyValuesSupport["totalGames"] = killsArraySupport.length;
		manyValuesJungle["totalGames"] = killsArrayJungle.length;


		manyValues["creepScore010"] = (arrSum(creepScoreArray) / creepScoreArray.length * 10).toFixed(0);
		manyValuesMid["creepScore010"] = (arrSum(creepScoreArrayMid) / creepScoreArrayMid.length * 10).toFixed(0);
		manyValuesJungle["creepScore010"] = (arrSum(creepScoreArrayJungle) / creepScoreArrayJungle.length * 10).toFixed(0);
		manyValuesAdc["creepScore010"] = (arrSum(creepScoreArrayAdc) / creepScoreArrayAdc.length * 10).toFixed(0);
		manyValuesSupport["creepScore010"] = (arrSum(creepScoreArraySupport) / creepScoreArraySupport.length * 10).toFixed(0);
		manyValuesTop["creepScore010"] = (arrSum(creepScoreArrayTop) / creepScoreArrayTop.length * 10).toFixed(0);


		manyValues["timePlayed"] = msToTime( arrSum(gameDurationArray) * 1000);
		manyValuesMid["timePlayed"] = msToTime( arrSum(gameDurationArrayMid) * 1000);
		manyValuesTop["timePlayed"] = msToTime( arrSum(gameDurationArrayTop) * 1000);
		manyValuesJungle["timePlayed"] = msToTime( arrSum(gameDurationArrayJungle) * 1000);
		manyValuesSupport["timePlayed"] = msToTime( arrSum(gameDurationArraySupport) * 1000);
		manyValuesAdc["timePlayed"] = msToTime( arrSum(gameDurationArrayAdc) * 1000);


		await getMostPlayedChampionName(getMostPlayedChampionId(championIdArray), "ALL");
		await getMostPlayedChampionName(getMostPlayedChampionId(championIdArrayMid), "MID");
		await getMostPlayedChampionName(getMostPlayedChampionId(championIdArrayJungle), "JUNGLE");
		await getMostPlayedChampionName(getMostPlayedChampionId(championIdArraySupport), "SUPPORT");
		await getMostPlayedChampionName(getMostPlayedChampionId(championIdArrayAdc), "ADC");
		await getMostPlayedChampionName(getMostPlayedChampionId(championIdArrayTop), "TOP");
		console.log("Loaded champions");

		console.log(manyValues)

	}











	// This runs first
	// gets accounId and uses it to calls getMatches and ranks
	async function callbackGetName(error, response, body) {
		if (!error && response.statusCode == 200) {		
			let info = JSON.parse(body);
			accountId = info.accountId;
			id = info.id;
			summonerName = info.name;

			apiCalls++;

			optionsGetMatches = {
				url: `https://${zoneCode}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&queue=440&beginTime=${unix7daysAgo}&api_key=${apiKey}`		
			};

			optionsGetRanks = {
				url: `https://${zoneCode}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${apiKey}`
			};

			console.log("CALLBACK GET NAMES")

		} else {
			console.log("error 1", error, body)
		}
	}	



	async function getSummonerNameId() {
		let response = await fetch(optionsGetName)
		let data = await response.json()

		apiCalls++;

		console.log("CALLBACK GET NAMES NEWNEWNEWNEWNEWNEWNEWNEW")

		let info = JSON.parse(data);
		accountId = info.accountId;
		id = info.id;
		summonerName = info.name;

		optionsGetMatches = {
			url: `https://${zoneCode}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&queue=440&beginTime=${unix7daysAgo}&api_key=${apiKey}`		
		};

		optionsGetRanks = {
			url: `https://${zoneCode}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${apiKey}`
		};

	}












	async function callbackGetRanks(error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);

			apiCalls++;

			let counter = 0;
			info.forEach(element => {

				rankArray.push({"queue": element.queueType,"tier":element.tier,"rank": element.rank});			
				counter++
			})

			manyValues["RankData"] = rankArray;

			console.log("CALLBACK GET RANKS")
		} else {
			console.log("error 4", error, body)
		}
	}



	async function callbackGetMatches(error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);

			apiCalls++;
			matchCount = 0;

			totalGames = info.totalGames;
			manyValues["totalGames"] = info.totalGames;

			allMatches = info.matches;

			var interval = 100; // how much time should the delay between two iterations be (in milliseconds)?
			var promise = Promise.resolve();

			//			queueId: 420 = Ranked Solo
			//			queueId: 440 = Ranked Flex

			info.matches.forEach(element => {	
				promise = promise.then(async function () {				

					matchInfo = info.matches[matchCount];
					gameId = info.matches[matchCount].gameId;
					//					championIdArray.push(element.champion);

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

					console.log("Match Count", matchCount)
					console.log("Total Games", totalGames)

					matchCount++;

					// When all matches loaded start pulling the data from them
					if(matchCount === totalGames) {
						console.log("Total games loaded");
						getMidData();
					}

					return new Promise(function (resolve) {
						setTimeout(resolve, interval);
					});
				})
			})

		} else {
			console.log("error 2", error, body)			
		}
	}		


	async function startEverything() {	
		await request(optionsGetName, callbackGetName);
		await request(optionsGetRanks, callbackGetRanks);
		// calls getMidData that calls the next function when finished
		await request(optionsGetMatches, callbackGetMatches);
	}	

	startEverything();

	let midFuncRun = false;
	let topFuncRun = false;
	let jungleFuncRun = false;
	let adcFuncRun = false;
	let supportFuncRun = false;


	// each function will call the next when it is finished
	async function getMidData() {		
		console.log("Got All Data");
		midFuncRun = false;
		await getPositionValues("MID");		
	}

	async function getTopData() {
		if(getOneMatchDataDoneMid === true && winLoseArrayMidDone === true && midFuncRun === false) {
			console.log("getTopData SUCCESS" );
			midFuncRun = true;
			topFuncRun = false;
			await getPositionValues("TOP");
		} else {
			console.log("getTopData fail", getOneMatchDataDoneMid, winLoseArrayMidDone)
		}
	}


	async function getJungleData() {
		if(getOneMatchDataDoneTop === true && winLoseArrayTopDone === true && topFuncRun === false) {
			console.log("getJungleData SUCCESS" );
			jungleFuncRun = false;
			topFuncRun = true;
			await getPositionValues("JUNGLE");
		} else {
			console.log("getJungleData fail", getOneMatchDataDoneTop, winLoseArrayTopDone)
		}
	}

	async function getAdcData() {
		if(getOneMatchDataDoneJungle === true && winLoseArrayJungleDone === true && jungleFuncRun === false ) {
			console.log("getAdcData SUCCESS" );
			jungleFuncRun = true;
			adcFuncRun = false;
			await getPositionValues("ADC");
		} else {
			console.log("getAdcData fail", getOneMatchDataDoneJungle, winLoseArrayJungleDone)
		}
	}

	async function getSupportData() {
		if(getOneMatchDataDoneAdc === true && winLoseArrayAdcDone === true && adcFuncRun === false ) {
			console.log("getSupportData SUCCESS" );
			adcFuncRun = true;
			supportFuncRun = false;
			await getPositionValues("SUPPORT");
		} else {
			console.log("getSupportData fail", getOneMatchDataDoneAdc, winLoseArrayAdcDone, adcFuncRun)
		}
	}

	async function compileManyValuesData() {
		if(getOneMatchDataDoneSupport === true && winLoseArraySupportDone === true && supportFuncRun === false ) {
			console.log("compileManyValuesData SUCCESS" );
			console.log("WE MADE IT");
			console.log("Final Api call number", apiCalls);
			supportFuncRun = true;
			await finaliseData();


			
			app.set('views', path.join(__dirname, '/emails'));


			res.render('emailTemplate', {manyValues: manyValues, manyValuesMid: manyValuesMid, manyValuesTop: manyValuesTop, manyValuesJungle: manyValuesJungle, manyValuesSupport: manyValuesSupport, manyValuesAdc: manyValuesAdc})


			// ejs rendering engine rendering email 
			app.render('emailTemplate', {manyValues: manyValues, manyValuesMid: manyValuesMid, manyValuesTop: manyValuesTop, manyValuesJungle: manyValuesJungle, manyValuesSupport: manyValuesSupport, manyValuesAdc: manyValuesAdc}, function(err, html){ 
				if (err) {
					console.log('error rendering email template:', err) 
					return
				} else {
					var mailOptions = {
						from: 'noreply@*****.com',
						to: 'john@snow.com',
						subject: 'Verify Your Email',
						generateTextFromHtml : true,
						// pass the rendered html string in as your html 
						html: html 
					};

					//Execute this to send the mail
					transporter.sendMail(mailOptions, function(error, response){
						if(error) {
							console.log("error", error);
							res.send('Mail Error! Try again')
						} else {
							console.log("Mail Sent", response);

							res.send("Mail succesfully sent!")
						}
					});
				} 
			}); 


		} else {
			console.log("compileManyValuesData fail", getOneMatchDataDoneSupport, winLoseArraySupportDone)
		}
	}

})


app.listen(port, ()=> console.log(`Listening at ${port}`));
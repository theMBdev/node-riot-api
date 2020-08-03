const express = require('express');
const request = require("request-promise");
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


	var allDataLoadedTrueFalse = false;	
	var midDataLoadedTrueFalse = false;	

	var getOneMatchDataDoneAll = false;
	var getOneMatchMidDataDone = false;
	var winLoseArrayDoneAll = false;
	var winLoseArrayMidDone = false;


	// UNSORTED FUNCTIONS


	// Populates wonLoseArray used to calculate wining percentage
	function gameResults(infoTeams, infoParticipantIdentities, position) {

		let resultToReturn;

		console.log("INSIDE GAMERESULTS START")
		// Get winner id so i can check if the player was on this team
		infoTeams.find(element => {
			if(element.win === "Win") {
				winnerId = element.teamId;				
			} 			
			//			console.log("WINNNNNNNER                teamID", element.teamId)
			//			console.log("WINNNNNNNER                WIN or LOSS", element.win)
			//			console.log("WINNNNNNNER                WIN", winnerId)
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
					//							console.log("Player Win");							
					resultToReturn = "Win"
				} else {
					//							console.log("Player Lost");							
					resultToReturn = "Loss"
				}
			}	
		});		

		
		if(position === "MID") {
			winLoseArrayMid.push({resultToReturn, winnerId, summonerTeam});
		} 
		if(position === "ALL") {
			winLoseArray.push({resultToReturn, winnerId, summonerTeam});
		}

		//		console.log("GAMES RESULTS", winLoseArrayMid)
		//		console.log("GAMES RESULTS", winLoseArray)
		console.log("INSIDE GAMERESULTS END")

		if(winLoseArray.length === totalGames) {
			console.log("WINLOSEA    RRAY ALL FI   NS         I       SHE D")
			winLoseArrayDoneAll = true;
			checkValue();
		} else {
			console.log("WINLOSEA    RRAY ALL FI   NS       NOPOOOOOOOOOOOO")
			console.log("WINLOSEA    RRAY ALL FI   NS       NOPOOOOOOOOOOOO", totalGames, winLoseArray.length)
		}


		if(winLoseArrayMid.length === midMatches.length) {
			console.log("WINLOSEA    RRAY ALL FI   NS         I       SHE D 222")
			winLoseArrayMidDone = true;
			checkValue2();
		} else {
			console.log("WINLOSEA    RRAY ALL FI   NS       NOPOOOOOOOOOOOO 222")
			console.log("WINLOSEA    RRAY ALL FI   NS       NOPOOOOOOOOOOOO  222", midMatches.length, winLoseArrayMid.length)
			console.log("midMatches", midMatches.length)
		}	

		return resultToReturn;

	}



	// gets the champion name
	// needed to be async so that the champion name value got saved before the page rendered
	async function getMostPlayedChampionName(id, position) {
		console.log("getMostPlayedChampionName");
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

		}
	}



	// return most played champion id, result will be used in getMostPlayedChampionName
	function getMostPlayedChampionId(array) {
		console.log("getMostPlayedChampionId");
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























	let killsArrayMid = [];
	let deathsArrayMid = [];
	let assistsArrayMid = [];
	let totalDamageDealtToChampionsArrayMid = [];
	let creepScoreArrayMid = [];
	let gameDurationArrayMid = [];

	let winLoseArrayMid = [];
	let championIdArrayMid = [];


	let info = "";

	var positionMod = "";

	// POPULATES
	// calls getonematchNEW
	// killsArray, assistsArray, deathsArray, gameDurationArray
	async function getPositionValues(position) {

		console.log("START GET POSITION VALUES");
		async function callbackGetOneMatchNew(error, response, body) {
			if (!error && response.statusCode == 200) {
				let info = JSON.parse(body);

				//			experementCount++;

				// this does not get triggered
				if(position === "MID") {
					gameDurationArrayMid.push(info.gameDuration);
				}

				if(position === "ALL") {
					gameDurationArray.push(info.gameDuration);
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
						}

						if(position === "ALL") {
							killsArray.push(element.stats.kills);
							deathsArray.push(element.stats.deaths);
							assistsArray.push(element.stats.assists);
							totalDamageDealtToChampionsArray.push(element.stats.totalDamageDealtToChampions);

							doubleKillsArray.push(element.stats.doubleKills)
							tripleKillsArray.push(element.stats.tripleKills)
							quadraKillsArray.push(element.stats.quadraKills)
							pentaKillsArray.push(element.stats.pentaKills)
						}

						var objKey = "0-10";

						if(element.timeline.creepsPerMinDeltas){

							if(position === "MID") {
								creepScoreArrayMid.push(element.timeline.creepsPerMinDeltas[objKey]);
							}
							if(position === "ALL") {
								creepScoreArray.push(element.timeline.creepsPerMinDeltas[objKey]);
							}

						} else {
							console.log("ERROR creeps", element.timeline);
						}

						if(position === "ALL") {
							if(totalGames === killsArray.length){

								//									console.log("GET ONE MATCH ALL DATA DONE")								
								//									console.log("CALLLLLLLLLLLL    LLLLLL   LLLLLLLLLLLLLLLLLLLLLLLL")


								getOneMatchDataDoneAll = true;
								checkValue();
							}
						}

						// COULD BE ERROR WHAT IS TOTAL GAMES HERE???????????????
						if(position === "MID") {
							if(totalGames === killsArrayMid.length){	

								console.log("YO BITA BOIIIIIII ")
								console.log("CALLLLLLLLLLLL    LLLLLL   LLLLLLLLLLLLLLLLLLLLLLLL 22222")

								getOneMatchMidDataDone = true;
								checkValue2();
							}
						}

						console.log("KAM", killsArrayMid)
						console.log("GDA", gameDurationArrayMid)
						console.log("KA", killsArray);
						console.log("Total Games", totalGames);
					}	

				});	

				// populate WinLoseArray
				gameResults(info.teams, info.participantIdentities, position)	
			}
		}


		if(position === "MID") {
			position = "MID";
			positionMod = "Mid";
			info = midMatches;
			//			console.log("MiDMATCHES", midMatches)
			//			console.log("pos", position)
		}

		if(position === "ALL") {
			position = "ALL";
			positionMod = "All";
			info = allMatches;
			//			console.log("MiDMATCHES", midMatches)
			//			console.log("pos", position)
		}

		matchCount2 = 0;

		totalGames = info.length;
		//	manyValues["totalGames"] = info.totalGames;		
		console.log("TG", totalGames)

		var interval = 60; // how much time should the delay between two iterations be (in milliseconds)?
		var promise = Promise.resolve();

		//		console.log("INFO", info)

		info.forEach(element => {

			promise = promise.then(function () {				
				//				console.log("Match Count rb", matchCount);
				//				console.log("info", info)			
				//				console.log("info each", info[matchCount])			

				matchInfo = info[matchCount2];
				gameId = info[matchCount2].gameId;

				if (position === "MID") {
					championIdArrayMid.push(element.champion);
				}
				if (position === "ALL") {
					championIdArray.push(element.champion);
				}

				let optionsGetOneMatch = {
					url: `https://${zoneCode}.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${apiKey}`
				};			


				async function callFunction() {
					console.log("START  INSIDE GETPOSITIONVALUE")					
					request(optionsGetOneMatch, callbackGetOneMatchNew);
					console.log("END INSIDE GETPOSITIONVALUE")
					matchCount2++;


					if(matchCount2 === totalGames) {
						console.log("TOTAL REACHED DO THE THING NOW")

						// might be rubbish
						if(position === "ALL") {
							allDataLoadedTrueFalse = true;
						}					

						if(position === "MID") {
							midDataLoadedTrueFalse = true;
						}


					}

				}

				callFunction();
				console.log("Match Count2", matchCount2);

				return new Promise(function (resolve) {
					setTimeout(resolve, interval);
				});
			})
		})

		let jesusVar = "jesus";
		console.log("ENDING GET POSITION VALUES");
		return jesusVar;
	}








	async function finaliseData() {


		// ALL DATA SHOULD BE LOADED WHEN THIS FUCNTION IS CALLED

		function getWinPercentageAll() {
			let gamesWinCounter = 0;
			var gameCounter = 0;

			console.log("start win P")
			console.log(winLoseArray)
			winLoseArray.forEach(element => {
				if(element.resultToReturn === "Win") {
					gamesWinCounter++	
					gameCounter++;
				} else {
					gameCounter++;
				}
			})

			// used to make sure all games were loaded in the array
			if(gameCounter === winLoseArray.length) {
				console.log(gamesWinCounter)
				console.log(winLoseArray.length)
				winPercentage = gamesWinCounter / winLoseArray.length;
				winPercentage = winPercentage * 100;
				winPercentage = winPercentage.toFixed(0);
				manyValues["winP"] = winPercentage;
				console.log("END win P", winPercentage)
			}
		}


		function getWinPercentageMid() {
			let gamesWinCounter = 0;
			var gameCounter = 0;

			console.log("WIN LOSE MIDDDDDDDDDDDDDDDDDDDDDDDDDDDD", winLoseArrayMid);

			winLoseArrayMid.forEach(element => {
				if(element.resultToReturn === "Win") {
					gamesWinCounter++	
					gameCounter++;
				} else {
					gameCounter++;
				}
			})

			console.log("COUNTRRD ADOIH    COUNTERS", gamesWinCounter, gameCounter)

			// used to make sure all games were loaded in the array
			if(gameCounter === winLoseArrayMid.length) {
				winPercentageMid = gamesWinCounter / winLoseArrayMid.length;
				winPercentageMid = winPercentageMid * 100;
				winPercentageMid = winPercentageMid.toFixed(0);
				manyValuesMid["winP"] = winPercentageMid;
			}
		}

		getWinPercentageAll()		
		getWinPercentageMid()



		// END GET WIN PERCENTAGE


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

		//	averageKda = (arrSum(killsArray) + arrSum(assistsArray))/ arrSum(deathsArray);

		manyValues["KDAaverage"] = ((arrSum(killsArray) + arrSum(assistsArray)) / arrSum(deathsArray)).toFixed(2);;
		manyValuesMid["KDAaverage"] = ((arrSum(killsArrayMid) + arrSum(assistsArrayMid)) / arrSum(deathsArrayMid)).toFixed(2);;



		manyValues["totalDamageDealtToChampions"] = arrSum(totalDamageDealtToChampionsArray);
		manyValuesMid["totalDamageDealtToChampions"] = arrSum(totalDamageDealtToChampionsArrayMid);


		manyValues["kills"] = arrSum(killsArray);
		manyValues["assists"] = arrSum(assistsArray);
		manyValues["deaths"] = arrSum(deathsArray);

		manyValuesMid["kills"] =  arrSum(killsArrayMid);
		manyValuesMid["assists"] = arrSum(assistsArrayMid);
		manyValuesMid["deaths"] = arrSum(deathsArrayMid);
		

		manyValuesMid["totalGames"] = killsArrayMid.length;


		//		let creepScoreAverage = arrSum(creepScoreArray) / creepScoreArray.length * 10;	
		//		creepScoreAverage = creepScoreAverage.toFixed(0);
		manyValues["creepScore010"] = (arrSum(creepScoreArray) / creepScoreArray.length * 10).toFixed(0);
		manyValuesMid["creepScore010"] = (arrSum(creepScoreArrayMid) / creepScoreArrayMid.length * 10).toFixed(0);




		//		var gameDurationSum = arrSum(gameDurationArray) * 1000;						
		manyValues["timePlayed"] = msToTime( arrSum(gameDurationArray) * 1000);
		manyValuesMid["timePlayed"] = msToTime( arrSum(gameDurationArrayMid) * 1000);





		console.log("IIIIIIIIIIIIII GOT HERE 10");
		await getMostPlayedChampionName(getMostPlayedChampionId(championIdArray), "ALL");
		await getMostPlayedChampionName(getMostPlayedChampionId(championIdArrayMid), "MID");
		console.log("Loaded champions");

		console.log(manyValues)
		console.log(manyValues)




		//		async function renderPage() {
		//			
		//			//	await getPositionValues("MID");
		//
		//			res.render('index', {manyValues: manyValues })
		//		}		
		//
		//		renderPage();


		// used to render page once all data had been loaded
		//		if(experementCount === totalGames) {
		//			renderPage();
		//		}

	}

































	var position = "def";
	const apiKey = apikey;
	//	let accountName = "Top%209th%20Sup%20LFL2";
	let accountName = "dacurrymonster";
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
	//	let unix2daysAgo = Date.now() - 2*24*60*60*1000;

	let championIdArray = [];

	let experementCount = 0;

	// winP, gamesPlayed, 
	let manyValues = {};
	let manyValuesMid = {};


	//	let optionsGetName = {
	//		url: `https://${zoneCode}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${accountName}?api_key=${apiKey}`
	//	};

	//	optionsGetName = `https://${zoneCode}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${accountName}?api_key=${apiKey}`;

	let optionsGetName = {
		url:  `https://${zoneCode}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${accountName}?api_key=${apiKey}`
	}


	let optionsGetMatches = {
		url: `https://${zoneCode}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&queue=440&beginTime=${unix7daysAgo}&api_key=${apiKey}`		
	};

	let optionsGetRanks = {
		url: `https://${zoneCode}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${apiKey}`
	};




	let winPercentage = 0;






	// This runs first
	// gets accounId and uses it to calls getMatches and ranks
	async function callbackGetName(error, response, body) {
		if (!error && response.statusCode == 200) {

			let info = JSON.parse(body);
			accountId = info.accountId;
			id = info.id;
			summonerName = info.name;

			optionsGetMatches = {
				url: `https://${zoneCode}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?queue=420&queue=440&beginTime=${unix7daysAgo}&api_key=${apiKey}`		
			};

			optionsGetRanks = {
				url: `https://${zoneCode}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}?api_key=${apiKey}`
			};

			//			request(optionsGetMatches, callbackGetMatches);
			//			request(optionsGetRanks, callbackGetRanks);


			console.log("CALLBACK GET NAMES")

		} else {
			console.log("error 1", error, body)
		}
	}	



	async function getSummonerNameId() {
		let response = await fetch(optionsGetName)
		let data = await response.json()

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

		//			request(optionsGetMatches, callbackGetMatches);
		//			request(optionsGetRanks, callbackGetRanks);

	}









	function checkStatus(res) {
		if (res.ok) { // res.status >= 200 && res.status < 300
			return res;
		} else {
			throw MyCustomError(res.statusText);
		}
	}

	let optionsGetTest = {
		url:  `https://jsonplaceholder.typicode.com/todos/2`
	}

	async function callbackGetTest(error, response, body) {
		if (!error && response.statusCode == 200) {

			let info = JSON.parse(body);

			console.log("ddddddddddd", body);
			console.log("CALLBACK GET TEST")

		} else {
			console.log("error 167", error, body)
		}
	}	





	var zone = "jsonplaceholder"
	var urlNew = `https://${zone}.typicode.com/todos/1`;

	async function getRanksNew() {
		let response = await fetch(urlNew)
		let data = await response.json()

		console.log(JSON.stringify(data, null, "\t"))
	}



















	async function callbackGetRanks(error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);

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

			matchCount = 0;

			totalGames = info.totalGames;
			manyValues["totalGames"] = info.totalGames;

			allMatches = info.matches;

			var interval = 60; // how much time should the delay between two iterations be (in milliseconds)?
			var promise = Promise.resolve();

			//			queueId: 420 = Ranked Solo
			//			queueId: 440 = Ranked Flex



			info.matches.forEach(element => {	
				promise = promise.then(async function () {				

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

					//	request(optionsGetOneMatch, callbackGetOneMatch);								

					console.log("MC", matchCount)
					console.log("TG", totalGames)

					matchCount++;


					if(matchCount === totalGames) {
						console.log("Total games loaded");
						getPositionValues("ALL");						
					}




					return new Promise(function (resolve) {
						setTimeout(resolve, interval);
					});


				})
			})

			console.log("CALLBACK GET MATCHES")
			// call 3

		} else {
			console.log("error 2", error, body)			
		}
	}		


	async function startEverything() {
		await getRanksNew()		
		await request(optionsGetTest, callbackGetTest);
		await request(optionsGetName, callbackGetName);
		await request(optionsGetRanks, callbackGetRanks);

		// calls finalise data , calls get positionValue
		await request(optionsGetMatches, callbackGetMatches);




	}	

	startEverything();


	async function checkValue() {
		if(getOneMatchDataDoneAll === true && winLoseArrayDoneAll === true) {
			console.log("ITS TIME TO GOOOOOOOOOOOOOOOOOOOOOOOOOOO");
			getPositionValues("MID");

			//			await finaliseData();
			//			res.render('index', {manyValues: manyValues })
		} else {
			console.log("ITS NOTTTTTTTTTTTTTTTTTTTTTTTTTTT", getOneMatchDataDoneAll, winLoseArrayDoneAll)
		}
	}

	async function checkValue2() {
		if(getOneMatchMidDataDone === true && winLoseArrayMidDone === true) {
			console.log("ITS TIME TO GOOOOOOOOOOOOOOOOOOOOOOOOOOO 222222222" );
			//			getPositionValues("MID");

			await finaliseData();

			console.log(manyValuesMid);
			res.render('index', {manyValues: manyValues, manyValuesMid: manyValuesMid })
		} else {
			console.log("ITS NOTTTTTTTTTTTTTTTTTTTTTTTTTTT", getOneMatchDataDoneAll, winLoseArrayDoneAll)
		}
	}






	// call this once every thing has loaded

	// could do a line of awaits or





})


app.listen(port, ()=> console.log(`Listening at ${port}`));
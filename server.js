const express = require('express');
const request = require('request');
const app = express();
const ejs = require('ejs');
const port = 3000;

app.set('view engine', 'ejs');




// routes
app.get('/', (req, res) => {


	const apiKey = 'RGAPI-a8f5aa38-1555-4371-a0a1-eaf54da44551';
	//	let accountId = 'wz3GXIlG2798lfGWUFPzhj7wlfBxF9J2QqTJhwPDmz0NTqQ';
	let accountId;
	let summonerName;
	let gameId;
	let championId;
	let matchInfo;
	let accountName = "sudofo";	
	let teamId;
	let winnerId;
	let matchCount;	
	
	let winArray = [];
	let dateNow = Date.now();
	let unix7Days = 7*24*60*60;
	let unix7daysAgo = Date.now() - 7*24*60*60;
	let manyValues = {};


	let optionsGetName = {
		url: `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${accountName}?api_key=${apiKey}`
	};


		let winPercentage = 0;
		
		function callbackGetName(error, response, body) {
			if (!error && response.statusCode == 200) {
				let info = JSON.parse(body);

				accountId = info.accountId;
				summonerName = info.name;

				let optionsGetMatches = {
					url: `https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?beginTime=1595439345000&api_key=${apiKey}`		
				};

				request(optionsGetMatches, callbackGetMatches);
			} else {
				console.log("error 1", error)
			}
		}	

		function callbackGetMatches(error, response, body) {
			if (!error && response.statusCode == 200) {
				let info = JSON.parse(body);

				matchCount = 0;

				manyValues["games"] = info.totalGames;
				
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
				console.log("error 2", error)
			}
		}		

		function callbackGetOneMatch(error, response, body) {
			if (!error && response.statusCode == 200) {
				let info = JSON.parse(body);
				console.log("GetOneMatch")

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

							if(element.participantId <= 5) {
								summonerTeam = 100
							} else {
								summonerTeam = 200
							}

							console.log("Win Id", winnerId , "Team id", summonerTeam)

							if (winnerId === summonerTeam) {
								console.log("Player Win");							
								resultToReturn = "Win"
							} else {
								console.log("Player Lost");							
								resultToReturn = "Loss"
							}
						}			

					});		

					winArray.push({resultToReturn, winnerId, summonerTeam});
					return resultToReturn;
				}

				gameResult()
				console.log( winArray );


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
							console.log(winPercentage);
							manyValues["winP"] = winPercentage;
							console.log(manyValues);
							console.log(manyValues.games);
							res.render('index', {manyValues: manyValues })
						}

					})
				}		


			} else {
				console.log("error 3", error)
			}
		}

		// first call
		request(optionsGetName, callbackGetName);
		
	})



app.listen(port, ()=> console.log(`Listening at ${port}`));
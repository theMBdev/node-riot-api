const express = require('express');
const request = require('request');
const app = express();
const ejs = require('ejs');
const port = 3000;

app.set('view engine', 'ejs');




// routes
app.get('/', (req, res) => {


	const apiKey = 'RGAPI-f2589bac-c871-4bdf-a2d9-ed4952c9c27c';
	//	let accountId = 'wz3GXIlG2798lfGWUFPzhj7wlfBxF9J2QqTJhwPDmz0NTqQ';
	let accountId;
	let summonerName;
	let gameId;
	let championId;

	let matchInfo;

	let teamId;
	let winnerId;

	let dateNow = Date.now();
	let unix7Days = 7*24*60*60;
	let unix7daysAgo = Date.now() - 7*24*60*60;

	//	const headers = {
	//		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
	//		"Accept-Language": "en-US,en;q=0.9,la;q=0.8",
	//		"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
	//		"Origin": "https://developer.riotgames.com",
	//		"X-Riot-Token": "RGAPI-f2589bac-c871-4bdf-a2d9-ed4952c9c27c"
	//	}

	let optionsGetName = {
		url: `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/sudofo?api_key=${apiKey}`
	};

	//	let optionsGetMatches = {
	//		url: `https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?beginTime=1595439345000&api_key=${apiKey}`		
	//	};

	//	let optionsGetOneMatch = {
	//		url: `https://euw1.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${apiKey}`};

	function callbackGetName(error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);
			console.log("GetName");
			console.log(info);
			accountId = info.accountId;
			console.log("aid", accountId);

			summonerName = info.name;
			//call 2

			let optionsGetMatches = {
				url: `https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?beginTime=1595439345000&api_key=${apiKey}`		
			};

			console.log(optionsGetMatches)

			request(optionsGetMatches, callbackGetMatches);
		} else {
			console.log("error 1", error)
		}
	}	

	function callbackGetMatches(error, response, body) {
		console.log("AID", accountId);
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);
			console.log("GetMatches");			
			console.log("Matches", info);		
			console.log("MATCHES MY Q2", info.matches[2].gameId);		
			gameId = info.matches[2].gameId;

			matchInfo = info.matches[2];

			let optionsGetOneMatch = {
				url: `https://euw1.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${apiKey}`};

			// call 3
			request(optionsGetOneMatch, callbackGetOneMatch);
			res.render('index', {info: info})
		} else {
			console.log("error 2", error)
		}
	}	

	function callbackGetOneMatch(error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);
			console.log("GetOneMatch")

			//			teamId

			console.log("INFOOOOOOOOOOOOOO", info.teams);
			//			console.log("Winning team", info);	


			function gameResult() {

				let resultToReturn;
				
				// Get winner id so i can check if the player was on this team
				info.teams.find(element => {
					if(element.win === "Win") {
						winnerId = element.teamId;
					}
				})	

				// find what team the player was on
				// to compair with winingTeam Id to see if this game was a win
				info.participantIdentities.find(element => {	
					if(element.player.summonerName === summonerName) {					
						if (winnerId === element.teamId) {
							console.log("Player Win");							
							resultToReturn = "Win"
						} else {
							console.log("Player Lost");							
							resultToReturn = "Loss"
						}
					}			

				});
				
				return resultToReturn;

			}
			
			console.log( gameResult() );




		} else {
			console.log("error 3", error)
		}
	}	

	// first call
	request(optionsGetName, callbackGetName);


	res.render('index')

})




app.listen(port, ()=> console.log(`Listening at ${port}`));
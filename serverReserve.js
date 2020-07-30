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
	let winPercentage = 0;
	let winArray = [];
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
		url: `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${accountName}?api_key=${apiKey}`
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

			console.log("STARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTARTSTART");

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
			//			console.log("MATCHES MY Q2", info.matches[2].gameId);		
			//			gameId = info.matches[2].gameId;


			matchCount = 0;

			// FOR EACH MATCH GET IF IT WAS WIN OR LOST
			info.matches.forEach(element => {	

				matchInfo = info.matches[matchCount];
				gameId = info.matches[matchCount].gameId;
				console.log("Game id", gameId);

				console.log("MATCH INFO", matchInfo)

				let optionsGetOneMatch = {
					url: `https://euw1.api.riotgames.com/lol/match/v4/matches/${gameId}?api_key=${apiKey}`};
			
			
				request(optionsGetOneMatch, callbackGetOneMatch);

				matchCount++;

			})

			// call 3
			//			request(optionsGetOneMatch, callbackGetOneMatch);
//			res.render('index', {info: info})
		} else {
			console.log("error 2", error)
		}
	}		

	function callbackGetOneMatch(error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);
			console.log("GetOneMatch")
			//
			//			//			teamId
			//
			//			console.log("INFOOOOOOOOOOOOOO", info.teams);
			//			console.log("INFOOOOOOOOOOOOOO ALLLLLLLLL ONE MATCHHHHHHHHHHHHHH", info);
			//			console.log("MIMI", matchInfo);
			//			//			console.log("Winning team", info);


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
			//			console.log( gameResult() );
			console.log( winArray );


			let counter = 0;
			if(winArray.length === matchCount) {				
						
				winArray.forEach(element => {
					if(element.resultToReturn === "Win") {
						counter++						
					}
					console.log(counter);
				}			 					 
			)}
			winPercentage = counter / winArray.length;
			
			console.log(winPercentage);


		} else {
			console.log("error 3", error)
		}
	}
	
	
		// first call
	request(optionsGetName, callbackGetName);
		res.send("HEY " + winPercentage);

//res.render('index', {winPercentage:winPercentage})

	

		
	
	

	
	
})






app.listen(port, ()=> console.log(`Listening at ${port}`));
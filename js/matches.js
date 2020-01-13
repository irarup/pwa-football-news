function Matches(data){

	    var matches = data.matches;
        var jumlah = matches.length;
        var sceduledHTML = "";
        var update = data.competition.lastUpdated;

        
        //console.log(dateFormat(update));
        if (jumlah > 20) {
            jumlah = 20;
        }

        for (var i = 0 ; i < jumlah; i++) {
            //console.log(i);
            sceduledHTML += `
                  <div class="col s12 m6 l6">
                    <div class="card">
                      <div class="card-image">
                        <img src="../img/LaLiga.png">
                      </div>
                      <div class="card-content">
                        <span class="card-title flow-text center-align orange-text darken-4-text">${matches[i].homeTeam.name} vs ${matches[i].awayTeam.name}</span>
                        <p class="flow-text center-align">
                            Match Day : ${matches[i].matchday}<br>
                        </p>
                            <h6 class="center-align">Kick Off : `+dateFormat(matches[i].utcDate, "utc") +`</h6>
                      </div>
                      <div class="card-action right-align">
                          <button data-target="detail-match"  class="btn modal-trigger match-detail orange accent-3" onclick="detailMatch(${matches[i].id});">See Detail</button>    
                      </div>
                    </div>
                  </div>
              `
        }

        document.getElementById("update").innerHTML = "Last Update : " + dateFormat(update, "update");
        document.getElementById("SceduledMatch").innerHTML = sceduledHTML;

        

}

function MatchDetail(data){
    console.log(data.match);
        document.getElementById("home-team").innerHTML = data.match.homeTeam.name ;
        document.getElementById("home-team").href = "./team.html?id=" + data.match.homeTeam.id;
        document.getElementById("away-team").innerHTML = data.match.awayTeam.name ;
        document.getElementById("away-team").href = "./team.html?id=" + data.match.awayTeam.id;
        document.getElementById("match-day").innerHTML = "Match Day : " + data.match.matchday;
        document.getElementById("kick-off").innerHTML = "Kick-off : " + dateFormat(data.match.utcDate, "utc");
        document.getElementById("venue").innerHTML = "( "+ data.match.venue + " )" ;
        document.getElementById("num-matches").innerHTML = "Number of Matches : " + data.head2head.numberOfMatches;
        document.getElementById("goal").innerHTML = "Total Goals : " + data.head2head.totalGoals;
        document.getElementById("win-home").innerHTML = data.head2head.homeTeam.wins;
        document.getElementById("draw-home").innerHTML = data.head2head.homeTeam.draws;
        document.getElementById("lose-home").innerHTML = data.head2head.homeTeam.losses;
        document.getElementById("win-away").innerHTML = data.head2head.awayTeam.wins;
        document.getElementById("draw-away").innerHTML = data.head2head.awayTeam.draws;
        document.getElementById("lose-away").innerHTML = data.head2head.awayTeam.losses;
        document.getElementById("fav-btn").setAttribute('data-id', data.match.id);
    
    var winner = data.match.score.winner;

    if( winner == "Home_Team" ){
        var win = data.match.homeTeam.name;
        var link = "./team.html?id=" + data.match.homeTeam.id;
    }else{
        var win = data.match.awayTeam.name;
         var link = "./team.html?id=" + data.match.awayTeam.id;
    }

    var finishHTML = `
        <hr>
        <h5 class="align-center orange-text darken-4-text" >RESULT</h5>
        <h6 class="center"> Duration : ${data.match.score.duration}</h6>
        <div class="row">
          <div class="col m4">Home Team</div>
          <div class="col m4"></div>
          <div class="col m4">Away Team</div>
        </div>
        <div class="row">
            <div class="col m4">${data.match.score.penalties.homeTeam}</div>
            <div class="col m4">PENALTIES</div>
            <div class="col m4">${data.match.score.penalties.awayTeam}</div>
        </div>
        <h5 class="align-center orange-text darken-4-text">SCORE</h5>
        <div class="row">
            <div class="col m4">${data.match.score.halfTime.homeTeam}</div>
            <div class="col m4">HALF TIME</div>
            <div class="col m4">${data.match.score.halfTime.awayTeam}</div>
        </div>
        <div class="row">
            <div class="col m4">${data.match.score.fullTime.homeTeam}</div>
            <div class="col m4">FULL TIME</div>
            <div class="col m4" id="draw-away">${data.match.score.fullTime.awayTeam}</div>
        </div>
        <h6 class="align-center orange-text darken-4-text">WINNER = <a href="${link}">${win}</a></h6>
    `; 

    if(page == "match"){
        document.getElementById("finished-match").innerHTML = finishHTML;
    }
}


function getDataStandings(data) {
	//console.log(data);
        document.getElementById("update-standing").innerHTML = "Last Update : " + dateFormat(data.competition.lastUpdated, "update");
        document.getElementById("start").innerHTML = "Start Season : " + dateFormat(data.season.startDate, "tgl");
        document.getElementById("end").innerHTML = "End Season : " + dateFormat(data.season.endDate, "tgl");
        document.getElementById("matchDay").innerHTML = "Current Match Day : " + data.season.currentMatchday;


        var standing = data.standings[0].table;
        var standingHTML = '';
        for (var i = 0; i < standing.length; i++) {
            var gambar = standing[i].team.crestUrl.replace(/^http:\/\//i, 'https://')
            standingHTML += `
                <tr>
                  <td>${standing[i].position}</td>
                  <td height="66px"><img src="${gambar}" id="mini-logo"></td>
                  <td><a href="./team.html?id=${standing[i].team.id}">${standing[i].team.name}</td>
                  <td>${standing[i].points}</td>
                  <td>${standing[i].won}</td>
                  <td>${standing[i].draw}</td>
                  <td>${standing[i].lost}</td>
                  <td>${standing[i].goalsFor}</td>
                </tr>
            `;
        }

        document.getElementById("standing").innerHTML = standingHTML;
        document.getElementById('preloader').innerHTML = "";
}
function FavResult(type, data) {

    var favHTML = '';
    var judul = '';
    var jumlah = data.length;

    if (jumlah == 0) {
      favHTML = '<h3 class="red-text center"> No Favorite ' + type + ' here';
      judul = "Favorite " + type + "s";
    };
    
    for (var i = 0; i < jumlah; i++) {
      if (type == "match") {
          console.log(data[i].match);
          judul = "Favorite Matches";
          favHTML += `
            <div id="match-${data[i].id}">
              <div class="col s12 m6 l6">
                  <div class="card">
                    <div class="card-content">
                      <span class="card-title flow-text center-align orange-text darken-4-text">${data[i].match.homeTeam.name} vs ${data[i].match.awayTeam.name}</span>
                      <p class="flow-text center-align">
                          Match Day : ${data[i].match.matchday}<br>
                      </p>
                          <h6 class="center-align">Kick Off : `+dateFormat(data[i].match.utcDate, "utc") +`</h6>
                    </div>
                    <div class="card-action right-align">
                        <button  class="btn match-detail red" onclick="deleteFav('match',${data[i].id}); document.getElementById('match-${data[i].id}').innerHTML=''; "><i class="material-icons">delete</i></button>
                        <button data-target="detail-match"  class="btn modal-trigger match-detail orange accent-3" onclick="detailMatch(${data[i].id});"> See Detail</button>    
                    </div>
                  </div>
                </div>
            </div>
          `;

      }else if (type == "team") {
          judul = "Favorite Teams";
          favHTML += `
            <div id="team-${data[i].id}">
              <div class="col s12 m6 l6">
                  <div class="card">
                    <div class="card-image orange lighten-3 center-align">
                        <img src="${data[i].crestUrl}" class="favTeamLogo">
                    </div>
                    <div class="card-content">
                      <span class="card-title flow-text center-align orange-text darken-4-text"><a href="./team.html?id=${data[i].id}"> ${data[i].name}</a></span>
                      <p class="flow-text center-align">
                          Faunded : ${data[i].founded}<br>
                          address : ${data[i].address}
                      </p>
                    </div>
                    <div class="card-action right-align">
                        <button  class="btn match-detail red" onclick="deleteFav('team',${data[i].id}); document.getElementById('team-${data[i].id}').innerHTML=''; "><i class="material-icons">delete</i></button>
                        <a  class="btn orange accent-3" href="./team.html?id=${data[i].id}" target="_blank">See Detail</a>    
                    </div>
                  </div>
                </div>
            </div>
          `;
      }else{
          judul = "Favorite Players";
          favHTML += `
            <div id="player-${data[i].id}">
              <div class="col s12 m6 l6">
                  <div class="card">
                    <div class="card-image">
                        <h5 class="orange-text darken-4-text center" id="name">${data[i].name}</h5>
                    </div>
                    <div class="card-content">
                          <div class="row">
                              <div class="col m5 s6">First Name</div>
                              <div class="col m7" id="f-name">${data[i].firstName}</div>
                          </div>
                          <div class="row">
                              <div class="col m5 s6">Last Name</div>
                              <div class="col m7" id="l-name">${data[i].lastName}</div>
                          </div class="row">
                          <div class="row">
                              <div class="col m5 s6">County of Birth</div>
                              <div class="col m7" id="country-birth">${data[i].counrtyOfBirth}</div>
                          </div>
                          <div class="row">
                              <div class="col m5 s6">Date Of Birth</div>
                              <div class="col m7" id="date-birth">${data[i].dateOfBirth}</div>
                          </div>
                          <div class="row">
                              <div class="col m5 s6">Nationality</div>
                              <div class="col m7" id="nationality">${data[i].nationalityn}</div>
                          </div>
                          <div class="row">
                              <div class="col m5 s6">Position</div>
                              <div class="col m7 s6" id="position">${data[i].position}</div>
                          </div>
                    </div>
                    <div class="card-action right-align">
                        <button  class="btn match-detail red" onclick="deleteFav('player',${data[i].id}); document.getElementById('player-${data[i].id}').innerHTML=''; "><i class="material-icons">delete</i></button> 
                    </div>
                  </div>
                </div>
            </div>
          `;
        }
      }

    // Sisipkan komponen card ke dalam elemen dengan id divFavorit
    document.getElementById("favTitle").innerHTML = judul;
    document.getElementById("favoriteResult").innerHTML = favHTML;
    document.getElementById('preloader').innerHTML = "";
}

function getFavData(type){

    return new Promise(function (resolve, reject) {
        var storeName = "";
        dbPromised.then(function(db) {
            if (type == "match") {
                storeName = "favorite_matches";
            
            }else if (type == "team") {
               storeName = "favorite_teams";

            }else{
                storeName = "favorite_players";
            }
        var tx = db.transaction( storeName, 'readonly');
        var store = tx.objectStore( storeName );
          return store.getAll(); 
        }).then(function (val) {
            console.log(val);
            FavResult(type, val);
        });
    });
}
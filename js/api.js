const base_url = "https://api.football-data.org/v2/";
const dataMatch = "competitions/2014/matches?status=SCHEDULED";
const filterMathes = "competitions/2014/matches?status=";
const dataStanding = "competitions/2014/standings";

// Fetch function
function status (response) {
    if (response.status !== 200) {
        console.log('Error : ' + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json (response) {
    return response.json();
}

function error (error) {
    console.log('Error : ' + error);
}

function fetchApi(link) {
  return fetch(base_url + link, {
    headers: {
      'X-Auth-Token': "465bcd003e674d418caa49848b909cd4"
    }
  })
  .then(status)
  .then(json);
}


//format tanggal
function dateFormat(tgl, jenis){
  var hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  var bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember"];

  var d = new Date(tgl);
  var _hari = d.getDay();
  var _tanggal = d.getDate();
  var _bulan = d.getMonth();
  var _tahun = d.getYear();
  var jam = d.getHours();
  var menit = d.getMinutes();

  if (jam < 12) {
        var a_p = "AM";
    } else {
        a_p = "PM";
    }
    if (jam == 0) {
        jam = 12;
    }
    if (jam > 12) {
        jam = jam - 12;
    }
    jam = checkTime(jam);
    menit = checkTime(menit);
 
      function checkTime(i) {
          if (i < 10) {
              i = "0" + i;
          }
          return i;
      }

        var tahun = (_tahun < 1000 ) ? _tahun + 1900 : _tahun;

        if(jenis == "update" || jenis == "utc"){
          var tanggal = hari[_hari-1] +", " + _tanggal + " " + bulan[_bulan] + " " + tahun + " " + jam + ":" + menit + " " + a_p;
        }else if(jenis == "birth" || jenis == "tgl"){
          var tanggal = hari[_hari] +", " + _tanggal + " " + bulan[_bulan] + " " + tahun;  
        }
          return tanggal;
}

// Tulisan sumber : https://stackoverflow.com/questions/21792367/replace-underscores-with-spaces-and-capitalize-words
function humanize(str) {
  var splitStr = str.toLowerCase().split('_');
  for (var i = 0; i < splitStr.length; i++) {
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   return splitStr.join(' ');
}


// Mengambil data incoming match
function getMatch() {
  if ('caches' in window) {
    caches.match(base_url + dataMatch).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          if(page == "" || page =="home"){
            Matches(data);
            console.log("data diambil dari caches match");
          }
        });
      }
    });
  }else {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(function(response) {
            return response || fetch (event.request);
        })
    )
  }

  fetchApi(dataMatch)
    .then(function(data) {
      if(page == "" || page =="home"){
        Matches(data);
      }
    })
    .catch(error);
  

}

// Mengambil data finised match sebagai default pada halaman match
function getFinisedMatch() {

  if ('caches' in window) {
    caches.match(base_url + filterMathes + "FINISHED").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          if(page == "match"){
              Matches(data);
              console.log("data finised match diambil dari caches");
          }
        });
      }
    });
  }else{

    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(function(response) {
            return response || fetch (event.request);
        })
    )

  }

    fetchApi(filterMathes + "FINISHED")
      .then(function(data) {
        if(page == "match"){  
          Matches(data);
        }
      })
      .catch(error);
}

// Daftar Match
function matchesData(filter){

  // membedakan aktif botton
  var id = ['finished','live','in_play','paused'];

      for (var i = 0; i < id.length; i++) {
                if( id[i] != filter.toLowerCase()){
                  document.getElementById(id[i]).classList.remove("darken-4");
                  document.getElementById(id[i]).classList.add("accent-3");
                }else{
                  document.getElementById(filter.toLowerCase()).classList.remove("accent-3");
                  document.getElementById(filter.toLowerCase()).classList.add("darken-4");
                }
            };
  //Judul
  document.getElementById("show-match").innerHTML = "Showing Of " + humanize(filter) + " Matches";

  if ('caches' in window) {
    caches.match(base_url + filterMathes + filter).then(function (response) {
      if (response) {
        response.json().then(function (data) {
            var matches = data.matches;
            var jumlah = matches.length;
            if (page == "match"){
              if (jumlah == 0){
                  console.log(jumlah);
                    document.getElementById("SceduledMatch").innerHTML = `
                    <div class="red darken-1 white-text empty center-align">
                      <i class="large material-icons">sentiment_very_dissatisfied</i>
                      <h5 class="center">No Data in ${humanize(filter)} Matches</h5>
                    </div>
                 `;
                  console.log("jumlahnya" + filter + "harus = " + 0);
              }else if(jumlah != 0){
                  Matches(data);
                  console.log("Data "+ filter +" diambil dari caches" + jumlah);
            }
          }
        });
      }
    });
  }else{
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(function(response) {
            return response || fetch (event.request);
        })
    )
  }

    //Matches data menurut filter
      fetchApi(filterMathes + filter)
        .then(function(data) {
          var matches = data.matches;
          var jumlah = matches.length;
        
          if (page == "match"){
            if (jumlah == 0){
               document.getElementById("SceduledMatch").innerHTML = `
                  <div class="red darken-1 white-text empty center-align">
                    <i class="large material-icons">sentiment_very_dissatisfied</i>
                    <h5 class="center">No Data in ${humanize(filter)} Matches</h5>
                  </div>
               `;
            }else{
                Matches(data);
            }
          }

        })
        .catch(error);
  }

// Detail Match
function detailMatch(id){
  //open modal
  $('#detail-match').modal('open');

  return new Promise(function (resolve, reject) {
      if ('caches' in window) {
          caches.match(base_url + 'matches/' + id).then(function (response) {
          if (response) {
            response.json().then(function (data) {
                  if(page == "" || page =="home" || page == "match"){
                    console.log(data);
                    MatchDetail(data);
                    console.log("data detail match diambil dari caches");
                    resolve(data);
                  }
            });
          }
        });
      }else{

        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(function(response) {
                return response || fetch (event.request);
                resolve(data);
            })
        )

      }

    fetchApi('matches/' + id)
    .then(function(data) {
      if(page == "" || page =="home" || page == "match"){
        MatchDetail(data);
        resolve(data);
      }
    })
    .catch(error);
  });
  
}

//Detail Team
function getTeamDetail(){
    return new Promise(function (resolve, reject) {
      var urlParams = new URLSearchParams(window.location.search);
            var idParam = urlParams.get("id");
      
              if ('caches' in window) {
                  caches.match(base_url + 'teams/' + idParam).then(function(response) {
                    if (response) {
                      response.json().then(function (data) {
                        //console.log(data);
                        teamData(data);
                        console.log("data detail team diambil dari caches");
                      // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                       resolve(data);
                    })
                  }
                })
              }else{
                event.respondWith(
                  caches.match(event.request, { ignoreSearch: true }).then(function(response) {
                      return response || fetch (event.request);
                      resolve(data);
                  })
                )
              }
      
              fetchApi('teams/' + idParam)
                .then(function(data) {
                  teamData(data);
                // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                  resolve(data);
              })
              .catch(error);
        });
}

// Detail Pemain
function detailPlayer(id){
  //open modal
    $('#player').modal('open');

    //ceck data fav-players
    var btn = document.getElementById("fav-btn");
    var isFavorite = false;

    checkData("player", id).then(function (data){
        //console.log(data);
        if (data != undefined) {
              btn.innerHTML = "Remove from favorite <i class='material-icons red-text'>favorite</i>";
              isFavorite = true;
          }else{
              btn.innerHTML = "Add to favorite <i class='material-icons red-text'>favorite_border</i>";
              isFavorite = false;
          };
    });


    return new Promise(function (resolve, reject) {
        if ('caches' in window) {
            caches.match(base_url + 'teams/' + id).then(function(response) {
              if (response){
                response.json().then(function (data) {
                  playerById(data);
                  console.log("data detail player diambil dari caches");
                  resolve(data);
                });
              }
            });
        }else{
          event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(function(response) {
                return response || fetch (event.request);
            })
          )
        }

          fetchApi('players/' + id)
            .then(function(data) {
               playerById(data);
               resolve(data);
            })
            .catch(error);
    });
}

//Data standing
function getStanding(){
    if ('caches' in window) {
    caches.match(base_url + dataStanding).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          if(page == "standing"){
              console.log("data standing diambil dari caches");
              getDataStandings(data);
          }
        });
      }
    });
  }else{
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(function(response) {
            return response || fetch (event.request);
        })
    )
  }

    fetchApi(dataStanding)
      .then(function(data) {
        if(page == "standing"){
            getDataStandings(data);
        }
      })
      .catch(error); 
}

// Favorite page
function favoriteData(type){
    storeDataFav(type).then(function(favData) {
    console.log(favData);
    // Menyusun komponen card
    var jumlah = favData.length;
    var favHTML = "";

    for (var i = 0 ; i < jumlah; i++) {
      if(type == "match"){
        
      }else if(type == "team"){
        favHTML += `
          <div id="team${favData[i].id}">
            <div class="col s12 m6 l6">
              <div class="card">
                <div class="card-image orange darken-1">
                  <img src="${favData[i].crestUrl}" class="team-logo">
                  <a class="btn-floating halfway-fab waves-effect waves-light red" onclick="deleteData('team_favorit', ${favData[i].id}); document.getElementById('team${favData[i].id}').innerHTML = '';"><i class="material-icons">close</i></a>
                </div>
                <div class="card-content">
                  <span class="card-title flow-text center-align orange-text darken-4-text">${favData[i].name}</span>
                  <p class="flow-text center-align orange-text darken-4-text">
                      ${favData[i].founded}<br>
                  </p>
                </div>
                <div class="card-action right-align">
                    <a href="team.html?id=${favData[i].id}"  class="btn orange accent-3">See Detail</a>    
                </div>
              </div>
            </div>
          </div>
        `;
        
      }else{
        
      }
    }
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
      document.getElementById("favoriteResult").innerHTML = favHTML;
  });
}
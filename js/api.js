var base_url = "https://api.football-data.org/v2/";
var dataMatch = "competitions/2014/matches?status=SCHEDULED";
var filterMathes = "competitions/2014/matches?status=";
var dataStanding = "competitions/2014/standings";

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
function dateFormat(tgl){
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

        var tanggal = hari[_hari] +", " + _tanggal + " " + bulan[_bulan] + " " + tahun + " " + jam + ":" + menit + " " + a_p;
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
            console.log("data diambil dari caches");
          }
        });
      }
    });
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
              console.log("data diambil dari caches");
          }
        });
      }
    });
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
  var id = ['finised','live','in_play','paused'];

  for (var i = 0; i < id.length; i++) {
    if( id[i] != filter.toLowerCase()){
      document.getElementById(id[i]).classList.remove("darken-4");
      document.getElementById(id[i]).classList.add("accent-3");
    }
  };
  document.getElementById(filter.toLowerCase()).classList.remove("accent-3");
  document.getElementById(filter.toLowerCase()).classList.add("darken-4");
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
                 document.getElementById("no-data").innerHTML = `
                    <div class="red darken-1 white-text empty center-align">
                      <i class="large material-icons">sentiment_very_dissatisfied</i>
                      <h5 class="center">No Data in ${humanize(filter)} Matches</h5>
                    </div>
                 `;
              }

              Matches(data);
              console.log("Data diambil dari caches");
            }
        });
      }
    });
  }

  //Matches data menurut filter
  fetchApi(filterMathes + filter)
    .then(function(data) {
      console.log(data);
      var matches = data.matches;
      var jumlah = matches.length;
    
      if (page == "match"){
        if (jumlah == 0){
        console.log(jumlah);
           document.getElementById("no-data").innerHTML = `
              <div class="red darken-1 white-text empty center-align">
                <i class="large material-icons">sentiment_very_dissatisfied</i>
                <h5 class="center">No Data in ${humanize(filter)} Matches</h5>
              </div>
           `;
        }
        Matches(data);
      }

    })
    .catch(error);
}

// Detail Match
function detailMatch(id){
  //open modal
  $('#detail-match').modal('open');

  if ('caches' in window) {
        caches.match(base_url + 'matches/' + id).then(function(response) {
          if (response) {
            response.json().then(function (data) {
              if(page == "" || page =="home" || page == "match"){
                MatchDetail(data);
              }
              console.log("data diambil dari caches");
          })
        } else {
              event.respondWith(
                  caches.match(event.request, { ignoreSearch: true }).then(function(response) {
                      return response || fetch (event.request);
            })
          )
        }
      })
  }

    fetchApi('matches/' + id)
    .then(function(data) {
      if(page == "" || page =="home" || page == "match"){
        MatchDetail(data);
      }
    })
    .catch(error);
}

//Detail Team
function getTeamDetail(){
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");

    if ('caches' in window) {
        caches.match(base_url + 'teams/' + idParam).then(function(response) {
          if (response) {
            response.json().then(function (data) {
              teamData(data);
              console.log("data diambil dari caches");
          })
        } else {
              event.respondWith(
                  caches.match(event.request, { ignoreSearch: true }).then(function(response) {
                      return response || fetch (event.request);
            })
          )
        }
      })
    }

  fetchApi('teams/' + idParam)
    .then(function(data) {
      teamData(data);
  });
}

// Detail Pemain
function detailPlayer(id){
  //open modal
    $('#player').modal('open');

    if ('caches' in window) {
        caches.match(base_url + 'teams/' + id).then(function(response) {
          if (response) {
            response.json().then(function (data) {
              teamData(data);
              console.log("data diambil dari caches");
          })
        } else {
              event.respondWith(
                  caches.match(event.request, { ignoreSearch: true }).then(function(response) {
                      return response || fetch (event.request);
            })
          )
        }
      })
    }

    fetchApi('players/' + id)
    .then(function(data) {
       playerById(data);
    })
    .catch(error);
}

//Data standing
function getStanding(){
    if ('caches' in window) {
    caches.match(base_url + dataStanding).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          console.log("data diambil dari caches")
        });
      }
    });
  }

  fetchApi(dataStanding)
    .then(function(data) {
      if(page == "standing"){
        console.log(data);
      }
    })
    .catch(error);
}
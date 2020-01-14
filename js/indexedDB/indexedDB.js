// Membuatan database
    var dbPromised = idb.open("db_fnews", 1, function (upgradeDb) {
            if (!upgradeDb.objectStoreNames.contains("favorite_teams")) {
                var indexTimFav = upgradeDb.createObjectStore("favorite_teams", {
                    keyPath: "id"
                });
                indexTimFav.createIndex("teamName", "name", {
                    unique: false
                });
            }

            if (!upgradeDb.objectStoreNames.contains("favorite_players")) {
                var indexPlayerFav = upgradeDb.createObjectStore("favorite_players", {
                    keyPath: "id"
                });
                indexPlayerFav.createIndex("PlayerName", "name", {
                    unique: false
                });
            }

            if (!upgradeDb.objectStoreNames.contains("favorite_matches")) {
                var indexMatchFav = upgradeDb.createObjectStore("favorite_matches", {
                    keyPath: "id"
                });
                indexMatchFav.createIndex("homeTeam", "match.homeTeam.name", {
                    unique: false
                });
                indexMatchFav.createIndex("awayTeam", "match.awayTeam.name", {
                    unique: false
                });
            }
        });

function saveToFav(type, data){
    var storeName = "";
    var dataAdd = {}
    if (type = "match") {
        storeName = "favorite_matches";
        dataAdd = {
            id: data.match.id,
            head2head: {
                numberOfMatches: data.head2head.numberOfMatches,
                totalGoals: data.head2head.totalGoals,
                homeTeam: {
                    wins: data.head2head.homeTeam.wins,
                    draws: data.head2head.homeTeam.draws,
                    losses: data.head2head.homeTeam.losses
                },
                awayTeam: {
                    wins: data.head2head.awayTeam.wins,
                    draws: data.head2head.awayTeam.draws,
                    losses: data.head2head.awayTeam.losses
                }
            },
            match: {
                utcDate: data.match.utcDate,
                venue: data.match.venue,
                matchday: data.match.matchday,
                homeTeam: {
                    name: data.match.homeTeam.name
                },
                awayTeam: {
                    name: data.match.awayTeam.name
                }
            }
        }
    }else if (type = "team") {
        storeName = "favorite_teams";
        dataToCreate = {
            id: data.id,
            name: data.name,
            shortName: data.shortName,
            tla: data.tla,
            crestUrl: data.crestUrl,
            address: data.address,
            phone: data.phone,
            website: data.website,
            email: data.email,
            founded: data.founded,
            clubColors: data.clubColors,
            venue: data.venue,
            squad: data.squad
        }

    }else{
        storeName = "favorite_players";
        dataAdd = {
            id: data.id,
            name: data.name,
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            counrtyOfBirth: data.counrtyOfBirth,
            nationality: data.nationality,
            position: data.position
        }
    };

  dbPromised
    .then(function(db) {
      var tx = db.transaction(storeName, "readwrite");
      var store = tx.objectStore(storeName);

      console.log(data);
      store.add(dataAdd);
      return tx.complete;
    })
    .then(function() {
      console.log("Data " + type + " berhasil di simpan ke favorite.");
    });
}

function checkData(type, id){
    return new Promise(function (resolve, reject) {
        var storeName = "";
        dbPromised.then(function(db) {
            if (type = "match") {
                storeName = "favorite_matches";
            
            }else if (type = "team") {
               storeName = "favorite_teams";

            }else{
                storeName = "favorite_players";
            }

        var tx = db.transaction( storeName, 'readonly');
        var store = tx.objectStore( storeName );
          // mengambil primary key berdasarkan isbn
          return store.get(id); 
        }).then(function (val) {
            resolve(val);
        });
    });
}

function deleteFav(type, id){
    if (type = "match") {
        storeName = "favorite_matches";
    
    }else if (type = "team") {
       storeName = "favorite_teams";

    }else{
        storeName = "favorite_players";
    }

    dbPromised.then(function(db) {
          var tx = db.transaction(storeName, 'readwrite');
          var store = tx.objectStore(storeName);
          store.delete(id);
          return tx.complete;
        }).then(function() {
          console.log('Item from' + storeName + " with id = " + id + ' is deleted');
        });
}




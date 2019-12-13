function birthDate(date){
  var hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  var bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember"];

  var d = new Date(date);
  var _hari = d.getDay();
  var _tanggal = d.getDate();
  var _bulan = d.getMonth();
  var _tahun = d.getYear();

    var tahun = (_tahun < 1000 ) ? _tahun + 1900 : _tahun;
    var tanggal = hari[_hari] +", " + _tanggal + " " + bulan[_bulan] + " " + tahun
    return tanggal;
}

function teamData(data) {
      var teamHTML = `
        <div class="center-align">
          <img src="${data.crestUrl}" id="logo">
          <h5 class="orange-text darken-4-text">${data.name}</h5>
        </div>
        <hr>
        <table class="striped">
          <tbody>
              <tr>
                 <td width="40%">Name</td>
                 <td>${data.name}</td>
              </tr>
              <tr>
                 <td>Short Name</td>
                 <td>${data.shortName}</td>
              </tr>
              <tr>
                 <td>Founded</td>
                 <td>${data.founded}</td>
              </tr>
              <tr>
                 <td>Address</td>
                 <td>${data.address}</td>
              </tr>
              <tr>
                 <td>Phone</td>
                 <td>${data.phone}</td>
              </tr>
              <tr>
                 <td>E-mail</td>
                 <td>${data.email}</td>
              </tr>
              <tr>
                 <td>Website</td>
                 <td><a href="${data.website}" target="_blank">${data.website}</a></td>
              </tr>
              <tr>
                 <td>Club Color</td>
                 <td>${data.clubColors}</td>
              </tr>
              <tr>
                 <td>Venue</td>
                 <td>${data.venue}</td>
              </tr>
          </tbody>
      </table>
        `;

      var dataSquad = data.squad;
      var squadHTML =``;

          for (var i = 0; i < dataSquad.length; i++) {
              squadHTML += `
                  <tr>
                    <td class="center-align">${dataSquad[i].shirtNumber}</td>
                    <td><a href="#" data-target="player" class="modal-trigger" onclick="detailPlayer(${dataSquad[i].id});">${dataSquad[i].name}</a></td>
                    <td>${dataSquad[i].position}</td>
                  </tr>
              `;
          };
      
      // Sisipkan komponen
      document.getElementById("logo-container").innerHTML = "<h5 class='flow-text'>Detail Team " + data.shortName + "</h5>";
      document.getElementById("detail-team").innerHTML = teamHTML;
      document.getElementById("squad-detail").innerHTML = squadHTML;
}

function playerById(data){
      console.log(data.dateOfBirth);
       document.getElementById("name").innerHTML = data.name;
       document.getElementById("f-name").innerHTML = data.firstName;
       document.getElementById("l-name").innerHTML = data.lastName;
       document.getElementById("country-birth").innerHTML = data.countryOfBirth;
       document.getElementById("date-birth").innerHTML = birthDate(data.dateOfBirth);
       document.getElementById("nationality").innerHTML = data.nationality;
       document.getElementById("position").innerHTML = data.position;
}
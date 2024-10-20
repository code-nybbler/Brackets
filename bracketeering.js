$(document).ready(function() {
    $('#player-dialog').addClass('show');
});

$(document).on('click', '.menu .close-btn', function() {
    $(this).closest('.menu').removeClass('show');
});

$(document).on('click', '#player-dialog .player-submit-btn', async function() {
    let playerName = $('#player-input').val();
    if (playerName !== '') {        
        let gamePlay = {
            "Name": playerName.toString()
        }
        await addPlayer(gamePlay);
        $('#player-dialog').removeClass('show');
        $('#game-container').show();
    }
});

function readScoreboard() {
    $.ajax({
        type: "GET",
        url: "https://prod-56.westus.logic.azure.com:443/workflows/7534300353cb48ad892f6741046aeab8/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=JS-U_mvyGe_-PXwesvCPE7DA0oASww0h6h7D1RXM47Q",
        success: function(data) {
            scoreboard = data;
            populateScoreboard();
        }
    });
}

function addPlayer(player) {
    return new Promise(resolve => {
        let flowURL = 'https://prod-32.westus.logic.azure.com:443/workflows/da2b34cb1d6944e6af68d305a9324a29/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Pm2_jB6ERFmRgrF1J26j97A92pd7HIh63z457AadGFA';
        let req = new XMLHttpRequest();
        req.open("POST", flowURL, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    let result = JSON.parse(this.response);
                    resolve(result);
                }
            }
        };
        req.send(JSON.stringify(player));
    });
}

function showToast(text) {
    $('#toast-msg').text(text).addClass('show');
    setTimeout(function(){ $('#toast-msg').removeClass('show'); }, 3000);
}
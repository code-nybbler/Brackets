let bracket;

$(document).ready(function() {
    $('#player-dialog').addClass('show');
});

$(document).on('click', '.menu .close-btn', function() {
    $(this).closest('.menu').removeClass('show');
});

$(document).on('click', '#player-dialog .player-bracket-btn', function() {    
    submitPlayerForm(1)
});

$(document).on('click', '#player-dialog .player-audience-btn', function() {    
    submitPlayerForm(2)
});

async function submitPlayerForm(playerType) {
    let playerName = $('#player-input').val();
    let code = $('#code-input').val();

    if (playerName !== '' && code !== '') {        
        let player = {
            "Name": playerName.toString(),
            "Code": code.toString(),
            "Type": playerType
        }

        bracket = await addPlayer(player);

        if (bracket !== undefined && bracket !== null) {
            $('#player-dialog').removeClass('show');
            $('#game-container').show();
            
            if (playerType === 1) {
                if (bracket.Status === 122430000) showToast('You\'ve joined the bracket!');
                else showToast('This bracket is already underway! We added you to the audience.');
            } else showToast('You\'ve joined the audience!');

            populateBracket();
        } else showToast('An error has occurred.');
    } else {
        if (code === '') $('#code-input').css('border', '2px solid red');
        if (playerName === '') $('#player-input').css('border', '2px solid red');
    }
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

function populateBracket() {
    for (let p = 0; p < bracket.Players.length; p++) {
        console.log(bracket.Players[p]);
    }
}

function showToast(text) {
    $('#toast-msg').text(text).addClass('show');
    setTimeout(function(){ $('#toast-msg').removeClass('show'); }, 3000);
}
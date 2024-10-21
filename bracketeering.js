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

        let result = await addPlayer(player);

        if (result.error !== undefined) {
            showToast(result.error.message);
        } else {
            bracket = result;

            if (bracket !== undefined && bracket !== null) {
                $('#player-dialog').removeClass('show');
                $('#game-container').show();
                
                if (playerType === 1) {
                    if (bracket.Status === 122430000) showToast('You\'ve joined the bracket!');
                    else showToast('This bracket is already underway! We added you to the audience.');
                } else showToast('You\'ve joined the audience!');

                populateBracket();
            } else showToast('An error has occurred.');
        }
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
                let result = JSON.parse(this.response);
                resolve(result);
            }
        };
        req.send(JSON.stringify(player));
    });
}

function populateBracket() {
    let players = bracket.Players, audience = bracket.Audience;

    $('#bracket').append(`
        <tr>
            <td><span class="player">${players.length > 0 ? players[0].Name : '?'}</span></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td><span class="player">${players.length > 4 ? players[4].Name : '?'}</span></td>
        </tr>                            
        <tr>
            <td class="topNrightLine"></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="topNleftLine"></td>
        </tr>                    
        <tr>
            <td class="bottomNrightLine"><span class="player">${players.length > 1 ? players[1].Name : '?'}</span></td>
            <td class="topNrightLine"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="topNleftLine"></td>
            <td class="bottomNleftLine"><span class="player">${players.length > 5 ? players[5].Name : '?'}</span></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="bottomNleftLine"></td>
            <td class="bottomLine"></td>
            <td class="bottomNrightLine"></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td><span class="player">${players.length > 2 ? players[2].Name : '?'}</span></td>
            <td class="rightLine"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="leftLine"></td>
            <td><span class="player">${players.length > 6 ? players[6].Name : '?'}</span></td>
        </tr>
        <tr>
            <td class="topNrightLine"></td>
            <td class="bottomNrightLine"></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="bottomNleftLine"></td>
            <td class="topNleftLine"></td>
        </tr>
        <tr>
            <td class="bottomNrightLine"><span class="player">${players.length > 3 ? players[3].Name : '?'}</span></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="bottomNleftLine"><span class="player">${players.length > 7 ? players[7].Name : '?'}</span></td>
        </tr>`
    );

    for (let p = 0; p < audience.length; p++) {
        $('#audience').append(`<span class="audience-member">${audience[p].Name}</span>`);
    }
}

function showToast(text) {
    $('#toast-msg').text(text).addClass('show');
    setTimeout(function(){ $('#toast-msg').removeClass('show'); }, 5000);
}
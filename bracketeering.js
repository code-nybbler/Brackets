let bracket, player;

$(document).ready(function() { $('#code-dialog').addClass('show'); });
$(document).on('click', '#code-dialog .code-input-btn', function() { submitCodeForm(); });
$(document).on('click', '#player-dialog .player-bracket-btn', function() { submitPlayerForm(1); });
$(document).on('click', '#player-dialog .player-audience-btn', function() { submitPlayerForm(2); });
$(document).on('click', '#welcome-dialog .welcome-confirm-btn', function() {
    $(this).closest('.menu').removeClass('show');
    setTimeout(function() {
        $('#question-dialog p').text(bracket.Question1);
        $('#question-dialog').addClass('show');
    }, 1000);
});

$(document).on('click', '#code-dialog .create-bracket-btn', async function() {
    let result = await createBracket();
    if (result.error !== undefined) {
        showToast(result.error.message);
    } else {
        bracket = result;
        if (bracket !== undefined && bracket !== null) {
            $('#code-dialog').removeClass('show');
            $('#player-dialog').addClass('show');
            $('.player-audience-btn').remove();
        }
    }
});

$(document).on('click', '#question-dialog .answer-submit-btn', function() {
    let answer = $(this).closest('.menu').find('textarea').val();
    submitAnswerForm(answer);
});

async function submitAnswerForm(answer) {
    if (answer !== '') {
        let result = await submitAnswer(answer);

        if (result.error !== undefined) {
            showToast(result.error.message);
            $('#answer-input').addClass('input-error');
        } else {
            player.Answer1 = answer;
            $('#question-dialog').closest('.menu').removeClass('show');
            populateBracket();
        }
    } else $('#answer-input').addClass('input-error');
}

function submitAnswer(answer) {
    return new Promise(resolve => {
        let flowURL = 'https://prod-57.westus.logic.azure.com:443/workflows/c554fb64e21b43b886f3a4be7421d091/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_Lw4U86l7JdXcmGkbdOBMtjimf6UK8kUV9fUEDsdtrM';
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
        req.send(JSON.stringify({ "Code": bracket.Code.toString(), "Player": player.Name.toString(), "Round": 1, "Answer": answer.toString() }));
    });
}

async function submitCodeForm() {
    let code = $('#code-input').val();
    $('#code-input').removeClass('input-error');

    if (code !== '') {
        let result = await getBracket(code);

        if (result.error !== undefined) {
            showToast(result.error.message);
            $('#code-input').addClass('input-error');
        } else {
            bracket = result;
            if (bracket !== undefined && bracket !== null) {
                $('#code-dialog').removeClass('show');

                if (bracket.Status !== 122430000) { // Bracket is in progress
                    $('.player-bracket-btn').remove();
                }
                $('#player-dialog').addClass('show');
            } else showToast('An error has occurred.');
        }
    } else $('#code-input').addClass('input-error');
}

function createBracket() {
    return new Promise(resolve => {
        let flowURL = 'https://prod-57.westus.logic.azure.com:443/workflows/096f2b8043a8450aab692962605201bd/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hGCwqrjBDnd9CFI093YVqbukFWQM5yUfIF2cZBJ_7g0';
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
        req.send();
    });
}

function getBracket(code) {
    return new Promise(resolve => {
        let flowURL = 'https://prod-143.westus.logic.azure.com:443/workflows/8691dd8648704bf5bfdc55ba889242ee/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ZWUQDgXwALHY0_euftQqs1IxKtDSvRJRwM609PxgsAE';
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
        req.send(JSON.stringify({ "Code": code }));
    });
}

async function submitPlayerForm(playerType) {
    let playerName = $('#player-input').val();
    $('#player-input').removeClass('input-error');

    if (playerName !== '') {
        player = {
            "Name": playerName.toString().toUpperCase(),
            "Code": bracket.Code.toString().toUpperCase(),
            "Type": playerType
        }

        let result = await addPlayer(player);

        if (result.error !== undefined) {
            showToast(result.error.message);
            $('#player-input').addClass('input-error');
        } else {
            $('#player-dialog').removeClass('show');

            if (playerType === 1) {
                bracket.Players.push(player);
                showToast('You\'ve joined the bracket!');
                $('#welcome-dialog').addClass('show');
            } else {
                bracket.Audience.push(player);
                showToast('You\'ve joined the audience!');
                populateBracket();
            }
        }
    } else $('#player-input').addClass('input-error');
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

    $('#bracket-code').html(`<span style="font-size: 16px;">Bracket Code</span><br>`+bracket.Code);
    $('#prompt p').text(bracket.Question1);
    
    for (let p = 0; p < players.length; p++) {
        let playerBlurb = '';
        switch(bracket.Status) {
            case 122430000: playerBlurb = players[p].Name; break;
            case 122430001: playerBlurb = players[p].Answer1 !== null ? players[p].Answer1 : '?'; break;
            case 122430002: playerBlurb = players[p].Answer2 !== null ? players[p].Answer2 : '?'; break;
            case 122430003: playerBlurb = players[p].Answer3 !== null ? players[p].Answer3 : '?'; break;
            default: break;
        }
        $(`#p${p+1}`).append(`<span class="player">${playerBlurb}</span>`);
    }

    $('#audience-container').text('Audience').append('<div id="audience"></div>');
    for (let p = 0; p < audience.length; p++) {
        $('#audience').append(`<span class="audience-member">${audience[p].Name}</span>`);
    }

    $('#game-container').show();
}

function showToast(text) {
    $('#toast-msg').text(text).addClass('show');
    setTimeout(function(){ $('#toast-msg').removeClass('show'); }, 5000);
}
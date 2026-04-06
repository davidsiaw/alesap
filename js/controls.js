/*
 * +------------------------------------------------------------
 * | controls.js
 * +------------------------------------------------------------
 * | functions that run when user interacts with the UI
 * +------------------------------------------------------------
 */

// handles adding songs to the queue
function queue_song(song_code)
{
    if (session_is_active()) {
        $.ajax({
            type: "POST",
            url: API_URL + "/api/v1/command/queue/",
            data: JSON.stringify({
                akey: sessionStorage.getItem('akey'),
                skey: sessionStorage.getItem('skey'),
                scd: sessionStorage.getItem('scd'),
                ecd: song_code 
            }),
            contentType: "application/json; charset=utf-8"
        }).then(function(data) {
            $('#song_modal').modal('hide');
            Toastify({
                text: "Sent to queue",
                duration: 3000,
                position: "center"
            }).showToast();
            // add successfully queued song to song history
            var song_cache = JSON.parse(localStorage.getItem('song_cache'));
            var song_history = JSON.parse(localStorage.getItem('song_history')) ?? [];
            song_history.push(song_cache[song_code]);
            if (song_history.length > HISTORY_MAX_LENGTH) {
                song_history.shift();
            }
            localStorage.setItem('song_history', JSON.stringify(song_history));
        })
    } else {
        $('#song_modal').modal('hide');
        err_not_connected();
    }
}

// queues a random song from the song history
function queue_random() {
    const song_history = JSON.parse(localStorage.getItem('song_history'));
    queue_song(song_history[Math.floor(Math.random() * song_history.length)]['code']);
}

// handles stopping the current song in the queue
function stop_song()
{
    if (session_is_active()) {
        $.ajax({
            type: "POST",
            url: API_URL + "/api/v1/command/stop/",
            data: JSON.stringify({
                akey: sessionStorage.getItem('akey'),
                skey: sessionStorage.getItem('skey'),
                scd: sessionStorage.getItem('scd'),
            }),
            contentType: "application/json; charset=utf-8"
        }).then(function(data) {
            Toastify({
                text: "Sent stop request",
                duration: 3000,
                position: "center"
            }).showToast();
        })
    } else {
        err_not_connected();
    }
}

// enable/disable debugging mode
function toggle_debug()
{
    if (sessionStorage.getItem('debug_mode') == null) {
        sessionStorage.setItem('debug_mode', true);
        $('#debug-widget').css("display", "block");
        $('#debug-div').css("display", "block");
        $('#debug-widget').css("display", "block");
        $('#session-storage').text(JSON.stringify(sessionStorage, null, 2));
        $('#local-storage').text(parse_local_storage());
        $('#device-info').text(parse_device_info());
    } else {
        sessionStorage.removeItem('debug_mode');
        $('#debug-widget').css("display", "none");
        $('#debug-div').css("display", "none");
    }
}

// formats localStorage data
function parse_local_storage() {
    var local_storage = {};
    Object.keys(localStorage).forEach(key => {
        const value = localStorage.getItem(key);
        try {
            local_storage[key] = JSON.parse(value);
        } catch (e) {
            local_storage[key] = value;
        }
    });
    return JSON.stringify(local_storage, null, 2);
}

// formats device info
function parse_device_info() {
    const device_info = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        pixelRatio: window.devicePixelRatio,
        platform: navigator.platform,
        onLine: navigator.onLine,
        cookieEnabled: navigator.cookieEnabled,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory
    };
    return JSON.stringify(device_info, null, 2);
}

// error function when session not active
// pulled out for extensibility
function err_not_connected() {
    Toastify({
        text: "Not connected",
        duration: 3000,
        position: "center",
        style: {
            background: "#ed5565",
        }
    }).showToast();
}

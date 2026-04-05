// just a cache of songs keyed by their song code (1234A56)
// with all the relevant info
var song_cache = {}

// loads elements on page start
function startup()
{
    $(window).keydown(function(event) {
        if(event.keyCode == 13) {
            start_search()
            event.preventDefault();
            return false;
        }
    });

    $("#textfield0").on("change", "", function() {
        start_search()
    });

    if (session_is_active()) {
        update_status("connected");
    }
}

// handles search functionality and displaying results
function start_search()
{
    var search_string = $("#textfield0").val();

    $.ajax({
        type: "POST",
        url: API_URL + "/api/v1/command/search/",
        data: JSON.stringify({
            str: search_string
        }),
        contentType: "application/json; charset=utf-8"

    }).then(function(data) {
        $("#dyn_table0_body").empty();
        append_table(data.results[0]);
    })
}

// helper function to display search results
function append_table(data)
{
    for (var index in data) {
        // add song to cache
        song_cache[data[index]['code']] = data[index];

        var song_code = data[index]['code'];
        var song = song_cache[song_code]['song'];
        if (song_cache[song_code]['extra']['content_type'] != null) {
            if(!song.toLowerCase().includes(song_cache[song_code]['extra']['content_type'].toLowerCase())) {
                song += "【"
                song += song_cache[song_code]['extra']['content_type'];
                song += "】"
            }
        }
        var artist = song_cache[song_code]['artist'];

        var row = $('<tr onclick="fill_song_modal(this)">');
        row.append( $(`<td id=song-${index}>`).text(song).data("object", data[index]) );
        row.append( $(`<td id=artist-${index}>`).text(artist).data("object", data[index]) );
        row.append( $(`<td id=code-${index}>`).text(song_code).data("object", data[index]) );
        $("#dyn_table0_body").append(row);
    }
}

// handles clicking items in the search results
function fill_song_modal(song)
{
    $("#song_modal").modal("show");
    // extract song code from DOM based on selection
    var song_code = $(song).children("td")[2].innerText;

    $('#song-modal').text(song_cache[song_code]['song']);
    $('#artist-modal').text(song_cache[song_code]['artist']);
    $('#code-modal').text(song_cache[song_code]['code']);
    $('#extra-modal').text(JSON.stringify(song_cache[song_code]));
}

// handles adding songs to the queue
function queue_song(song, artist, code)
{
    if (session_is_active()) {
        $.ajax({
            type: "POST",
            url: API_URL + "/api/v1/command/queue/",
            data: JSON.stringify({
                akey: sessionStorage.getItem('akey'),
                skey: sessionStorage.getItem('skey'),
                scd: sessionStorage.getItem('scd'),
                ecd: code
            }),
            contentType: "application/json; charset=utf-8"
        }).then(function(data) {
            $('#song_modal').modal('hide');
            Toastify({
                text: `Queued ${artist}: ${song}`,
                duration: 3000,
                position: "center"
            }).showToast();
        })
    } else {
        $('#song_modal').modal('hide');
        Toastify({
            text: `Not connected`,
            duration: 3000,
            position: "center",
            style: {
                background: "#ed5565",
            }
        }).showToast();
    }
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
                text: `Sent stop request`,
                duration: 3000,
                position: "center"
            }).showToast();
        })
    } else {
        $('#song_modal').modal('hide');
        Toastify({
            text: `Not connected`,
            duration: 3000,
            position: "center",
            style: {
                background: "#ed5565",
            }
        }).showToast();
    }
}

function toggle_debug()
{
    if (sessionStorage.getItem('debug_mode') == null) {
        sessionStorage.setItem('debug_mode', true);
        Toastify({
            text: `Debug Mode Enabled`,
            duration: 3000,
            position: "center",
        }).showToast();
    } else {
        sessionStorage.removeItem('debug_mode');
        Toastify({
            text: `Debug Mode Disabled`,
            duration: 3000,
            position: "center",
        }).showToast();
    }
}

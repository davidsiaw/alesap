/*
 * +------------------------------------------------------------
 * | utils.js
 * +------------------------------------------------------------
 * | shared constants, error handlers, and debug formatting
 * | utilities used across multiple modules
 * +------------------------------------------------------------
 */

// initialize globals
const HISTORY_MAX_LENGTH = 20;

// appends extra content type info to a song title if not already present
function normalize_song(song_code) {
    const song_cache = JSON.parse(localStorage.getItem("song_cache"));
    let song = song_cache[song_code]["song"];
    if (
        // check for extra info
        song_cache[song_code]["extra"]["content_type"] != null &&
        // ignore if extra info already included in title
        !song.toLowerCase().includes(song_cache[song_code]["extra"]["content_type"].toLowerCase())
    ) {
        // append extra info to title
        song += `【${song_cache[song_code]["extra"]["content_type"]}】`;
    }
    return song;
}

// builds the list of modal body elements for a given song
// TODO: hashify
function build_song_modal_data(song_code) {
    const song_cache = JSON.parse(localStorage.getItem("song_cache")) ?? {};
    const modal_data = [];
    modal_data.push($("<h4>").text("Title:"));
    modal_data.push($("<p>").text($("#song-modal-title").text()));
    modal_data.push($("<h4>").text("Artist:"));
    modal_data.push($("<p>").text(song_cache[song_code]["artist"]));
    if (song_cache[song_code]["extra"]["genre_name"]) {
        modal_data.push($("<h4>").text("Genre:"));
        modal_data.push($("<p>").text(song_cache[song_code]["extra"]["genre_name"]));
    }
    const info = song_cache[song_code]["extra"]["information"] ??
        song_cache[song_code]["extra"]["program_name"] ??
        song_cache[song_code]["extra"]["tie_up"] ??
        null;
    if (info) {
        modal_data.push($("<h4>").text("Info:"));
        modal_data.push($("<p>").text(info));
    }
    if (song_cache[song_code]["extra"]["introcha"]) {
        modal_data.push($("<h4>").text("Lyrics:"));
        modal_data.push($("<p>").text(`${song_cache[song_code]["extra"]["introcha"]}…`));
    }
    modal_data.push($("<h4>").text("Code:"));
    modal_data.push($("<p>").attr("id", "current-song-code").text(song_code));
    if (sessionStorage.getItem("debug_mode")) {
        modal_data.push($("<hr>"));
        modal_data.push($("<h4>").text("Debugging info:"));
        modal_data.push($("<pre>").text(JSON.stringify(song_cache[song_code], null, 2)));
    }
    return modal_data;
}

// formats localStorage data as a pretty-printed JSON string
function parse_local_storage() {
    const local_storage = {};
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

// formats device and browser info as a pretty-printed JSON string
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

var akey
var skey
var scd

function onScanSuccess(qr_value) {
    [akey, skey, scd] = qr_value.split('/')[2].split(',')
    alert("akey: " + akey + "\nskey: " + skey + "\nscd: " + scd)
    $('#scan_qr').modal('hide');
}

function scan_qr()
{
    let htmlscanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbos: 250 }
    );
    htmlscanner.render(onScanSuccess);
}

function start_search()
{
    var search_string = $("#textfield0").val();

    console.log(search_string)

    $.ajax({
        type: "POST",
        url: "http://192.168.1.15:3000/api/v1/command/search/",
        data: JSON.stringify({
            str: search_string
        }),
        contentType: "application/json; charset=utf-8"

    }).then(function(data) {
        console.log(data.results);
        clear();
        append_table(data.results[0]);
    })
}


function get_form0_object()
{
    var object = {}
    object["search"] = $('#textfield0').val();

    return object;
}

function clear()
{
    var body = $("#dyn_table0_body");
    body.empty();
}

function append_table(data)
{
    var query_object = {};

    var data_object = {};
    if (data !== null && typeof data === 'object')
    {
        data_object = data;
    }
    else
    {
        data_object = data;
    }

    var body = $("#dyn_table0_body")

    var columns = getcolumns();

    var row = $('<tr>');


    for (var index in data_object)
    {
        var row = $('<tr>');
        for (var columnIndex = 0; columnIndex < Object.keys(columns).length; columnIndex++)
        {
            var cell_data = data_object[index][ Object.keys(columns)[columnIndex] ];


            row.append($('<td>').text( cell_data ).data("object", data_object[index]) );
        }
        console.log(row)
        body.append(row);
    }
}

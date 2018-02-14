$(document).on('change asColorPicker::close', '#MB-settings-page :input', function(e) {
    var input = $(this);
    switch ($(this).attr('type')) {
        case 'switch':
        case 'checkbox':
            var value = $(this).prop("checked") ? true : false;
            break;
        default:
            var value = $(this).val();
    }
        var post = {
        api:'api/?v1/update/config',
        name:$(this).attr("name"),
        type:$(this).attr("data-type"),
        value:value,
        messageTitle:'',
        messageBody:'Updated Value for '+$(this).parent().parent().find('label').text(),
        error:'Organizr Function: API Connection Failed'
    };
        var callbacks = $.Callbacks();
    //callbacks.add( buildCustomizeAppearance );
    settingsAPI(post,callbacks);
    //disable button then renable
    $('#MB-settings-page :input').prop('disabled', 'true');
    setTimeout(
        function(){
            $('#MB-settings-page :input').prop('disabled', null);
            input.emulateTab();
        },
        2000
    );
});

$(document).on('click', '#MB-settings-button', function() {
    var post = {
        plugin:'MB/settings/get', // used for switch case in your API call
    };
    ajaxloader(".content-wrap","in");
    organizrAPI('POST','api/?v1/plugin',post).success(function(data) {
        var response = JSON.parse(data);
        $('#MB-settings-items').html(buildFormGroup(response.data));
    }).fail(function(xhr) {
        console.error("Organizr Function: API Connection Failed");
    });
    ajaxloader();
});

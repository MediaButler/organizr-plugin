$(document).on('click', '#MB-settings-button', function() {
    var post = {
        plugin:'MB/settings/get',
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
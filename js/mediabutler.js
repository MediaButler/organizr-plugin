var initialData = false;
const toTitleCase = (phrase) => { return phrase.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); };
$(document).on('click', '#MB-settings-button', function () {
    var post = {
        plugin: 'MB/settings/get',
    };
    ajaxloader(".content-wrap", "in");
    organizrAPI('POST', 'api/?v1/plugin', post).success(function (data) {
        var response = JSON.parse(data);
        initialData = response.data;
        $('#MB-settings-items').html(buildFormGroup(initialData));
        $('.MB-TEST-CONN').click(function () {
            message('MediaButler', ' Grabbing Settings', activeInfo.settings.notifications.position, '#FFF', 'info', '2000');
            var url = $("[name=MB-API-URL]").val();
            var token = $("[name=MB-API-TOKEN]").val();
            if (url == undefined && token == undefined) return;
            var newData = [];
            var pluginNames = [];
            var schema = {};
            mediaAPI('g', url + '/version', token).success(function (data) {
                $.each(data['plugins'], function (i, v) {
                    var pluginArray = [];
                    mediaAPI('g', url + '/configure/' + v, token).success(function (config) {
                        const name = v;
                        if (config['schema'].length !== 0) {
                            // log schema here
                            schema[name] = config['schema'];
                            $.each(config['schema'], function (i, v) {
                                var endType = '';
                                switch (v.type) {
                                    case 'url':
                                        endType = 'input';
                                        break;
                                    case 'secure-string':
                                        endType = 'password-alt';
                                        break;
                                    case 'string':
                                        endType = 'input';
                                        break;
                                    default:
                                        break;
                                }
                                if (endType) {
                                    var valueToPush = {
                                        "type": endType,
                                        "name": 'MB-TEMP-' + name + '-' + v.name,
                                        "value": eval(`config.settings.${v.name}`),
                                        "label": toTitleCase(v.name)
                                    };
                                    pluginArray.push(valueToPush);
                                } else {
                                    console.log(`no end type found for ${v.name} - should have found ${v.type}`);
                                    console.log(v);
                                }
                            });
                            var testButton = {
                                'type': 'button',
                                'class': `MB-TEMP-${name}-TESTBUTTON`,
                                'text': 'Test Connection',
                                'label': 'Test Connection',
                                'icon': 'fa fa-check',
                            };
                            var saveButton = {
                                'type': 'button',
                                'class': `MB-TEMP-${name}-SAVEBUTTON`,
                                'text': 'Save Settings',
                                'label': 'Save Settings',
                                'icon': 'fa fa-save',
                            };
                            pluginArray.push(testButton);
                            pluginArray.push(saveButton);
                            pluginNames.push(name);
                            initialData[toTitleCase(v)] = pluginArray;
                        }
                    }).fail(function (xhr) {
                        console.error("MB Function: API Connection Failed");
                    });
                });
                $('#MB-settings-items').html(buildFormGroup(initialData));
                $.each(pluginNames, function (i, v) {
                    const name = v;
                    $('.MB-TEMP-' + v + '-TESTBUTTON').click(function () {
                        const data = {};
                        $.each(schema[name], function (i, v2) {
                            data[v2.name] = $("[name='MB-TEMP-" + name + "-" + v2.name + "']").val();
                        });
                        mediaAPI('put', url + '/configure/' + name, token, data).success(function (data) {
                            if (data.message == 'success') message('MediaButler', `Settings for ${toTitleCase(name)} PASSED`, activeInfo.settings.notifications.position, '#FFF', 'info', '5000');
                            else console.log(data);
                        }).fail(function(d) {
                            console.log(d)
                            if (d.response == 'Unauthorized') message('MediaButler', `ERRPR: Unauthorized`, activeInfo.settings.notifications.position, '#FFF', 'error', '5000');
                            else message('MediaButler', d.responseJSON.message, activeInfo.settings.notifications.position, '#FFF', 'error', '5000');
                        });
                    });
                    $(document).on('click', '.MB-TEMP-' + v + '-SAVEBUTTON', function () {
                        const data = {};
                        $.each(schema[name], function (i, v2) {
                            data[v2.name] = $("[name='MB-TEMP-" + name + "-" + v2.name + "']").val();
                        });
                        mediaAPI('p', url + '/configure/' + name, token, data).success(function (data) {
                            if (data.message == 'success') message('MediaButler', `Settings for ${toTitleCase(name)} SAVED`, activeInfo.settings.notifications.position, '#FFF', 'success', '5000');
                            else console.log(data);
                        }).fail(function(d) {
                            if (d.response == 'Unauthorized') message('MediaButler', `ERRPR: Unauthorized`, activeInfo.settings.notifications.position, '#FFF', 'error', '5000');
                            else message('MediaButler', d.responseJSON.message, activeInfo.settings.notifications.position, '#FFF', 'error', '5000');
                        });
                    });
                });
            });
        });
    }).fail(function (xhr) {
        console.error("Organizr Function: API Connection Failed");
    });
    ajaxloader();
});

function mediaAPI(type, path, token, data = null) {
    console.log('MB API: Calling API: ' + path);
    switch (type) {
        case 'get':
        case 'GET':
        case 'g':
            return $.ajax({
                url: path,
                method: "GET",
                async: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Bearer " + token);
                },
                timeout: 10000,
            });
            break;
        case 'post':
        case 'POST':
        case 'p':
            return $.ajax({
                url: path,
                method: "POST",
                async: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Bearer " + token);
                },
                data
            });
        case 'put':
        case 'PUT':
            return $.ajax({
                url: path,
                method: "PUT",
                async: false,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Bearer " + token);
                },
                data
            });
        default:
            console.warn('MB API: Method Not Supported');
    }
}
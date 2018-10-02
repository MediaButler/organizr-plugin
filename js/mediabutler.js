const toTitleCase = (phrase) => { return phrase.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); };

$(document).on('click', '#MB-settings-button', () => {
    const post = { plugin: 'MB/settings/get' };
    ajaxloader(".content-wrap", "in");
    organizrAPI('POST', 'api/?v1/plugin', post).success((data) => {
        const response = JSON.parse(data);
        let initialData = response.data;
        $('#MB-settings-items').html(buildFormGroup(initialData));
        $('.MB-TEST-CONN').click(() => {
            message('MediaButler', ' Grabbing Settings', activeInfo.settings.notifications.position, '#FFF', 'info', '2000');
            const url = $('[name=MB-API-URL]').val();
            const token = local('g', 'MB-TOKEN');
            if (url == undefined && token == null) return;
            const pluginNames = [];
            const schema = {};
            mediaAPI('g', `${url}/version`, token, null, false).success((data) => {
                local('s', 'MB-URL', url);
                MBload();
                $.each(data['plugins'], (i, v) => {
                    const pluginArray = [];
                    mediaAPI('g', `${url}/configure/${v}`, token, null, false).success((config) => {
                        const name = v;
                        if (config['schema'].length !== 0) {
                            schema[name] = config['schema'];
                            $.each(config['schema'], (i, v) => {
                                let endType = '';
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
                                    const valueToPush = {
                                        "type": endType,
                                        "name": `MB-TEMP-${name}-${v.name}`,
                                        "value": eval(`config.settings.${v.name}`),
                                        "label": toTitleCase(v.name)
                                    };
                                    pluginArray.push(valueToPush);
                                } else {
                                    console.log(`no end type found for ${v.name} - should have found ${v.type}`);
                                    console.log(v);
                                }
                            });
                            const testButton = {
                                'type': 'button',
                                'class': `MB-TEMP-${name}-TESTBUTTON`,
                                'text': 'Test Connection',
                                'label': 'Test Connection',
                                'icon': 'fa fa-check',
                            };
                            const saveButton = {
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
                    }).fail((xhr) => {
                        console.error("MB Function: API Connection Failed");
                    });
                });
                $('#MB-settings-items').html(buildFormGroup(initialData));
                $.each(pluginNames, (i, v) => {
                    const name = v;
                    $(`.MB-TEMP-${v}-TESTBUTTON`).click(() => {
                        const data = {};
                        $.each(schema[name], (i, v2) => {
                            data[v2.name] = $(`[name='MB-TEMP-${name}-${v2.name}']`).val();
                        });
                        mediaAPI('put', `${url}/configure/${name}`, token, data).success((data) => {
                            if (data.message == 'success') message('MediaButler', `Settings for ${toTitleCase(name)} PASSED`, activeInfo.settings.notifications.position, '#FFF', 'info', '5000');
                            else console.log(data);
                        }).fail((d) => {
                            console.log(d)
                            if (d.response == 'Unauthorized') message('MediaButler', `ERROR: Unauthorized`, activeInfo.settings.notifications.position, '#FFF', 'error', '5000');
                            else message('MediaButler', d.responseJSON.message, activeInfo.settings.notifications.position, '#FFF', 'error', '5000');
                        });
                    });
                    $(document).on('click', `.MB-TEMP-${v}-SAVEBUTTON`, () => {
                        const data = {};
                        $.each(schema[name], (i, v2) => {
                            data[v2.name] = $(`[name='MB-TEMP-${name}-${v2.name}']`).val();
                        });
                        mediaAPI('p', `${url}/configure/${name}`, token, data).success((data) => {
                            if (data.message == 'success') message('MediaButler', `Settings for ${toTitleCase(name)} SAVED`, activeInfo.settings.notifications.position, '#FFF', 'success', '5000');
                            else console.log(data);
                        }).fail((d) => {
                            if (d.response == 'Unauthorized') message('MediaButler', `ERRPR: Unauthorized`, activeInfo.settings.notifications.position, '#FFF', 'error', '5000');
                            else message('MediaButler', d.responseJSON.message, activeInfo.settings.notifications.position, '#FFF', 'error', '5000');
                        });
                    });
                });
            });
        });
    }).fail((xhr) => { console.error('Organizr Function: API Connection Failed'); });
    ajaxloader();
});

const manageRequestLaunch = () => {
    if (typeof activeInfo == 'undefined') setTimeout(() => { manageRequestLaunch(); }, 1000);
    else {
        let menuList = '';
        let htmlDOM = `
        <div id="MB-requests-area" class="white-popup mfp-with-anim mfp-hide">
                <div class="col-md-10 col-md-offset-1">
                        <div class="request-div"></div>
                </div>
        </div>
        `;
        if (activeInfo.plugins['MB-enabled'] == true) {
            if (activeInfo.user.loggedin === true && activeInfo.user.groupID <= 1) {
                menuList = `<li><a class="inline-popups MB-manageRequestsModal" href="#MB-requests-area" data-effect="mfp-zoom-out"><i class="fa fa-search fa-fw"></i> <span lang="en">Manage Requests</span></a></li>`;
                htmlDOM += `
                <div id="MB-approver-area" class="white-popup mfp-with-anim mfp-hide">
                    <div class="col-md-10 col-md-offset-1">
                        <div class="col-md-12">
                            <div class="panel panel-info m-b-0">
                                <div class="panel-heading" lang="en">Add Approver</div>
                                <div class="panel-wrapper collapse in" aria-expanded="true">
                                    <div class="panel-body">
                                        <form id="MB-addapprover-form">
                                            <fieldset style="border:0;">
                                            <div class="form-group">
                                                <label class="control-label" for="MB-addapprover-form-inputUsername" lang="en">Name or Username</label>
                                                <input type="text" class="form-control" id="MB-addapprover-form-inputUsername" name="username" required="" autofocus="">
                                            </div>
                                            <div class="form-group">
                                                <label class="control-label" for="MB-addapprover-form-inputEmail" lang="en">Email</label>
                                                <input type="text" class="form-control" id="MB-addapprover-form-inputEmail" name="email" required="" autofocus="">
                                            </div>
                                            </fieldset>
                                            <button class="btn btn-sm btn-info btn-rounded waves-effect waves-light pull-right row b-none" onclick="addApprover();" type="button"><span class="btn-label"><i class="fa fa-plus"></i>$
                                            <div class="clearfix"></div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>`;
            }
            $('.append-menu').after(menuList);
            $('.organizr-area').after(htmlDOM);
            pageLoad();
        }
    }
}
manageRequestLaunch();

$(document).on('click', '.MB-manageRequestsModal', () => {
    if (activeInfo.user.loggedin === true && activeInfo.user.groupID <= 1) {
        const token = local('g', 'MB-TOKEN');
        const url = local('g', 'MB-URL');
        mediaAPI('g', `${url}/requests`, token).success((res) => {
            const t = `
            <div class="col-md-12">
                <div class="panel bg-org panel-info">
                    <div class="panel-heading">
                        <span lang="en">Manage Requests</span>
                        <button type="button" class="btn btn-info btn-circle pull-right popup-with-form" href="#new-request-area" data-effect="mfp-3d-unfold"><i class="fa fa-plus"></i> </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover manage-u-table">
                            <thead>
                                <tr>
                                    <th lang="en">IMG</th>
                                    <th lang="en">TITLE</th>
                                    <th lang="en">TYPE</th>
                                    <th lang="en">STATUS</th>
                                    <th lang="en">REQUESTER</th>
                                    <th lang="en">DATE ADDED</th>
                                    <th lang="en"></th>
                                    <th lang="en">APPROVE</th>
                                    <th lang="en">DECLINE</th>
                                </tr>
                            </thead>
                            <tbody id="manageRequestTable"></tbody>
                        </table>
                    </div>
                </div>
            </div>`
            $('.request-div').html(t);

            $.each(res, (i, v) => {
                if (v.type == 'tv') mediaAPI('g', `${url}/tv/series/${v.tvdbId}/images`, token).success((data) => {
                    let h = `<tr>
                    <td><img src="http://thetvdb.com/banners/${data[0].thumbnail}" height="100" /></td>
                    <td>${v.title}</td>
                    <td>${toTitleCase(v.type)}</td>
                    <td>${requestStatus(v.status)}</td>
                    <td>${v.username}</td>
                    <td>${new Date(v.dateAdded).toLocaleDateString()}</td>
                    <td></td>`
                    if (v.status < 1) {
                        h += `<td><button type="button" class="btn btn-success btn-outline btn-circle btn-lg m-r-5" onClick="MBapproveRequest('${v._id}');"><i class="fa fa-check"></i></button></td>
                    <td><button type="button" class="btn btn-danger btn-outline btn-circle btn-lg m-r-5" onClick="MBdeclineRequest('${v._id}');"><i class="fa fa-times"></i></button></td>`
                    } else {
                        h += `<td></td><td></td>`;
                    }
                    h += `</tr>`
                    $('#manageRequestTable').append(h);
                });
                if (v.type == 'movie') mediaAPI('g', `${url}/movie/${v.imdbId}`, token).success((data) => {
                    let h = `<tr>
                    <td><img src="${data.poster}" height="100" /></td>
                    <td>${v.title}</td>
                    <td>${toTitleCase(v.type)}</td>
                    <td>${requestStatus(v.status)}</td>
                    <td>${v.username}</td>
                    <td>${new Date(v.dateAdded).toLocaleDateString()}</td>
                    <td></td>`
                    if (v.status < 1) {
                        h += `<td><button type="button" class="btn btn-success btn-outline btn-circle btn-lg m-r-5" onClick="MBapproveRequest('${v._id}');"><i class="fa fa-check"></i></button></td>
                        <td><button type="button" class="btn btn-danger btn-outline btn-circle btn-lg m-r-5" onClick="MBdeclineRequest('${v._id}');"><i class="fa fa-times"></i></button></td>`;
                    } else {
                        h += `<td></td><td></td>`;
                    }
                    h += `</tr>`;
                    $('#manageRequestTable').append(h);
                });
            });
        });
    }
});

const MBapproveRequest = (id) => {
    const token = local('g', 'MB-TOKEN');
    const url = local('g', 'MB-URL');
    mediaAPI('p', `${url}/requests/approve/${id}`, token, { hello: 'hello' }).success((data) => {
        message('MediaButler', `Successfully Approved Request for ${data.title}`, activeInfo.settings.notifications.position, '#FFF', 'success', '5000');
        $('.mfp-close').click();
        setTimeout(() => { $('.MB-manageRequestsModal').click(); }, 500);
    }).fail((err) => {
        console.log(err);
        message('MediaButler', `ERROR: Unable to Approve Request`, activeInfo.settings.notifications.position, '#FFF', 'error', '5000');
    });
}

const MBdeclineRequest = (id) => {
    const token = local('g', 'MB-TOKEN');
    const url = local('g', 'MB-URL');
    mediaAPI('delete', `${url}/requests/${id}`, token).success((data) => {
        message('MediaButler', `Successfully Deleted Request`, activeInfo.settings.notifications.position, '#FFF', 'success', '5000');
        $('.mfp-close').click();
        setTimeout(() => { $('.MB-manageRequestsModal').click(); }, 500);
    }).fail((err) => {
        console.log(err);
        message('MediaButler', `ERROR: Unable to Delete Request`, activeInfo.settings.notifications.position, '#FFF', 'error', '5000');
    });
}

const requestStatus = (status) => {
    switch (status) {
        case 0:
            return 'Pending Approval';
        case 1:
            return 'Adding to Media Manager';
        case 2:
            return 'Partially filled';
        case 3:
            return 'Filled';
        default:
            return 'Unknown';
    }
}

const mediaAuthAPI = (data) => {
    console.log('Authenticating to MediaButler');
    return $.ajax({
        url: 'https://auth.mediabutler.io/login',
        method: "POST",
        async: true,
        beforeSend: (req) => {
            req.setRequestHeader('MB-Client-Identifier', '353aa454-4d6f-4275-9a4f-c29a3e34966a');
        },
        data
    });
}

const mediaAPI = (type, path, token, data = null, runasync = true) => {
    console.log(`MB API: ${path}`);
    switch (type) {
        case 'get':
        case 'GET':
        case 'g':
            return $.ajax({
                url: path,
                method: 'GET',
                async: runasync,
                beforeSend: (req) => {
                    req.setRequestHeader('Authorization', `Bearer ${token}`);
                    req.setRequestHeader('MB-Client-Identifier', '353aa454-4d6f-4275-9a4f-c29a3e34966a');
                },
                timeout: 10000,
            });
        case 'post':
        case 'POST':
        case 'p':
            return $.ajax({
                url: path,
                method: 'POST',
                async: runasync,
                beforeSend: (req) => {
                    req.setRequestHeader('Authorization', `Bearer ${token}`);
                    req.setRequestHeader('MB-Client-Identifier', '353aa454-4d6f-4275-9a4f-c29a3e34966a');
                },
                data
            });
        case 'put':
        case 'PUT':
            return $.ajax({
                url: path,
                method: 'PUT',
                async: runasync,
                beforeSend: (req) => {
                    req.setRequestHeader('Authorization', `Bearer ${token}`);
                    req.setRequestHeader('MB-Client-Identifier', '353aa454-4d6f-4275-9a4f-c29a3e34966a');
                },
                data
            });
        case 'delete':
        case 'DELETE':
        case 'd':
            return $.ajax({
                url: path,
                method: 'DELETE',
                async: runasync,
                beforeSend: (req) => {
                    req.setRequestHeader('Authorization', `Bearer ${token}`);
                    req.setRequestHeader('MB-Client-Identifier', '353aa454-4d6f-4275-9a4f-c29a3e34966a');
                },
                timeout: 10000,
            });
        default:
            console.warn('MB API: Method Not Supported');
    }
}

const originalLogout = logout;
logout = () => {
    local('r', 'MB-TOKEN');
    local('r', 'MB-URL');
    return originalLogout();
};

const MBload = () => {
    if (typeof activeInfo == 'undefined') return setTimeout(() => { MBload(); }, 1000);
    if (activeInfo.user.username == 'Guest') return;
    if (activeInfo.plugins["MB-enabled"] != true) return;
    if (local('g', 'MB-URL') == null) {
        organizrAPI('POST', 'api/?v1/plugin', { plugin: 'MB/settings/get' }).success((data) => {
            const response = JSON.parse(data);
            $.each(response['data']['API Server'], (i, v) => {
                if (v.name == "MB-API-URL") {
                    local('s', 'MB-URL', v.value);
                }
            })
        });
    }
    if (local('g', 'MB-TOKEN') == null) {
        mediaAuthAPI({ authToken: activeInfo.sso.myPlexAccessToken }).success((data) => {
            $.each(data.servers, (i, server) => {
                if (server.machineId == activeInfo.settings.sso.plex.machineID) local('s', 'MB-TOKEN', server.token);
            });
        });
    }
}
MBload();
var initialData = false;
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
            var url = $("input[name=MB-API-URL]").val();
            var token = $("input[name=MB-API-TOKEN]").val();
            if (url == undefined && token == undefined) return;
            var newData = [];
            mbApi(url, token, 'version').then((versionResult) => {
                for (let i = 0; i < versionResult.plugins.length; i++) {
                    newData.push(_mbMakeArray(url, token, versionResult.plugins[i]));
                }
                var a = buildFormGroup(initialData);
                var b = _MBbuildFormGroup(newData);
                console.log(b);
                $('#MB-settings-items').html(a);
            });
            // Connect to MB API
        });
    }).fail(function (xhr) {
        console.error("Organizr Function: API Connection Failed");
    });
    ajaxloader();
});

function _mbMakeArray(url, token, plugin) {
    const data = [];
    mbApi(url, token, `configure/${plugin}`).then((config) => {
        const name = plugin;
        for (let a = 0; a < config.schema.length; a++) {
            var endType;
            switch (config.schema[a].type) {
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
                data.push({ type: endType, name: `MB-TEMP-${plugin}-${config.schema[a].name}`, value: eval(`config.settings.${config.schema[a].name}`), label: config.schema[a].name });
            } else {
                console.log(`no end type found for ${config.schema[a].name} - should have found ${config.schema[a].type}`);
                console.log(config.schema[a]);
            }
        }
    });
    return data;
}


function mbApi(url, token, endpoint, cb) {
    var t = $.ajax({
        url: `${url}${endpoint}`,
        data: {},
        headers: { Authorization: `Bearer ${token}` },
    });
    return $.when(t);
}

function _MBbuildFormGroup(array) {
    var mainCount = 0;
    var group = '<div class="tab-content">';
    var uList = '<ul class="nav customtab nav-tabs nav-low-margin" role="tablist">';
    $.each(array, function (i, v) {
        mainCount++;
        var count = 0;
        var total = v.length;
        var active = (mainCount == 1) ? 'active' : '';
        var customID = createRandomString(10);
        if (i == 'custom') {
            group += v;
        } else {
            uList += `<li role="presentation" class="` + active + `"><a href="#` + customID + cleanClass(`_${i}`) + `" aria-controls="` + i + `" role="tab" data-toggle="tab" aria-expanded="false"><span> ` + i + `</span></a></li>`;
            group += `
				<!-- FORM GROUP -->
				<div role="tabpanel" class="tab-pane fade in `+ active + `" id="` + customID + cleanClass(`_${i}`) + `">
            `;
            $.each({v}, function (a, b) {
                console.log(a);
                console.log(b);
                console.log(v.v);
                console.log('hello');
                b.forEach(function (k) {
                    console.log(k);
                    console.log(buildFormItem(k));
                    var override = '6';
                    if (typeof k.override !== 'undefined') {
                        override = k.override;
                    }
                    count++;
                    if (count % 2 !== 0) {
                        group += '<div class="row start">';
                    }
                    var helpID = '#help-info-' + k.name;
                    var helpTip = (k.help) ? '<sup><a class="help-tip" data-toggle="collapse" href="' + helpID + '" aria-expanded="true"><i class="m-l-5 fa fa-question-circle text-info" title="Help" data-toggle="tooltip"></i></a></sup>' : '';
                    group += `
					<!-- INPUT BOX -->
					<div class="col-md-`+ override + ` p-b-10">
						<div class="form-group">
							<label class="control-label col-md-12"><span lang="en">`+ k.label + `</span>` + helpTip + `</label>
							<div class="col-md-12">
								`+ _mbBuildFormItem(k) + `
							</div>
						</div>
					</div>
					<!--/ INPUT BOX -->
				`;
                    if (count % 2 == 0 || count == total) {
                        group += '</div><!--end-->';
                    }
                });
                group += '</div>';
            });
        }
    });
    return uList + '</ul>' + group;
}

function _mbBuildFormItem(item) {
    console.log(item);
    var placeholder = (item.placeholder) ? ' placeholder="' + item.placeholder + '"' : '';
    var id = (item.id) ? ' id="' + item.id + '"' : '';
    var type = (item.type) ? ' data-type="' + item.type + '"' : '';
    var value = (item.value) ? ' value="' + item.value + '"' : '';
    var textarea = (item.value) ? item.value : '';
    var name = (item.name) ? ' name="' + item.name + '"' : '';
    var extraClass = (item.class) ? ' ' + item.class : '';
    var icon = (item.icon) ? ' ' + item.icon : '';
    var text = (item.text) ? ' ' + item.text : '';
    var attr = (item.attr) ? ' ' + item.attr : '';
    var disabled = (item.disabled) ? ' disabled' : '';
    var href = (item.href) ? ' href="' + item.href + '"' : '';
    var pwd1 = createRandomString(6);
    var pwd2 = createRandomString(6);
    var pwd3 = createRandomString(6);
    var helpInfo = (item.help) ? '<div class="collapse" id="help-info-' + item.name + '"><blockquote>' + item.help + '</blockquote></div>' : '';
    var smallLabel = (item.smallLabel) ? '<label><span lang="en">' + item.smallLabel + '</span>`+helpTip+`</label>' + helpInfo : '' + helpInfo;
    var pwgMgr = `
	<input name="disable-pwd-mgr-`+ pwd1 + `" type="password" id="disable-pwd-mgr-` + pwd1 + `" style="display: none;" value="disable-pwd-mgr-` + pwd1 + `" />
	<input name="disable-pwd-mgr-`+ pwd2 + `" type="password" id="disable-pwd-mgr-` + pwd2 + `" style="display: none;" value="disable-pwd-mgr-` + pwd2 + `" />
	<input name="disable-pwd-mgr-`+ pwd3 + `" type="password" id="disable-pwd-mgr-` + pwd3 + `" style="display: none;" value="disable-pwd-mgr-` + pwd3 + `" />
	`;
    //+tof(item.value,'c')+`
    switch (item.type) {
        case 'input':
        case 'text':
            return smallLabel + '<input data-changed="false" lang="en" type="text" class="form-control' + extraClass + '"' + placeholder + value + id + name + disabled + type + attr + ' autocomplete="new-password" />';
            break;
        case 'number':
            return smallLabel + '<input data-changed="false" lang="en" type="number" class="form-control' + extraClass + '"' + placeholder + value + id + name + disabled + type + attr + ' autocomplete="new-password" />';
            break;
        case 'textbox':
            return smallLabel + '<textarea data-changed="false" class="form-control' + extraClass + '"' + placeholder + id + name + disabled + type + attr + ' autocomplete="new-password">' + textarea + '</textarea>';
            break;
        case 'password':
            return smallLabel + pwgMgr + '<input data-changed="false" lang="en" type="password" class="form-control' + extraClass + '"' + placeholder + value + id + name + disabled + type + attr + ' autocomplete="new-password" />';
            break;
        case 'password-alt':
            return smallLabel + '<div class="input-group">' + pwgMgr + '<input data-changed="false" lang="en" type="password" class="password-alt form-control' + extraClass + '"' + placeholder + value + id + name + disabled + type + attr + ' autocomplete="new-password" /><span class="input-group-btn"> <button class="btn btn-default showPassword" type="button"><i class="fa fa-eye passwordToggle"></i></button></span></div>';
            break;
        case 'hidden':
            return '<input data-changed="false" lang="en" type="hidden" class="form-control' + extraClass + '"' + placeholder + value + id + name + disabled + type + attr + ' />';
            break;
        case 'select':
            return smallLabel + '<select class="form-control' + extraClass + '"' + placeholder + value + id + name + disabled + type + attr + '>' + selectOptions(item.options, item.value) + '</select>';
            break;
        case 'select2':
            return smallLabel + '<select class="m-b-10 ' + extraClass + '"' + placeholder + value + id + name + disabled + type + attr + ' multiple="multiple" data-placeholder="Choose">' + selectOptions(item.options, item.value) + '</select>';
            break;
        case 'switch':
        case 'checkbox':
            return smallLabel + '<input data-changed="false" type="checkbox" class="js-switch' + extraClass + '" data-size="small" data-color="#99d683" data-secondary-color="#f96262"' + name + value + tof(item.value, 'c') + id + disabled + type + attr + ' /><input data-changed="false" type="hidden"' + name + 'value="false">';
            break;
        case 'button':
            return smallLabel + '<button class="btn btn-sm btn-success btn-rounded waves-effect waves-light b-none' + extraClass + '" ' + href + attr + 'type="button"><span class="btn-label"><i class="' + icon + '"></i></span><span lang="en">' + text + '</span></button>';
            break;
        case 'blank':
            return '';
            break;
        case 'accordion':
            return '<div class="panel-group' + extraClass + '"' + placeholder + value + id + name + disabled + type + attr + '  aria-multiselectable="true" role="tablist">' + accordionOptions(item.options, item.id) + '</div>';
            break;
        case 'html':
            return item.html;
            break;
        default:
            return false;
    }
}

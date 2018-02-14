<?php
if(isset($_POST['data']['plugin'])){
    switch ($_POST['data']['plugin']) {
        case 'MB/settings/get':
            if(qualifyRequest(1)){
                $result['status'] = 'success';
                $result['statusText'] = 'success';
                $result['data'] = MBGetSettings();
            }else{
                $result['status'] = 'error';
                $result['statusText'] = 'API/Token invalid or not set';
                $result['data'] = null;
            }
            break;
        case 'MB/config/get':
            if(qualifyRequest(1)){
                $result['status'] = 'success';
                $result['statusText'] = 'success';
                $result['data'] = MBGetConfig();
            }else{
                $result['status'] = 'error';
                $result['statusText'] = 'API/Token invalid or not set';
                $result['data'] = null;
            }
            break;
        default:
            //DO NOTHING!!
            break;
    }
}

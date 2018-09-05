<?php
$GLOBALS['plugins'][]['MediaButler'] = array(
    'name'=>'MediaButler',
    'author'=>'MediaButler',
    'category'=>'Services API',
    'link'=>'https://github.com/MediaButler/MediaButler',
    'idPrefix'=>'MB',
    'configPrefix'=>'MB',
    'version'=>'1.0.0',
    'image'=>'plugins/images/mediabutler.png',
    'settings'=>true,
    'homepage'=>false,
    'license'=>'personal,business'
);

function MBGetSettings() {
        return array(
		'API Server' => array(
			array(
                        'type' => 'html',
                        'label' => 'Please Note',
                        'html' => 'Please hit test connection after filling in details if you do not have'
                  ),
                  array(
                        'type' => 'html',
                        'label' => ' ',
                        'html' => ' '
                  ),
			array(
                        'type' => 'input',
                        'name' => 'MB-API-URL',
                        'label' => 'Server URL',
                        'value' => $GLOBALS['MB-API-URL']
                  ),
                  array(
                        'type' => 'html',
                        'label' => ' ',
                        'html' => ' '
                  ),
                  array(
                        'type' => 'button',
                        'label' => 'Test Connection',
                        'class' => 'MB-TEST-CONN',
                        'icon' => 'fa fa-check',
                        'text' => 'Test Connection'
                  )
		)
	);
}

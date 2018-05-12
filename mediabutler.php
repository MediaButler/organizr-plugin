<?php
$GLOBALS['plugins'][]['MediaButler'] = array(
    'name'=>'MediaButler',
    'author'=>'MediaButler',
    'category'=>'Discord Bot',
    'link'=>'https://github.com/MediaButler/MediaButler',
    'idPrefix'=>'MB',
    'configPrefix'=>'MB',
    'version'=>'0.0.1',
    'image'=>'plugins/images/tabs/mediabutler.png',
    'settings'=>true,
    'homepage'=>false,
    'license'=>'personal,business'
);

function _mbGetSonarrProfiles() {
	$sonarr = new Kryptonit3\Sonarr\Sonarr($GLOBALS['sonarrURL'], $GLOBALS['sonarrToken']);
	$profiles = $sonarr->getProfiles();
	$profiles = json_decode($profiles);
	$data = array();
        $i = 1;
        $data[0] = array(
                'name' => 'Select...',
                'value' => 'Select...'
        );
	foreach ($profiles as $item) {
		$data[$i] = array(
			'name' => $item->name,
			'value' => $item->name
		);
		$i++;
	}
	return $data;
}

function _mbGetRadarrProfiles() {
        $sonarr = new Kryptonit3\Sonarr\Sonarr($GLOBALS['radarrURL'], $GLOBALS['radarrToken']);
        $profiles = $sonarr->getProfiles();
        $profiles = json_decode($profiles);
        $data = array();
        $i = 1;
        $data[0] = array(
                'name' => 'Select...',
                'value' => 'Select...'
        );
        foreach ($profiles as $item) {
                $data[$i] = array(
                        'name' => $item->name,
                        'value' => $item->name
                );
                $i++;
        }
        return $data;
}

function _mbGetSonarrRoot() {
	$sonarr = new Kryptonit3\Sonarr\Sonarr($GLOBALS['sonarrURL'], $GLOBALS['sonarrToken']);
	$rootpaths = $sonarr->getRootFolder();
	$rootpaths = json_decode($rootpaths);
	$data = array();
        $i = 1;
        $data[0] = array(
                'name' => 'Select...',
                'value' => 'Select...'
        );
	foreach ($rootpaths as $rootpath) {
		$data[$i] = array(
			'name' => $rootpath->path,
			'value' => $rootpath->path
		);
		$i++;
	}
	return $data;
}

function _mbGetRadarrRoot() {
        $sonarr = new Kryptonit3\Sonarr\Sonarr($GLOBALS['radarrURL'], $GLOBALS['radarrToken']);
        $rootpaths = $sonarr->getRootFolder();
        $rootpaths = json_decode($rootpaths);
        $data = array();
        $i = 1;
        $data[0] = array(
                'name' => 'Select...',
                'value' => 'Select...'
        );
        foreach ($rootpaths as $rootpath) {
                $data[$i] = array(
                        'name' => $rootpath->path,
                        'value' => $rootpath->path
                );
		$i++;
        }
        return $data;
}

function MBGetSettings() {
	$sonarrProfiles = _mbGetSonarrProfiles();
	$radarrProfiles = _mbGetRadarrProfiles();
	$sonarrRoots = _mbGetSonarrRoot();
	$radarrRoots = _mbGetRadarrRoot();
        return array(
		'Bot' => array(
			array(
				'type' => 'input',
				'name' => 'MB-botPrefix',
				'label' => 'Command Prefix',
				'value' => $GLOBALS['MB-botPrefix']
			)
		),
                'Sonarr' => array(
                        array(
                                'type' => 'select',
                                'name' => 'MB-sonarrRoot',
                                'label' => 'Default Root Path',
                                'value' => $GLOBALS['MB-sonarrRoot'],
				'options' => $sonarrRoots
                        ),
                        array(
                                'type' => 'select',
                                'name' => 'MB-sonarrProfile',
                                'label' => 'Default Profile',
                                'value' => $GLOBALS['MB-sonarrProfile'],
				'options' => $sonarrProfiles
                        )
                ),
                'Radarr' => array(
                        array(
                                'type' => 'select',
                                'name' => 'MB-radarrRoot',
                                'label' => 'Default Root Path',
                                'value' => $GLOBALS['MB-radarrRoot'],
				'options' => $radarrRoots
                        ),
                        array(
                                'type' => 'select',
                                'name' => 'MB-radarrProfile',
                                'label' => 'Default Profile',
                                'value' => $GLOBALS['MB-radarrProfile'],
				'options' => $radarrProfiles
                        )
                ),
//                'Lidarr' => array(
//                        array(
//                                'type' => 'input',
//                                'name' => 'MB-lidarrRoot',
//                                'label' => 'Default Root Path',
//                                'value' => $GLOBALS['MB-lidarrRoot']
//                        ),
//                        array(
//                                'type' => 'input',
//                                'name' => 'MB-lidarrProfile',
//                                'label' => 'Default Profile',
//                                'value' => $GLOBALS['MB-lidarrProfile']
//                        )
//                ),
		'Tautulli' => array(
			array(
				'type' => 'input',
				'name' => 'MB-tautulliToken',
				'label' => 'API Key',
				'value' => $GLOBALS['MB-tautulliToken']
			)
		),
                'SyncLounge' => array(
                        array(
                                'type' => 'input',
                                'name' => 'MB-syncLoungeServerUrl',
                                'label' => 'Server URL',
                                'value' => $GLOBALS['MB-syncLoungeServerUrl']
                        ),
                        array(
                                'type' => 'input',
                                'name' => 'MB-syncLoungeAppUrl',
                                'label' => 'App URL',
                                'value' => $GLOBALS['MB-syncLoungeAppUrl']
                        )
                )
	);
}

function MBGetConfig() {
	$data = array(
		'prefix' => $GLOBALS['MB-botPrefix'],
		'tautulli' => array(
			'url' => $GLOBALS['tautulliURL'],
			'apikey' => $GLOBALS['MB-tautulliToken']
		),
		'sonarr' => array(
			'url' => $GLOBALS['sonarrURL'],
			'apikey' => $GLOBALS['sonarrToken'],
			'defaultProfile' => $GLOBALS['MB-sonarrProfile'],
			'defaultRootPath' => $GLOBALS['MB-sonarrRoot']
		),
                'radarr' => array(
                        'url' => $GLOBALS['radarrURL'],
                        'apikey' => $GLOBALS['radarrToken'],
                        'defaultProfile' => $GLOBALS['MB-radarrProfile'],
                        'defaultRootPath' => $GLOBALS['MB-radarrRoot']
                ),
                'lidarr' => array(
                        'url' => $GLOBALS['lidarrURL'],
                        'apikey' => $GLOBALS['lidarrToken'],
                        'defaultProfile' => $GLOBALS['MB-lidarrProfile'],
                        'defaultRootPath' => $GLOBALS['MB-lidarrRoot'] 
                ),
		'synclounge' => array(
			'serverurl' => $GLOBALS['MB-syncLoungeServerUrl'],
			'appurl' => $GLOBALS['MB-syncLoungeAppUrl']
		),
		'plex' => array(
			'url' => $GLOBALS['plexURL'],
			'token' => ''
		)
	);
return $data;
}

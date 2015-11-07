var widget_chart = {
	widgetname : 'chart',
	instance : 0,
	
	createElem: function(elem) { // create new graphic svg element
		return $(document.createElementNS('http://www.w3.org/2000/svg', elem));
	},
	fontNameToUnicode: function(name) {
		var FONT_AWESOME = {"fa-500px":"\uf26e","fa-adjust":"\uf042","fa-adn":"\uf170","fa-align-center":"\uf037","fa-align-justify":"\uf039","fa-align-left":"\uf036","fa-align-right":"\uf038","fa-amazon":"\uf270","fa-ambulance":"\uf0f9","fa-anchor":"\uf13d","fa-android":"\uf17b","fa-angellist":"\uf209","fa-angle-double-down":"\uf103","fa-angle-double-left":"\uf100","fa-angle-double-right":"\uf101","fa-angle-double-up":"\uf102","fa-angle-down":"\uf107","fa-angle-left":"\uf104","fa-angle-right":"\uf105","fa-angle-up":"\uf106","fa-apple":"\uf179","fa-archive":"\uf187","fa-area-chart":"\uf1fe","fa-arrow-circle-down":"\uf0ab","fa-arrow-circle-left":"\uf0a8","fa-arrow-circle-o-down":"\uf01a","fa-arrow-circle-o-left":"\uf190","fa-arrow-circle-o-right":"\uf18e","fa-arrow-circle-o-up":"\uf01b","fa-arrow-circle-right":"\uf0a9","fa-arrow-circle-up":"\uf0aa","fa-arrow-down":"\uf063","fa-arrow-left":"\uf060","fa-arrow-right":"\uf061","fa-arrow-up":"\uf062","fa-arrows":"\uf047","fa-arrows-alt":"\uf0b2","fa-arrows-h":"\uf07e","fa-arrows-v":"\uf07d","fa-asterisk":"\uf069","fa-at":"\uf1fa","fa-automobile":"\uf1b9","fa-backward":"\uf04a","fa-balance-scale":"\uf24e","fa-ban":"\uf05e","fa-bank":"\uf19c","fa-bar-chart":"\uf080","fa-bar-chart-o":"\uf080","fa-barcode":"\uf02a","fa-bars":"\uf0c9","fa-battery-0":"\uf244","fa-battery-1":"\uf243","fa-battery-2":"\uf242","fa-battery-3":"\uf241","fa-battery-4":"\uf240","fa-battery-empty":"\uf244","fa-battery-full":"\uf240","fa-battery-half":"\uf242","fa-battery-quarter":"\uf243","fa-battery-three-quarters":"\uf241","fa-bed":"\uf236","fa-beer":"\uf0fc","fa-behance":"\uf1b4","fa-behance-square":"\uf1b5","fa-bell":"\uf0f3","fa-bell-o":"\uf0a2","fa-bell-slash":"\uf1f6","fa-bell-slash-o":"\uf1f7","fa-bicycle":"\uf206","fa-binoculars":"\uf1e5","fa-birthday-cake":"\uf1fd","fa-bitbucket":"\uf171","fa-bitbucket-square":"\uf172","fa-bitcoin":"\uf15a","fa-black-tie":"\uf27e","fa-bold":"\uf032","fa-bolt":"\uf0e7","fa-bomb":"\uf1e2","fa-book":"\uf02d","fa-bookmark":"\uf02e","fa-bookmark-o":"\uf097","fa-briefcase":"\uf0b1","fa-btc":"\uf15a","fa-bug":"\uf188","fa-building":"\uf1ad","fa-building-o":"\uf0f7","fa-bullhorn":"\uf0a1","fa-bullseye":"\uf140","fa-bus":"\uf207","fa-buysellads":"\uf20d","fa-cab":"\uf1ba","fa-calculator":"\uf1ec","fa-calendar":"\uf073","fa-calendar-check-o":"\uf274","fa-calendar-minus-o":"\uf272","fa-calendar-o":"\uf133","fa-calendar-plus-o":"\uf271","fa-calendar-times-o":"\uf273","fa-camera":"\uf030","fa-camera-retro":"\uf083","fa-car":"\uf1b9","fa-caret-down":"\uf0d7","fa-caret-left":"\uf0d9","fa-caret-right":"\uf0da","fa-caret-square-o-down":"\uf150","fa-caret-square-o-left":"\uf191","fa-caret-square-o-right":"\uf152","fa-caret-square-o-up":"\uf151","fa-caret-up":"\uf0d8","fa-cart-arrow-down":"\uf218","fa-cart-plus":"\uf217","fa-cc":"\uf20a","fa-cc-amex":"\uf1f3","fa-cc-diners-club":"\uf24c","fa-cc-discover":"\uf1f2","fa-cc-jcb":"\uf24b","fa-cc-mastercard":"\uf1f1","fa-cc-paypal":"\uf1f4","fa-cc-stripe":"\uf1f5","fa-cc-visa":"\uf1f0","fa-certificate":"\uf0a3","fa-chain":"\uf0c1","fa-chain-broken":"\uf127","fa-check":"\uf00c","fa-check-circle":"\uf058","fa-check-circle-o":"\uf05d","fa-check-square":"\uf14a","fa-check-square-o":"\uf046","fa-chevron-circle-down":"\uf13a","fa-chevron-circle-left":"\uf137","fa-chevron-circle-right":"\uf138","fa-chevron-circle-up":"\uf139","fa-chevron-down":"\uf078","fa-chevron-left":"\uf053","fa-chevron-right":"\uf054","fa-chevron-up":"\uf077","fa-child":"\uf1ae","fa-chrome":"\uf268","fa-circle":"\uf111","fa-circle-o":"\uf10c","fa-circle-o-notch":"\uf1ce","fa-circle-thin":"\uf1db","fa-clipboard":"\uf0ea","fa-clock-o":"\uf017","fa-clone":"\uf24d","fa-close":"\uf00d","fa-cloud":"\uf0c2","fa-cloud-download":"\uf0ed","fa-cloud-upload":"\uf0ee","fa-cny":"\uf157","fa-code":"\uf121","fa-code-fork":"\uf126","fa-codepen":"\uf1cb","fa-coffee":"\uf0f4","fa-cog":"\uf013","fa-cogs":"\uf085","fa-columns":"\uf0db","fa-comment":"\uf075","fa-comment-o":"\uf0e5","fa-commenting":"\uf27a","fa-commenting-o":"\uf27b","fa-comments":"\uf086","fa-comments-o":"\uf0e6","fa-compass":"\uf14e","fa-compress":"\uf066","fa-connectdevelop":"\uf20e","fa-contao":"\uf26d","fa-copy":"\uf0c5","fa-copyright":"\uf1f9","fa-creative-commons":"\uf25e","fa-credit-card":"\uf09d","fa-crop":"\uf125","fa-crosshairs":"\uf05b","fa-css3":"\uf13c","fa-cube":"\uf1b2","fa-cubes":"\uf1b3","fa-cut":"\uf0c4","fa-cutlery":"\uf0f5","fa-dashboard":"\uf0e4","fa-dashcube":"\uf210","fa-database":"\uf1c0","fa-dedent":"\uf03b","fa-delicious":"\uf1a5","fa-desktop":"\uf108","fa-deviantart":"\uf1bd","fa-diamond":"\uf219","fa-digg":"\uf1a6","fa-dollar":"\uf155","fa-dot-circle-o":"\uf192","fa-download":"\uf019","fa-dribbble":"\uf17d","fa-dropbox":"\uf16b","fa-drupal":"\uf1a9","fa-edit":"\uf044","fa-eject":"\uf052","fa-ellipsis-h":"\uf141","fa-ellipsis-v":"\uf142","fa-empire":"\uf1d1","fa-envelope":"\uf0e0","fa-envelope-o":"\uf003","fa-envelope-square":"\uf199","fa-eraser":"\uf12d","fa-eur":"\uf153","fa-euro":"\uf153","fa-exchange":"\uf0ec","fa-exclamation":"\uf12a","fa-exclamation-circle":"\uf06a","fa-exclamation-triangle":"\uf071","fa-expand":"\uf065","fa-expeditedssl":"\uf23e","fa-external-link":"\uf08e","fa-external-link-square":"\uf14c","fa-eye":"\uf06e","fa-eye-slash":"\uf070","fa-eyedropper":"\uf1fb","fa-facebook":"\uf09a","fa-facebook-f":"\uf09a","fa-facebook-official":"\uf230","fa-facebook-square":"\uf082","fa-fast-backward":"\uf049","fa-fast-forward":"\uf050","fa-fax":"\uf1ac","fa-feed":"\uf09e","fa-female":"\uf182","fa-fighter-jet":"\uf0fb","fa-file":"\uf15b","fa-file-archive-o":"\uf1c6","fa-file-audio-o":"\uf1c7","fa-file-code-o":"\uf1c9","fa-file-excel-o":"\uf1c3","fa-file-image-o":"\uf1c5","fa-file-movie-o":"\uf1c8","fa-file-o":"\uf016","fa-file-pdf-o":"\uf1c1","fa-file-photo-o":"\uf1c5","fa-file-picture-o":"\uf1c5","fa-file-powerpoint-o":"\uf1c4","fa-file-sound-o":"\uf1c7","fa-file-text":"\uf15c","fa-file-text-o":"\uf0f6","fa-file-video-o":"\uf1c8","fa-file-word-o":"\uf1c2","fa-file-zip-o":"\uf1c6","fa-files-o":"\uf0c5","fa-film":"\uf008","fa-filter":"\uf0b0","fa-fire":"\uf06d","fa-fire-extinguisher":"\uf134","fa-firefox":"\uf269","fa-flag":"\uf024","fa-flag-checkered":"\uf11e","fa-flag-o":"\uf11d","fa-flash":"\uf0e7","fa-flask":"\uf0c3","fa-flickr":"\uf16e","fa-floppy-o":"\uf0c7","fa-folder":"\uf07b","fa-folder-o":"\uf114","fa-folder-open":"\uf07c","fa-folder-open-o":"\uf115","fa-font":"\uf031","fa-fonticons":"\uf280","fa-forumbee":"\uf211","fa-forward":"\uf04e","fa-foursquare":"\uf180","fa-frown-o":"\uf119","fa-futbol-o":"\uf1e3","fa-gamepad":"\uf11b","fa-gavel":"\uf0e3","fa-gbp":"\uf154","fa-ge":"\uf1d1","fa-gear":"\uf013","fa-gears":"\uf085","fa-genderless":"\uf22d","fa-get-pocket":"\uf265","fa-gg":"\uf260","fa-gg-circle":"\uf261","fa-gift":"\uf06b","fa-git":"\uf1d3","fa-git-square":"\uf1d2","fa-github":"\uf09b","fa-github-alt":"\uf113","fa-github-square":"\uf092","fa-gittip":"\uf184","fa-glass":"\uf000","fa-globe":"\uf0ac","fa-google":"\uf1a0","fa-google-plus":"\uf0d5","fa-google-plus-square":"\uf0d4","fa-google-wallet":"\uf1ee","fa-graduation-cap":"\uf19d","fa-gratipay":"\uf184","fa-group":"\uf0c0","fa-h-square":"\uf0fd","fa-hacker-news":"\uf1d4","fa-hand-grab-o":"\uf255","fa-hand-lizard-o":"\uf258","fa-hand-o-down":"\uf0a7","fa-hand-o-left":"\uf0a5","fa-hand-o-right":"\uf0a4","fa-hand-o-up":"\uf0a6","fa-hand-paper-o":"\uf256","fa-hand-peace-o":"\uf25b","fa-hand-pointer-o":"\uf25a","fa-hand-rock-o":"\uf255","fa-hand-scissors-o":"\uf257","fa-hand-spock-o":"\uf259","fa-hand-stop-o":"\uf256","fa-hdd-o":"\uf0a0","fa-header":"\uf1dc","fa-headphones":"\uf025","fa-heart":"\uf004","fa-heart-o":"\uf08a","fa-heartbeat":"\uf21e","fa-history":"\uf1da","fa-home":"\uf015","fa-hospital-o":"\uf0f8","fa-hotel":"\uf236","fa-hourglass":"\uf254","fa-hourglass-1":"\uf251","fa-hourglass-2":"\uf252","fa-hourglass-3":"\uf253","fa-hourglass-end":"\uf253","fa-hourglass-half":"\uf252","fa-hourglass-o":"\uf250","fa-hourglass-start":"\uf251","fa-houzz":"\uf27c","fa-html5":"\uf13b","fa-i-cursor":"\uf246","fa-ils":"\uf20b","fa-image":"\uf03e","fa-inbox":"\uf01c","fa-indent":"\uf03c","fa-industry":"\uf275","fa-info":"\uf129","fa-info-circle":"\uf05a","fa-inr":"\uf156","fa-instagram":"\uf16d","fa-institution":"\uf19c","fa-internet-explorer":"\uf26b","fa-intersex":"\uf224","fa-ioxhost":"\uf208","fa-italic":"\uf033","fa-joomla":"\uf1aa","fa-jpy":"\uf157","fa-jsfiddle":"\uf1cc","fa-key":"\uf084","fa-keyboard-o":"\uf11c","fa-krw":"\uf159","fa-language":"\uf1ab","fa-laptop":"\uf109","fa-lastfm":"\uf202","fa-lastfm-square":"\uf203","fa-leaf":"\uf06c","fa-leanpub":"\uf212","fa-legal":"\uf0e3","fa-lemon-o":"\uf094","fa-level-down":"\uf149","fa-level-up":"\uf148","fa-life-bouy":"\uf1cd","fa-life-buoy":"\uf1cd","fa-life-ring":"\uf1cd","fa-life-saver":"\uf1cd","fa-lightbulb-o":"\uf0eb","fa-line-chart":"\uf201","fa-link":"\uf0c1","fa-linkedin":"\uf0e1","fa-linkedin-square":"\uf08c","fa-linux":"\uf17c","fa-list":"\uf03a","fa-list-alt":"\uf022","fa-list-ol":"\uf0cb","fa-list-ul":"\uf0ca","fa-location-arrow":"\uf124","fa-lock":"\uf023","fa-long-arrow-down":"\uf175","fa-long-arrow-left":"\uf177","fa-long-arrow-right":"\uf178","fa-long-arrow-up":"\uf176","fa-magic":"\uf0d0","fa-magnet":"\uf076","fa-mail-forward":"\uf064","fa-mail-reply":"\uf112","fa-mail-reply-all":"\uf122","fa-male":"\uf183","fa-map":"\uf279","fa-map-marker":"\uf041","fa-map-o":"\uf278","fa-map-pin":"\uf276","fa-map-signs":"\uf277","fa-mars":"\uf222","fa-mars-double":"\uf227","fa-mars-stroke":"\uf229","fa-mars-stroke-h":"\uf22b","fa-mars-stroke-v":"\uf22a","fa-maxcdn":"\uf136","fa-meanpath":"\uf20c","fa-medium":"\uf23a","fa-medkit":"\uf0fa","fa-meh-o":"\uf11a","fa-mercury":"\uf223","fa-microphone":"\uf130","fa-microphone-slash":"\uf131","fa-minus":"\uf068","fa-minus-circle":"\uf056","fa-minus-square":"\uf146","fa-minus-square-o":"\uf147","fa-mobile":"\uf10b","fa-mobile-phone":"\uf10b","fa-money":"\uf0d6","fa-moon-o":"\uf186","fa-mortar-board":"\uf19d","fa-motorcycle":"\uf21c","fa-mouse-pointer":"\uf245","fa-music":"\uf001","fa-navicon":"\uf0c9","fa-neuter":"\uf22c","fa-newspaper-o":"\uf1ea","fa-object-group":"\uf247","fa-object-ungroup":"\uf248","fa-odnoklassniki":"\uf263","fa-odnoklassniki-square":"\uf264","fa-opencart":"\uf23d","fa-openid":"\uf19b","fa-opera":"\uf26a","fa-optin-monster":"\uf23c","fa-outdent":"\uf03b","fa-pagelines":"\uf18c","fa-paint-brush":"\uf1fc","fa-paper-plane":"\uf1d8","fa-paper-plane-o":"\uf1d9","fa-paperclip":"\uf0c6","fa-paragraph":"\uf1dd","fa-paste":"\uf0ea","fa-pause":"\uf04c","fa-paw":"\uf1b0","fa-paypal":"\uf1ed","fa-pencil":"\uf040","fa-pencil-square":"\uf14b","fa-pencil-square-o":"\uf044","fa-phone":"\uf095","fa-phone-square":"\uf098","fa-photo":"\uf03e","fa-picture-o":"\uf03e","fa-pie-chart":"\uf200","fa-pied-piper":"\uf1a7","fa-pied-piper-alt":"\uf1a8","fa-pinterest":"\uf0d2","fa-pinterest-p":"\uf231","fa-pinterest-square":"\uf0d3","fa-plane":"\uf072","fa-play":"\uf04b","fa-play-circle":"\uf144","fa-play-circle-o":"\uf01d","fa-plug":"\uf1e6","fa-plus":"\uf067","fa-plus-circle":"\uf055","fa-plus-square":"\uf0fe","fa-plus-square-o":"\uf196","fa-power-off":"\uf011","fa-print":"\uf02f","fa-puzzle-piece":"\uf12e","fa-qq":"\uf1d6","fa-qrcode":"\uf029","fa-question":"\uf128","fa-question-circle":"\uf059","fa-quote-left":"\uf10d","fa-quote-right":"\uf10e","fa-ra":"\uf1d0","fa-random":"\uf074","fa-rebel":"\uf1d0","fa-recycle":"\uf1b8","fa-reddit":"\uf1a1","fa-reddit-square":"\uf1a2","fa-refresh":"\uf021","fa-registered":"\uf25d","fa-remove":"\uf00d","fa-renren":"\uf18b","fa-reorder":"\uf0c9","fa-repeat":"\uf01e","fa-reply":"\uf112","fa-reply-all":"\uf122","fa-retweet":"\uf079","fa-rmb":"\uf157","fa-road":"\uf018","fa-rocket":"\uf135","fa-rotate-left":"\uf0e2","fa-rotate-right":"\uf01e","fa-rouble":"\uf158","fa-rss":"\uf09e","fa-rss-square":"\uf143","fa-rub":"\uf158","fa-ruble":"\uf158","fa-rupee":"\uf156","fa-safari":"\uf267","fa-save":"\uf0c7","fa-scissors":"\uf0c4","fa-search":"\uf002","fa-search-minus":"\uf010","fa-search-plus":"\uf00e","fa-sellsy":"\uf213","fa-send":"\uf1d8","fa-send-o":"\uf1d9","fa-server":"\uf233","fa-share":"\uf064","fa-share-alt":"\uf1e0","fa-share-alt-square":"\uf1e1","fa-share-square":"\uf14d","fa-share-square-o":"\uf045","fa-shekel":"\uf20b","fa-sheqel":"\uf20b","fa-shield":"\uf132","fa-ship":"\uf21a","fa-shirtsinbulk":"\uf214","fa-shopping-cart":"\uf07a","fa-sign-in":"\uf090","fa-sign-out":"\uf08b","fa-signal":"\uf012","fa-simplybuilt":"\uf215","fa-sitemap":"\uf0e8","fa-skyatlas":"\uf216","fa-skype":"\uf17e","fa-slack":"\uf198","fa-sliders":"\uf1de","fa-slideshare":"\uf1e7","fa-smile-o":"\uf118","fa-soccer-ball-o":"\uf1e3","fa-sort":"\uf0dc","fa-sort-alpha-asc":"\uf15d","fa-sort-alpha-desc":"\uf15e","fa-sort-amount-asc":"\uf160","fa-sort-amount-desc":"\uf161","fa-sort-asc":"\uf0de","fa-sort-desc":"\uf0dd","fa-sort-down":"\uf0dd","fa-sort-numeric-asc":"\uf162","fa-sort-numeric-desc":"\uf163","fa-sort-up":"\uf0de","fa-soundcloud":"\uf1be","fa-space-shuttle":"\uf197","fa-spinner":"\uf110","fa-spoon":"\uf1b1","fa-spotify":"\uf1bc","fa-square":"\uf0c8","fa-square-o":"\uf096","fa-stack-exchange":"\uf18d","fa-stack-overflow":"\uf16c","fa-star":"\uf005","fa-star-half":"\uf089","fa-star-half-empty":"\uf123","fa-star-half-full":"\uf123","fa-star-half-o":"\uf123","fa-star-o":"\uf006","fa-steam":"\uf1b6","fa-steam-square":"\uf1b7","fa-step-backward":"\uf048","fa-step-forward":"\uf051","fa-stethoscope":"\uf0f1","fa-sticky-note":"\uf249","fa-sticky-note-o":"\uf24a","fa-stop":"\uf04d","fa-street-view":"\uf21d","fa-strikethrough":"\uf0cc","fa-stumbleupon":"\uf1a4","fa-stumbleupon-circle":"\uf1a3","fa-subscript":"\uf12c","fa-subway":"\uf239","fa-suitcase":"\uf0f2","fa-sun-o":"\uf185","fa-superscript":"\uf12b","fa-support":"\uf1cd","fa-table":"\uf0ce","fa-tablet":"\uf10a","fa-tachometer":"\uf0e4","fa-tag":"\uf02b","fa-tags":"\uf02c","fa-tasks":"\uf0ae","fa-taxi":"\uf1ba","fa-television":"\uf26c","fa-tencent-weibo":"\uf1d5","fa-terminal":"\uf120","fa-text-height":"\uf034","fa-text-width":"\uf035","fa-th":"\uf00a","fa-th-large":"\uf009","fa-th-list":"\uf00b","fa-thumb-tack":"\uf08d","fa-thumbs-down":"\uf165","fa-thumbs-o-down":"\uf088","fa-thumbs-o-up":"\uf087","fa-thumbs-up":"\uf164","fa-ticket":"\uf145","fa-times":"\uf00d","fa-times-circle":"\uf057","fa-times-circle-o":"\uf05c","fa-tint":"\uf043","fa-toggle-down":"\uf150","fa-toggle-left":"\uf191","fa-toggle-off":"\uf204","fa-toggle-on":"\uf205","fa-toggle-right":"\uf152","fa-toggle-up":"\uf151","fa-trademark":"\uf25c","fa-train":"\uf238","fa-transgender":"\uf224","fa-transgender-alt":"\uf225","fa-trash":"\uf1f8","fa-trash-o":"\uf014","fa-tree":"\uf1bb","fa-trello":"\uf181","fa-tripadvisor":"\uf262","fa-trophy":"\uf091","fa-truck":"\uf0d1","fa-try":"\uf195","fa-tty":"\uf1e4","fa-tumblr":"\uf173","fa-tumblr-square":"\uf174","fa-turkish-lira":"\uf195","fa-tv":"\uf26c","fa-twitch":"\uf1e8","fa-twitter":"\uf099","fa-twitter-square":"\uf081","fa-umbrella":"\uf0e9","fa-underline":"\uf0cd","fa-undo":"\uf0e2","fa-university":"\uf19c","fa-unlink":"\uf127","fa-unlock":"\uf09c","fa-unlock-alt":"\uf13e","fa-unsorted":"\uf0dc","fa-upload":"\uf093","fa-usd":"\uf155","fa-user":"\uf007","fa-user-md":"\uf0f0","fa-user-plus":"\uf234","fa-user-secret":"\uf21b","fa-user-times":"\uf235","fa-users":"\uf0c0","fa-venus":"\uf221","fa-venus-double":"\uf226","fa-venus-mars":"\uf228","fa-viacoin":"\uf237","fa-video-camera":"\uf03d","fa-vimeo":"\uf27d","fa-vimeo-square":"\uf194","fa-vine":"\uf1ca","fa-vk":"\uf189","fa-volume-down":"\uf027","fa-volume-off":"\uf026","fa-volume-up":"\uf028","fa-warning":"\uf071","fa-wechat":"\uf1d7","fa-weibo":"\uf18a","fa-weixin":"\uf1d7","fa-whatsapp":"\uf232","fa-wheelchair":"\uf193","fa-wifi":"\uf1eb","fa-wikipedia-w":"\uf266","fa-windows":"\uf17a","fa-won":"\uf159","fa-wordpress":"\uf19a","fa-wrench":"\uf0ad","fa-xing":"\uf168","fa-xing-square":"\uf169","fa-y-combinator":"\uf23b","fa-y-combinator-square":"\uf1d4","fa-yahoo":"\uf19e","fa-yc":"\uf23b","fa-yc-square":"\uf1d4","fa-yelp":"\uf1e9","fa-yen":"\uf157","fa-youtube":"\uf167","fa-youtube-play":"\uf16a","fa-youtube-square":"\uf166"};
		var FONT_OPENAUTOMATION = {"oa-weather_winter":"\ue600","oa-weather_wind_speed":"\ue601","oa-weather_wind_directions_w":"\ue602","oa-weather_wind_directions_sw":"\ue603","oa-weather_wind_directions_se":"\ue604","oa-weather_wind_directions_s":"\ue605","oa-weather_wind_directions_nw":"\ue606","oa-weather_wind_directions_ne":"\ue607","oa-weather_wind_directions_n":"\ue608","oa-weather_wind_directions_e":"\ue609","oa-weather_wind":"\ue60a","oa-weather_thunderstorm":"\ue60b","oa-weather_sunset":"\ue60c","oa-weather_sunrise":"\ue60d","oa-weather_sun":"\ue60e","oa-weather_summer":"\ue60f","oa-weather_storm":"\ue610","oa-weather_station_quadra":"\ue611","oa-weather_station":"\ue612","oa-weather_snow_light":"\ue613","oa-weather_snow_heavy":"\ue614","oa-weather_snow":"\ue615","oa-weather_rain_meter":"\ue616","oa-weather_rain_light":"\ue617","oa-weather_rain_heavy":"\ue618","oa-weather_rain_gauge":"\ue619","oa-weather_rain":"\ue61a","oa-weather_pollen":"\ue61b","oa-weather_moonset":"\ue61c","oa-weather_moonrise":"\ue61d","oa-weather_moon_phases_8":"\ue61e","oa-weather_moon_phases_7_half":"\ue61f","oa-weather_moon_phases_6":"\ue620","oa-weather_moon_phases_5_full":"\ue621","oa-weather_moon_phases_4":"\ue622","oa-weather_moon_phases_3_half":"\ue623","oa-weather_moon_phases_2":"\ue624","oa-weather_moon_phases_1_new":"\ue625","oa-weather_light_meter":"\ue626","oa-weather_humidity":"\ue627","oa-weather_frost":"\ue628","oa-weather_directions":"\ue629","oa-weather_cloudy_light":"\ue62a","oa-weather_cloudy_heavy":"\ue62b","oa-weather_cloudy":"\ue62c","oa-weather_barometric_pressure":"\ue62d","oa-weather_baraometric_pressure":"\ue62e","oa-vent_ventilation_level_manual_m":"\ue62f","oa-vent_ventilation_level_automatic":"\ue630","oa-vent_ventilation_level_3":"\ue631","oa-vent_ventilation_level_2":"\ue632","oa-vent_ventilation_level_1":"\ue633","oa-vent_ventilation_level_0":"\ue634","oa-vent_ventilation_control":"\ue635","oa-vent_ventilation":"\ue636","oa-vent_used_air":"\ue637","oa-vent_supply_air":"\ue638","oa-vent_exhaust_air":"\ue639","oa-vent_bypass":"\ue63a","oa-vent_ambient_air":"\ue63b","oa-user_ext_away":"\ue63c","oa-user_away":"\ue63d","oa-user_available":"\ue63e","oa-time_timer":"\ue63f","oa-time_statistic":"\ue640","oa-time_note":"\ue641","oa-time_manual_mode":"\ue642","oa-time_graph":"\ue643","oa-time_eco_mode":"\ue644","oa-time_clock":"\ue645","oa-time_calendar":"\ue646","oa-time_automatic":"\ue647","oa-text_min":"\ue648","oa-text_max":"\ue649","oa-temp_windchill":"\ue64a","oa-temp_temperature_min":"\ue64b","oa-temp_temperature_max":"\ue64c","oa-temp_temperature":"\ue64d","oa-temp_outside":"\ue64e","oa-temp_inside":"\ue64f","oa-temp_frost":"\ue650","oa-temp_control":"\ue651","oa-status_standby":"\ue652","oa-status_open":"\ue653","oa-status_night":"\ue654","oa-status_locked":"\ue655","oa-status_frost":"\ue656","oa-status_comfort":"\ue657","oa-status_away_2":"\ue658","oa-status_away_1":"\ue659","oa-status_available":"\ue65a","oa-status_automatic":"\ue65b","oa-secur_smoke_detector":"\ue65c","oa-secur_open":"\ue65d","oa-secur_locked":"\ue65e","oa-secur_heat_protection":"\ue65f","oa-secur_frost_protection":"\ue660","oa-secur_encoding":"\ue661","oa-secur_alarm":"\ue662","oa-scene_x-mas":"\ue663","oa-scene_workshop":"\ue664","oa-scene_wine_cellar":"\ue665","oa-scene_washing_machine":"\ue666","oa-scene_visit_guests":"\ue667","oa-scene_toilet_alternat":"\ue668","oa-scene_toilet":"\ue669","oa-scene_terrace":"\ue66a","oa-scene_swimming":"\ue66b","oa-scene_summerhouse":"\ue66c","oa-scene_stove":"\ue66d","oa-scene_storeroom":"\ue66e","oa-scene_stairs":"\ue66f","oa-scene_sleeping_alternat":"\ue670","oa-scene_sleeping":"\ue671","oa-scene_shower":"\ue672","oa-scene_scene":"\ue673","oa-scene_sauna":"\ue674","oa-scene_robo_lawnmower":"\ue675","oa-scene_pool":"\ue676","oa-scene_party":"\ue677","oa-scene_office":"\ue678","oa-scene_night":"\ue679","oa-scene_microwave_oven":"\ue67a","oa-scene_making_love_clean":"\ue67b","oa-scene_making_love":"\ue67c","oa-scene_livingroom":"\ue67d","oa-scene_laundry_room_fem":"\ue67e","oa-scene_laundry_room":"\ue67f","oa-scene_keyboard":"\ue680","oa-scene_hall":"\ue681","oa-scene_garden":"\ue682","oa-scene_gaming":"\ue683","oa-scene_fitness":"\ue684","oa-scene_dressing_room":"\ue685","oa-scene_dishwasher":"\ue686","oa-scene_dinner":"\ue687","oa-scene_day":"\ue688","oa-scene_cubby":"\ue689","oa-scene_cooking":"\ue68a","oa-scene_cockle_stove":"\ue68b","oa-scene_clothes_dryer":"\ue68c","oa-scene_cleaning":"\ue68d","oa-scene_cinema":"\ue68e","oa-scene_childs_room":"\ue68f","oa-scene_bathroom":"\ue690","oa-scene_bath":"\ue691","oa-scene_baking_oven":"\ue692","oa-scene_baby":"\ue693","oa-sani_water_tap":"\ue694","oa-sani_water_hot":"\ue695","oa-sani_water_cold":"\ue696","oa-sani_supply_temp":"\ue697","oa-sani_sprinkling":"\ue698","oa-sani_solar_temp":"\ue699","oa-sani_solar":"\ue69a","oa-sani_return_temp":"\ue69b","oa-sani_pump":"\ue69c","oa-sani_irrigation":"\ue69d","oa-sani_heating_temp":"\ue69e","oa-sani_heating_manual":"\ue69f","oa-sani_heating_automatic":"\ue6a0","oa-sani_heating":"\ue6a1","oa-sani_garden_pump":"\ue6a2","oa-sani_floor_heating":"\ue6a3","oa-sani_earth_source_heat_pump":"\ue6a4","oa-sani_domestic_waterworks":"\ue6a5","oa-sani_buffer_temp_up":"\ue6a6","oa-sani_buffer_temp_down":"\ue6a7","oa-sani_buffer_temp_all":"\ue6a8","oa-sani_boiler_temp":"\ue6a9","oa-phone_ring_out":"\ue6aa","oa-phone_ring_in":"\ue6ab","oa-phone_ring":"\ue6ac","oa-phone_missed_out":"\ue6ad","oa-phone_missed_in":"\ue6ae","oa-phone_dial":"\ue6af","oa-phone_call_out":"\ue6b0","oa-phone_call_in":"\ue6b1","oa-phone_call_end_out":"\ue6b2","oa-phone_call_end_in":"\ue6b3","oa-phone_call_end":"\ue6b4","oa-phone_call":"\ue6b5","oa-phone_answersing":"\ue6b6","oa-message_tendency_upward":"\ue6b7","oa-message_tendency_steady":"\ue6b8","oa-message_tendency_downward":"\ue6b9","oa-message_socket_on_off":"\ue6ba","oa-message_socket_ch_3":"\ue6bb","oa-message_socket_ch":"\ue6bc","oa-message_socket":"\ue6bd","oa-message_service":"\ue6be","oa-message_presence_disabled":"\ue6bf","oa-message_presence":"\ue6c0","oa-message_ok":"\ue6c1","oa-message_medicine":"\ue6c2","oa-message_mail_open":"\ue6c3","oa-message_mail":"\ue6c4","oa-message_light_intensity":"\ue6c5","oa-message_garbage":"\ue6c6","oa-message_attention":"\ue6c7","oa-measure_water_meter":"\ue6c8","oa-measure_voltage":"\ue6c9","oa-measure_power_meter":"\ue6ca","oa-measure_power":"\ue6cb","oa-measure_photovoltaic_inst":"\ue6cc","oa-measure_current":"\ue6cd","oa-measure_battery_100":"\ue6ce","oa-measure_battery_75":"\ue6cf","oa-measure_battery_50":"\ue6d0","oa-measure_battery_25":"\ue6d1","oa-measure_battery_0":"\ue6d2","oa-light_wire_system_2":"\ue6d3","oa-light_wire_system_1":"\ue6d4","oa-light_wall_3":"\ue6d5","oa-light_wall_2":"\ue6d6","oa-light_wall_1":"\ue6d7","oa-light_uplight":"\ue6d8","oa-light_stairs":"\ue6d9","oa-light_pendant_light_round":"\ue6da","oa-light_pendant_light":"\ue6db","oa-light_party":"\ue6dc","oa-light_outdoor":"\ue6dd","oa-light_office_desk":"\ue6de","oa-light_office":"\ue6df","oa-light_mirror":"\ue6e0","oa-light_light_dim_100":"\ue6e1","oa-light_light_dim_90":"\ue6e2","oa-light_light_dim_80":"\ue6e3","oa-light_light_dim_70":"\ue6e4","oa-light_light_dim_60":"\ue6e5","oa-light_light_dim_50":"\ue6e6","oa-light_light_dim_40":"\ue6e7","oa-light_light_dim_30":"\ue6e8","oa-light_light_dim_20":"\ue6e9","oa-light_light_dim_10":"\ue6ea","oa-light_light_dim_00":"\ue6eb","oa-light_light":"\ue6ec","oa-light_led_stripe_rgb":"\ue6ed","oa-light_led_stripe":"\ue6ee","oa-light_led":"\ue6ef","oa-light_floor_lamp":"\ue6f0","oa-light_fairy_lights":"\ue6f1","oa-light_downlight":"\ue6f2","oa-light_dinner_table":"\ue6f3","oa-light_diffused":"\ue6f4","oa-light_control":"\ue6f5","oa-light_ceiling_light":"\ue6f6","oa-light_cabinet":"\ue6f7","oa-it_wireless_dcf77":"\ue6f8","oa-it_wifi":"\ue6f9","oa-it_television":"\ue6fa","oa-it_telephone":"\ue6fb","oa-it_smartphone":"\ue6fc","oa-it_server":"\ue6fd","oa-it_satellite_dish_heating":"\ue6fe","oa-it_satellite_dish":"\ue6ff","oa-it_router":"\ue700","oa-it_remote":"\ue701","oa-it_radio":"\ue702","oa-it_pc":"\ue703","oa-it_network":"\ue704","oa-it_net":"\ue705","oa-it_nas":"\ue706","oa-it_internet":"\ue707","oa-it_fax":"\ue708","oa-it_camera":"\ue709","oa-fts_window_roof_shutter":"\ue70a","oa-fts_window_roof_open_2":"\ue70b","oa-fts_window_roof_open_1":"\ue70c","oa-fts_window_roof":"\ue70d","oa-fts_window_louvre_open":"\ue70e","oa-fts_window_louvre":"\ue70f","oa-fts_window_2w_tilt_r":"\ue710","oa-fts_window_2w_tilt_lr":"\ue711","oa-fts_window_2w_tilt_l_open_r":"\ue712","oa-fts_window_2w_tilt_l":"\ue713","oa-fts_window_2w_tilt":"\ue714","oa-fts_window_2w_open_r":"\ue715","oa-fts_window_2w_open_lr":"\ue716","oa-fts_window_2w_open_l_tilt_r":"\ue717","oa-fts_window_2w_open_l":"\ue718","oa-fts_window_2w_open":"\ue719","oa-fts_window_2w":"\ue71a","oa-fts_window_1w_tilt":"\ue71b","oa-fts_window_1w_open":"\ue71c","oa-fts_window_1w":"\ue71d","oa-fts_sunblind":"\ue71e","oa-fts_sliding_gate":"\ue71f","oa-fts_shutter_up":"\ue720","oa-fts_shutter_manual":"\ue721","oa-fts_shutter_down":"\ue722","oa-fts_shutter_automatic":"\ue723","oa-fts_shutter_100":"\ue724","oa-fts_shutter_90":"\ue725","oa-fts_shutter_80":"\ue726","oa-fts_shutter_70":"\ue727","oa-fts_shutter_60":"\ue728","oa-fts_shutter_50":"\ue729","oa-fts_shutter_40":"\ue72a","oa-fts_shutter_30":"\ue72b","oa-fts_shutter_20":"\ue72c","oa-fts_shutter_10":"\ue72d","oa-fts_shutter":"\ue72e","oa-fts_light_dome_open":"\ue72f","oa-fts_light_dome":"\ue730","oa-fts_garage_door_100":"\ue731","oa-fts_garage_door_90":"\ue732","oa-fts_garage_door_80":"\ue733","oa-fts_garage_door_70":"\ue734","oa-fts_garage_door_60":"\ue735","oa-fts_garage_door_50":"\ue736","oa-fts_garage_door_40":"\ue737","oa-fts_garage_door_30":"\ue738","oa-fts_garage_door_20":"\ue739","oa-fts_garage_door_10":"\ue73a","oa-fts_garage":"\ue73b","oa-fts_door_slide_open_m":"\ue73c","oa-fts_door_slide_open":"\ue73d","oa-fts_door_slide_m":"\ue73e","oa-fts_door_slide_2w_open_r":"\ue73f","oa-fts_door_slide_2w_open_lr":"\ue740","oa-fts_door_slide_2w_open_l":"\ue741","oa-fts_door_slide_2w":"\ue742","oa-fts_door_slide":"\ue743","oa-fts_door_open":"\ue744","oa-fts_door":"\ue745","oa-fts_blade_z_sun":"\ue746","oa-fts_blade_z":"\ue747","oa-fts_blade_s_sun":"\ue748","oa-fts_blade_s":"\ue749","oa-fts_blade_arc_sun":"\ue74a","oa-fts_blade_arc_close_100":"\ue74b","oa-fts_blade_arc_close_50":"\ue74c","oa-fts_blade_arc_close_00":"\ue74d","oa-fts_blade_arc":"\ue74e","oa-edit_sort":"\ue74f","oa-edit_settings":"\ue750","oa-edit_save":"\ue751","oa-edit_paste":"\ue752","oa-edit_open":"\ue753","oa-edit_expand":"\ue754","oa-edit_delete":"\ue755","oa-edit_cut":"\ue756","oa-edit_copy":"\ue757","oa-edit_collapse":"\ue758","oa-control_zoom_out":"\ue759","oa-control_zoom_in":"\ue75a","oa-control_x":"\ue75b","oa-control_standby":"\ue75c","oa-control_return":"\ue75d","oa-control_reboot":"\ue75e","oa-control_plus":"\ue75f","oa-control_outside_on_off":"\ue760","oa-control_on_off":"\ue761","oa-control_minus":"\ue762","oa-control_home":"\ue763","oa-control_centr_arrow_up_right":"\ue764","oa-control_centr_arrow_up_left":"\ue765","oa-control_centr_arrow_up":"\ue766","oa-control_centr_arrow_right":"\ue767","oa-control_centr_arrow_left":"\ue768","oa-control_centr_arrow_down_right":"\ue769","oa-control_centr_arrow_down_left":"\ue76a","oa-control_centr_arrow_down":"\ue76b","oa-control_building_s_og":"\ue76c","oa-control_building_s_kg":"\ue76d","oa-control_building_s_eg":"\ue76e","oa-control_building_s_dg":"\ue76f","oa-control_building_s_all":"\ue770","oa-control_building_outside":"\ue771","oa-control_building_og":"\ue772","oa-control_building_modern_s_okg_og":"\ue773","oa-control_building_modern_s_okg_eg":"\ue774","oa-control_building_modern_s_okg_dg":"\ue775","oa-control_building_modern_s_okg_all":"\ue776","oa-control_building_modern_s_og":"\ue777","oa-control_building_modern_s_kg":"\ue778","oa-control_building_modern_s_eg":"\ue779","oa-control_building_modern_s_dg":"\ue77a","oa-control_building_modern_s_all":"\ue77b","oa-control_building_modern_s_2og_og2":"\ue77c","oa-control_building_modern_s_2og_og1":"\ue77d","oa-control_building_modern_s_2og_kg":"\ue77e","oa-control_building_modern_s_2og_eg":"\ue77f","oa-control_building_modern_s_2og_dg":"\ue780","oa-control_building_modern_s_2og_all":"\ue781","oa-control_building_kg":"\ue782","oa-control_building_filled":"\ue783","oa-control_building_empty":"\ue784","oa-control_building_eg":"\ue785","oa-control_building_dg":"\ue786","oa-control_building_control":"\ue787","oa-control_building_all":"\ue788","oa-control_building_2_s_kg":"\ue789","oa-control_building_2_s_eg":"\ue78a","oa-control_building_2_s_dg":"\ue78b","oa-control_building_2_s_all":"\ue78c","oa-control_arrow_upward":"\ue78d","oa-control_arrow_up_right":"\ue78e","oa-control_arrow_up_left":"\ue78f","oa-control_arrow_up":"\ue790","oa-control_arrow_turn_right":"\ue791","oa-control_arrow_turn_left":"\ue792","oa-control_arrow_rightward":"\ue793","oa-control_arrow_right":"\ue794","oa-control_arrow_leftward":"\ue795","oa-control_arrow_left":"\ue796","oa-control_arrow_downward":"\ue797","oa-control_arrow_down_right":"\ue798","oa-control_arrow_down_left":"\ue799","oa-control_arrow_down":"\ue79a","oa-control_all_on_off":"\ue79b","oa-control_4":"\ue79c","oa-control_3":"\ue79d","oa-control_2":"\ue79e","oa-control_1":"\ue79f","oa-audio_volume_mute":"\ue7a0","oa-audio_volume_mid":"\ue7a1","oa-audio_volume_low":"\ue7a2","oa-audio_volume_high":"\ue7a3","oa-audio_stop":"\ue7a4","oa-audio_sound":"\ue7a5","oa-audio_shuffle":"\ue7a6","oa-audio_rew":"\ue7a7","oa-audio_repeat":"\ue7a8","oa-audio_rec":"\ue7a9","oa-audio_playlist":"\ue7aa","oa-audio_play":"\ue7ab","oa-audio_pause":"\ue7ac","oa-audio_mic_mute":"\ue7ad","oa-audio_mic":"\ue7ae","oa-audio_loudness":"\ue7af","oa-audio_headphone":"\ue7b0","oa-audio_ff":"\ue7b1","oa-audio_fade":"\ue7b2","oa-audio_eq":"\ue7b3","oa-audio_eject":"\ue7b4","oa-audio_audio":"\ue7b5"};
		var FONT_FHEMSVG = {"fs-user_unknown":"\ue600","fs-usb_stick":"\ue601","fs-usb":"\ue602","fs-unlock":"\ue603","fs-unknown":"\ue604","fs-temperature_humidity":"\ue605","fs-taster_ch6_6":"\ue606","fs-taster_ch6_5":"\ue607","fs-taster_ch6_4":"\ue608","fs-taster_ch6_3":"\ue609","fs-taster_ch6_2":"\ue60a","fs-taster_ch6_1":"\ue60b","fs-taster_ch_aus_rot .path1":"\ue60c","fs-taster_ch_aus_rot .path2":"\ue60d","fs-taster_ch_aus_rot .path3":"\ue60e","fs-taster_ch_aus_rot .path4":"\ue60f","fs-taster_ch_aus_rot .path5":"\ue610","fs-taster_ch_aus_rot .path6":"\ue611","fs-taster_ch_an_gruen .path1":"\ue612","fs-taster_ch_an_gruen .path2":"\ue613","fs-taster_ch_an_gruen .path3":"\ue614","fs-taster_ch_an_gruen .path4":"\ue615","fs-taster_ch_an_gruen .path5":"\ue616","fs-taster_ch_2":"\ue617","fs-taster_ch_1":"\ue618","fs-taster_ch":"\ue619","fs-taster":"\ue61a","fs-system_fhem_update":"\ue61b","fs-system_fhem_reboot":"\ue61c","fs-system_fhem":"\ue61d","fs-system_backup":"\ue61e","fs-socket_timer":"\ue61f","fs-security_password":"\ue620","fs-security":"\ue621","fs-sdcard":"\ue622","fs-scc_868":"\ue623","fs-sani_heating_timer":"\ue624","fs-sani_heating_level_100":"\ue625","fs-sani_heating_level_90":"\ue626","fs-sani_heating_level_80":"\ue627","fs-sani_heating_level_70":"\ue628","fs-sani_heating_level_60":"\ue629","fs-sani_heating_level_50":"\ue62a","fs-sani_heating_level_40":"\ue62b","fs-sani_heating_level_30":"\ue62c","fs-sani_heating_level_20":"\ue62d","fs-sani_heating_level_10":"\ue62e","fs-sani_heating_level_0":"\ue62f","fs-sani_heating_calendar":"\ue630","fs-sani_heating_boost":"\ue631","fs-sani_floor_heating_off":"\ue632","fs-sani_floor_heating_neutral":"\ue633","fs-RPi .path1":"\ue634","fs-RPi .path2":"\ue635","fs-RPi .path3":"\ue636","fs-RPi .path4":"\ue637","fs-RPi .path5":"\ue638","fs-RPi .path6":"\ue639","fs-RPi .path7":"\ue63a","fs-RPi .path8":"\ue63b","fs-RPi .path9":"\ue63c","fs-RPi .path10":"\ue63d","fs-RPi .path11":"\ue63e","fs-RPi .path12":"\ue63f","fs-RPi .path13":"\ue640","fs-RPi .path14":"\ue641","fs-RPi .path15":"\ue642","fs-RPi .path16":"\ue643","fs-RPi .path17":"\ue644","fs-RPi .path18":"\ue645","fs-RPi .path19":"\ue646","fs-RPi .path20":"\ue647","fs-RPi .path21":"\ue648","fs-remote_control":"\ue649","fs-refresh":"\ue64a","fs-recycling":"\ue64b","fs-rc_YELLOW .path1":"\ue64c","fs-rc_YELLOW .path2":"\ue64d","fs-rc_WEB":"\ue64e","fs-rc_VOLUP":"\ue64f","fs-rc_VOLPLUS":"\ue650","fs-rc_VOLMINUS":"\ue651","fs-rc_VOLDOWN":"\ue652","fs-rc_VIDEO":"\ue653","fs-rc_USB":"\ue654","fs-rc_UP":"\ue655","fs-rc_TVstop":"\ue656","fs-rc_TV":"\ue657","fs-rc_TEXT":"\ue658","fs-rc_templatebutton":"\ue659","fs-rc_SUB":"\ue65a","fs-rc_STOP":"\ue65b","fs-rc_SHUFFLE":"\ue65c","fs-rc_SETUP":"\ue65d","fs-rc_SEARCH":"\ue65e","fs-rc_RIGHT":"\ue65f","fs-rc_REWred":"\ue660","fs-rc_REW":"\ue661","fs-rc_REPEAT":"\ue662","fs-rc_RED .path1":"\ue663","fs-rc_RED .path2":"\ue664","fs-rc_REC .path1":"\ue665","fs-rc_REC .path2":"\ue666","fs-rc_RADIOred":"\ue667","fs-rc_RADIO":"\ue668","fs-rc_PREVIOUS":"\ue669","fs-rc_POWER":"\ue66a","fs-rc_PLUS":"\ue66b","fs-rc_PLAYgreen":"\ue66c","fs-rc_PLAY":"\ue66d","fs-rc_PAUSEyellow":"\ue66e","fs-rc_PAUSE":"\ue66f","fs-rc_OPTIONS":"\ue670","fs-rc_OK":"\ue671","fs-rc_NEXT":"\ue672","fs-rc_MUTE":"\ue673","fs-rc_MINUS":"\ue674","fs-rc_MENU":"\ue675","fs-rc_MEDIAMENU":"\ue676","fs-rc_LEFT":"\ue677","fs-rc_INFO":"\ue678","fs-rc_HOME":"\ue679","fs-rc_HELP":"\ue67a","fs-rc_HDMI":"\ue67b","fs-rc_GREEN .path1":"\ue67c","fs-rc_GREEN .path2":"\ue67d","fs-rc_FFblue":"\ue67e","fs-rc_FF":"\ue67f","fs-rc_EXIT":"\ue680","fs-rc_EPG":"\ue681","fs-rc_EJECT":"\ue682","fs-rc_DOWN":"\ue683","fs-rc_dot":"\ue684","fs-rc_BLUE .path1":"\ue685","fs-rc_BLUE .path2":"\ue686","fs-rc_BLANK":"\ue687","fs-rc_BACK":"\ue688","fs-rc_AV":"\ue689","fs-rc_AUDIO":"\ue68a","fs-rc_9":"\ue68b","fs-rc_8":"\ue68c","fs-rc_7":"\ue68d","fs-rc_6":"\ue68e","fs-rc_5":"\ue68f","fs-rc_4":"\ue690","fs-rc_3":"\ue691","fs-rc_2":"\ue692","fs-rc_1":"\ue693","fs-rc_0":"\ue694","fs-people_sensor":"\ue695","fs-outside_socket":"\ue696","fs-motion_detector":"\ue697","fs-message_socket_unknown":"\ue698","fs-message_socket_on2":"\ue699","fs-message_socket_off2":"\ue69a","fs-message_socket_off":"\ue69b","fs-message_socket_enabled":"\ue69c","fs-message_socket_disabled":"\ue69d","fs-max_wandthermostat":"\ue69e","fs-max_heizungsthermostat":"\ue69f","fs-lock":"\ue6a0","fs-light_toggle":"\ue6a1","fs-light_question .path1":"\ue6a2","fs-light_question .path2":"\ue6a3","fs-light_question .path3":"\ue6a4","fs-light_question .path4":"\ue6a5","fs-light_question .path5":"\ue6a6","fs-light_question .path6":"\ue6a7","fs-light_outdoor":"\ue6a8","fs-light_on-for-timer":"\ue6a9","fs-light_off-for-timer":"\ue6aa","fs-light_exclamation .path1":"\ue6ab","fs-light_exclamation .path2":"\ue6ac","fs-light_exclamation .path3":"\ue6ad","fs-light_exclamation .path4":"\ue6ae","fs-light_exclamation .path5":"\ue6af","fs-light_exclamation .path6":"\ue6b0","fs-light_dim_up":"\ue6b1","fs-light_dim_down":"\ue6b2","fs-light_ceiling_off":"\ue6b3","fs-light_ceiling":"\ue6b4","fs-lan_rs485":"\ue6b5","fs-it_remote_folder .path1":"\ue6b6","fs-it_remote_folder .path2":"\ue6b7","fs-it_remote_folder .path3":"\ue6b8","fs-it_remote_folder .path4":"\ue6b9","fs-it_remote_folder .path5":"\ue6ba","fs-it_remote_folder .path6":"\ue6bb","fs-it_remote_folder .path7":"\ue6bc","fs-it_remote_folder .path8":"\ue6bd","fs-it_remote_folder .path9":"\ue6be","fs-it_remote_folder .path10":"\ue6bf","fs-it_remote_folder .path11":"\ue6c0","fs-it_remote_folder .path12":"\ue6c1","fs-it_remote_folder .path13":"\ue6c2","fs-it_remote_folder .path14":"\ue6c3","fs-it_remote_folder .path15":"\ue6c4","fs-it_remote_folder .path16":"\ue6c5","fs-it_remote_folder .path17":"\ue6c6","fs-it_remote_folder .path18":"\ue6c7","fs-it_remote_folder .path19":"\ue6c8","fs-it_remote_folder .path20":"\ue6c9","fs-it_remote_folder .path21":"\ue6ca","fs-it_i-net":"\ue6cb","fs-it_hue_bridge .path1":"\ue6cc","fs-it_hue_bridge .path2":"\ue6cd","fs-it_hue_bridge .path3":"\ue6ce","fs-it_hue_bridge .path4":"\ue6cf","fs-it_hue_bridge .path5":"\ue6d0","fs-it_hue_bridge .path6":"\ue6d1","fs-it_hue_bridge .path7":"\ue6d2","fs-it_hue_bridge .path8":"\ue6d3","fs-it_hue_bridge .path9":"\ue6d4","fs-it_hue_bridge .path10":"\ue6d5","fs-it_hue_bridge .path11":"\ue6d6","fs-it_hue_bridge .path12":"\ue6d7","fs-it_hue_bridge .path13":"\ue6d8","fs-it_hue_bridge .path14":"\ue6d9","fs-it_hue_bridge .path15":"\ue6da","fs-it_hue_bridge .path16":"\ue6db","fs-it_hue_bridge .path17":"\ue6dc","fs-it_hue_bridge .path18":"\ue6dd","fs-it_hue_bridge .path19":"\ue6de","fs-it_hue_bridge .path20":"\ue6df","fs-it_hue_bridge .path21":"\ue6e0","fs-it_hue_bridge .path22":"\ue6e1","fs-it_hue_bridge .path23":"\ue6e2","fs-IR":"\ue6e3","fs-Icon_Fisch":"\ue6e4","fs-humidity":"\ue6e5","fs-hue_bridge .path1":"\ue6e6","fs-hue_bridge .path2":"\ue6e7","fs-hue_bridge .path3":"\ue6e8","fs-hue_bridge .path4":"\ue6e9","fs-hue_bridge .path5":"\ue6ea","fs-hue_bridge .path6":"\ue6eb","fs-hue_bridge .path7":"\ue6ec","fs-hue_bridge .path8":"\ue6ed","fs-hue_bridge .path9":"\ue6ee","fs-hue_bridge .path10":"\ue6ef","fs-hue_bridge .path11":"\ue6f0","fs-hue_bridge .path12":"\ue6f1","fs-hue_bridge .path13":"\ue6f2","fs-hue_bridge .path14":"\ue6f3","fs-hue_bridge .path15":"\ue6f4","fs-hue_bridge .path16":"\ue6f5","fs-hue_bridge .path17":"\ue6f6","fs-hue_bridge .path18":"\ue6f7","fs-hue_bridge .path19":"\ue6f8","fs-hue_bridge .path20":"\ue6f9","fs-hue_bridge .path21":"\ue6fa","fs-hue_bridge .path22":"\ue6fb","fs-hue_bridge .path23":"\ue6fc","fs-hourglass":"\ue6fd","fs-hm-tc-it-wm-w-eu":"\ue6fe","fs-hm-dis-wm55":"\ue6ff","fs-hm-cc-rt-dn":"\ue700","fs-hm_lan":"\ue701","fs-hm_keymatic":"\ue702","fs-hm_ccu":"\ue703","fs-general_ok":"\ue704","fs-general_low":"\ue705","fs-general_aus_fuer_zeit":"\ue706","fs-general_aus":"\ue707","fs-general_an_fuer_zeit":"\ue708","fs-general_an":"\ue709","fs-garden_socket":"\ue70a","fs-fts_window_1wbb_open":"\ue70b","fs-fts_shutter_updown":"\ue70c","fs-fts_door_tilt":"\ue70d","fs-fts_door_right_open":"\ue70e","fs-fts_door_right":"\ue70f","fs-frost":"\ue710","fs-floor":"\ue711","fs-dustbin":"\ue712","fs-dreambox":"\ue713","fs-dog_silhouette":"\ue714","fs-DIN_rail_housing .path1":"\ue715","fs-DIN_rail_housing .path2":"\ue716","fs-DIN_rail_housing .path3":"\ue717","fs-DIN_rail_housing .path4":"\ue718","fs-DIN_rail_housing .path5":"\ue719","fs-DIN_rail_housing .path6":"\ue71a","fs-DIN_rail_housing .path7":"\ue71b","fs-DIN_rail_housing .path8":"\ue71c","fs-DIN_rail_housing .path9":"\ue71d","fs-DIN_rail_housing .path10":"\ue71e","fs-DIN_rail_housing .path11":"\ue71f","fs-DIN_rail_housing .path12":"\ue720","fs-DIN_rail_housing .path13":"\ue721","fs-DIN_rail_housing .path14":"\ue722","fs-DIN_rail_housing .path15":"\ue723","fs-DIN_rail_housing .path16":"\ue724","fs-DIN_rail_housing .path17":"\ue725","fs-DIN_rail_housing .path18":"\ue726","fs-DIN_rail_housing .path19":"\ue727","fs-DIN_rail_housing .path20":"\ue728","fs-DIN_rail_housing .path21":"\ue729","fs-DIN_rail_housing .path22":"\ue72a","fs-DIN_rail_housing .path23":"\ue72b","fs-DIN_rail_housing .path24":"\ue72c","fs-DIN_rail_housing .path25":"\ue72d","fs-DIN_rail_housing .path26":"\ue72e","fs-DIN_rail_housing .path27":"\ue72f","fs-DIN_rail_housing .path28":"\ue730","fs-DIN_rail_housing .path29":"\ue731","fs-DIN_rail_housing .path30":"\ue732","fs-DIN_rail_housing .path31":"\ue733","fs-DIN_rail_housing .path32":"\ue734","fs-DIN_rail_housing .path33":"\ue735","fs-DIN_rail_housing .path34":"\ue736","fs-DIN_rail_housing .path35":"\ue737","fs-DIN_rail_housing .path36":"\ue738","fs-DIN_rail_housing .path37":"\ue739","fs-DIN_rail_housing .path38":"\ue73a","fs-DIN_rail_housing .path39":"\ue73b","fs-DIN_rail_housing .path40":"\ue73c","fs-DIN_rail_housing .path41":"\ue73d","fs-DIN_rail_housing .path42":"\ue73e","fs-DIN_rail_housing .path43":"\ue73f","fs-DIN_rail_housing .path44":"\ue740","fs-DIN_rail_housing .path45":"\ue741","fs-DIN_rail_housing .path46":"\ue742","fs-DIN_rail_housing .path47":"\ue743","fs-DIN_rail_housing .path48":"\ue744","fs-DIN_rail_housing .path49":"\ue745","fs-day_night":"\ue746","fs-cul_usb":"\ue747","fs-cul_cul":"\ue748","fs-cul_868":"\ue749","fs-cul":"\ue74a","fs-christmas_tree":"\ue74b","fs-building_security":"\ue74c","fs-building_outside":"\ue74d","fs-building_carport_socket":"\ue74e","fs-building_carport_light":"\ue74f","fs-building_carport":"\ue750","fs-bluetooth":"\ue751","fs-batterie":"\ue752","fs-bag":"\ue753","fs-ampel_rot .path1":"\ue754","fs-ampel_rot .path2":"\ue755","fs-ampel_gruen .path1":"\ue756","fs-ampel_gruen .path2":"\ue757","fs-ampel_gelb .path1":"\ue758","fs-ampel_gelb .path2":"\ue759","fs-ampel_aus":"\ue75a","fs-alarm_system_password":"\ue75b","fs-access_keypad_2":"\ue75c","fs-access_keypad_1":"\ue75d"};
		//helper code for retrieving glyph information for FONT_AWESOME, not needed for normal operation
		/*var faCheatsLoaded = false;

		if (faPage === undefined) {
			var faPage = document.createElement("div");
			$(faPage).load('http://fortawesome.github.io/Font-Awesome/cheatsheet/ div.col-md-4.col-sm-6', function( response, status, xhr ) {
				for (var i=0, ll=faPage.childNodes.length; i<ll; i++) {
					var tc = faPage.childNodes[i].textContent;
					if (tc.indexOf('fa') >=0) {
						tc = tc.replace(/ /g, '');
						lines = tc.split('\n');
						sname = lines[3];
						sglyph = "\\u" + lines[5].substring(4, lines[5].indexOf(';'));
						FONT_AWESOME[sname]=sglyph;
					}
				}
				faCheatsLoaded = true;
			});
		} else
		{
			faCheatsLoaded = true;
		}
		
		waitForFaUnicodes();
		
		function waitForFaUnicodes() {
			setTimeout(function(){
				if (!faCheatsLoaded) {
					waitForFaUnicodes();
				}else{
					console.log(JSON.stringify(FONT_AWESOME));
				}
			},100);
		}*/

		glyphs = name.split(' ');
		var ret = "";
		for (var i=0, ll=glyphs.length; i<ll; i++) {
			ret += (name.indexOf('fa-')>=0)?FONT_AWESOME[glyphs[i]]:(name.indexOf('fs-')>=0)?FONT_FHEMSVG[glyphs[i]]:FONT_OPENAUTOMATION[glyphs[i]];
		}
		return(ret);
	},
	createElemFrag: function(elem) { // create new graphic svg element
		return $(document.createDocumentFragment('http://www.w3.org/2000/svg', elem));
	},
	precision: function(a) { // calculate number of fractional digits
		var s = a + "",
		d = s.indexOf('.') + 1;
		return !d ? 0 : s.length - d;
	},
	getStyleRuleValue: function(res, style, selector) { // helper function for getting style values
		var FirstChar = selector.charAt(0);
		var Remaining = selector.substring(1);
		res.attr({'class':Remaining}); // make sure the style is already used so that we get the right information
		//var elem = (FirstChar =='#') ?  document.getElementById(Remaining) : document.getElementsByClassName(Remaining)[0];
		//console.log(selector, style, $(selector.replace(' ','.')).css(style), window.getComputedStyle(elem,null).getPropertyValue(style));
		//ret = window.getComputedStyle(elem,null).getPropertyValue(style).indexOf('#');
		return $(res).css(style);
	},
	scaleStroke: function(container, style, scale) {
		var styleV = widget_chart.getStyleRuleValue(container, 'stroke-width', style);
		var strk = scale * ((styleV)?parseFloat(styleV.split('px')):1);
		styleV = widget_chart.getStyleRuleValue(container, 'stroke-dasharray', style);
		if (styleV && styleV!='none') {
			var dashA = styleV.split(',');
			for(var i=0, ll=dashA.length; i<ll; i++) {
				dashA[i] = parseFloat(dashA[i].split('px'))*scale+'px';
			}
			var dashArray = dashA.join(',');
		}
		return {stroke:strk, dash:dashArray};
	},
	computeControlPoints4: function(p1, p2, p3) { // helper function for calculation of control points for SVG splines used in interpolated plots
		var dx1 = p1.x - p2.x;
		var dy1 = p1.y - p2.y;
		var dx2 = p2.x - p3.x;
		var dy2 = p2.y - p3.y;
		
		var l1 = Math.sqrt(dx1*dx1 + dy1*dy1);
		var l2 = Math.sqrt(dx2*dx2 + dy2*dy2);
		
		m1 = {x: (p1.x + p2.x) / 2.0, y: (p1.y + p2.y) / 2.0};
		m2 = {x: (p2.x + p3.x) / 2.0, y: (p2.y + p3.y) / 2.0};

		dxm = (m1.x - m2.x);
		dym = (m1.y - m2.y);
		
		k = (((l1+l2)!=0)?l2 / (l1+l2):0);
		cm = {x: m2.x + dxm*k, y: m2.y + dym*k};
		tx = p2.x - cm.x;
		ty = p2.y - cm.y;

		cp1 = {x: m1.x + tx, y: m1.y + ty};
		cp2 = {x: m2.x + tx, y: m2.y + ty};
		
		return {p1:cp1, p2:cp2};
	},
	computeControlPoints3: function(arg) { // calculation of control points for SVG splines used in interpolated plots
		var n = arg.length;
		nc = 1;

		cx = {p1:new Array(), p2:new Array()};
		cy = {p1:new Array(), p2:new Array()};

		for (var i=0, leni=n-1; i<leni ; i++)
		{
			iloc = 0;
			lK=new Array();
			for (var ii=i-nc, lenii=i+nc+1; ii<=lenii; ii++)
			{
				icorr = Math.max(0,Math.min(ii,n-1));
				lK[iloc] = {x: parseFloat(arg[icorr][0]), y:parseFloat(arg[icorr][1])};
				iloc = iloc+1;
			}
			
			re = widget_chart.computeControlPoints4(lK[0], lK[1], lK[2]);	
			cx.p1[i] = re.p2.x;
			cy.p1[i] = re.p2.y;

			re = widget_chart.computeControlPoints4(lK[1], lK[2], lK[3]);
			cx.p2[i] = re.p1.x;
			cy.p2[i] = re.p1.y;	
		}
		return {cx:cx, cy:cy};
	},
	getSVGPoints: function (arg, min, xmax, ptype, closed) { // function for generation of strings for d attribute in SVG paths for different plot types
		if (arg.length < 1) return; // empty array, nothing to do

		var res = [];
		
		switch (ptype) {
			case 'lines':
				res.push("M" + arg[0][0] + "," + (closed?min:arg[0][1]) + " L");
				for (var i=0,l=arg.length;i<l;i++) {
					if(arg[i])
					res.push(arg[i].join(','));
				}
				res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				break;
			case 'steps':
				res.push("M" + arg[0][0] + "," + (closed?min:arg[0][1]) + " L");
				for (var i=0,l=arg.length-1;i<l;i++) {
					if(arg[i]) {
						res.push(arg[i].join(','));
						res.push(arg[i+1][0] + ',' + arg[i][1]);
					}
				}
				res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				break;
			case 'fsteps':
				res.push("M" + arg[0][0] + "," + (closed?min:arg[0][1]) + " L");
				for (var i=0,l=arg.length-1;i<l;i++) {
					if(arg[i]) {
						res.push(arg[i].join(','));
						res.push(arg[i][0] + ',' + arg[i+1][1]);
					}
				}
				res.push(arg[arg.length-1][0] + ',' + arg[arg.length-1][1]);
				res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				break;
			case 'histeps':
				if (arg.length > 1) {
					res.push("M" + (3*parseFloat(arg[0][0])-parseFloat(arg[1][0]))/2 + "," + (closed?min:arg[0][1]) + " L");
					res.push((3*parseFloat(arg[0][0])-parseFloat(arg[1][0]))/2 + "," + (arg[0][1]));
					res.push((parseFloat(arg[0][0])+parseFloat(arg[1][0]))/2 + "," + (arg[0][1]));
					for (var i=1,l=arg.length-1;i<l;i++) {
						if(arg[i]) {
							var xval = (parseFloat(arg[i-1][0])+parseFloat(arg[i][0]))/2;
							res.push(xval + ',' + arg[i][1]);
							xval = (parseFloat(arg[i][0])+parseFloat(arg[i+1][0]))/2;
							res.push(xval + ',' + arg[i][1]);
						}
					}
					res.push((parseFloat(arg[arg.length-2][0])+parseFloat(arg[arg.length-1][0]))/2 + "," + arg[arg.length-1][1]);
					res.push(arg[arg.length-1][0] + "," + arg[arg.length-1][1]);
					res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				} else {
					res.push("M 0," + (closed?min:arg[0][1]) + " L");
					res.push(" 0," + arg[0][1]);
					res.push(xmax + "," + arg[0][1]);
					res.push(xmax + "," + (closed?min+" Z":arg[0][1]));
				}
				break;
			case 'bars':
				res.push("M" + arg[0][0] + "," + (closed?min:arg[0][1]) + " L");
				var step = parseFloat(arg[arg.length-1][0])-parseFloat(arg[0][0]);
				for (var i=1,l=arg.length;i<l;i++) {
					var diff = (parseFloat(arg[i-1][0])-parseFloat(arg[i][0]));
					(diff<0)?diff=-diff:diff=diff;
					(diff<step && diff!=0)?step=diff:step=step;
				}
				step = step*0.4;
				for (var i=0,l=arg.length;i<l;i++) {
					if(arg[i]) {
						var xval = (parseFloat(arg[i][0])-step);
						res.push(xval + ',' + min);
						res.push(xval + ',' + arg[i][1]);
						xval = (parseFloat(arg[i][0])+step);
						res.push(xval + ',' + arg[i][1]);
						res.push(xval + ',' + min);
					}
				}
				res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				break;
			case 'ibars':
				if (arg.length > 1) {
					res.push("M" + arg[0][0] + "," + (closed?min:arg[0][1]) + " L");
					res.push((parseFloat(arg[0][0])+parseFloat(arg[1][0]))/2 + "," + (closed?min:arg[0][1]));
					for (var i=1,l=arg.length-1;i<l;i++) {
						if(arg[i]) {
							var xval = (parseFloat(arg[i-1][0])+parseFloat(arg[i][0]))/2;
							res.push(xval + ',' + min);
							res.push(xval + ',' + arg[i][1]);
							xval = (parseFloat(arg[i][0])+parseFloat(arg[i+1][0]))/2;
							res.push(xval + ',' + arg[i][1]);
							res.push(xval + ',' + min);
						}
					}
					res.push((parseFloat(arg[arg.length-2][0])+parseFloat(arg[arg.length-1][0]))/2 + "," + arg[arg.length-1][1]);
					res.push(arg[arg.length-1][0] + "," + arg[arg.length-1][1]);
					res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				} else {
					res.push("M 0," + min + " L");
					res.push(" 0," + arg[0][1]);
					res.push(xmax + "," + arg[0][1]);
					res.push(xmax + "," + min + (closed?" Z":""));
				}
				break;
			case 'cubic':
				res.push("M" + arg[0][0] + "," + (closed?min:arg[0][1]) + " L");
				var cp = widget_chart.computeControlPoints3(arg);
				var cx = cp.cx;
				var cy = cp.cy;
				res.push(arg[0][0] + ", " + arg[0][1] + " C");
				for (var i=0,l=arg.length-1;i<l;i++) {
					if(arg[i]) {
						res.push(cx.p1[i] + ", " + cy.p1[i] + ", " + cx.p2[i] + ", " + cy.p2[i] + ", " + arg[i+1] + " ");
					}
				}
				res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				break;
			case 'quadratic':
				res.push("M" + arg[0][0] + "," + (closed?min:arg[0][1]) + " L");
				var cp = widget_chart.computeControlPoints3(arg);
				var cx = cp.cx;
				var cy = cp.cy;
				res.push(arg[0][0] + ", " + arg[0][1] + " Q");
				for (var i=0,l=arg.length-1;i<l;i++) {
					if(arg[i]) {
						res.push(cx.p2[i] + ", " + cy.p2[i] + ", " + arg[i+1] + " ");
					}
				}
				res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				break;
			case 'quadraticSmooth':
				res.push("M" + arg[0][0] + "," + (closed?min:arg[0][1]) + " L");
				res.push(arg[0][0] + ", " + arg[0][1] + " T");
				for (var i=0,l=arg.length-1;i<l;i++) {
					if(arg[i]) {
						res.push(((parseFloat(arg[i][0])+parseFloat(arg[i+1][0]))/2) + ", " + ((parseFloat(arg[i][1])+parseFloat(arg[i+1][1]))/2) + " ");
					}
				}
				res.push("L" + arg[arg.length-1][0] + "," + (closed?min + " Z":arg[arg.length-1][1]));
				break;
		}
		return res.join(' ');
	},
	scaleValues: function(pointsarray, data) {
		var uaxis_array = data.uaxis;
		for (var k=0,l=pointsarray.length; k<l; k++) {
			if ($.isArray(uaxis_array)) {var uaxis = uaxis_array[k];} else if (uaxis_array) {var uaxis = uaxis_array;} else {var uaxis = 'primary';}
			var yscale = (uaxis!='secondary')?data.scaleY:data.scaleY_sec;
			var yshift = (uaxis!='secondary')?data.shiftY:data.shiftY_sec;
			for (var i=0,ll=pointsarray[k].length; i<ll; i++) {
				pointsarray[k][i][1] = pointsarray[k][i][1]*yscale-yshift;
			}
		}
	},
	getValues: function (x,y,left,width,xrange,values,pointsarray) { // helper function for calculation of positions and values for crosshair cursor
		if (width > 0) {
			var xval=parseInt((x-left)/width*xrange);
			var index=0;
			for (var k=0,l=pointsarray.length; k<l; k++) {
				if (pointsarray[k] && pointsarray[k].length > 0) {
					for (var i=0,ll=pointsarray[k].length; i<ll; i++) {
						if (pointsarray[k][i][0]>xval) {
							index=i;
							break;
						}
					}
					if (index>0 && index<pointsarray[k].length) {
						if ((xval-pointsarray[k][index-1][0])>(pointsarray[k][index][0]-xval)) {
							var val=[pointsarray[k][index][0]/xrange*width+left,pointsarray[k][index][1]];
							values[k]=val;
						} else {
							var val=[pointsarray[k][index-1][0]/xrange*width+left,pointsarray[k][index-1][1]];
							values[k]=val;
						}
					} else {
						if (xval < pointsarray[k][0][0]) {
							var val=[pointsarray[k][0][0]/xrange*width+left,pointsarray[k][0][1]];
							values[k]=val;
						} else {
							var val=[pointsarray[k][pointsarray[k].length-1][0]/xrange*width+left,pointsarray[k][pointsarray[k].length-1][1]];
							values[k]=val;
						}
					}
				}
			}
		}
	},
	getArrayValue: function(array,i,defVal) {
		if ($.isArray(array)) {var rVal = array[Math.min(i,array.length-1)];} else if (array) {var rVal = array;} else {var rVal = defVal;}
		return rVal;
	},
	getArrayLength: function(array) {
		var n=0;
		if ($.isArray(array)) var n = array.length;
		return n;
	},
	getDaysAgo: function (dStr) {	// helper function to check date strings
		if ($.isNumeric(dStr)) return parseFloat(dStr);
		var ds = new Date(dStr);
		if (isNaN(ds.getMonth())) { // date string is not valid, check if string is a number
			return 'NaN';
		} else {
			var now = new Date();
			return widget_chart.dateDiff(ds, new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0), 'd');
		}
	},
	dateDiff: function (dfrom,dto,selector){ // helper function for calculation of date differences
		//dfrom: Startdatum als String, "" für das aktuelle Datum/Zeit oder Date-Object
		//dto:   Enddatum als String, "" für das aktuelle Datum/Zeit  oder Date-Object
		//selctor: 'ms' Millisekunden, 's' Sekunden, 'm' Minuten, 'h' Stunden,
		// 'd' tage, 'w' wochen, 'y' ganze Jahre
		var r,dfy,dy;
		var osl = {ms:1,s:1000,m:60000,h:3600000,d:86400000,w:604800000,y:-1};
		var df = typeof(dfrom)=="object" ? dfrom : dfrom=="" ? new Date() : new Date(dfrom);
		var dt = typeof(dto)=="object" ? dto : dto=="" ? new Date() : new Date(dto);
		var sl = osl[selector] || 1;
		var sz= sl >= osl['d'] ? (df.getTimezoneOffset()-dt.getTimezoneOffset())*60000 : 0;
		if(sl > 0) return (dt.getTime() - df.getTime() +sz)/sl;
		else { dfy = df.getFullYear();
			   dy = dt.getFullYear() - dfy;
			   dt.setFullYear(dfy);
			   return (dt.getTime() < df.getTime()) ? dy -1 : dy; }
	},
	propagateEvent: function(event) {
		// check if other charts are in same cursorgroup and eventually trigger mouse events
		var target = $(event.delegateTarget).parents("[class^=basesvg]");
		var dataE = target.parent().data();
		var scE = dataE.days_start - dataE.days_end;
		$(document).find("[class^=basesvg]").each(function() {
			var data = $(this).parent().data();
			if ((data.cursorgroup == dataE.cursorgroup) && dataE.cursorgroup!=undefined && dataE.instance!=data.instance) {
				var dShift = data.days_start-dataE.days_start;
				var sc = data.days_start-data.days_end;
				var scW = data.graphArea.width/dataE.graphArea.width;
				e = $.Event(event.type);
				e.pageX = data.graphArea.left + ((event.pageX-dataE.graphArea.left)*scE/sc + (dShift/sc)*dataE.graphArea.width)*scW;
				e.delegateTarget = $(this).find("rect.chart-background, [id*='graph-']");
				widget_chart.doEvent(e);
			}
		});
	},
	doEvent: function(event) { // function for activities to be performed when events occur
		var target = $(event.delegateTarget).parents("[class^=basesvg]");
		var data = target.parent().data();
		var instance = data.instance;
		var crosshair = target.find('svg.crosshair');
		var crht = crosshair.find('text.crosshair');
		var crh_text = [];
		crht.each(function(index) {crh_text[index] = $(this);});

		switch (event.type) { // split into different activities for different events
			case 'mouseenter': case 'mousemove':
				//$(event.delegateTarget).append(widget_chart.createElem('text').attr({'class':'debug','x':'20','y':'20'}));
				//event.preventDefault();
				if(data.crosshair)	{
					//console.log("Mouseenter Event",$(event.delegateTarget).parents("[class^=basesvg]").parent().data'crs_inactive'));
					if (crosshair && !data.crs_inactive && data.pointsarrayCursor) {
						var x = event.pageX - data.chartArea.left;
						noticks = ( data.width <=100 ) ? true : target.parent().hasClass('noticks');
						crosshair.find('line.crosshair').attr({'x1':x, 'y1':data.topOffset, 'x2':x, 'y2':data.chartArea.height-(noticks?0:data.bottomOffset)});
						var values=[];
						var ind = ((parseInt(x+0.5)<=0)?0:((parseInt(x+0.5)>=data.pointsarrayCursor.length)?data.pointsarrayCursor.length-1:(parseInt(x+0.5))));
						values = data.pointsarrayCursor[ind];
						var lastV = data.lastV;
						if (!lastV) lastV = values;
						for (var i=0,ll=values.length; i<ll; i++) {
							if (values[i] && (values[i][0] != lastV[i][0])) {
								if ($.isArray(data.uaxis)) {var uxis = data.uaxis[i];} else if (data.uaxis) {var uxis = data.uaxis;} else {var uxis = 'primary';}
								var yscale = (uxis!='secondary')?data.scaleY:data.scaleY_sec;
								var yshift = (uxis!='secondary')?data.shiftY:data.shiftY_sec;
								var mx = (uxis!='secondary')?data.max_save:data.max_save_sec;
								var mn = (uxis!='secondary')?data.min_save:data.min_save_sec;
								var legendY=(((mx-values[i][1]))/(mx-mn)*data.graphHeight/100*target.height()+data.topOffset);
								crh_text[i].attr({'x':values[i][0], 'y':legendY+''});
								data.graphsshown[i]?
									crh_text[i].text(data.legend[i] + ": " + (parseInt((values[i][1]+yshift)/yscale*100+0.5))/100 + " " + (uxis!='secondary'?data.yunit:data.yunit_sec)):
									crh_text[i].text("");
							}
						}
						data.lastV = values;
						//console.log(values);
						if (event.type == 'mouseenter') {
							for (var i=0, ll=crh_text.length; i<ll; i++) {crh_text[i].text = "";}
							crosshair.show();
							//event.stopPropagation();
						}
					}
				}
				break;
				
			case 'mouseleave':
				//$(event.delegateTarget).find("text.debug").remove();
				if($(event.delegateTarget).parents("[class^=basesvg]").parent().data('crosshair'))	{
					//console.log("Mouseleave Event",$(event.delegateTarget).parents("[class^=basesvg]").parent().data'crs_inactive'));
					if (crosshair) {crosshair.hide();}
				}
				break;
		}
	},
	shift: function(evt,elem,offset){ // calculate new start and end dates when user wants to shift graph
		var dataE = elem.data();
		var width = dataE.days_start-dataE.days_end;
		dataE.days_start = dataE.days_start+offset*(width);
		dataE.days_end = dataE.days_end+offset*(width);
		widget_chart.refresh(elem,'shift',-offset);
		
		// check if other charts are in the same scrollgroup and shift them as well
		$(document).find("[class^=basesvg]").each(function() {
			var data = $(this).parent().data();
			if ((data.scrollgroup == dataE.scrollgroup) && dataE.scrollgroup!=undefined && dataE.instance!=data.instance) {
				var width = data.days_start-data.days_end;
				data.days_start = data.days_start+offset*(width);
				data.days_end = data.days_end+offset*(width);
				widget_chart.refresh($(this).parent(),'shift',-offset);
			}
		});
	},
	scale: function(evt,elem,scale){ // calculate new start and end dates when user wants to scale graph
		var dataE = elem.data();
		dataE.days_start = dataE.days_end + ((dataE.days_start-dataE.days_end) * scale);
		widget_chart.refresh(elem,'scale');

		// check if other charts are in the same scrollgroup and scale them as well
		$(document).find("[class^=basesvg]").each(function() {
			var data = $(this).parent().data();
			if ((data.scrollgroup == dataE.scrollgroup) && dataE.scrollgroup!=undefined && dataE.instance!=data.instance) {
				data.days_start = data.days_end + ((data.days_start-data.days_end) * scale);
				widget_chart.refresh($(this).parent(),'scale');
			}
		});
	},
	swipe: function(base,instance,direction,leftright,data_new,data_old){ // perform animation when scaling/shifting graph
		var graphs = base.find("[id*='graph-']");
		var graphs_old = base.find("[id*='graphold-']");
		if (graphs.length == 0) return;

		if (direction=="horizontal-shift") {
			for (var i=0,l=graphs_old.length; i<l; i++) {
				if ($.isArray(data_old.uaxis)) {var uaxis = data_old.uaxis[i];} else if (data_old.uaxis) {var uaxis = data_old.uaxis;} else {var uaxis = 'primary';}
				var shifty = (uaxis!='secondary')?data_old.shiftY*data_new.scaleY/data_old.scaleY-data_new.shiftY:data_old.shiftY_sec*data_new.scaleY_sec/data_old.scaleY_sec-data_new.shiftY_sec;
				var scaley = (uaxis!='secondary')?data_new.scaleY/data_old.scaleY:data_new.scaleY_sec/data_old.scaleY_sec;
				if (data_old.graphsshown[i]) animateVisibilityShift($(graphs_old[i]), 1, 0, leftright, 1, data_new, data_old, shifty, scaley);
			}
			for (var i=0,l=graphs.length; i<l; i++) {
				if (data_old.graphsshown[i]) animateVisibilityShift($(graphs[i]), 1, 0, leftright, 0, data_new, data_new, 0, 1);
			}
		} else if (direction=="scale") {
			if (data_new.xrange > data_old.xrange) {
				graphs_old.remove();
				for (var i=0,l=graphs.length; i<l; i++) {
					if (data_old.graphsshown[i]) animateVisibilityScale($(graphs[i]), data_new.xrange/data_old.xrange, 1, data_new.xrange/data_old.xrange/20, 0, data_new, data_old, 0, 1);
				}
			} else {
				graphs.attr("transform","scale(0,0)"); // use scale instead of hide for hiding because hide had strange side effects
				for (var i=0,l=graphs_old.length; i<l; i++) {
					if ($.isArray(data_old.uaxis)) {var uaxis = data_old.uaxis[i];} else if (data_old.uaxis) {var uaxis = data_old.uaxis;} else {var uaxis = 'primary';}
					var shifty = (uaxis!='secondary')?data_old.shiftY*data_new.scaleY/data_old.scaleY-data_new.shiftY:data_old.shiftY_sec*data_new.scaleY_sec/data_old.scaleY_sec-data_new.shiftY_sec;
					var scaley = (uaxis!='secondary')?data_new.scaleY/data_old.scaleY:data_new.scaleY_sec/data_old.scaleY_sec;
					if (data_old.graphsshown[i]) animateVisibilityScale($(graphs_old[i]), data_new.xrange/data_old.xrange, 1, data_new.xrange/data_old.xrange/20, 1, data_new, data_old, shifty, scaley, $(graphs[i]));
				}
			}
		}

		function animateVisibilityScale(sel, currval, maxval, step, inout, data_new, data_old, transy, scaley, sel_new) { // recursively called function for animated scaling of graphs
			var scalex = currval;
			var transx = (currval<maxval)?data_old.xrange*(data_new.xrange/data_old.xrange-currval):data_new.xrange*(1-currval);
			
			sel.attr("transform", "translate("+transx+", "+transy+" ) "+"scale("+scalex+","+scaley+")");

			if(currval != maxval) {
				currval += (currval<maxval ? step : -step);
				currval = Math.round(currval*100)/100;
				setTimeout(function(){ animateVisibilityScale(sel,currval,maxval,step,inout, data_new, data_old, transy, scaley, sel_new) }, 10);
			} else {
				if (inout==1) {
					sel.remove();							// remove old graph as animation is finished
					sel_new.attr("transform","scale(1,1)");	// show new graph after animation has finished
				}
			}
		}
		
		function animateVisibilityShift(sel, currval, maxval, leftright, inout, data_new, data_old, transy, scaley) {// recursively called function for animated shifting of graphs
			var transx = 0;
			(inout==0)?transx = parseFloat(sel.attr("xrange"))*leftright*(currval):transx = parseFloat(sel.attr("xrange"))*leftright*(currval-1);
			sel.attr("transform", "translate("+transx+", "+transy+") "+"scale(1,"+scaley+")");

			if(currval != maxval) {
				currval += (currval<maxval ? 0.04 : -0.04);
				currval = Math.round(currval*100)/100;
				setTimeout(function(){ animateVisibilityShift(sel,currval,maxval,leftright,inout, data_new, data_old, transy, scaley) }, 10);
			} else {
				if (inout==1) sel.remove();
			}
		}
	},
	toggle: function(evt,instance){ // swith on/off graph including fade out/in animation
		var index = $(evt.delegateTarget).attr('igraph');
		var base = $(evt.delegateTarget).parents("[class^=basesvg]");
		var graph = base.find("[id*='graph-"+instance+"-"+index+"']");
		var uaxis = graph.attr('id').split("-")[0];
		var ptype = graph.attr('id').split("-")[4];

		animateVisibility(graph, (graph.attr('animstate')=='show')?0:1, (graph.attr('animstate')=='show')?1:0);
		(graph.attr('animstate')=='show')?$(evt.delegateTarget).attr('opacity',1):$(evt.delegateTarget).attr('opacity',0.5);
		base.parent().data('graphsshown')[index]=!base.parent().data('graphsshown')[index];
		
		function animateVisibility(sel, currval, maxval) { // recursively called function for fade out/in animation using translate attribute
			var h = parseFloat(sel.attr("min"));
			sel.attr("transform", "translate(0,"+h*(1-currval)+") "+
									"scale(1,"+currval+")");

			if(currval != maxval) {
			  currval += (currval<maxval ? 0.02 : -0.02);
			  currval = Math.round(currval*100)/100;
			  setTimeout(function(){ animateVisibility(sel,currval,maxval) }, 10);
			}
		}

		(graph.attr('animstate')=='show')?graph.attr('animstate','hide'):graph.attr('animstate','show');
	},
	init_attr: function(elem) { // initialize all attributes called from widget init function
		var data = elem.data();
		elem.data('minvalue_sec', typeof elem.data('minvalue_sec') != 'undefined' ? elem.data('minvalue_sec')  : 10);
		elem.data('maxvalue_sec', typeof elem.data('maxvalue_sec') != 'undefined' ? elem.data('maxvalue_sec')  : 30);
		elem.data('minvalue',     typeof elem.data('minvalue') != 'undefined' ? elem.data('minvalue')          : 10);
		elem.data('maxvalue',     typeof elem.data('maxvalue') != 'undefined' ? elem.data('maxvalue')          : 30);
		elem.data('daysago_start',elem.data('daysago_start')                                                  || '0');
		elem.data('daysago_end',  elem.data('daysago_end')                                                    || '-1');
		elem.data('xticks',       elem.data('xticks')                                                         || 'auto');
		elem.data('yticks',       elem.data('yticks')                                                         || 'auto');
		elem.data('yunit',        unescape(elem.data('yunit')                                                 || '' ));
		elem.data('yunit_sec',    unescape(elem.data('yunit_sec')                                             || '' ));
		elem.data('ytext',        unescape(elem.data('ytext')                                                 || '' ));
		elem.data('ytext_sec',    unescape(elem.data('ytext_sec')                                             || '' ));
		elem.data('style',        elem.data('style')                                                          || '' );
		elem.data('ptype',        elem.data('ptype')                                                          || 'lines' );
		elem.data('uaxis',        elem.data('uaxis')                                                          || 'primary' );
		elem.data('get',          elem.data('get')                                                            || 'STATE');
		elem.data('graphWidth',   91);
		elem.data('graphHeight',  87);
		elem.data('textWidth',    30);
		elem.data('textHeight',   9);
		elem.data('bottomOffset', elem.data('noticks')?0:2*elem.data('textHeight'));
		elem.data('topOffset',    2*elem.data('textHeight'));
		elem.data('crosshair',    elem.data('crosshair')                                                      || false);
		elem.data('crs_inactive', elem.data('crs_inactive')                                                   || false);
		elem.data('showlegend',   elem.data('showlegend')                                                     || false);
		elem.data('nofulldays',   elem.data('nofulldays')                                                     || false);
		elem.data('graphsshown',  []);

		data.days_start = widget_chart.getDaysAgo(data.daysago_start);
		if (data.days_start == 'NaN') data.days_start = 0;
		if (!data.nofulldays) data.days_start = parseInt(data.days_start);
		data.days_end = widget_chart.getDaysAgo(data.daysago_end);
		if (data.days_end == 'NaN') data.days_end = -1;
		if (!data.nofulldays) data.days_end = parseInt(data.days_end);
		if (data.days_start == data.days_end) data.days_end++;

		devices[elem.data('logdevice')] = true;
		devs.push(elem.data('logdevice'));
	},
	init: function () { // initialization of widget, run at widget creation/reload
		var base=this;

        if (!$.fn.draggable)
            dynamicload('../pgm2/jquery-ui.min.js', null, null, false);
		$('head').append('<link rel="stylesheet" href="'+ dir + '/../css/ftui_chart.css" type="text/css" />');

		this.elements = $('div[data-type="'+this.widgetname+'"]');
		this.elements.each(function(index) {

		widget_chart.init_attr($(this));
		
		var defaultHeight = $(this).hasClass('fullsize') ? '85%' : '';
		widget_chart.instance++;
		
		$(this).data('instance', widget_chart.instance);

		var gs = [];
		for (var k=0; k<$(this).data('logdevice').length; k++) {gs[k]=true;}
		$(this).data('graphsshown',gs);

		var svgElement = $(
				'<svg class="basesvg' + widget_chart.instance + '">'+
				'<g id="classesContainer" stroke="grey"></g>' +
				'</svg>');
		svgElement.appendTo($(this))
			.css("width",$(this).data('width') || '93%')
			.css("height",$(this).data('height') || defaultHeight);

		//base.refresh.apply(this);

		});
	},
	refresh: function (elem,type,swoffset) { // main function for generation of all HTML code and dynamics for graph called whenever thigs change (e.g. data update, shift, scale, ...)
		(elem) ? theObj=elem : theObj=this;
		var data = $(theObj).data();
		
		var minarray = data.minvalue;
		var maxarray = data.maxvalue;
		var minarray_sec = data.minvalue_sec;
		var maxarray_sec = data.maxvalue_sec;
		var min_sec = parseFloat( $.isArray(minarray_sec) ? minarray_sec[minarray_sec.length-1] : minarray_sec );
		var max_sec = parseFloat( $.isArray(maxarray_sec) ? maxarray_sec[0] : maxarray_sec );
		var logdevice_array = data.logdevice;
		var logfile_array = data.logfile;
		var columnspec_array = data.columnspec;
		var xticks = parseFloat( (data.xticks!="auto") ? data.xticks : -1 );
		var yticks = parseFloat( (data.yticks!="auto") ? data.yticks : -1);
		var autoscaley = data.yticks?data.yticks=="auto":true;
		var style_array = data.style;
		var ptype_array = data.ptype;
		var uaxis_array = data.uaxis;
		var fix = widget_chart.precision( data.yticks );
		var unit = data.yunit;
		var unit_sec = data.yunit_sec;
		var legend_array = data.legend;
		var noticks = ( data.width <=100 ) ? true : $(theObj).hasClass('noticks');
		var nobuttons = $(theObj).hasClass('nobuttons');
		var scale_sec = 1;

		var data_old = jQuery.extend({},$(theObj).data());

		var basescale = true; //(days_start==data.daysago_start) && (days_end==data.daysago_end);
		data.noticks = noticks;

		var instance = data.instance;

		var svg_old = $(theObj).find('svg.basesvg'+instance); // get previous graphics document (SVG, only skeleton at initial call)
		var classesContainer = svg_old.find('#classesContainer');

		if (basescale) { // minimum/maximum calculation for y axis from user input
			var min_prim = parseFloat( $.isArray(minarray) ? minarray[minarray.length-1] : (minarray!="auto") ? minarray : 100000.0 );
			var max_prim = parseFloat( $.isArray(maxarray) ? maxarray[0] : (maxarray!="auto") ? maxarray : -100000.0 );
			var min_sec = parseFloat( $.isArray(minarray_sec) ? minarray_sec[minarray_sec.length-1] : (minarray_sec!="auto") ? minarray_sec : 100000.0 );
			var max_sec = parseFloat( $.isArray(maxarray_sec) ? maxarray_sec[0] : (maxarray_sec!="auto") ? maxarray_sec : -100000.0 );
		} else { // never used currently
			min_prim = data.min_save;
			max_prim = data.max_save;
			min_sec = data.min_save_sec;
			max_sec = data.max_save_sec;			
		}
		
		// caluclation of min and max values for x axis from dates
		Date.prototype.stdTimezoneOffset = function() { // helper function to check Daytime Savings
			var jan = new Date(this.getFullYear(), 0, 1);
			var jul = new Date(this.getFullYear(), 6, 1);
			return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
		}
		Date.prototype.dst = function() {				// helper function to check Daytime Savings
			return this.stdTimezoneOffset() - this.getTimezoneOffset();
		}
		Number.prototype.pad = function(size) {			// helper function for adding leading zeros to numbers.
			var s = String(this);
			while (s.length < (size || 2)) {s = "0" + s;}
			return s;
		}

		var days_start = parseFloat(data.days_start);
		var days_end = parseFloat(data.days_end);
		if (days_end == days_start) days_end--;

		var now = new Date();
		var tstart = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);
		var tend = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0,0);
		var mindate=now;
		var maxdate=now;

		tstart.setTime(tstart.getTime() - (days_start*24*60*60*1000));
		tend.setTime(tend.getTime() - (days_end*24*60*60*1000));
		
		mindate = tstart.yyyymmdd() + '_' + (tstart.getHours()-tstart.dst()/60).pad() + ':' + tstart.getMinutes().pad() + ':' + tstart.getSeconds().pad();
		maxdate = tend.yyyymmdd() + '_' + (tend.getHours()-tend.dst()/60).pad() + ':' + tend.getMinutes().pad() + ':' + tend.getSeconds().pad();
		var xrange  = parseInt(diffMinutes(dateFromString(mindate),dateFromString(maxdate)));
		data.xrange = xrange;

		// check if arrays with data points are already existing and transfer them to working copies
		var pointsarray = (data.pointsarray)?data.pointsarray:[];
		var pointsarrayCursor = (data.pointsarrayCursor)?data.pointsarrayCursor:[];

		var foundPrimary = false, foundSecondary = false;
		
		//check the input arrays to derive the one with biggest length
		var nGraphs = 0;
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(logdevice_array));
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(logfile_array));
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(columnspec_array));
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(ptype_array));
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(uaxis_array));
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(legend_array));
		nGraphs = Math.max(nGraphs,widget_chart.getArrayLength(style_array));
		
		for (var k=0; k<nGraphs; k++) {	// main loop for getting information from HTTP server (FEHM)
			var points=[];

			// get graph definitions from configuration file
			var device = $(theObj).attr('data-device')||'';
			var reading = $(theObj).attr('data-get')||'';
			var logdevice = widget_chart.getArrayValue(logdevice_array,k,'');
			var columnspec = widget_chart.getArrayValue(columnspec_array,k,(device + ':' + reading));
			var ptype = widget_chart.getArrayValue(ptype_array,k,'lines');
			var logfile = widget_chart.getArrayValue(logfile_array,k,'-');
			var uaxis = widget_chart.getArrayValue(uaxis_array,k,'primary');
			var legend = widget_chart.getArrayValue(legend_array,k,'Graph '+k);

			// check if current graph is related to secondary or primary y axis
			if (uaxis != "secondary") {
				foundPrimary = true;
				var max = max_prim;
				var min = min_prim;
			} else {
				foundSecondary = true;
				var max = max_sec;
				var min = min_sec;
			}

			if(! columnspec.match(/.+:.+/)) { // column spec for HTTP call seems to be not correct
				console.log('columnspec '+columnspec+' is not ok in chart' + ($(theObj).attr('data-device')?' for device '+$(theObj).attr('data-device'):''));
			}
			
			var cmd =[
				'get',
				logdevice,
				logfile,
				'-',
				mindate,
				maxdate,
				columnspec
			];
			$.ajax({ // ajax call to get data from server
				url: $("meta[name='fhemweb_url']").attr("content") || "../fhem/",
				async: false,
				cache: false,
				context: {elem: $(theObj)},
				data: {
					cmd: cmd.join(' '),
					XHR: "1"
				},
			}).done(function(dat) {
				var lines = dat.split('\n');
				var point=[];
				var i=0;
				var tstart = dateFromString(mindate);
				$.each( lines, function( index, value ) {
					if (value){
						var val = getPart(value.replace('\r\n',''),2);
						var minutes = diffMinutes(tstart,dateFromString(value));
						if (val && minutes && $.isNumeric(val)){
							point=[minutes,val];
							i++;
							points[index]=point;
							var minAry = (uaxis!="secondary") ? minarray : minarray_sec; 
							var maxAry = (uaxis!="secondary") ? maxarray : maxarray_sec; 
							if (val>max && $.isArray(maxAry) ) {
								for(var j=0; j<maxAry.length; j++) {
									if (maxAry[j]>val) {
										max = maxAry[j];
										break;
									}
								}
							}
							if (val>max && maxAry=="auto" && basescale) {
								max = parseFloat(val); // calculate maximum y value
							}
							
							if (val<min && $.isArray(minAry) ) { // calculate minimum y value
								for(var j=minAry.length-1; j>=0; j--) {
									if (minAry[j]<val) {
										min = minAry[j];
										break;
									}
								}
							}
							if (val<min && maxAry=="auto" && basescale) {
								min = parseFloat(val);
							}
						}
					}
				});

				//last point is repetition of column spec, dont add
				//points[i]=point;
			});

			pointsarray[k]=points;

			if (uaxis != "secondary") {
				min_prim = min;
				max_prim = max;
			} else {
				min_sec = min;
				max_sec = max;
			}
		}

		var axis_done = ({'primary':false, 'secondary':false});
		
		// calculate space for text at primary and secondary axes
		svg_old.show();
		var tDummy = widget_chart.createElem('text').text(max_prim.toFixed(1)+unit);
		tDummy.attr('style','.axes');
		svg_old.append(tDummy);
		data.textWidth_prim = (foundPrimary)?$(tDummy)[0].getBBox().width:0;
		tDummy.text(max_sec.toFixed(1)+unit_sec);
		data.textWidth_sec = (foundSecondary)?$(tDummy)[0].getBBox().width:0;
		tDummy.remove();

		var styleV = widget_chart.getStyleRuleValue(classesContainer, 'font-size', '.axes');
		var fszA = (styleV)?parseFloat(styleV.split('px')):9;
		data.textWidth_prim = data.textWidth_prim+((noticks)?0:fszA); // additional offset for axes descrption (text 90°)
		data.textWidth_sec = data.textWidth_sec+((noticks)?0:fszA); // additional offset for axes descrption (text 90°)
		data.bottomOffset = noticks?0:2*(fszA);
		var styleV = widget_chart.getStyleRuleValue(classesContainer, 'font-size', '.caption');
		var fszC = (styleV)?parseFloat(styleV.split('px')):9;
		var styleV = widget_chart.getStyleRuleValue(classesContainer, 'font-size', '.buttons');
		var fszB = (styleV)?parseFloat(styleV.split('px')):18;
		data.topOffset = nobuttons?(fszA)/2:(fszC>fszB)?fszC:fszB;
		
		// generate crosshair container for cursor
		var crosshair = widget_chart.createElem('svg').attr({'class':'crosshair','pointer-events':'none'});
		crosshair.append(widget_chart.createElem('line').attr({'class':'crosshair'}));

		for (var k=0; k<nGraphs; k++) { // prepare crosshair text elements for each graph
			crosshair.append(widget_chart.createElem('text').attr({'class':'crosshair', 'filter':'url(#filterbackground)', 'style':'stroke-width:0px', 'text-anchor':'end'}));
		}
	
		// calculation of stroke width for stroke scaling
		var strokeWidth = (document.documentElement.style.vectorEffect === undefined) ? (max_prim-min_prim)/150 : 1;

		data.xscale = xrange; // set new value for scale (used for scale animation)
		
		if (svg_old) { // we need some pixels space for the text surrounding the plot
			var basewidth = parseFloat(svg_old.width());
			data.graphWidth = (basewidth-((noticks)?0:data.textWidth_prim+data.textWidth_sec))/basewidth * 100.;
			var baseheight = parseFloat(svg_old.height());
			data.graphHeight = (baseheight-(((noticks)?0:data.bottomOffset)+data.topOffset))/baseheight * 100.;
			//console.log(data.instance, basewidth, baseheight, data.graphWidth, data.graphHeight);
		}
		
		//calculate xticks automatically
		if (xticks == -1) {
			var mdiff = widget_chart.dateDiff(tstart,tend,'m');								// minutes between mindate and maxdate
			xticks = (basewidth>400) ? mdiff/12.0 : (basewidth>200) ? mdiff/6 : mdiff/3;	// set the number of ticks to 12 or 6 if window is not so wide
		}
		
		var defaultHeight = $(this).hasClass('fullsize') ? data.graphHeight + '%' : '';
		
		//include defs from svg_defs.svg for compatibility with fhem plots
		var defsFHEM =
			"<defs>"+
				'<linearGradient id="gr_bg" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#FFFFF7; stop-opacity:1"/>    <stop offset="100%" style="stop-color:#FFFFC7; stop-opacity:1"/>  </linearGradient>'+
				'<linearGradient id="gr_0" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#f00; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#f88; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_1" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#291; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#8f7; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_2" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#00f; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#88f; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_3" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#f0f; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#f8f; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_4" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#ff0; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#ff8; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_5" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#0ff; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#8ff; stop-opacity:.4"/>  </linearGradient>'+
				'<linearGradient id="gr_6" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset="0%"   style="stop-color:#000; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#ccc; stop-opacity:.4"/>  </linearGradient>'+
				'<pattern id="gr0_stripe" width="4" height="4"           patternUnits="userSpaceOnUse" patternTransform="rotate(-45 2 2)">      <path d="M -1,2 l 6,0" stroke="#f00" stroke-width="0.5"/>  </pattern>'+
				'<pattern id="gr1_stripe" width="4" height="4"           patternUnits="userSpaceOnUse" patternTransform="rotate(45 2 2)">      <path d="M -1,2 l 6,0" stroke="green" stroke-width="0.5"/>  </pattern>'+
				'<linearGradient id="gr0_gyr" x1="0%" y1="0%" x2="0%" y2="100%">    <stop offset=  "0%" style="stop-color:#f00; stop-opacity:.6"/>    <stop offset= "50%" style="stop-color:#ff0; stop-opacity:.6"/>    <stop offset="100%" style="stop-color:#0f0; stop-opacity:.6"/>  </linearGradient>'+
			'</defs>';

		// include some more defs
		var defs = 
			"<defs>"+
				'<linearGradient id="gr_bgftui" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"   style="stop-color:#2A2A2A; stop-opacity:1"/>'+
					'<stop offset="50%"  style="stop-color:#000; stop-opacity:1"/>'+
					'<stop offset="100%" style="stop-color:#2A2A2A; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui0" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"   style="stop-color:#DDA400; stop-opacity:1"/>'+
					'<stop offset="100%"  style="stop-color:#553300; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui1" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"   style="stop-color:#BBBBBB; stop-opacity:1"/>'+
					'<stop offset="100%"  style="stop-color:#333333; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui2" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"   style="stop-color:#FF0000; stop-opacity:1"/>'+
					'<stop offset="100%"  style="stop-color:#880000; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui3" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"   style="stop-color:#CCCC00; stop-opacity:1"/>'+
					'<stop offset="100%"  style="stop-color:#555500; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<linearGradient id="gr_ftui4" x1="0%" y1="0%" x2="0%" y2="100%">'+
					'<stop offset="0%"   style="stop-color:#33CC33; stop-opacity:1"/>'+
					'<stop offset="100%"  style="stop-color:#225522; stop-opacity:1"/>'+
				'</linearGradient>'+
				'<filter x="0" y="0" width="1" height="1" id="filterbackground">'+
					'<feFlood flood-color="black" flood-opacity="0.5" result="bBlack"/>'+
					'<feMerge>'+
						'<feMergeNode in="bBlack"/>'+
						'<feMergeNode in="SourceGraphic"/>'+
					'</feMerge>'+
				'</filter>'+
			'</defs>';

		// prepare skeleton of SVG part of page
		svg_new = $(
			'<svg class="basesvg'+instance+'">' + defsFHEM + defs +
			'<g id="classesContainer" stroke="grey"></g>' +
			'<rect class="chart-background" x="' + (data.textWidth_prim) + 'px" width="'+data.graphWidth+'%" preserveAspectRatio="none">'+'></rect>'+
			'<svg class="chart-primary" x="' + (data.textWidth_prim) + 'px" width="'+data.graphWidth+'%" preserveAspectRatio="none">'+
			'<g class="graph-parent" transform="scale(1, -1)">'+
			'<polyline points=""/>'+
			'<path d=""/>'+
			'</g></svg>'+
			'<svg class="chart-secondary" x="' + (data.textWidth_prim) + 'px" width="'+data.graphWidth+'%" preserveAspectRatio="none">'+
			'<g class="graph-parent" transform="scale(1, -1)">'+
			'<polyline points=""/>'+
			'<path d=""/>'+
			'</g></svg>'+
			'</svg>');
		
		//Save pixel coordinates of graph area for later use
		var oS = svg_old.offset();
		data.chartArea = {
			left:oS.left,
			top:oS.top,
			width:svg_old.width(),
			height:svg_old.height()
		};
		data.graphArea = {
			left:data.chartArea.left + (noticks?0:data.textWidth_prim),
			top:data.chartArea.top + data.topOffset,
			width:data.chartArea.width-(noticks?0:data.textWidth_prim+data.textWidth_sec),
			height:data.chartArea.height-data.topOffset-(noticks?0:data.bottomOffset)
		};

		svg_new.append(crosshair); // add crosshair
		
		// hack for wrong behaviour of Firefox
		var attrval = {};
		var stV = widget_chart.getStyleRuleValue(classesContainer, 'fill', ".chart-background");
		if (stV) {if(stV.indexOf("url") >= 0) {attrval.style = attrval.style + ';fill: ' +  stV.slice(0,4)+stV.slice(-(stV.length-stV.lastIndexOf("#"))).replace(/\"/g,'');}}
		svg_new.find("rect.chart-background").attr(attrval);

		// test for functions on touch devices, currently not running yet
		svg_new.find("rect.chart-background, [id*='graph-']").on("click", function(event) {
		});
		svg_new.find("rect.chart-background, [id*='graph-']").on("swipeleft", function(event) {
			//$(event.delegateTarget).find("text.debug").text('Type: '+event.type+' X: '+event.pageX+' Y: '+event.pageY);
			widget_chart.shift(event, $(event.delegateTarget),1); 
		});
		svg_new.find("rect.chart-background, [id*='graph-']").on("swiperight", function(event) {
			//$(event.delegateTarget).find("text.debug").text('Type: '+event.type+' X: '+event.pageX+' Y: '+event.pageY);
			widget_chart.shift(event, $(event.delegateTarget),-1); 
		});
		
		if (basescale) {
			min_prim=parseInt(min_prim);
			max_prim=(maxarray!="auto") ? parseInt(max_prim) : parseInt(max_prim) + 1;
			min_sec=parseInt(min_sec);
			max_sec=(maxarray_sec!="auto") ? parseInt(max_sec) : parseInt(max_sec) + 1;
			scale_sec = (max_sec-min_sec)/((max_prim - min_prim)/yticks);

			// do scaling of y axis due to problems with strokes in vertical and horizontal direction if scaling is very different between x and y
			// nonscaling-stroke does not work on all browsers
			data.scaleY = xrange/(max_prim-min_prim)/data.graphArea.width*data.graphArea.height;
			data.shiftY = min_prim*data.scaleY;
			data.min_save = 0;
			data.max_save = (max_prim-min_prim)*data.scaleY;
			// do scaling of y axis due to problems with strokes in vertical and horizontal direction if scaling is very different between x and y
			// nonscaling-stroke does not work on all browsers
			data.scaleY_sec = xrange/(max_sec-min_sec)/data.graphArea.width*data.graphArea.height;
			data.shiftY_sec = min_sec*data.scaleY_sec;
			data.min_save_sec = 0;
			data.max_save_sec = (max_sec-min_sec)*data.scaleY_sec;

			// scale data points in y direction to have them lying in about same range as x (due to stroke problems)
			widget_chart.scaleValues(pointsarray, data);
		}

		// add container for graphs
		$(theObj).find("g.graph-parent").append(widget_chart.createElem('svg').attr({'class':'graph-frame','width':xrange,'height':(max-min),'y':min}));

		var legend_menu = widget_chart.createElem('svg').attr({
			'class':'legend',
			'x':'0px',
			'width':(basewidth)+'px',
			'height':(baseheight)+'px',
			'y':'0px'
		});

		// text element for show/hide of legend container
		if (!nobuttons) {
			var caption_text = widget_chart.createElem('text').attr({'class':'caption'+(data.showlegend?' active':' inactive'),'x':'49%','y':data.topOffset/2,'dy':'0.4em','style':'text-anchor:end'});
			caption_text.text("Legend");
			legend_menu.append(caption_text);
		}

		// text element for show/hide of crosshair cursor
		if (!nobuttons) {
			var cursor_text = widget_chart.createElem('text').attr({'class':'caption'+((data.crosshair)?' active':' inactive'),'x':'51%','y':data.topOffset/2,'dy':'0.4em','text-anchor':'begin'});
			cursor_text.text("Cursor");
			cursor_text.on('click', function(event) {
				if ($(event.delegateTarget).parents("[class^=basesvg]").parent().data('crosshair')) {
					$(event.delegateTarget).parents("[class^=basesvg]").parent().data('crosshair',false);
					$(event.delegateTarget).parents("[class^=basesvg]").find('svg.crosshair').hide();
					$(event.delegateTarget).attr({'class':'caption inactive'});
				} else {
					$(event.delegateTarget).parents("[class^=basesvg]").parent().data('crosshair',true);
					$(event.delegateTarget).parents("[class^=basesvg]").find('svg.crosshair').show();
					$(event.delegateTarget).attr({'class':'caption active'});
				}
			});
			legend_menu.append(cursor_text);
		}

		// generate container, content and dynamics (events) for legend container
		var legend_container = widget_chart.createElem('svg').attr({'class':'lentries','x':'0%','y':'0px'});
		var xS = 0;
		var yS = 0;
		legend_container.prepend(widget_chart.createElem('rect').attr({'class':'lback'}));
		legend_container.find('rect.lback') // add drag functionality for legend container
			.draggable()
			.bind('mouseover', function(event) {
				event.target.setAttribute('style','cursor:move');
			})
			.bind('mousedown', function(event, ui){
				// keep initial mouse position relative to draggable object.
				var target = $(event.delegateTarget).parents("[class^=basesvg]");
				xS = parseFloat($(event.target).attr('x')) - (event.pageX - target.offset().left);
				yS = parseFloat($(event.target).attr('y')) - (event.pageY - target.offset().top);
			})
			.bind('drag', function(event, ui) {
				var target = $(event.delegateTarget).parents("[class^=basesvg]");
				var data = target.parent().data();
				var xOff = parseFloat($(event.target).attr('x')) - (event.pageX - target.offset().left) - xS;
				var yOff = parseFloat($(event.target).attr('y')) - (event.pageY - target.offset().top) - yS;
				event.target.setAttribute('x', parseFloat($(event.target).attr('x')) - xOff);
				event.target.setAttribute('y', parseFloat($(event.target).attr('y')) - yOff);
				target.find('text.legend').each(function(index) {
					$(this).attr('x', parseFloat($(this).attr('x'))-xOff);
					$(this).attr('y', parseFloat($(this).attr('y'))-yOff);
				});
				data.legend_pos = {
					left:parseFloat($(event.target).attr('x')),
					top:parseFloat($(event.target).attr('y')),
					width:parseFloat($(event.target).attr('width'))
				};
			});

		legend_menu.append(legend_container);
		if (!data.showlegend) legend_container.hide();

		if (!nobuttons) {
			// event handling for legend container (show/hide graphs)
			caption_text.click(function(event) {
				var target = $(event.delegateTarget).parents("[class^=basesvg]").find('svg.lentries');
				var data = $(event.delegateTarget).parents("[class^=basesvg]").parent().data();
				
				if(data.showlegend) {
					$(target).hide();
					data.showlegend = false;
					$(event.delegateTarget).attr({'class':'caption inactive'});
				} else {
					$(target).show();

					var existingLegends = target.find('text.legend');
					var maxwidth = 0;
					for (var i=0, l=existingLegends.length; i<l; i++) {
						if (existingLegends[i].getBBox().width > maxwidth) {maxwidth = existingLegends[i].getBBox().width;}
					}

					var x = (data.legend_pos)?data.legend_pos.left:(data.graphArea.left-data.chartArea.left+data.graphArea.width-maxwidth-5);
					var y = (data.legend_pos)?data.legend_pos.top:data.topOffset;

					for (var i=0, l=existingLegends.length; i<l; i++) {
						$(existingLegends[i]).attr({
							'x':((x+maxwidth)+2.5)+'px',
							'y':((y+(data.textHeight+5)*(i+1))+2.5)+'px',
							'igraph':i
						});

						$(existingLegends[i]).off('click');
						$(existingLegends[i]).click(function(event) {
							widget_chart.toggle(event, data.instance, "vertical-hide");
						});
					}

					var legend_back = target.find('rect.lback');
					legend_back.attr({
						'class':'legend lback',
						'x':x+'px',
						'y':y+'px',
						'height':((data.textHeight+5)*(existingLegends.length)+5)+5+'px',
						'width':(maxwidth+5)+'px',
					});

					data.legend_pos = {left:x, top:y, width:(maxwidth+5)};

					$(event.delegateTarget).attr({'class':'caption active'});
					data.showlegend = true;
				}
			});
		}

		svg_new.append(legend_menu);
	
		for (k=0; k<nGraphs; k++) { // main loop for generation of page content (chart with graphs)
		
			var tstart = dateFromString(mindate);
			style = widget_chart.getArrayValue(style_array,k,'');
			ptype = widget_chart.getArrayValue(ptype_array,k,'lines');
			uaxis = widget_chart.getArrayValue(uaxis_array,k,'primary');
			legend = widget_chart.getArrayValue(legend_array,k,'Graph '+k);

			if (uaxis != "secondary") {
				min = data.min_save;
				max = data.max_save;
			} else {
				min = data.min_save_sec;
				max = data.max_save_sec;
			}

			// calculate yticks automatically
			if (autoscaley) {
				if (uaxis != 'secondary') {
					var p=parseInt(Math.log(max_prim-min_prim)/Math.LN10);
					var yr = parseInt((max_prim-min_prim)/Math.pow(10,p)+0.5);
					var yrt=[0.2, 0.4, 0.6, 1, 1, 1.5, 2, 2, 2];
					var yt = yrt[yr-1]*Math.pow(10,p);
					var ymin_t = (parseInt(min_prim/yt)+1)*yt;
					yticks = yt*data.scaleY;
					ymin_t = ymin_t * data.scaleY - data.shiftY;
				} else {
					var p=parseInt(Math.log(max_sec-min_sec)/Math.LN10);
					var yr = parseInt((max_sec-min_sec)/Math.pow(10,p)+0.5);
					var yrt=[0.2, 0.4, 0.6, 1, 1, 1.5, 2, 2, 2];
					var yt = yrt[yr-1]*Math.pow(10,p);
					var ymin_t = (parseInt(min_sec/yt)+1)*yt;
					yticks = yt*data.scaleY_sec;
					ymin_t = ymin_t * data.scaleY_sec - data.shiftY_sec;
				}
			} else {
				if (uaxis == "secondary") {
					if (axis_done['primary']) {
						yticks = scale_sec;
						yticks = (scale_sec<=0) ? 1 : scale_sec;
					}
				}
			}

			// Calculated Stroke Width for gridlines
			var strkY = widget_chart.scaleStroke(classesContainer, '.yticks', (max-min) / (baseheight * data.graphHeight/100));
			var strkX = widget_chart.scaleStroke(classesContainer, '.xticks', (xrange) / (basewidth * data.graphWidth/100));

			// Calculated Stroke Width for graphs
			var strkG = widget_chart.scaleStroke(classesContainer, '.'+style, (xrange) / (basewidth * data.graphWidth/100));

			var points=pointsarray[k];

			//Setting the general attributes for different plot types
			if (ptype.indexOf('fa-')>=0 || ptype.indexOf('fs-')>=0 || ptype.indexOf('oa-')>=0) {
				//there seem to be font awesome symbols defind
				var symbol = widget_chart.fontNameToUnicode(ptype);
				var fontFamily = (ptype.indexOf('fa-')>=0)?'FontAwesome':(ptype.indexOf('fs-')>=0)?'fhemSVG':'openautomation'
				ptype = 'symbol';
			}
			switch (ptype) {
				case 'lines':
				case 'steps':
				case 'fsteps':
				case 'histeps':
				case 'bars':
				case 'ibars':
				case 'cubic':
				case 'quadratic':
				case 'quadraticSmooth':
					var attrval={};
					attrval.class = style;
					attrval.style = 'stroke-width: ' + strkG.stroke + 'px';
					if (strkG.dash && strkG.dash!='none') {attrval.style = attrval.style + '; stroke-dasharray:' + strkG.dash;}
					// hack for behaviour of Firefox
					var stV = widget_chart.getStyleRuleValue(classesContainer, 'fill', '.'+style);
					attrval.d = widget_chart.getSVGPoints(points, min, xrange, ptype, (stV!='none'));
					if (stV) {if(stV.indexOf("url") >= 0) {attrval.style = attrval.style + ';fill: ' + stV.slice(0,4)+stV.slice(-(stV.length-stV.lastIndexOf("#"))).replace(/\"/g,'');}}
					break;
				case 'points':
					var attrval={};
					var styleV = widget_chart.getStyleRuleValue(classesContainer, 'stroke', '.'+style);
					if (!styleV) {styleV = widget_chart.getStyleRuleValue(classesContainer, 'fill', '.'+style);}
					attrval.style = 'stroke-width: ' + 0 + 'px' + ';fill: ' + styleV;
					attrval.min = min;
					break;
				case 'symbol':
					var attrval={};
					var styleV = widget_chart.getStyleRuleValue(classesContainer, 'stroke', '.'+style);
					if (!styleV) {styleV = widget_chart.getStyleRuleValue(classesContainer, 'fill', '.'+style);}
					attrval.style = 'stroke-width: ' + 0 + 'px' + ';fill: ' + styleV;
					attrval.min = min;
					break;
			}
			
			var svg = svg_new.find('svg.chart-'+uaxis);

			if (svg){
				var polyline = svg.find('path');
				if (polyline){
					if (!axis_done[uaxis]) {
						svg.find('line').remove();
						var graph = polyline.parent();
						
						if (!gridlines) {var gridlines = widget_chart.createElem('g').attr({'class':'gridlines','stroke':widget_chart.getStyleRuleValue(classesContainer, 'color', '')});}
						if (!buttons) {var buttons = widget_chart.createElem('g').attr({'class':'buttons'});}
						if (!tyaxis) {var tyaxis = widget_chart.createElem('g').attr({'class':(uaxis != 'secondary') ? 'text yaxis_primary' : 'text yaxis_secondary'});}
						if (!txaxis) {var txaxis = widget_chart.createElem('g').attr({'class':'text xaxis'});}
						if (!taxes) {var taxes = widget_chart.createElem('g').attr({'class':'text axes'});}
						
						taxes.append(tyaxis);
						taxes.append(txaxis);

						if (!(axis_done['primary'] || axis_done['secondary'])) {
							//y-axis
							var stk = widget_chart.scaleStroke(classesContainer, '.yaxis', (max-min) / (baseheight * data.graphHeight/100));
							var yaxis = widget_chart.createElem('line');
							yaxis.attr({
								'class':'yaxis',
								'x1':stk.stroke,
								'y1':min,
								'x2':stk.stroke,
								'y2':max,
								'style':'stroke-width:'+stk.stroke+'px'+'; stroke-dasharray:'+stk.dash,
							});
							gridlines.prepend(yaxis);

							//x-axis
							var stk = widget_chart.scaleStroke(classesContainer, '.xaxis', (xrange) / (basewidth * data.graphWidth/100));
							var xaxis = widget_chart.createElem('line');
							xaxis.attr({
								'class':'xaxis',
								'x1':'0',
								'y1':min+stk.stroke,
								'x2':xrange,
								'y2':min+stk.stroke,
								'style':'stroke-width:'+stk.stroke+'px'+'; stroke-dasharray:'+stk.dash,
							});
							gridlines.prepend(xaxis);

							if (!nobuttons) {
								//zoom and shift buttons
								var buttonWidth = fszB;
								
								var zoomPlus = widget_chart.createElem('text').attr({
									'class':'buttons',
									'x': (noticks)?(2*buttonWidth):(data.textWidth_prim+2*buttonWidth)+'px',
									'y': buttonWidth/2 + 'px',
									'dy':'0.4em',
									'text-anchor':'middle',
									'style':'font-family: FontAwesome',
									'onclick':'widget_chart.scale(evt, $("svg.basesvg'+instance+'").parent(), 0.5)',
								});
								zoomPlus.text(widget_chart.fontNameToUnicode('fa-plus-circle'));
								buttons.append(zoomPlus);
								
								var zoomMinus = widget_chart.createElem('text').attr({
									'class':'buttons',
									'x': (noticks)?(3.5*buttonWidth):(data.textWidth_prim+3.5*buttonWidth)+'px',
									'y': buttonWidth/2 + 'px',
									'dy':'0.4em',
									'text-anchor':'middle',
									'style':'font-family: FontAwesome',
									'onclick':'widget_chart.scale(evt, $("svg.basesvg'+instance+'").parent(), 2)',
								});
								zoomMinus.text(widget_chart.fontNameToUnicode('fa-minus-circle'));
								buttons.append(zoomMinus);
								
								var shiftMinus = widget_chart.createElem('text').attr({
									'class':'buttons',
									'x': (noticks)?buttonWidth/2:data.textWidth_prim+buttonWidth/2+'px',
									'y': buttonWidth/2 + 'px',
									'dy':'0.4em',
									'text-anchor':'middle',
									'style':'font-family: FontAwesome',
									'onclick':'widget_chart.shift(evt, $("svg.basesvg'+instance+'").parent(), 1)',
								});
								shiftMinus.text(widget_chart.fontNameToUnicode('fa-arrow-circle-left'));
								buttons.append(shiftMinus);
								
								var shiftPlus = widget_chart.createElem('text').attr({
									'class':'buttons',
									'x': (basewidth - ((noticks)?(buttonWidth/2):(data.textWidth_sec+buttonWidth/2)))+'px',
									'y': buttonWidth/2 + 'px',
									'dy':'0.4em',
									'text-anchor':'middle',
									'style':'font-family: FontAwesome',
									'onclick':'widget_chart.shift(evt, $("svg.basesvg'+instance+'").parent(), -1)',
								});
								shiftPlus.text(widget_chart.fontNameToUnicode('fa-arrow-circle-right'));
								buttons.append(shiftPlus);
								svg.parent().append(buttons);
							}
						}
						
						if (!noticks){
							//y-ticks
							var text = widget_chart.createElem('text');
							textY = (0.5*data.graphHeight/100*baseheight+data.topOffset+data.textHeight/2);
							var textX = (uaxis=="secondary") ? (100-(fszA)/basewidth*100) : (0+(fszA)/basewidth*100);
							text.attr({
								'class':'text axes yaxis',
								'x': textX+'%',
								'y': textY,
								'transform':'rotate(-90 '+textX/100*basewidth+','+textY+')',
								'text-anchor':"middle",
							});
							if ( autoscaley ) fix = (yticks < 1) ? 1 : 0;
							text.text(((uaxis=="secondary") ? data.ytext_sec : data.ytext));
							tyaxis.append(text);

							for ( var y=ymin_t; y<=max; y+=yticks ){
								if (!(axis_done['primary'] || axis_done['secondary'])) {
									var line = widget_chart.createElem('line');
									line.attr({
										'class':'yticks',
										'x1':'0',
										'y1':y,
										'x2':xrange,
										'y2':y,
										'style':'stroke-width:'+strkY.stroke+'px'+'; stroke-dasharray:'+strkY.dash,
									});
									gridlines.prepend(line);
								}

								text = widget_chart.createElem('text');
								textY = (((max-y))/(max-min)*data.graphHeight/100*baseheight+data.topOffset+data.textHeight/2);
								text.attr({
									'class':'text axes yaxis',
									'x': (uaxis=="secondary") ? (basewidth+2-data.textWidth_sec)+'px' : (0-2+data.textWidth_prim)+'px',
									'y': textY+'',
									'text-anchor':(uaxis=="secondary") ? "start" : "end",
								});
								if ( autoscaley ) fix = (yticks/((uaxis!='secondary')?data.scaleY:data.scaleY_sec) < 10) ? 1 : 0;
								ysc = (uaxis!="secondary")?(y+data.shiftY)/data.scaleY:(y+data.shiftY_sec)/data.scaleY_sec;
								text.text( ((fix>-1 && fix<=20) ? ysc.toFixed(fix) : ysc)+((uaxis=="secondary") ? unit_sec : unit) );
								tyaxis.append(text);
							}
							
							if (!(axis_done['primary'] || axis_done['secondary'])) { // only add axis and gridlines when not already done
								//x-axis
								//leftmost text, show date
								var textX1 = widget_chart.createElem('text');
								textX1.attr({
									'class':'text axes xaxis',
									'x':(data.textWidth_prim) + 'px',
									'y': data.chartArea.height-data.bottomOffset/2+data.textHeight/2,
									'text-anchor':'middle',
								});
								textX1.text(tstart.ddmm());
								txaxis.append(textX1);

								for ( var x=xticks; x<xrange; x+=xticks ){

									var tx = new Date(tstart);
									var textX2 = widget_chart.createElem('text');
									var posX = data.graphWidth*x/xrange + data.textWidth_prim/basewidth*100;
									textX2.attr({
										'class':'text axes xaxis',
										'x':posX+'%',
										'y': data.chartArea.height-data.bottomOffset/2+data.textHeight/2,
										'text-anchor':'middle',
									});
									tx.setMinutes(tstart.getMinutes() + x);
									//console.log(tx);
									var textX2Value = (tx.hhmm()=="00:00") ? tx.ddmm() : tx.hhmm() ;
									textX2.text(textX2Value);
									txaxis.append(textX2);

									var xtick1 = widget_chart.createElem('line');
									xtick1.attr({
										'class':'xticks',
										'x1':100*x/xrange+'%',
										'y1':min,
										'x2':100*x/xrange+'%',
										'y2':max,
										'style':'stroke-width:'+strkX.stroke+'px'+'; stroke-dasharray:'+strkX.dash,
									});
									gridlines.prepend(xtick1);
								}

								//rightmost text, show date
								var textX1 = widget_chart.createElem('text');
								var posX = data.graphWidth + data.textWidth_prim/basewidth*100;
								textX1.attr({
									'class':'text axes xaxis',
									'x':posX+'%',
									'y': data.chartArea.height-data.bottomOffset/2+data.textHeight/2,
									'text-anchor':"middle",
								});
								textX1.text(tend.ddmm());
								txaxis.append(textX1);
							}
						}
						else{ // no axis and ticks as class is set to "noticks"
						}

						if (!(axis_done['primary'] || axis_done['secondary'])) {
							graph.prepend(gridlines);
							svg.parent().append(taxes);
						}

						//Viewbox (autoscaler)
						var graphTop = 100-(baseheight-data.topOffset)/baseheight*100;
						svg.attr({"height":data.graphHeight+"%","y":graphTop+"%"});
						svg[0].setAttribute('viewBox', [0, -max, xrange, max-min ].join(' '));
						svg.parent().find('rect.chart-background').attr({"height":data.graphHeight+"%","y":graphTop+"%"});

						// add graphs themselves
						switch(ptype) {
							case 'lines':
							case 'steps':
							case 'fsteps':
							case 'histeps':
							case 'bars':
							case 'ibars':
							case 'cubic':
							case 'quadratic':
							case 'quadraticSmooth':
								if (points.length > 1) {polyline.attr(attrval);}
								polyline.attr('id',uaxis + "-graph-" + instance + "-" + k + "-" + ptype);
								data.graphsshown[k]?polyline.attr('animstate','hide'):polyline.attr('animstate','show');
								if (!data.graphsshown[k]) {polyline.attr('transform', "translate(0,"+min+") "+ "scale(1,0)");}
								polyline.attr('min',min);
								polyline.attr('xrange', xrange);
								var color = (polyline.css("stroke"))?polyline.css("stroke"):polyline.css("fill");
								break;
						}
						axis_done[uaxis] = true;
					}
					else {
					
						if (!axis_done[uaxis]) {
							//Viewbox (autoscaler)
							var graphTop = 100-(baseheight-data.topOffset)/baseheight*100;
							svg.attr({"height":data.graphHeight+"%","y":graphTop+"%"});
							svg[0].setAttribute('viewBox', [0, -max, xrange, max-min ].join(' '));
							svg.parent().find('rect.chart-background').attr({"height":data.graphHeight+"%","y":graphTop+"%"});
						}
						axis_done[uaxis] = true;

						switch(ptype) {
							case 'lines':
							case 'steps':
							case 'fsteps':
							case 'histeps':
							case 'bars':
							case 'ibars':
							case 'cubic':
							case 'quadratic':
							case 'quadraticSmooth':
								var polyline_new = widget_chart.createElem('path').attr(attrval);
								polyline_new.attr('id',uaxis + "-graph-" + instance + "-" + k + "-" + ptype);
								data.graphsshown[k]?polyline_new.attr('animstate','hide'):polyline_new.attr('animstate','show');
								if (!data.graphsshown[k]) {polyline_new.attr('transform', "translate(0,"+min+") "+ "scale(1,0)");}
								polyline_new.attr('min',min);
								polyline_new.attr('xrange', xrange);
								if (points.length > 1) polyline_new.attr(attrval);
								svg.find('polyline').parent().append(polyline_new);
								break;
								svg.find('polyline').parent().append(g);
								break;
						}
					}
					switch(ptype) {
						case 'points':
							var g = widget_chart.createElem('g');
							g.attr('class',style);
							g.attr('id',uaxis + "-graph-" + instance + "-" + k + "-" + ptype);
							data.graphsshown[k]?g.attr('animstate','hide'):g.attr('animstate','show');
							if (!data.graphsshown[k]) {g.attr('transform', "translate(0,"+min+") "+ "scale(1,0)");}
							g.attr('min',min);
							g.attr('xrange', xrange);
							//var strk = (g.css("stroke-width")) ? parseFloat(g.css("stroke-width").split('px')) : 1;
							attrval.ry = strkG.stroke/2;
							attrval.rx = strkG.stroke/2;
							for (j=0;j<points.length;j++) {
								var point_new = widget_chart.createElem('ellipse');
								//attrval['stroke-width'] = strk;
								attrval.cx = points[j][0];
								attrval.cy = points[j][1];
								point_new.attr(attrval);
								g.append(point_new);
							}
							svg.find('polyline').parent().append(g);
							break;
						case 'symbol':
							var g = widget_chart.createElem('g');
							g.attr('class',style);
							g.attr('id',uaxis + "-graph-" + instance + "-" + k + "-" + ptype);
							data.graphsshown[k]?g.attr('animstate','hide'):g.attr('animstate','show');
							if (!data.graphsshown[k]) {g.attr('transform', "translate(0,"+min+") "+ "scale(1,0)");}
							g.attr('min',min);
							g.attr('xrange', xrange);
							//var strk = (g.css("stroke-width")) ? parseFloat(g.css("stroke-width").split('px')) : 1;
							attrval.style = attrval.style + ';font-size:' + strkG.stroke + 'px;' + 'text-anchor:middle' + ';font-family:' + fontFamily;
							for (j=0;j<points.length;j++) {
								var point_new = widget_chart.createElem('text');
								//attrval['stroke-width'] = strk;
								attrval.x = points[j][0];
								attrval.y = points[j][1]-strkG.stroke/2;
								attrval.transform = "translate(" + attrval.x + " " + attrval.y + ") scale(1,-1) translate(" + (-attrval.x) + " " + (-attrval.y) + ")";
								point_new.attr(attrval);
								point_new.text(symbol);
								g.append(point_new);
							}
							svg.find('polyline').parent().append(g);
							break;
					}
					//show chart legend if set
					if (legend){
						var styleV = widget_chart.getStyleRuleValue(classesContainer, 'stroke', '.'+style);
						if (!styleV) {styleV = widget_chart.getStyleRuleValue(classesContainer, 'fill', '.'+style);}
						var color = styleV;
						var textLegend = widget_chart.createElem('text');
						textLegend.attr({
										'class':'legend '+style,
										'x':'50%',
										'y':'2',
										'text-anchor':"end",
										'style':'stroke-width:0px;fill-opacity:1;'+((color!=undefined)?'':'fill:'+color)
										});
						textLegend.text(legend);
						legend_container.append(textLegend);
					}
				}
			}
		}

		// register events for crosshair cursor
		svg_new.find("rect.chart-background, [id*='graph-']").on("mouseenter",function(event) {
			widget_chart.doEvent(event);
			widget_chart.propagateEvent(event);
		});
		
		svg_new.find("rect.chart-background, [id*='graph-']").on("mouseleave",function(event) {
			widget_chart.doEvent(event);
			widget_chart.propagateEvent(event);
		});
		
		svg_new.find("rect.chart-background, [id*='graph-']").on('mousemove',function(event) {
			widget_chart.doEvent(event);
			widget_chart.propagateEvent(event);
		});

		// graph source is ready, add it to the page
		svg_new.appendTo($(theObj))
			.css("width",data.width || '93%')
			.css("height",data.height || defaultHeight);
			
		if (type=='shift' || type=='scale') { // prepare and trigger animation when shifting or scaling
			var graphs_old = svg_old.find("[id*='primary-graph-']");
			for (var i=0,l=graphs_old.length; i<l; i++) {
				$(graphs_old[i]).attr('id',$(graphs_old[i]).attr('id').replace("graph-","graphold-"));
			}
			svg_new.find('svg.chart-primary').find('g.graph-parent').append(graphs_old);
			var graphs_old = svg_old.find("[id*='secondary-graph-']");
			for (var i=0,l=graphs_old.length; i<l; i++) {
				$(graphs_old[i]).attr('id',$(graphs_old[i]).attr('id').replace("graph-","graphold-"));
			}
			svg_new.find('svg.chart-secondary').find('g.graph-parent').append(graphs_old);

			(type=='shift')?
				widget_chart.swipe(svg_new,instance,"horizontal-shift",swoffset,$(theObj).data(),data_old):
				widget_chart.swipe(svg_new,instance,"scale",swoffset,$(theObj).data(),data_old);
		}

		svg_old.remove(); // old graph is not needed any more

		if (data.showlegend){ // we need to reconfigure the legend, as only now we have all information available
			//need to correct x-position of legend texts after having displayed them
			var existingLegends = svg_new.find('svg.lentries').find('text.legend');
			var maxwidth = 0;
			for (var i=0, l=existingLegends.length; i<l; i++) {
				if (existingLegends[i].getBBox().width > maxwidth) {maxwidth = existingLegends[i].getBBox().width;}
			}

			var x = (data.legend_pos)?data.legend_pos.left:(data.graphArea.left-data.chartArea.left+data.graphArea.width-maxwidth-5);
			var y = (data.legend_pos)?data.legend_pos.top:data.topOffset;

			for (var i=0, l=existingLegends.length; i<l; i++) {
				$(existingLegends[i]).attr({
					'x':((x+maxwidth)+2.5)+'px',
					'y':((y+(data.textHeight+5)*(i+1))+2.5)+'px',
					'igraph':i,
					'opacity':(!data.graphsshown[i])?0.5:1
				});

				$(existingLegends[i]).off('click');
				$(existingLegends[i]).click(function(event) {
					widget_chart.toggle(event, data.instance, "vertical-hide");
				});

			}

			var legend_back = svg_new.find('svg.lentries').find('rect.lback');
			legend_back.attr({
				'class':'legend lback',
				'x':x+'px',
				'y':y+'px',
				'height':((data.textHeight+5)*(existingLegends.length)+5)+5+'px',
				'width':(maxwidth+5)+'px',
			});
			data.legend_pos={left:x, top:y, width:(maxwidth+5)};
		}

		//Calculate Array with x-resolution fitting to pixels for crosshair cursor
		var xOffset = (data.noticks)?0:data.textWidth_prim;
		for (k=0, l=data.graphArea.width+xOffset; k<l; k++) {
			var values=[];
			widget_chart.getValues(k,1,xOffset,data.graphArea.width,data.xrange,values,pointsarray);
			pointsarrayCursor[k] = values;
		}

		data.pointsarray = pointsarray; // return points
		data.pointsarrayCursor = pointsarrayCursor; // return points
	},
	
	update: function (dev,par) {
		var base = this;
		var devices = dev.split(",");
		var deviceElements= this.elements.filter("div[data-logdevice]");
		deviceElements.each(function(index) {
			var isLogdevice = ($.isArray($(this).data('logdevice')))?$(this).data('logdevice').join(',').search(dev)>=0:($(this).data('logdevice').fn.search)?$(this).data('logdevice').search(dev)>=0:false;
			if ( $(this).data('get')==par && isLogdevice) {
				if ($(this).parent().is(':visible')) {
					base.refresh.apply(this);
				} else {
					$(this).parent().on("fadein", function(event) {
						var theObj = $(event.delegateTarget).find("[class^=basesvg]").parent();
						base.refresh.apply(theObj);
					});
				}
			}
		});
	},
};

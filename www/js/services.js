var GET_CATEGORIES = "https://apex.oracle.com/pls/apex/channels/api/category";
var GET_CHANNELS_BY_CATEGORY_ID = "https://apex.oracle.com/pls/apex/channels/api/channels/";

var GET_CHANNEL_PLAYLIST = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBH6jIWaj9E4eHmhKi_BlIWs42ytiN9vcY&part=snippet,id&order=date&maxResults=19&channelId=";
var GET_CHANNEL_BY_ID = "https://www.googleapis.com/youtube/v3/channels?key=AIzaSyBH6jIWaj9E4eHmhKi_BlIWs42ytiN9vcY&part=snippet,id,statistics&order=date&maxResults=50&id=";
var SEARCH = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBH6jIWaj9E4eHmhKi_BlIWs42ytiN9vcY&part=snippet,id&maxResults=19&q=";
var SEARCH_LOAD_MORE = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBH6jIWaj9E4eHmhKi_BlIWs42ytiN9vcY&part=snippet,id&maxResults=19&pageToken=";
var GET_VIDEO_BY_ID = "https://www.googleapis.com/youtube/v3/videos?key=AIzaSyBH6jIWaj9E4eHmhKi_BlIWs42ytiN9vcY&part=snippet,id,statistics,player,contentDetails&id=";
var GET_VIDEO_COMMENTS = "https://www.googleapis.com/youtube/v3/commentThreads?key=AIzaSyBH6jIWaj9E4eHmhKi_BlIWs42ytiN9vcY&part=snippet&order=relevance&moderationStatus=published&maxResults=100&videoId=";
var GET_RELATED_TO_VIDEO = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBH6jIWaj9E4eHmhKi_BlIWs42ytiN9vcY&part=snippet&order=relevance&type=video&safeSearch=strict&maxResults=19&relatedToVideoId=";
var GET_TRENDING_VIDEOS = "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&key=AIzaSyBH6jIWaj9E4eHmhKi_BlIWs42ytiN9vcY&maxResults=19&regionCode=";

var AUTO_COMPLETE = "http://suggestqueries.google.com/complete/search?callback=JSON_CALLBACK&client=firefox&ds=yt&q=";
angular.module('starter.services', [])
    .service('category', function ($http, $ionicLoading) {
        this.getCategories = function () {
            $ionicLoading.show({
                template: '  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>'
            });
            return $http.get(GET_CATEGORIES)
                .then(function (response) {
                    $ionicLoading.hide();
                    return response.data;
                }, function (response) {
                    $ionicLoading.hide();
                    //Second function handles error
                    console.log("Something went wrong while getting categories !!!");
                });
        };



    })
    .service('personCategory', function (db, constant, $cordovaToast, utils) {
        this.getPersonCategories = function () {
            var query = "SELECT id , category , channels FROM myChannels";
            return db.executeQuery(query, []);
        };

        this.getPersonCategoryByCategoryName = function (categoryName) {
            var query = "SELECT id , category , channels FROM myChannels WHERE category =? ";
            return db.executeQuery(query, [categoryName]);
        };
        this.updatePersonCategoryChannels = function (personCategory, channelId) {
            var query = "update myChannels set channels=? WHERE id =? ";
            var channels = "";
            if (personCategory.channels == null || personCategory.channels === "") {
                channels = channelId;
            } else {
                channels = utils.addUniqueCSV(personCategory.channels, channelId);
            }
            return db.executeQuery(query, [channels, personCategory.id]);
        };
        this.createPersonCategory = function (personCategories, categoryName) {
            var query = "INSERT INTO myChannels (category) VALUES (?)";
            for (var i = 0; i < personCategories.length; i++) {
                if (personCategories[i].category.toLowerCase() === categoryName.toLowerCase()) {
                    $cordovaToast.show(constant.CATEGORY_EXSISTS, 'long', 'bottom');
                    return;
                }
            }
            db.executeQuery(query, [categoryName]);
            $cordovaToast.show(constant.CATEGORU_ADDED_SUCCESSFULLY, 'long', 'bottom');


        };
        this.deleteCategory = function (_id) {
            var query = "DELETE FROM myChannels where id = ?";
            return db.executeQuery(query, [_id]);
        };


    })
    .service('channel', function ($http, $ionicLoading) {
        this.getChannelsByCategoryId = function (id) {
            $ionicLoading.show({
                template: '  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>'
            });
            return $http.get(GET_CHANNELS_BY_CATEGORY_ID + id)
                .then(function (response) {
                    $ionicLoading.hide();
                    return response.data;
                }, function (response) {
                    $ionicLoading.hide();
                    console.log("Something went wrong while getting categories !!!");
                });
        }
        this.getChannelById = function (id) {
            $ionicLoading.show({
                template: ' <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> '
            });
            return $http.get(GET_CHANNEL_BY_ID + id)
                .then(function (response) {
                    $ionicLoading.hide();
                    return response.data;
                }, function (response) {
                    $ionicLoading.hide();
                    console.log("Something went wrong while getting categories !!!");
                });
        }

        this.getChannelPlaylistByChannelId = function (id) {
            $ionicLoading.show({
                template: '  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i> '
            });
            return $http.get(GET_CHANNEL_PLAYLIST + id)
                .then(function (response) {
                    $ionicLoading.hide();
                    return response.data;
                }, function (response) {
                    $ionicLoading.hide();
                    console.log("Something went wrong while getting categories !!!");
                });
        }

    })
    .service('search', function ($http, $ionicLoading) {
        this.search = function (q) {
            /*   $ionicLoading.show({
                   template: '  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>'
               }); */
            return $http.get(SEARCH + q)
                .then(function (response) {
                    //   $ionicLoading.hide();
                    return response.data;
                }, function (response) {
                    //    $ionicLoading.hide();
                    console.log("Something went wrong while getting categories !!!");
                });
        }
        this.loadMoreSearch = function (pageToken, channelId, q) {
            /*   $ionicLoading.show({
               template: '  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>'
           }); */
            var url = "";
            if (channelId !== undefined) {
                url = SEARCH_LOAD_MORE + pageToken + "&order=date&channelId=" + channelId;
            } else {
                url = SEARCH_LOAD_MORE + pageToken + "&q=" + q;
            }
            return $http.get(url)
                .then(function (response) {
                    //     $ionicLoading.hide();

                    return response.data;
                }, function (response) {
                    //      $ionicLoading.hide();
                    console.log("Something went wrong while getting categories !!!");
                });
        }

    })
    .service('about', function (SweetAlert, constant) {


        this.openMarket = function () {
            var ref = window.open(constant.publisher, '_system', 'location=yes');

        };

        this.showAbout = function () {
            SweetAlert.swal(constant.applicationName, "eapp.soft@gmail.com");
        };

        this.shareLink = function (link) {
            // this is the complete list of currently supported params you can pass to the plugin (all optional)
            var options = {
                url: link,
                chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
            }

            var onSuccess = function (result) {
                console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
            }

            var onError = function (msg) {
                console.log("Sharing failed with message: " + msg);
            }

            window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
        };
    })
    .service('db', function ($cordovaSQLite, constant, $rootScope) {

        this.createDb = function () {
            $rootScope.db = $cordovaSQLite.openDB({ name: 'tubePlus.db', location: 'default' });
            $cordovaSQLite.execute($rootScope.db, constant.createMyChannelsTable);
        };
        this.executeQuery = function (query, params) {
            return $cordovaSQLite.execute($rootScope.db, query, params);
        };
    })
    .service('hardware', function ($ionicPlatform, $cordovaNetwork, $rootScope, $ionicPopup) {
        this.overrideBackButton = function () {
            $ionicPlatform.onHardwareBackButton(function () {
                var iframes = document.getElementsByClassName('yvideo');
                for (var i = 0; i < iframes.length; i++) {
                    iframes[i].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
                }

            });
        };
        this.overridePauseButton = function () {
            $ionicPlatform.on('pause', function () {
                var iframes = document.getElementsByClassName('yvideo');
                for (var i = 0; i < iframes.length; i++) {
                    iframes[i].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
                }
            });

        };

        this.checkInternetConnection = function () {
            document.addEventListener("deviceready", function () {

                var type = $cordovaNetwork.getNetwork()

                var isOnline = $cordovaNetwork.isOnline()

                var isOffline = $cordovaNetwork.isOffline()


                // listen for Online event
                $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                    var onlineState = networkState;
                })

                // listen for Offline event
                $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                    var offlineState = networkState;

                    var alertPopup = $ionicPopup.alert({
                        title: 'Network Connection',
                        template: 'No network connection available! '
                    });
                    alertPopup.then(function (res) {
                        ionic.Platform.exitApp();
                    });

                })



            }, false);
        };

    })
    .service('video', function ($http, $ionicLoading, $filter, $q) {
        this.getVideoById = function (id) {
            /*  $ionicLoading.show({
                  template: '  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>'
              }); */
            return $http.get(GET_VIDEO_BY_ID + id)
                .then(function (response) {
                    //   $ionicLoading.hide();
                    response.data.items[0].snippet.description = response.data.items[0].snippet.description.replace(/\n/g, "<br />");
                    return response.data;
                }, function (response) {
                    // $ionicLoading.hide();
                    console.log("Something went wrong while getting categories !!!");
                });
        }
        this.getVideosByIds = function (items, playlist) {

            var promises = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].id.videoId != undefined) {

                    this.getVideoById(items[i].id.videoId).then(function (data) {
                        playlist.push(data.items[0]);
                    });


                }

            }
        }




        this.getTrendingVideos = function (code) {
            $ionicLoading.show({
                template: '  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>'
            });
            return $http.get(GET_TRENDING_VIDEOS + code)
                .then(function (response) {
                    $ionicLoading.hide();
                    return response.data;
                }, function (response) {
                    $ionicLoading.hide();
                    console.log("Something went wrong while getting categories !!!");
                });
        }
        this.getMoreTrendingVideos = function (code, pageToken) {
            $ionicLoading.show({
                template: '  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>'
            });
            return $http.get(GET_TRENDING_VIDEOS + code + "&pageToken=" + pageToken)
                .then(function (response) {
                    $ionicLoading.hide();
                    return response.data;
                }, function (response) {
                    $ionicLoading.hide();
                    console.log("Something went wrong while getting categories !!!");
                });
        }

    })
    .service('comments', function ($http, $ionicLoading) {

        this.getVideoComments = function (id) {
            $ionicLoading.show({
                template: '  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>'
            });
            var _url = GET_VIDEO_COMMENTS + id;
            return $http({ url: _url, method: 'GET' })
                .then(function (response) {
                    $ionicLoading.hide();
                    return response.data;
                }, function (response) {
                    $ionicLoading.hide();
                    console.log("Something went wrong while getting getVideoComments !!!");
                });
        };

    })
    .service('related', function ($http, $ionicLoading) {

        this.getRelatedVideos = function (id) {
            $ionicLoading.show({
                template: '  <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>'
            });
            var _url = GET_RELATED_TO_VIDEO + id;
            return $http({ url: _url, method: 'GET' })
                .then(function (response) {
                    $ionicLoading.hide();
                    return response.data;
                }, function (response) {
                    $ionicLoading.hide();
                    console.log("Something went wrong while getting getVideoComments !!!");
                });
        };

    })
    .service('autoComplete', function ($http) {
        this.complete = function (query) {
            var _url = AUTO_COMPLETE + query;
            return $http({ url: _url, method: 'JSONP' })
                .then(function (response) {
                    //$ionicLoading.hide();
                    return response.data[1];
                }, function (response) {
                    //  $ionicLoading.hide();
                    console.log("Something went wrong while getting categories !!!");
                });
        };

    })
    .service('utils', function ($cordovaToast, constant) {
        this.splitString = function (_string) {
            return _string.split(',');
        };
        this.addUniqueCSV = function (channels, newChannel) {
            var channels = this.splitString(channels);
            var found = false;
            for (var i = 0; i < channels.length; i++) {
                if (channels[i] === newChannel) {
                    found = true;
                    $cordovaToast.show(constant.CHANNEL_EXSISTS, 'long', 'bottom');

                }
            }
            if (!found) {
                $cordovaToast.show(constant.CHANNEL_ADDED_SUCCESSFULLY, 'long', 'bottom');
                return channels + "," + newChannel;
            } else {
                return channels;
            }

        };
        this.getVideoIndex = function (video, array) {
            for (var i = 0; i < array.length; i++) {
                if (video.id === array[i].id) {
                    return i;
                }
            }
            return -1;
        }
        this.checkArabicLanguage = function (text) {
            var arabic = /[\u0600-\u06FF]/;
            if (arabic.test(text)) {
                return true;
            }
            return false;
        };

        this.formatYoutubeDuration = function (duration) {
            var a = duration.match(/\d+/g);

            if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
                a = [0, a[0], 0];
            }

            if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
                a = [a[0], 0, a[1]];
            }
            if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
                a = [a[0], 0, 0];
            }

            duration = 0;

            if (a.length == 3) {
                duration = duration + parseInt(a[0]) * 3600;
                duration = duration + parseInt(a[1]) * 60;
                duration = duration + parseInt(a[2]);
            }

            if (a.length == 2) {
                duration = duration + parseInt(a[0]) * 60;
                duration = duration + parseInt(a[1]);
            }

            if (a.length == 1) {
                duration = duration + parseInt(a[0]);
            }
            var sec_num = parseInt(duration, 10); // don't forget the second param
            var hours = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours < 10) { hours = "0" + hours; }
            if (minutes < 10) { minutes = "0" + minutes; }
            if (seconds < 10) { seconds = "0" + seconds; }

            if (hours === "00")
                return minutes + ':' + seconds;
            else
                return hours + ':' + minutes + ':' + seconds;
        };

    })

    .service('adMob', function ($rootScope) {
        this.init = function () {
            $rootScope.admobid = {};
            // select the right Ad Id according to platform
            if (/(android)/i.test(navigator.userAgent)) {
                $rootScope.admobid = { // for Android
                    banner: 'ca-app-pub-2378414087412995/6176237268',
                    interstitial: 'ca-app-pub-2378414087412995/6954966465'
                };
            }

            if (window.AdMob) AdMob.createBanner({
                adId: $rootScope.admobid.banner,
                position: AdMob.AD_POSITION.BOTTOM_CENTER,
                isTesting: true,
                autoShow: true
            });

            if (window.AdMob) window.AdMob.prepareInterstitial({
                adId: $rootScope.admobid.interstitial,
                autoShow: false
            });
        };

        this.handleAdMobEvents = function () {
            $rootScope.$on('$ionicView.beforeEnter', function (e) {

                if (window.AdMob) {
                    window.AdMob.showInterstitial();
                }
            });
            document.addEventListener('onAdDismiss', function (e) {
                window.AdMob.prepareInterstitial({
                    adId: $rootScope.admobid.interstitial,
                    autoShow: false
                });
            });
        };

    });
angular.module('starter.controllers', [])
  /* .controller('LoginController', function ($scope, $rootScope, hardware, constant, localStorageService, $state, login) {
 
 
 
     // With the new view caching in Ionic, Controllers are only called
     // when they are recreated or on app start, instead of every page change.
     // To listen for when this page is active (for example, to refresh data),
     // listen for the $ionicView.enter event:
     //$scope.$on('$ionicView.enter', function(e) {
     //});
     $rootScope.person = { email: "", password: "" };
 
 
     $scope.checkPersonLogin = function () {
       var _person = login.isPersonLoginedIn();
       if (_person != null) {
         $rootScope.person = _person;
         $state.go("app.search");
         console.log(JSON.stringify($rootScope.person));
       }
     };
 
     $scope.login = function () {
       login.signIn($rootScope.person).then(function (data) {
         localStorageService.set(constant.loginKey, $rootScope.person);
       });
     }
 
     $rootScope.logout = function () {
       login.logout();
     };
 
 
     hardware.overrideBackButton();
     hardware.overridePauseButton();
     $scope.checkPersonLogin();
 
   }) */
  .controller('AppController', function ($rootScope, $scope, $location, category, personCategory, $ionicPopup, $state, constant, about, video, $cordovaToast, hardware, adMob) {
    $scope.data = { categoryName: "" };
    $scope.categories = [];
    $scope.personCategories = [];
    $rootScope.facebookAccessToken = "";
    $rootScope.userID = "";
    $rootScope.appLinkInPlayStore = constant.appLinkInPlayStore;




    $scope.getCategories = function () {
      category.getCategories().then(function (data) {
        $scope.categories = data.items;

      });
    };

    $scope.getPersonCategories = function () {
      $scope.personCategories = [];
      personCategory.getPersonCategories().then(function (data) {
        for (var i = 0; i < data.rows.length; i++) {
          $scope.personCategories.push({ id: data.rows.item(i).id, category: data.rows.item(i).category, channels: data.rows.item(i).channels });
        }

      });

    };

    $scope.createPersonCategory = function () {
      personCategory.createPersonCategory($scope.personCategories, $scope.data.categoryName);
      $scope.data.categoryName = "";
      $scope.getPersonCategories();
    };

    // Triggered on a button click, or some other target
    $scope.createNewCategory = function () {


      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="input" ng-model="data.categoryName">',
        title: 'Enter New Category',
        subTitle: 'أضف مجموعة جديد',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.categoryName) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                $scope.createPersonCategory();
              }
            }
          }
        ]
      });

      myPopup.then(function (res) {
        console.log('Tapped!', res);
      });

    };

    $scope.deleteCategory = function (id) {
      personCategory.deleteCategory(id).then(function (data) {
        $cordovaToast.show(constant.CATEGORU_DELETED_SUCCESSFULLY, 'long', 'bottom');
        $location.path("#/app/search");
        $scope.getPersonCategories();
      });
    };

    $scope.openMarket = function () {
      about.openMarket();
    };

    $scope.about = function () {
      about.showAbout();
    };

    $scope.shareLink = function (link) {
      about.shareLink(link);
    };

    $scope.categorySelected = function (newValue, oldValue, channelId) {
      console.log("category is : " + newValue + " channel id is " + channelId);
      personCategory.updatePersonCategoryChannels(newValue, channelId).then(function (data) {
        //$cordovaToast.show(constant.CATEGORU_DELETED_SUCCESSFULLY, 'long', 'bottom');
        $scope.getPersonCategories();
      });
    };

    $scope.$on("finallyDeviceReady", function () {
      $scope.getPersonCategories();
    });


    hardware.overrideBackButton();
    hardware.overridePauseButton();
    hardware.checkInternetConnection();
    //adMob.handleAdMobEvents();


    $scope.getCategories();

  })
  .controller('CategoryController', function ($scope, $stateParams, channel) {

    $scope.dbChannels = [];
    $scope.fullDetailsChannels = [];

    $scope.getChannelById = function () {
      for (var i = 0; i < $scope.dbChannels.length; i++) {
        var channelId = $scope.dbChannels[i].link;
        channel.getChannelById(channelId).then(function (data) {
          $scope.fullDetailsChannels.push(data.items[0]);
        });
      }

    };
    $scope.getChannels = function () {
      channel.getChannelsByCategoryId($stateParams.categoryId).then(function (data) {
        $scope.dbChannels = data.items;
        $scope.getChannelById();
      });
    };


    $scope.getChannels();
  })
  .controller('TrendingController', function ($scope, video, search, $ionicModal) {
    $scope.regionCode = "";
    $scope.playlist = [];
    $scope.nextPageToken = "";
    $scope.moredata = true;
    $scope.video = {};

    $scope.getTrendingVideos = function () {
      search.search("").then(function (data) {
        $scope.regionCode = data.regionCode;
        video.getTrendingVideos($scope.regionCode).then(function (data) {
          $scope.playlist = data.items;
          $scope.nextPageToken = data.nextPageToken;
        });

      });

    };


    $scope.loadMore = function () {
      video.getMoreTrendingVideos($scope.regionCode, $scope.nextPageToken).then(function (data) {
        if (data.nextPageToken === undefined) {
          $scope.moredata = false;
        } else {
          $scope.nextPageToken = data.nextPageToken;
          for (var i = 0; i < data.items.length; i++) {
            $scope.playlist.push(data.items[i]);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }

      });
    };

    $ionicModal.fromTemplateUrl('./templates/video.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function (video) {
      // $scope.video = video;
      angular.copy(video, $scope.video);
      // $scope.getVideoChannel();
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });


    $scope.getTrendingVideos();
  })

  .controller('PersonalCategoryController', function ($scope, utils, channel, $stateParams) {

    $scope.dbChannels = utils.splitString($stateParams.channels);
    $scope.fullDetailsChannels = [];



    $scope.getChannelById = function () {
      for (var i = 0; i < $scope.dbChannels.length; i++) {
        var channelId = $scope.dbChannels[i];
        channel.getChannelById(channelId).then(function (data) {
          $scope.fullDetailsChannels.push(data.items[0]);
        });
      }

    };
    $scope.getChannelById();
  })
  .controller("PlaylistController", function ($scope, $stateParams, channel, video, $filter, $ionicModal, search, $q, utils) {
    $scope.video = {};
    $scope.playlist = [];
    $scope.nextPageToken = "";
    $scope.moredata = true;

    $scope.getPlaylist = function () {
      channel.getChannelPlaylistByChannelId($stateParams.channelId).then(function (data) {
        $scope.nextPageToken = data.nextPageToken;
        $scope.getVideos(data.items);
      });
    };


    $scope.getVideos = function (items) {
      var promises = [];
      var x = [];
      //   video.getVideosByIds(items, $scope.playlist, true);
      for (var i = 0; i < items.length; i++) {
        if (items[i].id.videoId != undefined) {

          promises.push(video.getVideoById(items[i].id.videoId));
        }

      }
      $q.all(promises).then(function (ret) {
        for (var j = 0; j < ret.length; j++) {
          x.push(ret[j].items[0]);

        }
        x = $filter('orderBy')(x, 'snippet.publishedAt', true);
        for (var j = 0; j < x.length; j++) {
          $scope.playlist.push(x[j]);

        }
      });

    };

    $scope.formatYoutubeDuration = function (duration) {
      return utils.formatYoutubeDuration(duration);

    };

    $scope.loadMore = function () {
      search.loadMoreSearch($scope.nextPageToken, $stateParams.channelId, undefined).then(function (data) {
        if (data === undefined || data.nextPageToken === undefined) {
          $scope.moredata = false;
        } else {
          $scope.nextPageToken = data.nextPageToken;
          $scope.getVideos(data.items);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }

      });
    };
    $ionicModal.fromTemplateUrl('./templates/video.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function (video) {
      // $scope.video = video;
      angular.copy(video, $scope.video);
      // $scope.getVideoChannel();
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });



    $scope.getPlaylist();
  })

  .controller("SearchController", function ($rootScope, $scope, $stateParams, search, autoComplete, $http, $ionicHistory, video, $ionicModal, channel, utils) {
    $scope.query = { q: $stateParams.q };
    $scope.searchResults = [];
    $scope.playlist = [];
    $scope.noResults = true;
    $scope.searchPageToken = "";
    $scope.moredata = true;
    $scope.video = {};


    $rootScope.style = {
      direction: "ltr",
      float: "fl"
    };


    $scope.getYoutubeSearchResult = function () {
      if ($scope.query.q != "") {
        if (utils.checkArabicLanguage($scope.query.q)) {

          $rootScope.style.direction = "rtl";
          $rootScope.style.float = "fr";
        } else {
          $rootScope.style.direction = "ltr";
          $rootScope.style.float = "fl";
        }


        autoComplete.complete($scope.query.q).then(function (response) {
          $scope.searchResults = response;
          $scope.noResults = false;
        });
      }


    };


    $scope.search = function (selected) {
      $scope.query.q = selected;
      $scope.searchResults = [];
      $scope.playlist = [];
      $scope.noResults = true;

      search.search($scope.query.q).then(function (data) {
        $scope.searchPageToken = data.nextPageToken;
        $scope.getVideos(data.items);
      });
    };
    $scope.loadMore = function () {
      search.loadMoreSearch($scope.searchPageToken, undefined, $scope.query.q).then(function (data) {
        if (data.nextPageToken === undefined) {
          $scope.moredata = false;
        } else {
          $scope.searchPageToken = data.nextPageToken;
          $scope.getVideos(data.items);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }

      });
    };
    $scope.getVideos = function (items) {
      video.getVideosByIds(items, $scope.playlist);
    };


    $scope.formatYoutubeDuration = function (duration) {
      return utils.formatYoutubeDuration(duration);

    };





    $ionicModal.fromTemplateUrl('./templates/video.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function (video) {
      angular.copy(video, $scope.video);
      // $scope.video = video;
      //  $scope.getVideoChannel();
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });




    $scope.search("");
  })
  .controller("VideoController", function ($scope, $stateParams, $ionicActionSheet, $timeout, $sce, channel, localStorageService, utils, $cordovaToast, constant) {
    $scope.channel = {};
    // $scope.videoId = $stateParams.videoId;

    $scope.getVideoChannel = function () {
      if ($scope.video.id != undefined) {
        var channelId = $scope.video.snippet.channelId;
        channel.getChannelById(channelId).then(function (data) {
          $scope.channel = data.items[0];
        });
      }

    };


    $scope.checkArabicLanguage = function (text) {
      if (utils.checkArabicLanguage(text)) {
        return true;
      }
      return false;
    };

    // Triggered on a button click, or some other target
    $scope.showActionSheet = function () {

      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: '<i class="icon ion-share balanced"></i> Share' },
          { text: '<i class="icon fa fa-star positive" aria-hidden="true"></i> Add to favorite' },
          { text: '<i class="icon fa fa-ban assertive" aria-hidden="true"></i> Cancel' }
        ],
        // destructiveText: 'Delete',
        titleText: $scope.video.snippet.title,
        cancelText: 'Cancel',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          if (index == 0) {
            var videoLink = $scope.getVideoLink();
            $scope.shareLink(videoLink);
          } else if (index === 1) {
            $scope.addFavourite();
          }
          return true;
        }
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function () {
        hideSheet();
      }, 10000);

    };
    $scope.getIframeSrc = function () {
      return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + $scope.video.id + '?showinfo=0&enablejsapi=1&rel=0');
    };

    $scope.getVideoLink = function () {
      var youtubeLink = "https://www.youtube.com/watch?v=";
      return youtubeLink + $scope.video.id;
    };

    $scope.addFavourite = function () {
      var index = -1;
      var favourites = [];
      var tempFavourites = localStorageService.get(constant.favourites);
      if (tempFavourites !== null) {
        favourites = JSON.parse(localStorageService.get(constant.favourites));
        index = utils.getVideoIndex($scope.video, favourites);
      }
      if (index == -1) { //this vides is not exsist 
        favourites.push($scope.video);
        localStorageService.set(constant.favourites, JSON.stringify(favourites));
        $cordovaToast.show('new favourite video is added successfully', 'long', 'bottom');
      } else {
        //$ionicLoading.show({ template: "this video exsists", noBackdrop: false, duration: 1000 });
        $cordovaToast.show('this video exsists', 'long', 'bottom');

      }

    };
    $scope.$watch('video.id', function (newValue, oldValue, scope) {
      $scope.getVideoChannel();
    });

  })
  .controller("CommentsController", function ($scope, comments) {
    $scope.comments = [];

    $scope.getVideoComments = function () {
      comments.getVideoComments($scope.video.id).then(function (data) {
        $scope.comments = data.items;
      });
    };

    $scope.$watch('video.id', function (newValue, oldValue, scope) {
      $scope.getVideoComments();
    });
    $scope.getVideoComments();
  })
  .controller("RelatedController", function ($scope, related, video) {
    $scope.detailedRelatedVideos = [];

    $scope.getRelatedVideos = function () {
      related.getRelatedVideos($scope.video.id).then(function (data) {
        $scope.getVideos(data.items);
      });
    };

    $scope.getVideos = function (items) {
      $scope.detailedRelatedVideos = [];
      video.getVideosByIds(items, $scope.detailedRelatedVideos, false);
    };

    $scope.play = function (video) {
      angular.copy(video, $scope.video);
    };
    $scope.$watch('video.id', function (newValue, oldValue, scope) {
      $scope.getRelatedVideos();
    });

    $scope.getRelatedVideos();
  })
  .controller("FavouriteController", function ($scope, localStorageService, $filter, $ionicModal, utils, constant) {
    $scope.playlist = [];
    $scope.video = {};
    $scope.isFavouriteView = true;

    $scope.getFavourite = function () {
      $scope.playlist = [];
      var tempFavourites = localStorageService.get(constant.favourites);
      if (tempFavourites !== undefined && tempFavourites != null) {
        tempFavourites = JSON.parse(localStorageService.get(constant.favourites));
        $scope.playlist = $filter('orderBy')(tempFavourites, null, true);
      }



    };
    $scope.formatYoutubeDuration = function (duration) {
      return utils.formatYoutubeDuration(duration);

    };
    $scope.clearAll = function () {
      localStorageService.remove(constant.favourites);
      $scope.getFavourite();
    };

    $scope.deleteFavourite = function (video) {

      var index = utils.getVideoIndex(video, $scope.playlist);
      if (index != -1) {
        $scope.playlist.splice(index, 1);
        var favourites = $filter('orderBy')($scope.playlist, null, true);
        localStorageService.set(constant.favourites, JSON.stringify(favourites));
      }
      $scope.getFavourite();
    };

    $ionicModal.fromTemplateUrl('./templates/video.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function (video) {
      angular.copy(video, $scope.video);
      // $scope.getVideoChannel();
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
      // Execute action
    });


    $scope.getFavourite();
  });

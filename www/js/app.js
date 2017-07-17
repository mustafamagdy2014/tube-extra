// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'ionicLazyLoad', 'ionic-modal-select', 'ngSanitize', 'yaru22.angular-timeago', 'oitozero.ngSweetAlert', 'LocalStorageModule', 'starter.constant', 'starter.controllers', 'starter.services'])

  .run(function ($ionicPlatform, $cordovaSQLite, db,adMob, $rootScope, $cordovaNetwork) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      db.createDb();
     // adMob.init();
      $rootScope.$broadcast('finallyDeviceReady');
      
   


    });



  })

  .config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppController'
      })


      .state('app.category', {
        url: '/categories/:categoryId',
        views: {
          'menuContent': {
            templateUrl: 'templates/channels.html',
            controller: 'CategoryController'
          }
        }
      })
      .state('app.trending', {
        url: '/trending',
        views: {
          'menuContent': {
            templateUrl: 'templates/trending.html',
            controller: 'TrendingController'
          }
        }
      })
      .state('app.personCategory', {
        url: '/personCategoryChannels/:channels',
        views: {
          'menuContent': {
            templateUrl: 'templates/channels.html',
            controller: 'PersonalCategoryController'
          }
        }
      })
      .state('app.playlist', {
        url: '/playlist/:channelId',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'PlaylistController'
            /*  resolve: {
                 playList: function($stateParams,channel) {
                      return channel.getChannelPlaylistByChannelId($stateParams.channelId);
                 }
             }*/
          }
        }
      })
      .state('app.favourite', {
        url: '/favourite',
        views: {
          'menuContent': {
            templateUrl: 'templates/favourite.html',
            controller: 'FavouriteController'
          }
        }
      })
      .state('video', {
        url: '/video/:videoId',
        templateUrl: 'templates/video.html',
        controller: 'VideoController'
      })
      .state('app.search', {
        url: '/search/:q',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'SearchController'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/trending');
    localStorageServiceProvider
      .setPrefix('tubePlus');
  });
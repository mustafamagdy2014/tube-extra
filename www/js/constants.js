angular.module('starter.constant',[])
.constant('constant', {
    applicationName:'Tube Extra',
    favourites: 'favourites',
    personalCategories:'personalCategories',
    publisher:'http://play.google.com/store/search?q=pub:Eapp-Soft',
    appLinkInPlayStore:'',
    createMyChannelsTable:'CREATE TABLE IF NOT EXISTS myChannels (id integer primary key,category text, channels text)',
    CATEGORY_EXSISTS:'The category name you have chosen already exists. Please try another category name',
    CHANNEL_EXSISTS:'This channel  you have chosen already exists into this category',
    CATEGORU_ADDED_SUCCESSFULLY:'category is added successfully!',
    CHANNEL_ADDED_SUCCESSFULLY:'subscription done successfully!',
    CATEGORU_DELETED_SUCCESSFULLY:'category is deleted successfully!'
});

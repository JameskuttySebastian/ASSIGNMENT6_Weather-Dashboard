$(document).ready(function() {

// var defaultURL = "https://api.openweathermap.org/data/2.5/weather?units=metric";
// var city = "Adelaide";
// var cityAdd = "&q="+city;
// var key = "&appid=ed08a362d4cb8955e89ed3cacd336637";
// var queryDefaultURL = defaultURL+cityAdd+key;

// $.ajax({
//     url : queryDefaultURL,
//     method : "GET"
// }).then(function(response){
//     console.log(response);
// })


//Search from searh box
// var searchURL = "https://api.openweathermap.org/data/2.5/weather?units=metric";
// var city = $("#inputCity").val();
// var cityAdd = "&q="+city;
// var key = "&appid=ed08a362d4cb8955e89ed3cacd336637";
// var queryCurrentURL = searchURL+cityAdd+key;

// $.ajax({
//     url : queryCurrentURL,
//     method : "GET"
// }).then(function(response){
//     // var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
//     console.log(response);
// })


// var Day5URL = "https://api.openweathermap.org/data/2.5/forecast?units=metric";
// var city = "Melbourne";
// var cityAdd = "&q="+city;
// var key5Day = "&appid=0cc819ac1487bb114ac7b71d4c192ed7";
// var queryURLDay5 = Day5URL+cityAdd+key5Day;

// $.ajax({
//     url : queryURLDay5,
//     method : "GET"
// }).then(function(response){
//     var typ = response;
//     console.log(typ);
//     console.log(response);
// })

function populateSearchHistory(){
    for (var i = 0; i < searchList.length; i++){
        createSearchHistory(searchList[i]);
    }    
}

function createSearchHistory(searchItem){
    var searchContainer = $("<div>");
    searchContainer.addClass("p-1 bg-light rounded rounded-pill shadow-sm mb-4 searchContainer");
    $(".searchedItem").append(searchContainer);
    var searchHistory = $("<div>");
    searchHistory.addClass("searchHistory");
    var searchItemTag = $("<p>");
    searchItemTag.text(searchItem);
    searchHistory.append(searchItemTag);
    searchContainer.append(searchHistory);
    
    return("");
}

function createSearchedItemDiv (){
    var searchedItem = $("<div>");
    searchedItem.addClass("searchSection searchedItem");
    $("#searchColumn").append(searchedItem);
}
var searchList = [];
searchList = JSON.parse(localStorage.getItem("searchList"));

if(searchList!==null){
    createSearchedItemDiv();
    populateSearchHistory();
}


$("#buttonSearch").click(function(){
    var inputCity = $("#inputCity").val();
    $("#inputCity").val("");
    if(inputCity != ""){
        $(".searchedItem").empty();
        console.log(searchList);
        if (searchList === null || searchList.length ==0){
            searchList = [];
            searchList.push(inputCity);
            createSearchedItemDiv();
        }
        else{
            searchList.splice(0, 0,  inputCity)
        }        

        if(searchList.length>8){
            searchList.pop();
            console.log(searchList);        
        }
        localStorage.setItem("searchList", JSON.stringify(searchList));
        populateSearchHistory();
        
    }
})





})
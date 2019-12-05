$(document).ready(function () {

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
    function currentWeatherSearch(city) {
        var searchURL = "https://api.openweathermap.org/data/2.5/weather?units=metric";
        var cityAdd = "&q=" + city;
        var key = "&appid=ed08a362d4cb8955e89ed3cacd336637";
        var queryCurrentURL = searchURL + cityAdd + key;

        $.ajax({
            url: queryCurrentURL,
            method: "GET"
        }).then(function (response) {

            var myStatus = response.cod;
            if (myStatus == 200) {

                var name = response.name;
                var utiDatetime = response.dt;
                var iconcode = response.weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                var date = moment.unix(utiDatetime).format("MM/DD/YYYY HH:mmA");
                var temperature = response.main.temp;
                var humidity = response.main.humidity;
                var windSpeed = response.wind.speed;
                var lon = response.coord.lon;
                var lat = response.coord.lat;




                
                getUVIndex(lat, lon);


            }
        })
    }

    function getUVIndex(lat, lon) {
        // http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}
        var key = "appid=ed08a362d4cb8955e89ed3cacd336637";
        var location = "&lat=" + lat + "&lon=" + lon;
        var urlUVIndex = "http://api.openweathermap.org/data/2.5/uvi?" + key + location;

        $.ajax({
            url: urlUVIndex,
            method: "GET"
        }).then(function (response) {
            var uvIndex = response.value;

        })
    }

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

    // populate search history at the beginning and each new search
    function populateSearchHistory() {
        for (var i = 0; i < searchList.length; i++) {
            createSearchHistory(searchList[i]);
        }
    }

    // Create search history with each item dynamically created
    function createSearchHistory(searchItem) {
        var searchContainer = $("<div>");
        searchContainer.addClass("p-1 bg-light rounded rounded-pill shadow-sm mb-4 searchContainer");
        $(".searchedItem").append(searchContainer);
        var searchHistory = $("<div>");
        searchHistory.addClass("searchHistory");
        var searchItemTag = $("<p>");
        searchItemTag.text(searchItem);
        searchHistory.append(searchItemTag);
        searchContainer.append(searchHistory);
        return ("");
    }
    // main search history div creation
    function createSearchedItemDiv() {
        var searchedItem = $("<div>");
        searchedItem.addClass("searchSection searchedItem");
        $("#searchColumn").append(searchedItem);
    }

    // main history list variable
    var searchList = [];
    searchList = JSON.parse(localStorage.getItem("searchList"));

    if (searchList !== null) {
        /************************************************* */
        // creating main div when object is present in local memory
        createSearchedItemDiv();
        populateSearchHistory();
    }


    $("#buttonSearch").click(function () {
        var inputCity = $("#inputCity").val();

        $("#inputCity").val("");
        if (inputCity != "") {
            // clearing history display
            $(".searchedItem").empty();
            // console.log(searchList);
            if (searchList === null || searchList.length == 0) {
                /************************************************* */
                // this is done due to empty memory overwriting the variable to null
                searchList = [];
                /************************************************* */
                searchList.push(inputCity);
                /************************************************* */
                // creating main div when no object is saved in local memory
                createSearchedItemDiv();
            }
            else {
                // entering the element at the beginning of the array
                searchList.splice(0, 0, inputCity)
            }

            //calling the AJAX method to get weather infor for current weather

            currentWeatherSearch(inputCity);

            // var dateString = moment.unix("1575514614").format("MM/DD/YYYY HH:mmA");

            // console.log(dateString);





            // deleting search history which is more than last 8 searchs
            if (searchList.length > 8) {
                searchList.pop();
                // console.log(searchList);
            }
            // saving the array to local storage
            localStorage.setItem("searchList", JSON.stringify(searchList));
            // populating searh history after changing array
            populateSearchHistory();

        }
    })





})
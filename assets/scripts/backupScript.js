//********************************************************* */
// var splitByDateArray = [];
// var currentDateArray = [];

// for (var j = 1; j < dateArray.length; j++) {
//     if (currentDateArray.length == 0) {
//         currentDateArray.push(dateArray[j - 1]);
//     }
//     if (dateArray[j - 1].dt === dateArray[j].dt) {
//         currentDateArray.push(dateArray[j]);
//         if (j == dateArray.length - 1) {
//             splitByDateArray.push(currentDateArray);
//             currentDateArray = [];
//         }
//     }
//     else {
//         splitByDateArray.push(currentDateArray);
//         currentDateArray = [];
//     }
// }


// console.log(JSON.stringify(splitByDateArray));
//*****************************************************************
$(document).ready(function () {

    // main history list variable
    var searchList = [];
    searchList = JSON.parse(localStorage.getItem("searchList"));
    //initial loading
    if (searchList !== null) {
        /************************************************* */
        // creating main div when object is present in local memory
        createSearchedItemDiv();
        populateSearchHistory();
    }


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
                renderCurrentWeather(response);
                var lon = response.coord.lon;
                var lat = response.coord.lat;
                getUVIndex(lat, lon);

            }
            else if (myStatus != 200) {
                var mainHeading = $("<h2>");
                mainHeading.text("City not found....")
                $(".currentWeather").append(mainHeading);
            }
        })
    }

    function renderCurrentWeather(response) {
        $(".currentWeather").empty();
        // append name of the city
        var utiDatetime = response.dt;
        var dateTm = moment.unix(utiDatetime).format("MM/DD/YYYY hh:mm a");
        // append name of the city
        var mainHeading = $("<h2>").text(response.name + "( " + dateTm + " )");
        mainHeading.attr("id", "currentWeather-main");
        //include the icon
        var iconcode = response.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        var imageIcon = $("<img>");
        imageIcon.attr("src", iconurl)
        imageIcon.attr("style", "display: inline;")
        mainHeading.append(imageIcon);
        $(".currentWeather").append(mainHeading); // for showing near to date

        var temperatureTag = $("<p>").text("Temperature : " + response.main.temp);
        $(".currentWeather").append(temperatureTag);

        var humidityVal = $("<p>").text("Humidity : " + response.main.humidity);
        $(".currentWeather").append(humidityVal);

        var windSpeed = $("<p>").text("Wind Speed : " + response.wind.speed + " kms.");
        $(".currentWeather").append(windSpeed);
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
            uvIndex = response.value;
            colour = "";
            if (uvIndex != "") {

                if (uvIndex <= 2) {
                    color = "green";
                }
                else if (uvIndex <= 5) {
                    color = "yellow";
                }
                else if (uvIndex <= 7) {
                    color = "orange";
                }
                else if (uvIndex <= 10) {
                    color = "red";
                }
                else if (uvIndex > 10) {
                    color = "violet";
                }
                var span = $("<span>").text(response.value);
                span.attr("style", "background:" + color + "; padding: 10px;");
                var uvIndex = $("<p>").text("UV Index :");
                uvIndex.append(span)
                var uvDiv = $("<div>");
                uvDiv.append(uvIndex)
                $(".currentWeather").append(uvDiv);
            }
            else if (myStatus = "") {
                var uvIndex = $("<p>").text("UV Index is not available !...");
                $(".currentWeather").append(uvIndex);
            }

        })
    }


    function forcastWeatherSearch(inputCity) {


        var Day5URL = "https://api.openweathermap.org/data/2.5/forecast?units=metric";
        var city = inputCity
        var cityAdd = "&q=" + city;
        var key5Day = "&appid=0cc819ac1487bb114ac7b71d4c192ed7";
        var queryURLDay5 = Day5URL + cityAdd + key5Day;

        $.ajax({
            url: queryURLDay5,
            method: "GET"
        }).then(function (response) {
            // console.log(response);
            var myStatus = response.cod;
            if (myStatus == 200) {
                $("#forcastHeading").text("5-Day Forcast");

                //extracting required data
                var dataArray = response.list;
                var dateArray = [];

                for (var i = 0; i < dataArray.length; i++) {

                    var dataObject = {
                        dt: "",
                        time: "",
                        index: 0,
                        temp: 0,
                        humidity: 0,
                        daynight: "",
                        icon: ""
                    }

                    dataObject.dt = moment.unix(dataArray[i].dt).format("DD/MM/YYYY");
                    dataObject.time = moment.unix(dataArray[i].dt).format("hh:mm a");
                    dataObject.index = i;
                    dataObject.temp = dataArray[i].main.temp_max;
                    dataObject.humidity = dataArray[i].main.humidity;
                    dataObject.daynight = dataArray[i].sys.pod;
                    dataObject.icon = dataArray[i].weather[0].icon;
                    dateArray.push(dataObject);
                }

                console.log(JSON.stringify(dateArray));

                //apliting array by dates


                var requiredDateArray = [];
                var selectedObj = dateArray[0];
                for (var j = 0; j < dateArray.length - 1; j++) {
                    if (dateArray[j].dt === dateArray[j + 1].dt) {
                        if (parseFloat(dateArray[j].temp) < parseFloat(dateArray[j + 1].temp)) {
                            selectedObj = dateArray[j + 1];
                        }
                        if (j + 1 == dateArray.length - 1) {
                            requiredDateArray.push(selectedObj);
                        }
                    }
                    else {
                        requiredDateArray.push(selectedObj);
                        j++;
                        selectedObj = dateArray[j];
                    }
                }
                console.log(JSON.stringify(requiredDateArray));



            }
            else if (myStatus != 200) {
                $("#forcastHeading").text("Forcast not found.....");
            }
        })

    }

    // populate search history at the beginning and each new search
    function populateSearchHistory() {
        for (var i = 0; i < searchList.length; i++) {
            createSearchHistory(searchList[i]);
        }
        //re-attach search click function
        $(".searchTag").click(function () {
            var currentSearch = this.children[0].children[0].textContent;
            // console.log(currentSearch);
            $('#inputCity').val(currentSearch);
            event.preventDefault();
            $("#buttonSearch").click();
            // console.log("clicked");
        })
    }

    // Create search history with each item dynamically created
    function createSearchHistory(searchItem) {
        var atag = $("<a>");
        atag.addClass("searchTag");
        $(".searchedItem").append(atag);
        var searchContainer = $("<div>");
        searchContainer.addClass("p-1 bg-light rounded rounded-pill shadow-sm mb-4 searchContainer");
        atag.append(searchContainer);
        var searchHistory = $("<div>");
        searchHistory.addClass("searchHistory");
        var searchItemTag = $("<p>");
        atag.addClass("searchValue");
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




    // this is for enter key press function
    $(function () { // this will be called when the DOM is ready
        $('#inputCity').keyup(function () {
            if (event.keyCode === 13) {
                event.preventDefault();
                $("#buttonSearch").click();
            };
        });
    });

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

            // currentWeatherSearch(inputCity);
            forcastWeatherSearch(inputCity);



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
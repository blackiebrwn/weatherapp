define('gmaps', ['async!http://maps.google.com/maps/api/js?v=3&sensor=false'],
function(){
    // return the gmaps namespace for brevity
    return window.google.maps;
});

require(["forecast/forecast.io", "gmaps"], function(ForecastIO, gmaps) {

    $('#addr-submit').on('click', function(){
        useCurrent = false;
        codeAddress();
    });

    $('#curr-submit').on('click', function(){
        useCurrent = true;
        codeAddress();
    });

    var useCurrent = true;
    var currLat;
    var currLong;
    var result;
    var geocoder = new gmaps.Geocoder();


    function codeAddress() {

        var address = $('#address').val();

        if(useCurrent) {
            navigator.geolocation.getCurrentPosition(function(position){

                // alert('made it')
                currLat = position.coords.latitude;
                currLng = position.coords.longitude;

                initialize(currLat, currLng);
                createForecast(currLat, currLng);

            });
        } else {

            geocoder.geocode( {'address':address}, function(results, status){
                if(status == gmaps.GeocoderStatus.OK) {
                    currLat = String(results[0].geometry.location.lat());
                    currLong = String(results[0].geometry.location.lng());
                    alert('got geolocation');

                    initialize(currLat, currLong);
                    createForecast(currLat, currLong);
                }
                else {
                    alert('didnt make it');
                }
            });

        }

    }

    function createForecast(lat, lng) {
        var forecast = new ForecastIO({
            PROXY_SCRIPT: 'js/forecast/proxy.php'
        });

        alert('created Forecast');
        // console.log(forecast.requestData(lat,lng));
        var condition = forecast.getCurrentConditions(lat,lng);
        var today = forecast.getForecastToday(lat,lng);
        var week = forecast.getForecastWeek(lat,lng);

        for (var i = 0; i < today.length; i++) {
            var time = today[i].getTime('h:mm a');
            var temp = today[i].getTemperature();
            console.log(time + ', ' + temp);
        };


        displayWeekFC(week);

        $('.info h1').html('The current temp is: ' + condition.getTemperature());
        $('.info h2').html(condition.getSummary());
    }

    function displayWeekFC(week_obj) {
        for (var i = 1; i < week_obj.length; i++) {

            var heading = '#week-panel-' + i + ' > .panel-heading';
            var min = '#week-panel-' + i + ' p.min';
            var max = '#week-panel-' + i + ' p.max';
            $(heading).html(week_obj[i].getTime('dddd'));
            $(min).html(week_obj[i].getMinTemperature());
            $(max).html(week_obj[i].getMaxTemperature());
        };
    }

    function initialize(lat, lng) {

        var mapOptions = {};

        var map = new google.maps.Map(document.getElementById('map'), mapOptions);

        map.setCenter(new google.maps.LatLng(lat, lng));
        map.setZoom(14);
    }


});




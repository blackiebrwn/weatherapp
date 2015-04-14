define('gmaps', ['async!http://maps.google.com/maps/api/js?v=3&sensor=false'],
function(){
    // return the gmaps namespace for brevity
    return window.google.maps;
});

define(['gmaps'], function(require, gmaps) {

    function codeAddress(address) {
        var address = $('#address').val();
        var geocoder = new gmaps.Geocoder();
        geocoder.geocode( {'address':address}, function(results, status) {
            if (status == gmaps.GeocoderStatus.OK) {
                // var currLat = results[0].geometry.location.lat();
                // var currLong = results[0].geometry.location.lng();
                var latlng = results[0].geometry.location;
                return latlng;
            }
        });
    }

})
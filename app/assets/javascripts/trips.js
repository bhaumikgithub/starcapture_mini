

$(document).on("fields_added.nested_form_fields", function(event, param) {
  getPlaces()
});

$(document).on("fields_removed.nested_form_fields", function(event, param) {
  $(document).find('fieldset').each(function(){
    if(this.style['display'] == 'none'){
    this.elements[0].classList.remove('time')
    this.elements[1].classList.remove('place_search')
    this.elements[2].classList.remove('distance')
    }
  })
  getDirection()
});




function getPlaces()
  {
    $(".place_search").each(function(){
    var autocomplete = new google.maps.places.Autocomplete(this);
    autocomplete.setComponentRestrictions(
        {'country': ['in']});
    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    autocomplete.addListener('place_changed', function() {
     initMap()
    });
  });
}
function initMap() {
  var marker = [];
  var map = ''
  var current_pos = {lat: 23.0329, lng: 72.5328};
  var map_div = document.getElementById('map')
  if(map_div != null)
  {
    var myStyles =[
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [ { visibility: "off" }]
      }
    ];
    map = new google.maps.Map(map_div, {zoom: 15, center: current_pos,styles: myStyles});
    //  marker = new google.maps.Marker({
    //   draggable:true,
    //   position: current_pos,
    //   map: map,
    //   title:"Drag me!"
    // });
    getDirection()
  }
}

function getDirection() {
  var places= []
  var source;
  var destination;
  var waypoints = [];
  var directionsService = '';
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay.setOptions( { suppressMarkers: false } );
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {lat: 23.0329, lng: 72.5328}
  });
  
  directionsDisplay.setMap(map);
  $(".place_search").each(function(){
    places.push(this.value)
  })
  if(places.length == 1)
  {
    source = places[0]
    destination = places[0]
    
  }
  else{
    source = places[0]
    destination = places[places.length-1]

    for(var i=1; i<=places.length-2;i++ ){
    waypoints.push({
        location: places[i],
        stopover: true
      });
    }
  }
 if(source != '' || destination != ''){
    directionsService.route({
      origin: source,
      destination: destination,
      waypoints: waypoints,
      // optimizeWaypoints: true,
      travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
          var route = response.routes[0];
          var distance = [];
          var duration = [];
          var totalDistance = 0;
          var totalDuration = 0;
          // For each route, display summary information.
          for (var i = 0; i < route.legs.length; i++) {
            distance.push(route.legs[i].distance.text)
            duration.push(route.legs[i].duration.value)
            totalDistance += Number(route.legs[i].distance.text.split(' ')[0]);
            totalDuration += route.legs[i].duration.value;
          }
        } else {
          window.alert('Directions request failed. Please try again');
        }
        var totalTime = convertTime(totalDuration)
        $('.total_display').text("Total " + totalDistance + " kms distance, " + totalTime + " Hrs")
        if( distance != '' || duration != ''){
          for(let i = 0; i < distance.length; i++){
            $('.distance')[0].value = ''
            $('.time')[0].value = ''
            if(distance[i] != undefined || distance.length > 1)
              $('.distance')[i+1].value = distance[i]
            if(duration[i] != undefined || duration.length > 1)
              $('.time')[i+1].value = convertTime(duration[i])
          }
        }
    });
  }
}

function convertTime(num){
  var totalSeconds = num;
  var hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;
  return  ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2)
}


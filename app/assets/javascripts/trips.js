
$(document).on("fields_added.nested_form_fields", function(event, param) {
 
  if($('.start_time').length > 1 && $('.end_time').length > 1){
    if($('.end_time')[$('.start_time').length -2].value == '')
      $('.end_time')[$('.start_time').length -2].value = $('.start_time')[$('.start_time').length -2].value
  }
  var start_time = $('.start_time')[0].value
  if(start_time == ''){
    var date = new Date()
    var hours = date.getHours() % 12 || 12
    var minutes = date.getMinutes()
    var start_time =   ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2)
    $('.start_time')[0].value = start_time
    $('.duration')[0].value = '00:00'

  }
  getPlaces()
  if($(".place_search").length > 1 && $(".place_search")[$(".place_search").length-2].value == ''){
    alert('Please Enter Destination First')
    $('fieldset')[$(".place_search").length -1].remove()
    event.preventDefault();
    return false
  }
});

$(document).on("fields_removed.nested_form_fields", function(event, param) {
  $(document).find('fieldset').each(function(){
    if(this.style['display'] == 'none'){
    this.elements[0].classList.remove('start_time')
    this.elements[3].classList.remove('place_search')
    this.elements[4].classList.remove('distance')
    $(this).find('span').removeClass('place_order')
    }
  })
  getDirection()
});

$(document).on('change', ".start_time", function(){
  var current_element = this.name
  if(current_element.slice( 32,33 ) == '0'){
    $('.end_time')[0].value = this.value
    $($('.total_time')[0]).text(this.value + ' - ' + this.value)
  }
  for(let i = 0; i < $('.duration').length; i++){
    if($('.duration')[i].value == ''){
      $('.end_time')[i].value = $('.start_time')[i].value
      $($('.total_time')[i]).text($('.start_time')[i].value + ' - ' + $('.start_time')[i].value)
    }
    else{
      var total = moment.utc((moment.duration($('.duration')[i].value).add($('.start_time')[i].value)).asMilliseconds()).format("HH:mm")
      $('.end_time')[i].value = total
      $($('.total_time')[i]).text($('.start_time')[i].value + '- ' + total)
    }
  }
  var start_point = this.name.replace(/[\[\]']/g,'_' ).split('__')[1]
  getDirection(start_point)
})

$(document).on('change', '.duration', function(){

  // for(let i = 0; i < $('.duration').length; i++){
  //   if($('.duration')[i].value == ''){
  //     $('.end_time')[i].value = $('.start_time')[i].value
  //     $($('.total_time')[i]).text($('.start_time')[i].value + ' - ' + this.value)
  //   }
  //   else{
  //     var total = moment.utc((moment.duration($('.duration')[i].value).add($('.start_time')[i].value)).asMilliseconds()).format("HH:mm")
  //     $('.end_time')[i].value = total
  //     $($('.total_time')[i]).text($('.start_time')[i].value + ' - '+ total)

  //   }
  // }
  getDirection()
})


// $(document).on('change', '.end_time', function(){
//   if(this.value == '')
//     this.value = $(document).find('#'+this.id)[0].value

//   getDirection()
// })


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

function getDirection(start_point) {
  var totalTime = [];
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
  places = places.filter(Boolean)
  if(places.length == 1)
  {
    source = start_point || places[0]
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
          var google_distance = []
          var totalDistance = 0;
          var totalDuration = 0;
          // For each route, display summary information.
          for (var i = 0; i < route.legs.length; i++) {
            distance.push(route.legs[i].distance.text)
            duration.push(route.legs[i].duration.value)
            google_distance.push(route.legs[i].distance.text + ', ' + route.legs[i].duration.text)
            totalDistance += Number(route.legs[i].distance.text.split(' ')[0].replace(/\,/g,''));
            totalDuration += route.legs[i].duration.value;
          }
        } else {
          window.alert('Please enter valid location');
        }
        // var totalTime = totalTimeCalculation($('.start_time')[0].value, $('.start_time')[$('.start_time').length -1].value)
        for(var i =0; i < $('.start_time').length; i++){
          var t = totalTimeCalculation($('.start_time')[i].value, $('.end_time')[i].value)
          totalTime.push(t)
        }
        totalTime.push(convertTime(totalDuration))
        
        var  total = '00:00';
        for(i=0; i< totalTime.length; i++){
          total = addTimes(total , totalTime[i])
        }
        
        $('.total_display').text("Total " + totalDistance.toFixed(2) + " kms distance, " + total + " Hrs")
        $('.total_cacl').val(total)

        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
        for(let i = 0; i < $('.place_search').length; i++){
          if( $('.start_time').length > 2){
            if($('.duration')[i].value == ''){
              $('.duration')[i].value == '00:00'
              $('.end_time')[i].value = $('.start_time')[i].value
              $($('.total_time')[i]).text($('.start_time')[i].value + ' - ' + $('.start_time')[i].value)
            }
            else{
              var total = moment.utc((moment.duration($('.duration')[i].value).add($('.start_time')[i].value)).asMilliseconds()).format("HH:mm")
              $('.end_time')[i].value = total
              $($('.total_time')[i]).text($('.start_time')[i].value + '- ' + total)
            }
          }
          $($('.google_display')[i-1]).text(google_distance[i-1])
          $($('.place_order')[i]).text(alphabet[i])
        }
        if( distance != '' || duration != ''){
          for(var i = parseInt(start_point)+1 || 1; i <= distance.length; i++){
            // $('.distance')[0].value = ''
            var end_time = $('.end_time')[i-1].value 
            if(distance[i] != undefined || distance.length >= 1)
              $('.distance')[i].value = distance[i-1]
            if(duration[i] != undefined || duration.length >= 1){
              $('.start_time')[i].value = convertTime(duration[i-1], end_time)
            }
          }
        }

        for(let i = 0; i < $('.place_search').length; i++){

          if( $('.start_time').length > 2){
            if($('.duration')[i].value == ''){
              $('.duration')[i].value == '00:00'
              $('.end_time')[i].value = $('.start_time')[i].value
              $($('.total_time')[i]).text($('.start_time')[i].value + ' - ' + $('.start_time')[i].value)
            }
            else{
              var total = moment.utc((moment.duration($('.duration')[i].value).add($('.start_time')[i].value)).asMilliseconds()).format("HH:mm")
              $('.end_time')[i].value = total
              $($('.total_time')[i]).text($('.start_time')[i].value + '- ' + total)
            }
          }
          $($('.place_order')[i]).text(alphabet[i])
          $($('.google_display')[i-1]).text(google_distance[i-1])
        }

    });
  }
}

function convertTime(num, end_time){
  var totalSeconds = num;
  var hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;
  var date_diffrence =   ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2)
  if(end_time != undefined){
    return addGoogleTimes(date_diffrence, end_time)
  }
  else{
    return date_diffrence
  }
}

function timeToMins(time) {
  var b = time.split(':');
  return b[0]*60 + +b[1];
}

function timeFromMins(mins) {
  function z(n){return (n<10? '0':'') + n;}
  var h = (mins/60 |0) % 24;
  var m = mins % 60;
  return z(h) + ':' + z(m);
}


function addGoogleTimes(t0, t1) {
  return timeFromMins(timeToMins(t0) + timeToMins(t1));
}


function totalTimeCalculation(t1,t2)
{
  var time_start = new Date();
  var time_end = new Date();
  var value_start = t1.split(':');
  var value_end = t2.split(':');
  if((value_end[0] - value_start[0]) < 0)
    time_end = new Date(time_start.getTime() + 24 * 60 * 60 * 1000)
  time_start.setHours(value_start[0], value_start[1], 0, 0)
  time_end.setHours(value_end[0], value_end[1], 0, 0)
  var ms = time_end - time_start
  return msToTime(ms)
}

function msToTime(duration) {
  if(duration>0){
    var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + ":" + minutes;
  }
  else
    return '0'
}

function addTimes (startTime, endTime) {
  var times = [ 0, 0, 0 ]
  var max = times.length

  var a = (startTime || '').split(':')
  var b = (endTime || '').split(':')

  // normalize time values
  for (var i = 0; i < max; i++) {
    a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
    b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
  }

  // store time values
  for (var i = 0; i < max; i++) {
    times[i] = a[i] + b[i]
  }

  var hours = times[0]
  var minutes = times[1]
  var seconds = times[2]

  if (seconds >= 60) {
    var m = (seconds / 60) << 0
    minutes += m
    seconds -= 60 * m
  }

  if (minutes >= 60) {
    var h = (minutes / 60) << 0
    hours += h
    minutes -= 60 * h
  }

  return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2)
}


// function timeDiff(start, end){
//   var startTime=moment("03:12", "HH:mm");
//   var endTime=moment("23:12", "HH:mm");
//   var duration = moment.duration(endTime.diff(startTime));
//   var hours = parseInt(duration.asHours());
//   var minutes = parseInt(duration.asMinutes())%60;
//   return hours + ":" + minutes
// }

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                                       '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                                       'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                          subdomains:['a', 'b', 'c'],
                      });

var osmCycle = L.tileLayer(
            'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
                subdomains:['a', 'b', 'c'],
                attribution: '&copy; OpenCycleMap, ' + 'Map data ' + osm
            });

var google = L.tileLayer('https://{s}.google.com/vt/lyrs=m@248407269&hl=x-local&x={x}&y={y}&z={z}&s=Galileo', {
                             attribution: 'Map data &copy; Google 2012',
                             subdomains:['mt0','mt1','mt2','mt3'],
                         });

var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
                                    maxZoom: 20,
                                    subdomains:['mt0','mt1','mt2','mt3']
                                });

var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
                                   maxZoom: 20,
                                   subdomains:['mt0','mt1','mt2','mt3']
                               });

var satelite  = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
                                maxZoom: 20,
                                subdomains:['mt0','mt1','mt2','mt3']
                            });

var hikebikemapv1 = L.tileLayer('http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
                                        subdomains:['a', 'b', 'c'],
                                        maxZoom: 17,
                                        attribution: 'Map Data © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    });

var prosoar = L.tileLayer('https://skylines.aero/mapproxy/tiles/1.0.0/airspace+airports/EPSG3857/{z}/{x}/{y}.png',{
                              attribution: 'skylines.aero'
                          });

var hill = L.tileLayer(
            'http://{s}.tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png',
            {
                maxZoom: 17,
                attribution: 'Hillshading: SRTM3 v2 (<a href="http://www2.jpl.nasa.gov/srtm/">NASA</a>)'
            });

var baseMaps = {
    osm,
    osmCycle,
    google,
    googleTerrain,
    googleHybrid,
    satelite,
    hikebikemapv1
}

var selectedBaseLayer = osm;

var overlayMaps = {
    prosoar,
    hill
}

///////////////////


var mapWidget;
var map;
var markers = [];
var routes = [];
var joinedSegments = [];
var clickListener;
var yellowMarker;
var defaultMarker;
var elevator;

function initialize() {

    new QWebChannel(qt.webChannelTransport, function (channel) {
        // now you retrieve your object
        window.mapWidget = channel.objects.mapWidget;

    });

    map = L.map('map', {
                    zoomAnimation: false,
                    fadeAnimation: false,
                    layers: [ osm ],
                } ).setView([49.8043055, 15.4768055], 8);

    L.control.scale().addTo(map);
    L.control.layers(baseMaps, overlayMaps).addTo(map);

    yellowMarker = L.icon({
                              iconUrl: "qrc:///js/images/marker-icon-gold.png",
                              shadowUrl: "qrc:///js/images/marker-shadow.png",
                          });


    defaultMarker = L.icon({
                               iconUrl: "qrc:///js/images/marker-icon-red.png",
                               shadowUrl: "qrc:///js/images/marker-shadow.png",
                           });

    //    test_add_marker();
}

function test_add_marker() {
    addMarker(49, 16, 1, 1);
}


function setMapType(mapType) {

    map.removeLayer(selectedBaseLayer);

    switch (mapType){
    case "ROADMAP":
        selectedBaseLayer = google;
        break;
    case "TERRAIN":
        selectedBaseLayer = googleTerrain;
        break;
    case "SATELLITE":
        selectedBaseLayer = satelite;
        break;
    case "HYBRID":
        selectedBaseLayer = googleHybrid;
        break;
    case "Cykloturist":
        selectedBaseLayer = hikebikemapv1;
        break;
    case "OSMMapnik":
        selectedBaseLayer = osm;
        break;
    case "OSMCyklo":
        selectedBaseLayer = osmCycle;
        break;
    default:
        return false;
    }

    map.addLayer(selectedBaseLayer);

    return true;
}


function flipRelief(setVisible) {

    if (setVisible) {

        console.log("add hillshading")
        map.addLayer(hill);

//        map.overlayMapTypes.insertAt(0, mapTuristCykloRelief);
    } else {
        console.log("remove hillshading")
        map.removeLayer(hill)
//        map.overlayMapTypes.removeAt(0);
    }
    return true;
}

function setOldMarkerPosition(id) {
    for (var i in markers) {
        if(id === markers[i].options.id){
            markers[i].setLatLng(markers[i].oldPosition);
            map.panTo(markers[i].oldPosition)        }
    }
}

function setNewMarkerPosition(id) {
    console.log("setNewMarkerPosition " + id)
    for (var markerIdx in markers) {
        if(id === markers[markerIdx].options.id){
            markers[markerIdx].oldPosition = markers[markerIdx].getLatLng();
//            var newLat = markers[markerIdx].getLatLng();
//            var newLng = markers[markerIdx].position.lng();
//            markers[markerIdx].setMap(map);
            return markers[markerIdx].getLatLng();

            ////////////////////////

//            var ele = -1000;
//            var locations = [];
//            locations.push(markers[markerIdx].getPosition());

//            // Create a LocationElevationRequest object using the array's one value
//            var positionalRequest = {
//                'locations': locations
//            }
//            // Initiate the location request
//            elevator.getElevationForLocations(positionalRequest, function(results, status) {
//                if (status === google.maps.ElevationStatus.OK) {
//                    // Retrieve the first result
//                    if (results[0]) {
//                        ele = results[0].elevation;
//                    }
//                }
//                //				alert(newLat+ ", " +newLng + " != " + markers[markerIdx].position.lat()+ " " + markers[markerIdx].position.lng() + " " + ele);

//                newMarkerAdded(id, newLat, newLng, ele);
//            });
        }
    }
    //return [markers[markerIdx].position.lat(),markers[markerIdx].position.lng(), ele];
}


var idList;
function settingNewMarker(iidList) {
    idList = iidList;
    map.draggableCursor = 'crosshair';
    clickListener = google.maps.event.addListener(map, 'click', function(event) {
        addNewMarkers(event.latLng);
    });

}
function endSettingNewMarker() {
    console.log("FIXME endSettingNewMarker()")
//    map.draggableCursor = 'auto';
//    google.maps.event.removeListener(clickListener);
}


function addNewMarkers(coord) {
    console.log("FIXME addNewMarkers(" + coord + ")")
/*
    var ele = -1000;
    var locations = [];
    locations.push(LatLng);

    // Create a LocationElevationRequest object using the array's one value
    var positionalRequest = {
        'locations': locations
    }
    
    // Initiate the location request
    elevator.getElevationForLocations(positionalRequest, function(results, status) {
        if (status === google.maps.ElevationStatus.OK) {
            // Retrieve the first result
            if (results[0]) {
                ele = results[0].elevation;
            }
        }

        for (var i = 0; i< idList.length; i=i+1)
        {
            addMarker(coord.lat(), coord.lng(), idList[i], 1);
            markerClicked(idList[i], 1);
            newMarkerAdded(idList[i], coord.lat(), coord.lng(), ele);

        }
    });
*/
}

function addMarker(lat, lon, iid, isVisible) {
    console.log("addMarker("+lat+","+lon+","+iid+ ","+ isVisible+ ")")
    var location = L.latLng(lat, lon);

    for (var i in markers) {
        if (iid === markers[i].options.id){
            if(lat >90 || lat > 90 || lon < -180 || lon > 180) {
//                markers[i].setMap(null);
                console.log("setMap(null)")
                // FIXME
                markers.splice(i,1);
                return;
            }

            markers[i].position = location;
            markers[i].oldPosition = location;
            if(isVisible) {
//                markers[i].setMap(map);
                console.log("setMap")
            }
            //centerInBounds(1,0);
            return;
        }
    }

    
    if (lat >90 || lat > 90 || lon < -180 || lon > 180) {
        return;
    }

    var marker = L.marker([lat, lon], {
                              draggable: true,
                              icon: defaultMarker,
                              //title:"Muj puntik!",
                              id: iid,
                              title: iid
                          });

    if (isVisible) {
        marker.addTo(map);
    }
    marker.on('click', function(e) {
        markerClicked(marker.options.id)
    });
    marker.on('movestart',function() {
        console.log('dragstart');
//        markerClicked(marker.options.id);
    });
    marker.on('moveend',function() {
        console.log('markerDragged(' + marker.options.id+ ")");
        window.mapWidget.markerDragged(marker.options.id);
    });
    markers.push(marker);

    //centerInBounds(1,0);
}
function changeRouteOpacity(id, value) {
    for (var i in routes) {
        console.log(i)
        console.log(routes[i].options.id)
        if (id === routes[i].options.id)
            routes[i].setStyle({opacity: value});
    }
    for (var i in joinedSegments) {
        if (id === joinedSegments[i].options.id) {
            joinedSegments[i].setStyle({opacity: value});
        }
    }
}
function lineWidthChanged(id, value) {
    for (var i in routes) {
        if (id === routes[i].options.id) {
            routes[i].setStyle({weight: value});
        }
    }
    for (var i in joinedSegments) {
        if (id === joinedSegments[i].options.id) {
            joinedSegments[i].setStyle({weight: value});
        }
    }
}

function changeRouteColor(id, value) {
    for (var i in routes) {
        if(id === routes[i].options.id) {
            routes[i].setStyle({color: value});
        }
    }
    for (var i in joinedSegments) {
        if(id === joinedSegments[i].options.id) {
            joinedSegments[i].setStyle({color: value});
        }
    }
}
function setJoinSegments(setVisible) {
    for (var i in joinedSegments) {
        if(setVisible) {
            joinedSegments[i].setMap(map);
        } else {
            joinedSegments[i].setMap(null);
        }
    }
    // alert(setVisible);
}

//////////

function addRoute(routeCoordinatesList, iid, isVisible, var_color, isValid) {
    path = [];
    routeCoordinatesList.forEach(function(e) {
        path.push(L.latLng(e[0], e[1]));
    });
    

    var route = L.polyline(path, {
                                color: var_color,
                                id: iid
                            })
//    var route = new google.maps.Polyline({
//                                             path: path,
//                                             strokeColor: color,
//                                             strokeOpacity: 1.0,
//                                             strokeWeight: 3,
//                                             id: iid
//                                         });
    if(isVisible) {
        route.addTo(map);
    }

    map.fitBounds(route.getBounds());
//    var bounds = new google.maps.LatLngBounds;
//    for (i in path) {
//        bounds.extend(path[i]);
//    }
//    map.fitBounds(bounds);
    //map.panToBounds(bounds);
    if (isValid) {
        routes.push(route);
    } else {
        joinedSegments.push(route);
    }
}
function centerInBounds(fitMarkers, fitRoutes){

    if ((markers.length === 0) && (routes.length === 0))
    {
        /*var myLatlng = new google.maps.LatLng(0,0);
    var zoom = 1;
    map.setCenter(myLatLng);
    map.setZoom = zoom;*/
        return;
    }

    var bounds = L.latLngBounds();
    if (fitMarkers) {
        for (i in markers) {
            bounds.extend(markers[i].getLatLng());
        }
    }

    if (fitRoutes) {
        for (i in routes) {
            routes[i].getPath().forEach(function(e) {
                bounds.extend(e);
            });
        }
    }
    map.fitBounds(bounds);
    //map.panToBounds(bounds);
}
function markerSelected(isSelected, i, markersVisible) {
    console.log("markerSelected("+isSelected+", "+i+", "+markersVisible+")")
    if (isSelected) {
        //map.setCenter(markers[i].position);
        map.panTo(markers[i].getLatLng());
        markers[i].setIcon(yellowMarker);
        markers[i].setZIndexOffset(1);
        if(!markersVisible) {
//            markers[i].setMap(map);
            console.log("setMap")
        }
    } else {
        markers[i].setIcon(defaultMarker);
        markers[i].setZIndexOffset(0);
        if(!markersVisible) {
            console.log("setMap(null)")
//            markers[i].setMap(null);
        }
    }
}
function markerClicked(id, isCtrl) {
    console.log("markerClicked("+id+", "+isCtrl+")")
    for (var i in markers) {
        if (id === markers[i].options.id){
            markers[i].setIcon(yellowMarker);
            markers[i].setZIndexOffset(1);
        } else if(!isCtrl){
            markers[i].setIcon(defaultMarker);
            markers[i].setZIndexOffset(0);
        }
    }
}
function setMarkersVisibility(setVisible) {
    for (var i in markers) {
        if(setVisible) {
            markers[i].setMap(map);
        } else {
            if( markers[i].icon === defaultMarker) {
//                markers[i].setMap(null);
            }
        }
    }
}
function setRoutesVisibility(setVisible) {
    for (var i in routes) {
        if(setVisible) {
            routes[i].setMap(map);
        } else {
            routes[i].setMap(null);
        }
    }
}

function deleteMarker(id) {
    for (var i in markers) {
        if (id === markers[i].options.id){
//            markers[i].setMap(null);
            markers.splice(i,1);
            break;
        }
    }
}

function deleteRoute(id) {
    for(var i=routes.length - 1; i>=0; i--) {
        if (id === routes[i].options.id){
//            routes[i].setMap(null);
            routes.splice(i,1);
        }
    }
    for(var i=joinedSegments.length - 1; i>=0; i--) {
        if (id === joinedSegments[i].options.id) {
//            joinedSegments[i].setMap(null);
            joinedSegments.splice(i,1);
        }
    }
}

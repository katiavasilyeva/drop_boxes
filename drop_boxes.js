mapboxgl.accessToken = 'pk.eyJ1Ijoia2F0aWF2YXNpbHlldmEiLCJhIjoiY2lqdW90bXluMGYzdXV5a2dqenhhOWx5NyJ9.Jg2Cu_UI86hFf9eS6P_evA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/katiavasilyeva/cimwxst7i013gb8m7rb4bph36',
    center: [-79.406230,43.698013 ],
    zoom: 10.25
});

var geocoder = new mapboxgl.Geocoder({
    container: 'geocoder-container'
});

map.addControl(geocoder);

map.on('style.load',function() {

    map.addSource('drop_boxes',{
        type: 'vector',
        url: 'mapbox://katiavasilyeva.9xq9mk43'
       //need it to be a geojson format
       // cluster: true,
       // clusterMaxZoom: 10,
       // clusterRadius: 500
    });

    map.addLayer({
        'id': 'dropboxes',
        'type': 'circle',
        'interactive':true,
        'source': 'drop_boxes',
        'layout': {},
        'paint': {
            'circle-color': '#8F72A2',
            'circle-opacity': 1,
            'circle-radius':5
        },
        'source-layer': 'drop_boxes5'
    });
    map.addLayer({
        'id': 'dropboxes_filter',
        'type': 'circle',
        'interactive':true,
        'source': 'drop_boxes',
        'layout': {},
        'paint': {
            'circle-color': '#E5DE83',
            'circle-opacity': 1,
            'circle-radius':10
        },
        'source-layer': 'drop_boxes5',
        'filter': ["==", "Licence_No", ""]
    });




    var popup = new mapboxgl.Popup({ //first we need to tell mapbox about our parameters for our new popup object
        closeButton: false,
        closeOnClick: false,
        container: 'pop-up-container'
    });

    map.on("mousemove", function(e) {
        map.featuresAt(e.point, {
            radius: 7,
            includeGeometry: true, //this returns geometric info of the features at the event point.
            layers: ["dropboxes"]
        }, function (err, features) {

            if (!err && features.length) { //if no error, and features.length is 'true' (meaning there's stuff in there) then do the following
                //FIRST: We will change the color of the dissemination area we're hovering over
                map.setFilter("dropboxes_filter", ["==", "Licence_No", features[0].properties.Licence_No]);
                //SECOND: We will change the mouse cursor to a 'pointer'
                map.getCanvas().style.cursor = (!err && (features[0].properties.Licence_No != null)) ? 'pointer' : '';
                //THIRD: We will add a popup at the event long,lat coordinates
                popup.setLngLat(features[0].geometry.coordinates)
                    .setHTML("<p>" + "Drop-box operator: "  + features[0].properties.Licensee +
                                        "<p><p>" +"Address: " +  features[0].properties.Full_Addre  +"<p>")
                    .addTo(map);
            }
            //If there is an error, or there are no features, then make sure the
            //hover layer has no selections and all popups are removed
            else {
                map.setFilter("dropboxes_filter", ["==", "Licence_No", ""]);
                popup.remove();
                return;
            }
        });
    });

});
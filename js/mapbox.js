mapboxgl.accessToken = config1;
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-105.0178157, 39.737925],
    zoom: 12
    });
    map.on('load', function() {
    var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        zoom: 13,
        placeholder: "Enter an address or place name",
        bbox: [-105.116, 39.679, -104.898, 39.837]
    });
    map.addControl(geocoder, 'top-left');
    var marker = new mapboxgl.Marker({'color': '#008000'})
    geocoder.on('result', function(data) {
        var point = data.result.center;
        var tileset = 'examples.dl46ljcs';
        var radius = 1609;
        var limit = 50;
        var query = 'https://api.mapbox.com/v4/' + tileset + '/tilequery/' + point[0] + ',' + point[1] + '.json?radius=' + radius + '&limit= ' + limit + ' &access_token=' + mapboxgl.accessToken;
        marker.setLngLat(point).addTo(map);
        $.ajax({
        method: 'GET',
        url: query,
        }).done(function(data) {
        map.getSource('tilequery').setData(data);
        })
    });
    map.addSource('tilequery', {
        type: "geojson",
        data: {
        "type": "FeatureCollection",
        "features": []
        }
    });
    map.addLayer({
        id: "tilequery-points",
        type: "circle",
        source: "tilequery",
        paint: {
        "circle-stroke-color": "white",
        "circle-stroke-width": {
            stops: [
            [0, 0.1],
            [18, 3]
            ],
            base: 5
        },
        "circle-radius": {
            stops: [
            [12, 5],
            [22, 180]
            ],
            base: 5
        },
        "circle-color": [
            'match',
            ['get', 'STORE_TYPE'],
            'Specialty Food Store', '#9ACD32',
            'Small Grocery Store', '#008000',
            'Supercenter', '#008000',
            'Superette', '#008000',
            'Supermarket', '#008000',
            'Warehouse Club Store', '#008000',
            '#FF0000' // any other store type
        ]
        }
    });
    var popup = new mapboxgl.Popup;
    map.on('mouseenter', 'tilequery-points', function(e) {
        map.getCanvas().style.cursor = 'pointer';
        var title = '<h3>' + e.features[0].properties.STORE_NAME + '</h3>';
        var storeType = '<h4>' + e.features[0].properties.STORE_TYPE + '</h4>';
        var storeAddress = '<p>' + e.features[0].properties.ADDRESS_LINE1 + '</p>';
        var obj = JSON.parse(e.features[0].properties.tilequery);
        var distance = '<p>' + (obj.distance / 1609.344).toFixed(2) + ' mi. from location' + '</p>';
        var lon = e.features[0].properties.longitude;
        var lat = e.features[0].properties.latitude;
        var coordinates = new mapboxgl.LngLat(lon, lat);
        var content = title + storeType + storeAddress + distance;
        popup.setLngLat(coordinates)
        .setHTML(content)
        .addTo(map);
    })
    map.on('mouseleave', 'tilequery-points', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
    })
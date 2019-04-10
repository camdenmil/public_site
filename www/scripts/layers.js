let data_dir = '/data/';

let base_layers = {
    'ESRI Gray': L.tileLayer.provider('Esri.WorldGrayCanvas'),
    'ESRI Road': L.tileLayer.provider('Esri.WorldStreetMap'),
    'ESRI Imagery': L.tileLayer.provider('Esri.WorldImagery')
};

/* asynchronously load polygons of controlled airspace from GeoJSON file */
let controlled_airspace = L.geoJson.ajax(data_dir + 'controlled_airspace.geojson', {
    'onEachFeature': popupFeatureProperties,
    'style': function (feature) {
        let local_type = feature.properties['LOCAL_TYPE'];

        switch (local_type) {
            case 'R':
                return {'color': '#EA2027'};
            case 'CLASS_B':
                return {'color': '#0652DD'};
            case 'CLASS_C':
                return {'color': '#6F1E51'};
            case 'CLASS_D':
                return {'color': '#0652DD', 'dashArray': '4'};
            default:
                return {'color': '#6F1E51', 'dashArray': '4'};
        }
    },
    'attribution': 'Airspace - FAA'
});

/* asynchronously load polygons of uncontrolled airspace from GeoJSON file */
let uncontrolled_airspace = L.geoJson.ajax(data_dir + 'uncontrolled_airspace.geojson', {
    'onEachFeature': popupFeatureProperties,
    'style': function (feature) {
        return {'color': '#6F1E51', 'dashArray': '4'};
    },
    'attribution': 'Airspace &copy; FAA'
});

/* asynchronously load launch locations from GeoJSON file */
let launch_locations = L.geoJson.ajax(data_dir + 'launch_locations.geojson', {
    'onEachFeature': popupFeatureProperties
});

/* asynchronously load McDonald's locations from GeoJSON file */
let mcdonalds_locations = L.geoJson.ajax(data_dir + 'mcdonalds.geojson', {
    'onEachFeature': popupFeatureProperties,
    'pointToLayer': function (feature, latlng) {
        return L.circleMarker(latlng, {
            'radius': 4,
            'fillColor': '#EE5A24',
            'color': '#000000',
            'weight': 1,
            'opacity': 1,
            'fillOpacity': 0.8
        });
    }
});

/* dictionary to contain toggleable layers */
let overlay_layers = {
    'reference': {
        'Controlled Airspace': controlled_airspace,
        'Uncontrolled Airspace': uncontrolled_airspace
    }
};

/* add Leaflet map to 'map' div with grouped layer control */
let map = L.map('map', {
    'layers': [base_layers['ESRI Gray']],
    'zoomSnap': 0,
    'zoomControl': false
});

map.on('layeradd', sendReferenceLayersToBack);

map.addControl(L.control.scale());

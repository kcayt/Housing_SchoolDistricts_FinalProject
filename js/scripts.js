mapboxgl.accessToken = 'pk.eyJ1Ijoia2NheXQiLCJhIjoiY2tsZWY0cGJmMWRtZjJucXRqdGJhdnJ2OSJ9.5yR0jnpb7zMjnGWCj_Jr-g';

var map = new mapboxgl.Map({
    container: 'mapcontainer', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-73.956757, 40.702158], // starting position [lng, lat]
    zoom: 9.5 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl({
    showCompass: false,
    showZoom: true
}));

map.on('style.load', function() {
    map.addSource('schooldistricts', {
        type: 'geojson',
        data: 'data/schooldistrictsrank.geojson'
    })

    map.addLayer({
        'id': 'Schools',
        'type': 'fill',
        'source': 'schooldistricts',
        'layout': {
            //     // make layer visible by default
            //     'visibility': 'visible'
            // },
            'paint': {
                'fill-color': [
                    'interpolate', ['linear'],
                    ['get', 'rank'],
                    1, "#630FD1",
                    2, "#630FD1",
                    3, "#6E1FD4",
                    4, "#6E1FD4",
                    5, "#782FD7",
                    6, "#782FD7",
                    7, "#823ED9",
                    8, "#823ED9",
                    9, "#8C4EDC",
                    10, "#8C4EDC",
                    11, "#975EDF",
                    12, "#975EDF",
                    13, "#AB7EE5",
                    14, "#AB7EE5",
                    15, "#B68DE7",
                    16, "#BB68DE7",
                    17, "#C09DEA",
                    18, "#C09DEA",
                    19, "#CAADED",
                    20, "#CAADED",
                    21, "#D5BDF0",
                    22, "#D5BDF0",
                    23, "#DFCDF3",
                    24, "#DFCDF3",
                    25, "#E9DCF5",
                    26, "#E9DCF5",
                    27, "#F4ECF8",
                    28, "#F4ECF8",
                    29, "#F9F4FA",
                    30, "#FEFCFB",
                    31, "#FEFCFB",
                    32, "#FEFCFB",
                ],
                'fill-outline-color': 'grey',
                'fill-opacity': 0.9
            }
        }
    }, );


    // add an empty data source, which we will use to highlight the lot the user is hovering over
    map.addSource('highlight-feature', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: []
            }
        })
        // set the default text for the feature-info div

    var defaultText = '<p>Move the mouse over map to see detail on a school quality and housing creation in a neighborhood</p>'
        // $('#feature-info').html(defaultText)

    // add a layer for the highlighted lot
    map.addLayer({
        id: 'highlight-line',
        type: 'line',
        source: 'highlight-feature',
        paint: {
            'line-width': 1,
            'line-opacity': 0.9,
            'line-color': '#FAAE7B',
        }
    });
    // })

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mousemove', function(e) {
        // query for the features under the mouse, but only in the lots layer
        var features = map.queryRenderedFeatures(e.point, {
            // layers: ['Schools'],
        });

        if (features.length > 0) {
            //     // show the popup
            //     // Populate the popup and set its coordinates
            //     // based on the feature found.
            //
            var hoveredFeature = features[0]

            // set this lot's polygon feature as the data for the highlight source
            map.getSource('highlight-feature').setData(hoveredFeature.geometry);

            // show the cursor as a pointer
            map.getCanvas().style.cursor = 'pointer';
        } else {
            // remove the Popup
            popup.remove();

            map.getCanvas().style.cursor = '';
        }
        var popupContent = `
        <h4><u>School District ${hoveredFeature.properties.schoolDistrict}</u><br> Rank: ${hoveredFeature.properties.rank}</h4>
      <p><strong> Percent of Homeless Students:</strong> ${hoveredFeature.properties.percenthomeless}%
          <br>  <strong>Neighborhood:</strong> ${hoveredFeature.properties.neighborhood}
            <br><strong>Mean 4th Grade Math Score:</strong> ${hoveredFeature.properties.meanmathscore}</p>
          `
        popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);

        // set this lot's polygon feature as the data for the highlight source
        map.getSource('highlight-feature').setData(hoveredFeature.geometry);
        // $('#feature-info').html(featureInfoschools)
    })

    popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);
    });

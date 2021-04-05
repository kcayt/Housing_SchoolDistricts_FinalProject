mapboxgl.accessToken = 'pk.eyJ1Ijoia2NheXQiLCJhIjoiY2tsZWY0cGJmMWRtZjJucXRqdGJhdnJ2OSJ9.5yR0jnpb7zMjnGWCj_Jr-g';

var map = new mapboxgl.Map({
    container: 'mapcontainer', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-73.956757,40.702158], // starting position [lng, lat]
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
            // make layer visible by default
            'visibility': 'visible'
        },
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'rank'],
                1, "#630FD1",
                2, "#6817D2",
                3, "#6E1FD4",
                4, "#7328D5",
                5, "#7830D7",
                6, "#7E38D8",
                7, "#8340DA",
                8, "#8848DB",
                9, "#8E50DD",
                10, "#9359DE",
                11, "#9861DF",
                12, "#9E69E1",
                13, "#A371E2",
                14, "#A879E4",
                15, "#AE81E5",
                16, "#B38AE7",
                17, "#B992E8",
                18, "#BE9AEA",
                19, "#C3A2EB",
                20, "#C9AAED",
                21, "#CEB2EE",
                22, "#D3BBEF",
                23, "#D9C3F1",
                24, "#DECBF2",
                25, "#E3D3F4",
                26, "#E9DBF5",
                27, "#EEE3F7",
                28, "#F3ECF8",
                29, "#F9F4FA",
                30, "#FEFCFB",
                31, "#FEFCFB",
                32, "#FEFCFB",
            ],
            'fill-outline-color': 'grey',
            'fill-opacity': 0.9
        }
    }, );
    map.addSource('hnynta', {
        type: 'geojson',
        data: 'data/hnynta.geojson'
    })
    //globals for the choropleth
    var  COLORS = ['#8c510a', '#d8b365', '#f6e8c3', '#c7eae5', '#5ab4ac', '#01665e'],
        BREAKS = [ 0, 3, 8, 30, 111, 172, 332, 513, 790, 1473, 9876],
        FILTERUSE
        ;


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
    $('#feature-info').html(defaultText)

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
            layers: ['Schools', 'highlight-line'],
        });

        if (features.length > 0) {
        //     // show the popup
        //     // Populate the popup and set its coordinates
        //     // based on the feature found.
        //
            var hoveredFeature = features[0]
            var district = hoveredFeature.properties.schoolDistrict
            var rank = hoveredFeature.properties.rank
            var neighborhood = hoveredFeature.properties.neighborhood

            var popupContent = `

              <h4><u>School District ${hoveredFeature.properties.schoolDistrict}</u><br> Rank: ${hoveredFeature.properties.rank}/32</h4>
            <p><strong> Percent of Students Homeless:</strong> ${hoveredFeature.properties.percenthomeless}%
                <br>  <strong>Neighborhood:</strong> ${hoveredFeature.properties.neighborhood}
                  <br><strong>Mean 4th Grade Math Score:</strong> ${hoveredFeature.properties.meanmathscore}</p>
                `

            // set this lot's polygon feature as the data for the highlight source
            map.getSource('highlight-feature').setData(hoveredFeature.geometry);
            popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);

            // show the cursor as a pointer
            map.getCanvas().style.cursor = 'pointer';
        }
        else {
            // remove the Popup
            popup.remove();

            map.getCanvas().style.cursor = '';
        }

    })



    })
    // enumerate ids of the layers

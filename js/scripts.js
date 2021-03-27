mapboxgl.accessToken = 'pk.eyJ1Ijoia2NheXQiLCJhIjoiY2tsZWY0cGJmMWRtZjJucXRqdGJhdnJ2OSJ9.5yR0jnpb7zMjnGWCj_Jr-g';

var map = new mapboxgl.Map({
    container: 'mapcontainer', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-73.980789,40.747777], // starting position [lng, lat]
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
    //        map.addSource('hnynta', {
    //           type: 'geojson',
    //           data: 'data/hnynta.geojson'
    // })
    // });
    // console.log(map.getStyle().sources)
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
    map.addLayer({
        'id': 'Housing',
        'type': 'fill',
        'source': 'hnynta',
        'layout': {
            // make layer visible by default
            'visibility': 'visible'
        },
        "paint": {
            'fill-color': {
                property:'units',
                stops: [
                    [BREAKS[0], "#ffffff"],
                    [BREAKS[1], "#FEFCFB"],
                    [BREAKS[2], "#EFE4F7"],
                    [BREAKS[3], "#DFCDF3"],
                    [BREAKS[4], "#D0B5EE"],
                    [BREAKS[5], "#C09DEA"],
                    [BREAKS[6], "#B186E6"],
                    [BREAKS[7], "#A16EE2"],
                    [BREAKS[8], "#9256DE"],
                    [BREAKS[9], "#823ED9"],
                    [BREAKS[10],"#630FD1"]
                    // [BREAKS[11],"#630FD1"]
                ]
            },

            "fill-opacity": 0.85,
            "fill-outline-color": "#ffffff"
        }
    });

    // add an empty data source, which we will use to highlight the lot the user is hovering over
    map.addSource('highlight-feature', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: []
        }
    })
    // set the default text for the feature-info div

    var defaultText = '<p>Move the mouse over the map to get more info on a school district or neighborhood</p>'
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
            layers: ['Schools'],
        });

        if (features.length > 0) {
        //     // show the popup
        //     // Populate the popup and set its coordinates
        //     // based on the feature found.
        //
            var hoveredFeature = features[0]
        //     var district = hoveredFeature.properties.schoolDistrict
        //     var rank = hoveredFeature.properties.rank
        //     var neighborhood = hoveredFeature.properties.neighborhood
        //
        //     var popupContent = `
        //       <div class="inner">
        //       <h4>School District ${district}</h4>
        //       <h5>${neighborhood}</h5>
        //     <i>  Rank: ${rank}/32
        //       </div>
        //     `
        //
        //     popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);

            // set this lot's polygon feature as the data for the highlight source
            map.getSource('highlight-feature').setData(hoveredFeature.geometry);

            // show the cursor as a pointer
            map.getCanvas().style.cursor = 'pointer';
        }
        else {
            // remove the Popup
            popup.remove();

            map.getCanvas().style.cursor = '';
        }

    })
    map.on('mousemove', function(e) {
        // query for the features under the mouse, but only in the lots layer
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['Housing'],
        });

        if (features.length > 0) {
            // show the popup
            // Populate the popup and set its coordinates
            // based on the feature found.

            var hoveredFeature = features[0]
            var units = hoveredFeature.properties.units
            var neighborhood = hoveredFeature.properties.NTAName
            // var district = hoveredFeature.properties.schoolDistrict
            // var neighborhood = hoveredFeature.properties.neighborhood

            var popupContent = `
              <div class="inner">
              <h4> ${units} units created</h4>
              <h5>${neighborhood}</h5>
              </div>
            `

            popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);

            // set this lot's polygon feature as the data for the highlight source
            map.getSource('highlight-feature').setData(hoveredFeature.geometry);

            // show the cursor as a pointer
            map.getCanvas().style.cursor = 'pointer';
        } else {
            // remove the Popup
            popup.remove();

            map.getCanvas().style.cursor = '';
        }

    })
    // enumerate ids of the layers
    var toggleableLayerIds = ['Schools', 'Housing'];

    // set up the corresponding toggle button for each layer
    for (var i = 0; i < toggleableLayerIds.length; i++) {
        var id = toggleableLayerIds[i];
        var buttontext = ['School Districts', 'Housing Units']
        var link = document.createElement('a');
        link.href = '#';
        link.className = 'active';
        link.textContent = id;

        link.onclick = function(e) {
            var clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();

            var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

            // toggle layer visibility by changing the layout object's visibility property
            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = 'active';
                map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
            }
        };

        var layers = document.getElementById('menu');
        layers.appendChild(link);
    }
    map.on('mousemove', function (e) {
    // query for the features under the mouse, but only in the lots layer
    var features = map.queryRenderedFeatures(e.point, {
        layers: ['Schools'],
    });
    if (features.length > 0) {
      map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

      var hoveredFeature = features[0]
    var featureInfo = `
    <h4><u>School District ${hoveredFeature.properties.schoolDistrict}</u><br> Rank: ${hoveredFeature.properties.rank}</h4>
  <p><strong> Percent of Homeless Students:</strong> ${hoveredFeature.properties.percenthomeless}%
      <br>  <strong>Neighborhood:</strong> ${hoveredFeature.properties.neighborhood}
        <br><strong>Mean 4th Grade Math Score:</strong> ${hoveredFeature.properties.meanmathscore}</p>
      `
      $('#feature-info').html(featureInfo)
    } else {
      // if there is no feature under the mouse, reset things:
      map.getCanvas().style.cursor = 'default'; // make the cursor default

      // reset the highlight source to an empty featurecollection


    map.on('mousemove', function (e) {
      // query for the features under the mouse, but only in the lots layer
      var features = map.queryRenderedFeatures(e.point, {
          layers: [ 'Housing'],
      });
      if (features.length > 0) {
        map.getCanvas().style.cursor = 'pointer';  // make the cursor a pointer

        var hoveredFeature = features[0]
      var featureInfo = `
      <p><strong>Number of 2 BR+ units created under DeBlasio:</strong></strongg> ${hoveredFeature.properties.units}</h4>
          <p><strong>Neighborhood Tabulation Area:</strong> ${hoveredFeature.properties.NTAName}</p>
        `
        $('#feature-info').html(featureInfo)
      } else {
        // if there is no feature under the mouse, reset things:
        map.getCanvas().style.cursor = 'pointer'; // make the cursor default
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mousemove', function(e) {
            // query for the features under the mouse, but only in the lots layer
            var features = map.queryRenderedFeatures(e.point, {
                layers: ['Schools'],
            });

            if (features.length > 0) {
                // show the popup
                // Populate the popup and set its coordinates
                // based on the feature found.

                var hoveredFeature = features[0]
                var district = hoveredFeature.properties.schoolDistrict
                var rank = hoveredFeature.properties.rank
                var neighborhood = hoveredFeature.properties.neighborhood

                var popupContent = `
                  <div class="inner">
                  <h4>School District ${district}</h4>
                  <h5>${neighborhood}</h5>
                <i>  Rank: ${rank}/32
                  </div>
                `

                popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);


};

} )
};
});

  };
  ;
});
});

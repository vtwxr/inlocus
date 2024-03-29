function initMap() {

    let heatmap, map;

    $.ajax({
        method: 'GET',
        url: '/admin/analytics/api/heatmap/beacon',
        success: (res) => {
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 6,
                center: {
                    lat: parseFloat(res.center.latitude),
                    lng: parseFloat(res.center.longitude)
                },
                mapTypeId: 'satellite'
            });

            heatmap = new google.maps.visualization.HeatmapLayer({
                data: getPoints(),
                map: map
            });

            function toggleHeatmap() {
                heatmap.setMap(heatmap.getMap() ? null : map);
            }

            function changeGradient() {
                var gradient = [
                    'rgba(0, 255, 255, 0)',
                    'rgba(0, 255, 255, 1)',
                    'rgba(0, 191, 255, 1)',
                    'rgba(0, 127, 255, 1)',
                    'rgba(0, 63, 255, 1)',
                    'rgba(0, 0, 255, 1)',
                    'rgba(0, 0, 223, 1)',
                    'rgba(0, 0, 191, 1)',
                    'rgba(0, 0, 159, 1)',
                    'rgba(0, 0, 127, 1)',
                    'rgba(63, 0, 91, 1)',
                    'rgba(127, 0, 63, 1)',
                    'rgba(191, 0, 31, 1)',
                    'rgba(255, 0, 0, 1)'
                ]
                heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
            }

            function changeRadius() {
                heatmap.set('radius', heatmap.get('radius') ? null : 20);
            }

            function changeOpacity() {
                heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
            }

            function getPoints() {
                let temp = [];
                res.data.map(data => {
                    temp.push(new google.maps.LatLng(data.latitude, data.longitude));
                });
                return temp;
            }
        }
    });

    initbMap();
}


function initbMap() {

    let heatmap, map;

    $.ajax({
        method: 'GET',
        url: '/admin/analytics/api/heatmap/beacon',
        success: (res) => {
            map = new google.maps.Map(document.getElementById('bmap'), {
                zoom: 13,
                center: {
                    lat: parseFloat(res.center.latitude),
                    lng: parseFloat(res.center.longitude)
                },
                mapTypeId: 'coordinate'
            });

            heatmap = new google.maps.visualization.HeatmapLayer({
                data: getPoints(),
                map: map
            });

            function toggleHeatmap() {
                heatmap.setMap(heatmap.getMap() ? null : map);
            }

            function changeGradient() {
                var gradient = [
                    'rgba(0, 255, 255, 0)',
                    'rgba(0, 255, 255, 1)',
                    'rgba(0, 191, 255, 1)',
                    'rgba(0, 127, 255, 1)',
                    'rgba(0, 63, 255, 1)',
                    'rgba(0, 0, 255, 1)',
                    'rgba(0, 0, 223, 1)',
                    'rgba(0, 0, 191, 1)',
                    'rgba(0, 0, 159, 1)',
                    'rgba(0, 0, 127, 1)',
                    'rgba(63, 0, 91, 1)',
                    'rgba(127, 0, 63, 1)',
                    'rgba(191, 0, 31, 1)',
                    'rgba(255, 0, 0, 1)'
                ]
                heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
            }

            function changeRadius() {
                heatmap.set('radius', heatmap.get('radius') ? null : 20);
            }

            function changeOpacity() {
                heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
            }

            function getPoints() {
                let temp = [];
                res.data.map(data => {
                    temp.push(new google.maps.LatLng(data.latitude, data.longitude));
                });
                return temp;
            }
        }
    });
}
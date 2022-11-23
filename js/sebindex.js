var map = new kakao.maps.Map(document.getElementById('map'), { // 지도를 표시할 div
    center: new kakao.maps.LatLng(36.2683, 127.6358), // 지도의 중심좌표
    level: 14 // 지도의 확대 레벨
});


// 마커 클러스터러를 생성합니다
// 마커 클러스터러를 생성할 때 disableClickZoom 값을 true로 지정하지 않은 경우
// 클러스터 마커를 클릭했을 때 클러스터 객체가 포함하는 마커들이 모두 잘 보이도록 지도의 레벨과 영역을 변경합니다
// 이 예제에서는 disableClickZoom 값을 true로 설정하여 기본 클릭 동작을 막고
// 클러스터 마커를 클릭했을 때 클릭된 클러스터 마커의 위치를 기준으로 지도를 1레벨씩 확대합니다
var clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
    minLevel: 10, // 클러스터 할 최소 지도 레벨
    disableClickZoom: true // 클러스터 마커를 클릭했을 때 지도가 확대되지 않도록 설정한다
});

// 데이터를 가져오기 위해 jQuery를 사용합니다
// 데이터를 가져와 마커를 생성하고 클러스터러 객체에 넘겨줍니다


$.get("data/cat.json", function(data) {
    // 데이터에서 좌표 값을 가지고 마커를 표시합니다
    // 마커 클러스터러로 관리할 마커 객체는 생성할 때 지도 객체를 설정하지 않습니다
    var markers = $(data.positions).map(function(i, position) {
        var maks = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(position.wgs84Lat, position.wgs84Lon)
        });

        var infowindow = new kakao.maps.InfoWindow({
            content: '<div class="info-title">' + position.dutyName + '</br>' + position.dutyAddr + '</br> 영업시간 </br> 평일:' + position.dutyTime1s + '~' + position.dutyTime1c + '</br> 주말:' + position.dutyTime6s + '~' + position.dutyTime6c + '</div>',
            removable: true
        });


        kakao.maps.event.addListener(maks, 'click', makeOverListener(map, maks, infowindow));

        return maks;

    });

    // 클러스터러에 마커들을 추가합니다
    clusterer.addMarkers(markers);

});

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
function makeOverListener(map, marker, infowindow) {
    return function() {
        infowindow.open(map, marker);
    };
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다 
function makeOutListener(infowindow) {
    return function() {
        infowindow.close();
    };
}



// 마커 클러스터러에 클릭이벤트를 등록합니다
// 마커 클러스터러를 생성할 때 disableClickZoom을 true로 설정하지 않은 경우
// 이벤트 헨들러로 cluster 객체가 넘어오지 않을 수도 있습니다
kakao.maps.event.addListener(clusterer, 'clusterclick', function(cluster) {

    // 현재 지도 레벨에서 1레벨 확대한 레벨
    var level = map.getLevel() - 1;

    // 지도를 클릭된 클러스터의 마커의 위치를 기준으로 확대합니다
    map.setLevel(level, { anchor: cluster.getCenter() });
});




var infoTitle = document.querySelectorAll('.info-title');
infoTitle.forEach(function(e) {
    var w = e.offsetWidth + 10;
    var ml = w / 2;
    e.parentElement.style.top = "82px";
    e.parentElement.style.left = "50%";
    e.parentElement.style.marginLeft = -ml + "px";
    e.parentElement.style.width = w + "px";
    e.parentElement.previousSibling.style.display = "none";
    e.parentElement.parentElement.style.border = "0px";
    e.parentElement.parentElement.style.background = "unset";
});
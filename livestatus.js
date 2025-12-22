/* ---------- CONFIG ---------- */
const CONFIG = {
    ARRIVE_DIST: 0.15,      // km
    MAX_DIST:    3,         // km
    UPDATE_MS:   8000000,      // 8 s
    MIN_HRS:     0.0003,
    GEOJSON_STATIONS: 'data/Stations.geojson',
    GEOJSON_METRO:    'data/metro_track.geojson',
    METRO_GLOW_DIST:   0.5,
    METRO_LINE_WIDTH: 4,
    METRO_COLORS: { 
        red: '#ff0000', 
        blue: '#0000ff',
        default: '#888888'   // <-- NEW: gray for unknown / default
    }
};

/* ---------- GLOBALS ---------- */
let stationDataCacheLive = null, metroCache = null;
let departedCircle, arrivedCircle, nearestCircle, nextCircle, trainMarker;
let lastNearest = null, lastArrived = null;
let lastLatLng = null, lastTimestamp = null, updateCount = 0;
let intervalIdLive, metroLayer, interchangeMarkers = L.layerGroup();
let speedBuffer = [];

/* ---------- MAP INIT ---------- */


/* ---------- CLICK TO FAKE LOCATION (TESTING) ---------- */
map.on('click', e => {
    if (!document.getElementById('insideTrain').checked) return;
    onLocationFound({latlng: e.latlng});
});

/* ---------- LOAD STATIONS ---------- */
fetch(CONFIG.GEOJSON_STATIONS)
    .then(r => r.ok ? r.json() : Promise.reject('Stations missing'))
    .then(d => { stationDataCacheLive = d; document.getElementById('nearestStation').textContent = 'Ready – check “Inside Train”.'; })
    .catch(e => { console.error(e); document.getElementById('nearestStation').style.color='red'; document.getElementById('nearestStation').textContent='No station data.'; });

/* ---------- LOAD METRO TRACKS (LineString + Color) ---------- */
fetch(CONFIG.GEOJSON_METRO)
    .then(r => r.ok ? r.json() : Promise.reject('Metro tracks missing'))
    .then(data => {
        metroCache = data;
        metroLayer = L.geoJSON(data, {
style: f => {
        const col = (f.properties.Color || '').toLowerCase().trim();
        const color = CONFIG.METRO_COLORS[col] || CONFIG.METRO_COLORS.default;
        return {
            color: color,
            weight: CONFIG.METRO_LINE_WIDTH,
            opacity: 0.8
        };
    },
            onEachFeature: (f, layer) => {
                if (f.geometry.type === 'Point' && f.properties.type === 'interchange') {
                    const m = L.marker([f.geometry.coordinates[1], f.geometry.coordinates[0]], {
                        icon: L.divIcon({className:'interchange-icon',html:'Swap',iconSize:[20,20]})
                    }).bindPopup(`<strong>Interchange: ${f.properties.name || 'Unnamed'}</strong>`);
                    interchangeMarkers.addLayer(m);
                }
            }
        });//.addTo(map);
       // interchangeMarkers.addTo(map);
    })
    .catch(e => console.error('Metro load failed:', e));

/* ---------- MARKER HELPERS ---------- */
function removeIfExists(l) { if(l) map.removeLayer(l); }
function resetWidget(id) { const el=document.getElementById(id); if(el){ el.className='station-item'; el.innerHTML=''; } }

/* ---------- HIGHLIGHT STATIONS ---------- */
function highlightDeparted(f){ const [lng,lat]=f.geometry.coordinates; removeIfExists(departedCircle); departedCircle = L.circleMarker([lat,lng],{radius:15,color:'#ffd700',fillColor:'#ffd700',fillOpacity:0.6,weight:3,className:'glowing-marker glow-yellow'}).addTo(map); }
function highlightArrived(f){ const [lng,lat]=f.geometry.coordinates; removeIfExists(arrivedCircle); arrivedCircle = L.circleMarker([lat,lng],{radius:18,color:'#ff4444',fillColor:'#ff4444',fillOpacity:0.7,weight:4,className:'glowing-marker glow-red'}).addTo(map); }
function highlightNearest(f,dist){ const [lng,lat]=f.geometry.coordinates; removeIfExists(nearestCircle); nearestCircle = L.circleMarker([lat,lng],{radius:15,color:'#44ff44',fillColor:'#44ff44',fillOpacity:0.6,weight:3,className:'glowing-marker glow-green'}).addTo(map); nearestCircle.bindPopup(`<strong>Nearest</strong><br>${f.properties.station_name}<br>${dist.toFixed(2)} km`); }
function highlightNext(f){ const [lng,lat]=f.geometry.coordinates; removeIfExists(nextCircle); nextCircle = L.circleMarker([lat,lng],{radius:12,color:'#00ced1',fillColor:'#00ced1',fillOpacity:0.5,weight:2,dashArray:'5,10',className:'glowing-marker glow-cyan'}).addTo(map); nextCircle.bindPopup(`<strong>Next</strong><br>${f.properties.station_name}`); }

/* ---------- WIDGET UPDATE ---------- */
function updateWidget(f, type, speedStr){
    const p = f.properties;
    const cfg = {
        departed:{id:'departedWidget',title:'Departed',cls:'glow-yellow',bg:'#ffd700'},
        arrived :{id:'arrivedWidget' ,title:'Arrived' ,cls:'glow-red'   ,bg:'#ff4444'},
        nearest :{id:'nearestWidget' ,title:'Leaving…',cls:'glow-green' ,bg:'#44ff44'},
        next    :{id:'nextWidget'    ,title:'Approaching',cls:'glow-cyan',bg:'#00ced1'}
    }[type];
    if(!cfg) return;
    const el=document.getElementById(cfg.id); if(!el) return;
    el.className='station-item'; if(cfg.cls) el.classList.add(cfg.cls);
    //el.style.backgroundColor = cfg.bg;
    el.innerHTML = `<strong>${cfg.title}</strong><br>${p.station_name}<br>${speedStr}`;
}

/* ---------- SPEED (smoothed) ---------- */
function calcSpeed(e){
    const now = Date.now(), latlng = e.latlng;
    if (!lastLatLng || !lastTimestamp) { lastLatLng = latlng; lastTimestamp = now; return 0; }
    const dist = turf.distance(turf.point([lastLatLng.lng,lastLatLng.lat]), turf.point([latlng.lng,latlng.lat]), {units:'kilometers'});
    const hrs = Math.max((now - lastTimestamp)/(1000*60*60), CONFIG.MIN_HRS);
    lastLatLng = latlng; lastTimestamp = now;
    const instant = hrs>0 ? dist/hrs : 0;
    speedBuffer.push(instant); if(speedBuffer.length>5) speedBuffer.shift();
    return speedBuffer.reduce((a,b)=>a+b,0)/speedBuffer.length;
}

/* ---------- NEXT STATION PREDICTION ---------- */
function predictNext(current, userPt, speedStr){
    if (!lastLatLng) return;
    const trainBearing = turf.bearing(
        turf.point([lastLatLng.lng, lastLatLng.lat]),
        turf.point([userPt.geometry.coordinates[1], userPt.geometry.coordinates[0]])
    );
    const candidates = stationDataCacheLive.features
        .filter(f => f.properties.STN_ID !== current.properties.STN_ID)
        .map(f => {
            const pt = turf.point(f.geometry.coordinates);
            const dist = turf.distance(userPt, pt, {units:'kilometers'});
            const bearingTo = turf.bearing(userPt, pt);
            const diff = Math.abs((bearingTo - trainBearing + 540) % 360 - 180);
            return {f, dist, diff};
        })
        .filter(c => c.dist < 12 && c.diff < 90)
        .sort((a,b)=>a.dist-b.dist);
    const next = candidates[0];
    const el = document.getElementById('nextWidget');
    if(next){
        updateWidget(next.f,'next',speedStr);
        highlightNext(next.f);
    }else{
        el.className='station-item'; el.innerHTML='<em>Calculating direction…</em>';
        removeIfExists(nextCircle);
    }
}

/* ---------- METRO GLOW (LineString + Color) ---------- */
function highlightNearbyMetro(userPt){
    if(!metroCache || !metroLayer) return;

    metroCache.features.forEach(f => {
        if (f.geometry.type !== 'LineString') return;

        const line = turf.lineString(f.geometry.coordinates.map(c => [c[0], c[1]]));
        const dist = turf.pointToLineDistance(userPt, line, {units:'kilometers'});
        const isNear = dist <= CONFIG.METRO_GLOW_DIST;

        const layer = metroLayer.getLayers().find(l => l.feature === f);
        if (!layer) return;

        const col = (f.properties.Color || '').toLowerCase().trim();
        const glowClass = isNear && (col === 'red' || col === 'blue')
            ? (col === 'red' ? 'metro-glow-red' : 'metro-glow-blue')
            : '';

        layer.setStyle({
            weight: isNear ? CONFIG.METRO_LINE_WIDTH + 4 : CONFIG.METRO_LINE_WIDTH,
            opacity: isNear ? 1 : 0.8,
            className: glowClass
        });

        const path = layer._path;
        if (path) {
            path.style.animation = isNear && (col === 'red' || col === 'blue')
                ? (col === 'red' ? 'pulse-red 2s infinite ease-out' : 'pulse-blue 2s infinite ease-out')
                : '';
        }
    });
}

/* ---------- TRAIN MARKER ---------- */
function updateTrainMarker(latlng){
    removeIfExists(trainMarker);
    trainMarker = L.marker(latlng,{icon:L.divIcon({className:'train-icon',html:'Train',iconSize:[30,30]})}).addTo(map);
}



/* ---------- LOCATION HANDLER ---------- */
function onLocationFound(e){
    if(!stationDataCacheLive || !document.getElementById('insideTrain').checked){
        document.getElementById('loadingSpinner').style.display='none';
        return;
    }
    updateCount++;
    const userPt = turf.point([e.latlng.lng, e.latlng.lat]);
    const nearest = turf.nearestPoint(userPt, stationDataCacheLive);
    const distKm = turf.distance(userPt, turf.point(nearest.geometry.coordinates), {units:'kilometers'});

    const speed = updateCount>1 ? calcSpeed(e) : 0;
    const speedStr = speed.toFixed(0)+' km/h';

    if(distKm <= CONFIG.ARRIVE_DIST){
        if(!lastArrived || lastArrived.properties.STN_ID !== nearest.properties.STN_ID){
            if(lastNearest && lastNearest.properties.STN_ID !== nearest.properties.STN_ID){
                highlightDeparted(lastNearest);
                updateWidget(lastNearest,'departed',speedStr);
            }
            highlightArrived(nearest);
            updateWidget(nearest,'arrived',speedStr);
            lastArrived = nearest;
        }
        document.getElementById('nearestStation').style.color='#ff4444';
        document.getElementById('nearestStation').textContent=`${nearest.properties.station_name} (Arrived)`;
    }
    else if(distKm <= CONFIG.MAX_DIST){
        if(lastNearest && lastNearest.properties.STN_ID !== nearest.properties.STN_ID){
            highlightDeparted(lastNearest);
            updateWidget(lastNearest,'departed',speedStr);
            if(lastArrived){ resetWidget('arrivedWidget'); removeIfExists(arrivedCircle); lastArrived=null; }
        }
        highlightNearest(nearest,distKm);
        updateWidget(nearest,'nearest',speedStr);
        lastNearest = nearest;
        if(updateCount>1) predictNext(nearest,userPt,speedStr);
    }
    else{
        document.getElementById('nearestStation').textContent=`No station nearby (> ${CONFIG.MAX_DIST} km). Speed: ${speedStr}`;
        resetWidget('nearestWidget'); resetWidget('nextWidget');
        removeIfExists(nearestCircle); removeIfExists(nextCircle);
    }

    updateTrainMarker(e.latlng);
  //  maybeAddRaster(e.latlng);
    highlightNearbyMetro(userPt);
    document.getElementById('loadingSpinner').style.display='none';
}

/* ---------- ERROR ---------- */
function onLocationError(e){
    document.getElementById('loadingSpinner').style.display='none';
    document.getElementById('nearestStation').style.color='red';
    document.getElementById('nearestStation').textContent='Location error:';
}

/* ---------- UI TOGGLES ---------- */
document.getElementById('insideTrain').addEventListener('change',function(){
    const on = this.checked, widget = document.getElementById('station-widget');
    if(on){
        document.getElementById('nearestStation').textContent='Searching…';
        widget.style.display='block';
        updateCount=0; lastLatLng=null; lastTimestamp=null; lastNearest=null; lastArrived=null; speedBuffer=[];
        [departedCircle,arrivedCircle,nearestCircle,nextCircle,trainMarker].forEach(removeIfExists);
        ['departedWidget','arrivedWidget','nearestWidget','nextWidget'].forEach(resetWidget);
        updateLocation();
        intervalIdLive = setInterval(updateLocation, CONFIG.UPDATE_MS);
    }else{
        document.getElementById('nearestStation').textContent='';
        widget.style.display='none';
        clearInterval(intervalIdLive);
        [departedCircle,arrivedCircle,nearestCircle,nextCircle,trainMarker].forEach(removeIfExists);
        ['departedWidget','arrivedWidget','nearestWidget','nextWidget'].forEach(resetWidget);
        lastNearest=null; lastArrived=null; lastLatLng=null; lastTimestamp=null; updateCount=0; speedBuffer=[];
        // if(metroLayer) metroLayer.eachLayer(l=>l.setStyle({weight:CONFIG.METRO_LINE_WIDTH, opacity:0.8, className:''}));
        if(metroLayer){
// In the style function:
return {
    color: color,
    weight: color === CONFIG.METRO_COLORS.default ? 3 : CONFIG.METRO_LINE_WIDTH,
    opacity: 0.7
};
}
    }
});

// document.getElementById('showMetro').addEventListener('change', e=>{
//     if(e.target.checked){
//         if(metroLayer) metroLayer.addTo(map);
//         interchangeMarkers.addTo(map);
//     }else{
//         if(metroLayer) map.removeLayer(metroLayer);
//         map.removeLayer(interchangeMarkers);
//     }
// });

/* ---------- VISIBILITY ---------- */
document.addEventListener('visibilitychange',()=>{ 
    if(document.hidden) clearInterval(intervalIdLive);
    else if(document.getElementById('insideTrain').checked){
        lastLatLng=null; lastTimestamp=null; updateLocation();
        intervalIdLive = setInterval(updateLocation, CONFIG.UPDATE_MS);
    }
});

/* ---------- MAP EVENTS ---------- */
map.on('locationfound',onLocationFound);
map.on('locationerror',onLocationError);

/* ---------- LOCATION CALL ---------- */
function updateLocation(){
    if(document.getElementById('insideTrain').checked){
        document.getElementById('loadingSpinner').style.display='block';
        map.locate({setView:false,maxZoom:16,enableHighAccuracy:true});
    }
}
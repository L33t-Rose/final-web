const clientID = "HOVQQCVPWFHSCCVIRAH44DVR3B22AGB1SWWL1F2RQPOGUBCL";
const clientSecret = "Q40T4OCACKCGFWBNABGSC5VSE4CLQWFLJFLRJFZAGRFMXQDW";

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            console.log("Running getLocation")
            search(lat, lon);
        });
    }
}

function search(lat, lng) {
    console.log("Runnnig");
    var query = document.getElementById("query").value;
    var radius = document.getElementById("radius").value;
    var limit = document.getElementById("limit").value;
    console.log(lat)
    console.log(lng)
    setTimeout(function() {}, 2000);
    var request = new XMLHttpRequest();
    var venData = new Array();
    let post = document.getElementById("results").getElementsByClassName("container")[0];
    var begin = "https://api.foursquare.com/v2/venues/search?ll=" + lat + "," + lng;
    if (query.length !== 0) {
        begin += "&query=" + query;
    }
    if (radius.length !== 0) {
        begin += "&radius=" + radius;
    }
    if (limit.length !== 0) {
        begin += "&limit=" + limit;
    }
    var url = begin + "&client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20190401";
    console.log(url);
    request.open("GET", url);
    request.onload = function() {
        let data = JSON.parse(this.response);
        if (request.status >= 200 && request.status <= 400) {
            var vens = data["response"].venues;
            console.log(vens);
            var row = document.createElement("div");
            row.classList.add("row");
            post.appendChild(row);
            for (let i = 0; i < vens.length; i++) {
                var ven = vens[i];
                var add = getAdditionalInfo(ven.id)
                var info = {
                    id: ven.id,
                    name: ven.name,
                    address: ven["location"].address,
                    lat: ven["location"].lat,
                    lng: ven["location"].lng,
                    phone: add[0],
                    twitter: add[1],
                    instagram: add[2],
                    facebook: add[3],
                    rating: add[4],
                    desc: add[5],
                    tipCount: add[6],
                    review: add[7],
                    creator: add[8]
                };
                console.log(info);
                venData[i] = info;
                var div = document.createElement("div");
                div.classList.add("col-lg-4", "col-md-12", "col-sm-12");
                var nameElem = document.createElement("h4");
                nameElem.innerHTML = info.name;
                var mapDiv = document.createElement("p");
                mapDiv.innerHTML = "<i class=\"" + "fas " + "fa-map " + "fa-2x" + "\"></i> : " + info.address;
                var phoneDiv = document.createElement("p");
                phoneDiv.innerHTML = "<i class=\"" + "fas " + "fa-phone " + "fa-2x" + "\"></i> :" + info.phone;
                var socialDiv = document.createElement("div");
                socialDiv.classList.add("row");
                var f = document.createElement("a")
                f.classList.add("col-lg-3", "col-md-3", "col-sm-3");
                f.innerHTML = "<i class=\"" + "fab " + "fa-facebook " + "fa-2x" + "\"></i>"
                f.href = "https://facebook.com/" + info.facebook;
                var t = document.createElement("a")
                t.classList.add("col-lg-3", "col-md-3", "col-sm-3");
                t.innerHTML = "<i class=\"" + "fab " + "fa-twitter " + "fa-2x" + "\"></i>"
                t.href = "https://twitterk.com/" + info.twitter;
                var insta = document.createElement("a");
                insta.classList.add("col-lg-3", "col-md-3", "col-sm-3");
                insta.innerHTML = "<i class=\"" + "fab " + "fa-instagram " + "fa-2x" + "\"></i>"
                insta.href = "https://instagram.com/" + info.instagram + "/";
                var button = document.createElement("button");
                button.classList.add("btn", "btn-success");
                button.setAttribute("onclick", "showMore(" + i + ")");
                button.innerHTML = "See More";
                socialDiv.appendChild(f);
                socialDiv.appendChild(t);
                socialDiv.appendChild(insta);
                var rating = document.createElement("p")
                rating.classList.add("hidden")
                rating.innerHTML = "Rating: " + info.rating;
                var description = document.createElement("p");
                description.classList.add("hidden");
                description.innerHTML = "Description:\n" + info.desc;
                var review = document.createElement("small");
                review.classList.add("hidden");
                review.innerHTML = "\"" + info.review + "\" -" + info.creator;
                div.appendChild(nameElem);
                div.appendChild(description)
                div.appendChild(mapDiv);
                div.appendChild(phoneDiv);
                div.appendChild(rating);
                div.appendChild(review);
                div.appendChild(socialDiv);
                var lat=info.lat;
                var lng=info.lng
                drawMap(div,i,lat,lng);
                div.appendChild(button);
                row.appendChild(div);
                if (i > 1 && i % 3 == 2) {
                    let newRow = row.cloneNode();
                    row = null;
                    row = newRow;
                }

                post.appendChild(row);
            }

        }
    }
    request.send();
}
function drawMap(div,i, lat, lng) {
    console.log("Lat is: "+lat);
    console.log("lng is: "+lng);
    var map = document.createElement("div")
    map.id = "map" + i;
    map.classList.add("map","hidden");
    div.appendChild(map);
    map.setAttribute("onload", init(i, lat, lng));
}

function getAdditionalInfo(id) {
    var info = new Array();
    var req = new XMLHttpRequest();
    var url = "https://api.foursquare.com/v2/venues/"+id+"?&client_id=HOVQQCVPWFHSCCVIRAH44DVR3B22AGB1SWWL1F2RQPOGUBCL&client_secret=Q40T4OCACKCGFWBNABGSC5VSE4CLQWFLJFLRJFZAGRFMXQDW&v=20190501";
    req.open("GET", url,true);
    req.onload = function() {
        var data = JSON.parse(this.response);
        var phoneNum = data["response"]["venue"]["contact"].formattedPhone;
        var twitter = data["response"]["venue"]["contact"].twitter;
        var instagram = data["response"]["venue"]["contact"].instagram;
        var facebook = data["response"]["venue"]["contact"].facebookUsername;
        var rating = data["response"]["venue"].rating;
        var description = data["response"]["venue"].descritpion;
        var tipCount = data["response"]["venue"]["tips"].count;
        var review = data["response"]["venue"]["tips"]["groups"][0]["items"][0].text;
        var revCreator = data["response"]["venue"]["tips"]["groups"][0]["items"][0].user.firsttName;
        info.push(phoneNum, twitter, instagram, facebook, rating, description, tipCount, review, revCreator);
    }
    req.send();
    req.DONE;
    return info;
}

function showMore(i) {
    var elems = document.getElementById("results").getElementsByClassName("col-lg-4");
    var target = elems[i];
    for (let l = 0; l < elems.length; l++) {
        if (l == i) {
            continue;
        }
        else {
            elems[i].classList.add("hiddden");
        }
    }
    target.classList.remove("col-lg-4");
    target.classList.add("col-lg-12");
    var hiddens = target.getElementsByClassName("hidden")
    for (var t = 0; t < hiddens.length; t++) {
        hiddens[i].classList.remove("hidden");
    }

}

function init(i, lat, lng) {
    var lat;
    var lng;
    this.lat = lat;
    this.lng = lng
    var map = new ol.Map({ target: 'map' + i, layers: [new ol.layer.Tile({ source: new ol.source.OSM() })], view: new ol.View({ center: ol.proj.fromLonLat([lng, lat]), zoom: 14 }) });
    var marker = new ol.Feature({ geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat])), });
    var vectorSource = new ol.source.Vector({ features: [marker] });
    var markerVectorLayer = new ol.layer.Vector({ source: vectorSource, });
    map.addLayer(markerVectorLayer);
}
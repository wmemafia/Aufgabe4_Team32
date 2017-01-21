

var countries =[];
var selectedOption = "birth_rate_per_1000";
var margin = {top: 20, right: 30, bottom: 150, left: 45};
var width = 600 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;

var map;
var markers = [];

//load data from csv
d3.csv("world_data.csv", function(data) {
    countries = data;
    
    createChart(d3.select("#charts #chart1"));
    
    createChart(d3.select("#charts #chart2"));
    
    initMap();
});

// ideas from https://bost.ocks.org/mike/bar/ and next pages and https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4
function createChart(parentElement) {
    
    // append svg object to the parent
    var chart = parentElement.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // load options into select 
    var options = Object.keys(countries[0]);
    options.splice(0, 2);                   // delete keys for id and name to not offer a chart for those
    parentElement.select("select")
        .on("change", function() {
                                    selectedOption = this.options[this.selectedIndex].value;
                                    updateChart(chart);
				    updateMarker();
                                })
        .selectAll("option")
        .data(options)
        .enter().append("option")
            .attr("value", function(d) {return d;})
            .text(function(d) {return d;}); 
            
    updateChart(chart);  
      
}



function updateChart(chart) {
    // load data
    var data = countries.map(function(el) {return {name: el.name, value: parseFloat(el[selectedOption]) }; })
    
    // set the ranges
    var x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1);
    
    var y = d3.scaleLinear()
        .range([height, 0]);
    
    // scale range of the data in the domains
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.value})]);
    
    var bars = chart.selectAll(".bar")
        .data(data);
    
    // append rectancgles for the chart
   bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });
    
    bars.exit().remove();
    
    bars.transition().duration(800)
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });
    
    chart.select(".x-axis").remove();
    
    // append x axis and format it
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("style", null)
            .attr("dy", "-.25em")
            .attr("dx", ".8em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");
    
    chart.select(".y-axis").remove();
    
    // append y axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));
}







function initMap() {
	// taken from https://switch2osm.org/using-tiles/getting-started-with-leaflet/
	map = new L.map('map');

	// create the tile layer with correct attribution
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 10, attribution: osmAttrib});
	
	map.setView(new L.LatLng(0, 30), 2);
	map.addLayer(osm);
	
	updateMarker();
}


var markerIcon = L.Icon.extend({
	options: {
		iconSize: [20, 20],
		iconAnchor: [10, 20],
		popupAnchor: [0, -20]
	}
});

var defaultMarker = new markerIcon({iconUrl: 'map-marker.svg'});



function updateMarker() {
	markers = [];
	countries.forEach(function(value, index, array) {
		var currentMarker = L.marker([value["gps_lat"], value["gps_long"] ], {icon: defaultMarker}).addTo(map);
		currentMarker.bindPopup(selectedOption + "<br /> for " + value["name"] + ": <br />" + value[selectedOption]);
		markers.push(currentMarker);
	});
}

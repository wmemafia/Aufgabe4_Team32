

var countries =[];
var selectedOption = "birth_rate_per_1000";

//load data from csv
d3.csv("world_data.csv", function(data) {
    countries = data;
    
    createChart(d3.select("#charts #chart1"))
    
});

// ideas from https://bost.ocks.org/mike/bar/ and next pages
function createChart(parentElement) {
    
    var margin = {top: 20, right: 30, bottom: 30, left: 40};
    var width = 600 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    
    
    // load options into select 
    var options = Object.keys(countries[0]);
    options.splice(0, 2);                   // delete keys for id and name to not offer a chart for those
    parentElement.select("select")
        .selectAll("option")
        .data(options)
        .enter().append("option")
            .attr("value", function(d) {return d;})
            .text(function(d) {return d;});
     
    // load data
    var data = countries.map(function(el) {return {name: el.name, value: parseFloat(el[selectedOption]) }; })
    
    var x = d3.scaleBand()
        .rangeRound([0, width]);
    
    var y = d3.scaleLinear()
        .range([height, 0]);
    
    var xAxis = d3.axisBottom();
    
    var yAxis = d3.axisLeft();
    
    var chart = parentElement.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    
    chart.selectAll(".bar")
        .ata(data)
      .enter().appemd("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x.rangeBand());
    
        
    

   
}
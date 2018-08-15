let gdpData = [];

function loadData() {
    fetch('./assets/js/gdp_data.json')
        .then(response => response.json())
        .then(data => {
            console.log("Data Loaded", data);
            gdpData = data.data;
            createGraph();
        });
}

function createGraph() {
    let width = 700,
        height = 600,
        padding = 30;

    console.log(gdpData);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(gdpData, d => d[1])])
        .range([0, height]);

    const xScale = d3.scaleBand()
        .domain(gdpData)
        .range([0, width]);

    const svg = d3.select("body")
        .append("svg")
        .attr('width', '700')
        .attr('height', '600');

    svg.selectAll("rect")
        .data(gdpData)
        .enter()
        .append("rect")
        .attr("height", function (d) {
            return yScale(d[1]);
        })
        .attr("width", function(d){
            return xScale.bandwidth();
        })
        .attr("x", function(d){
            return xScale(d);
        })
        .attr("y", function(d){
            return height - yScale(d[1]);
        });
};

document.addEventListener('DOMContentLoaded', function (e) {
    loadData();
});
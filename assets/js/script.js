let gdpData = [],
    years = [];
width = 700,
    height = 600,
    padding = 40;

let barWidth;

function loadData() {
    fetch('./assets/js/gdp_data.json')
        .then(response => response.json())
        .then(data => {
            console.log("Data Loaded", data);
            gdpData = data.data;

            years = data.data.map(data => {
                return data[0].split('-')[0];
            });

            barWidth = width / years.length;
            createGraph();
        });
}

function createGraph() {

    console.log(gdpData);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(gdpData, d => d[1])])
        .range([0, height]);

    const xScale = d3.scaleLinear()
        .domain([d3.min(years), d3.max(years)])
        .range([0, width]);

    const svg = d3.select("body")
        .append("svg")
        .attr('width', width + padding + 20) //+20 for bottom axis
        .attr('height', height + padding + 20); //+20 for left axis

    svg.selectAll("rect")
        .data(gdpData)
        .enter()
        .append("rect")
        .attr("height", function (d) {
            return yScale(d[1]);
        })
        .attr("width", barWidth)
        .attr("x", function (d, i) {
            return i * barWidth + padding;
        })
        .attr("y", function (d) {
            return height - yScale(d[1]) + 20;
        })
        .on('mouseenter', function (d, i) {
            console.log(this);
            d3.select(this)
                .style("opacity", "0.7");

            console.log(d);
            console.log(d3.event.pageX, d3.event.pageY);
        })
        .on('mouseleave', function (d, i) {
            d3.select(this)
                .style("opacity", "1");
        });

    // Axis
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'));

    const yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(gdpData, d => d[1])])
        .range([height, 0]);

    const yAxis = d3.axisLeft(yAxisScale)

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", 'translate(' + padding + ', ' + (height + 20) + ')')
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", 'translate(' + 40 + ', ' + (0 + 20) + ')')
        .call(yAxis);
};

document.addEventListener('DOMContentLoaded', function (e) {
    loadData();
});
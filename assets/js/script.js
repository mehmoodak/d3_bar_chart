let gdpData = [],
    years = [],
    yearsQuater = [],
    width = 700,
    height = 400,
    padding = 40,
    barWidth;

function loadData() {
    fetch('./assets/js/gdp_data.json')
        .then(response => response.json())
        .then(data => {
            console.log("GDP Data Loaded from Server", data);

            gdpData = data.data;
            years = data.data.map(data => data[0].split('-')[0]);
            barWidth = width / years.length;
            yearsQuater = data.data.map(data => {
                var quater = '';
                if (data[0].split('-')[1] === '01') {
                    quater = 'Q1'
                } else if (data[0].split('-')[1] === '04') {
                    quater = 'Q2'
                } else if (data[0].split('-')[1] === '07') {
                    quater = 'Q3'
                } else if (data[0].split('-')[1] === '10') {
                    quater = 'Q4'
                }

                return data[0].split('-')[0] + " " + quater;
            });

            createGraph();
            document.getElementById('d3-bar-chart').style.display = 'inline-block';
        });
}

function createGraph() {

    // Scales
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(gdpData, d => d[1])])
        .range([0, height]);

    const xScale = d3.scaleLinear()
        .domain([d3.min(years), d3.max(years)])
        .range([0, width]);

    // Tools Tip
    const toolTip = d3.select('#d3-bar-chart')
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("padding", "5px 25px")
        .style("background", "rgba(255, 255, 255, 0.8)")
        .style("opacity", "0")
        .style("border-radius", '5px')
        .style('box-shadow', '1px 1px 10px 0px')
        .style('font-family', 'sans-serif')
        .style('color', '#222')
        .style('text-align', "center")
        .style("line-height", "1.4")
        .style('visibility', 'hidden')
        .style("transform", "translate(20px, -50%)");

    // Chart Rendering
    const svg = d3.select("#d3-bar-chart")
        .append("svg")
        .attr('width', width + padding * 2) //+20 for bottom axis
        .attr('height', height + padding * 2); //+20 for left axis

    svg.selectAll("rect")
        .data(gdpData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .attr("height", d => yScale(d[1]))
        .attr("width", barWidth)
        .attr("x", (d, i) => i * barWidth + padding)
        .attr("y", d => height - yScale(d[1]) + padding)
        .on('mouseover', function (d, i) {
            d3.select(this).style("opacity", "0.7");
            console.log(d3.event.pageX, d3.event.pageY);

            toolTip
                .attr('data-date', d[0])
                .style("left", d3.event.pageX + 'px')
                .style("top", d3.event.pageY + 'px');

            toolTip.html(yearsQuater[0] + "<br/> $" + d[1] + " Billion")
                .transition()
                .duration(200)
                .style('visibility', 'initial')
                .style('opacity', 1);


        })
        .on('mouseout', function (d, i) {
            d3.select(this).style("opacity", "1");

            toolTip.transition()
                .duration(100)
                .style('visibility', 'hidden')
                .style('opacity', 0);
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
        .attr("transform", 'translate(' + padding + ', ' + (height + padding) + ')')
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", 'translate(' + padding + ', ' + (padding) + ')')
        .call(yAxis);

};

document.addEventListener('DOMContentLoaded', function (e) {
    loadData();
});
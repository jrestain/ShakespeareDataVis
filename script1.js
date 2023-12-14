// script1.js

d3.csv('shakespeare.csv').then(data => {
    const svg = d3.select('#svg1');
    const width = +svg.attr('width');
    const height = +svg.attr('height') - 50;
    const margin = { top: 20, right: 20, bottom: 70, left: 70 };

    const playCounts = {};
    data.forEach(d => {
        const play = d.Play;
        playCounts[play] = (playCounts[play] || 0) + 1;
    });

    const xScale = d3.scaleBand()
        .domain(Object.keys(playCounts))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(playCounts))])
        .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 10)
        .attr('x', -(height - margin.bottom) / 2)
        .attr('dy', '1em')
        .attr('fill', '#000')
        .text('Count');

    const bars = svg.selectAll('rect')
        .data(Object.entries(playCounts))
        .enter().append('rect')
        .attr('x', d => xScale(d[0]))
        .attr('y', d => yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - margin.bottom - yScale(d[1]))
        .attr('fill', '#9F2B68') 
        .on('mouseover', showTooltip)
        .on('mouseout', hideTooltip);

   const slidersContainer = d3.select('#tooltipContainer1').append('div')
    .attr('class', 'slider-container')
    .style('width', `${width}px`) 
    .style('position', 'absolute') 
    .style('left', '0px');

const reviewersSliderLabel = slidersContainer.append('div')
    .attr('class', 'slider-label')
    .text('Number of Reviews');

const reviewersValueLabel = slidersContainer.append('div')
    .attr('class', 'slider-value-label')
    .text('0'); 

const reviewersSlider = slidersContainer.append('input')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', 30000)
    .attr('value', 0)
    .attr('class', 'reviewers-slider')
    .style('width', `${width}px`) 
    .on('input', function () {
        reviewersValueLabel.text(this.value);
        updateBars();
    });

    const imdbSliderLabel = slidersContainer.append('div')
        .attr('class', 'slider-label')
        .text('IMDb Score');

    const imdbValueLabel = slidersContainer.append('div')
        .attr('class', 'slider-value-label')
        .text('0'); 

    const imdbSlider = slidersContainer.append('input')
        .attr('type', 'range')
        .attr('min', 0)
        .attr('max', 10)  
        .attr('value', 0)
        .attr('class', 'imdb-slider')
        .style('width', `${width}px`)
        .on('input', function () {
            imdbValueLabel.text(this.value);
            updateBars();
        });
        

const tooltip = d3.select('#tooltipContainer1') 
.append('div')
.attr('class', 'tooltip')
.style('opacity', 0)
.style('background-color', 'white')
.style('border', '1px solid black');

function showTooltip(d) {
const x = d3.event.pageX;
const y = d3.event.pageY;

tooltip.transition()
    .duration(200)
    .style('opacity', 0.9);

tooltip.html(
    `Play: ${d[0]}<br/>
    Count: ${d[1]}`
)
.style('position', 'absolute')
.style('left', `${x + 25}px`)
.style('top', `${y - 25}px`);
}

function hideTooltip() {
tooltip.transition()
.duration(500)
.style('opacity', 0);
}

    function updateBars() {
        const reviewersThreshold = +reviewersSlider.property('value');
        const imdbThreshold = +imdbSlider.property('value');

        const filteredData = data.filter(d => {
            return +d.Reviewers >= reviewersThreshold && +d['IMDb Rating'] >= imdbThreshold;
        });

        const filteredPlayCounts = {};
        filteredData.forEach(d => {
            const play = d.Play;
            filteredPlayCounts[play] = (filteredPlayCounts[play] || 0) + 1;
        });

        bars.data(Object.entries(filteredPlayCounts), d => d[0]) 
            .attr('height', d => Math.max(0, height - margin.bottom - yScale(d[1])))
            .attr('y', d => yScale(d[1]));

        bars.filter(d => !filteredPlayCounts[d[0]])
            .attr('height', 0)
            .attr('y', yScale(0));
    }

});




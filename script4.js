// script4.js
d3.csv('shakespeare.csv').then(data => {
    const svg = d3.select('#svg4');
    const width = +svg.attr('width');
    const height = +svg.attr('height') - 50;
    const margin = { top: 80, right: 20, bottom: 70, left: 70 };

    const categoryCounts = {
        'Text Faithful': 0,
        'Text Unfaithful': 0,
        'Context Faithful': 0,
        'Context Unfaithful': 0
    };

    const countries = [];

    data.forEach(d => {
        const faithful = d['Faithful?'];
        const newTimePeriod = d['New Time Period?'];
        const country = d.Country;

        if (faithful === 'Yes') {
            categoryCounts['Text Faithful'] += 1;
        } else if (faithful === 'No') {
            categoryCounts['Text Unfaithful'] += 1;
        }

        if (newTimePeriod === 'No') {
            categoryCounts['Context Faithful'] += 1;
        } else if (newTimePeriod === 'Yes') {
            categoryCounts['Context Unfaithful'] += 1;
        }

        if (country && !countries.includes(country)) {
            countries.push(country);
        }
    });

    const xScale = d3.scaleBand()
        .domain(Object.keys(categoryCounts))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(categoryCounts))])
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
        .data(Object.entries(categoryCounts))
        .enter().append('rect')
        .attr('x', d => xScale(d[0]))
        .attr('y', d => yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - margin.bottom - yScale(d[1]))
        .attr('fill', '#9F2B68') 
        .on('mouseover', showTooltip)
        .on('mouseout', hideTooltip);

        const buttonsContainer = d3.select('#tooltipContainer4').append('div')  
        .attr('class', 'buttons-container')
        .style('width', `${width}px`) 
        .style('position', 'absolute') 
        .style('left', '0px');

    const countryButtons = buttonsContainer.selectAll('button')
        .data(countries.filter(country => country !== undefined))
        .enter().append('button')
        .text(d => d)
        .on('click', function (country) {
            updateBars(country);
        });

    const countryLabel = svg.append('text')
        .attr('class', 'country-label')
        .attr('x', width / 2)
        .attr('y', margin.top)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .text('All Countries'); 

const tooltip = d3.select('#tooltipContainer4') 
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
    `${d[0]}<br/>
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
    function updateBars(selectedCountry) {
        countryLabel.text(selectedCountry !== undefined ? selectedCountry : 'All Countries');

        const filteredData = selectedCountry !== undefined
            ? data.filter(d => d.Country === selectedCountry)
            : data;

        const filteredCategoryCounts = {
            'Text Faithful': 0,
            'Text Unfaithful': 0,
            'Context Faithful': 0,
            'Context Unfaithful': 0
        };

        filteredData.forEach(d => {
            const faithful = d['Faithful?'];
            const newTimePeriod = d['New Time Period?'];

            if (faithful === 'Yes') {
                filteredCategoryCounts['Text Faithful'] += 1;
            } else if (faithful === 'No') {
                filteredCategoryCounts['Text Unfaithful'] += 1;
            }

            if (newTimePeriod === 'Yes') {
                filteredCategoryCounts['Context Faithful'] += 1;
            } else if (newTimePeriod === 'No') {
                filteredCategoryCounts['Context Unfaithful'] += 1;
            }
        });

        bars.data(Object.entries(filteredCategoryCounts), d => d[0]) 
            .attr('height', d => Math.max(0, height - margin.bottom - yScale(d[1])))
            .attr('y', d => yScale(d[1]));

        bars.filter(d => !filteredCategoryCounts[d[0]])
            .attr('height', 0)
            .attr('y', yScale(0));
    }
});

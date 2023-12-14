// script2.js

d3.csv('shakespeare.csv').then(data => {
    data.forEach(d => {
      d.Year = +d.Year.replace(/,/g, ''); 
      d.Reviewers = +d.Reviewers;
    });
  
    const svg = d3.select('#svg2');
    const width = +svg.attr('width');
    const height = +svg.attr('height') - 50;
    const margin = { top: 20, right: 20, bottom: 70, left: 70 };
  
    const xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
      .range([margin.left, width - margin.right]);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Reviewers)])
      .range([height - margin.bottom, margin.top]);
  
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale);
  
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('fill', '#000')
      .text('Year');
  
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
      .text('Reviewers');
  
    svg.selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr('cx', d => xScale(d.Year))
      .attr('cy', d => yScale(d.Reviewers))
      .attr('r', 5)
      .attr('fill', '#9F2B68')
      .on('mouseover', showTooltip)
      .on('mouseout', hideTooltip);
  
    const circle1 = svg.append('circle')
      .attr('cx', 200)
      .attr('cy', 100)
      .attr('r', 60) 
      .attr('fill', 'rgba(255, 0, 0, 0.5)')
      .style('pointer-events', 'all') 
      .call(d3.drag().on('drag', updateCircle1));
  
    const circle2 = svg.append('circle')
      .attr('cx', 400)
      .attr('cy', 300)
      .attr('r', 60) 
      .attr('fill', 'rgba(0, 255, 0, 0.5)')
      .style('pointer-events', 'all') 
      .call(d3.drag().on('drag', updateCircle2));
  
const tooltip = d3.select('#tooltipContainer2')
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
    `Title: ${d.Title}<br/>
    Play: ${d.Play}<br/>
    Year: ${d.Year}<br/>
    Reviewers: ${d.Reviewers}`
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
  
const legend = svg.append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${width + margin.right - 175}, ${margin.top})`);

const legendItem1 = legend.append('g')
  .attr('class', 'legend-item')
  .attr('transform', `translate(0, 0)`);

legendItem1.append('rect')
  .attr('width', 15)
  .attr('height', 15)
  .attr('fill', 'rgba(255, 0, 0, 0.5)');

legendItem1.append('text')
  .attr('x', 20)
  .attr('y', 10)
  .text('Text Unfaithful');

const legendItem2 = legend.append('g')
  .attr('class', 'legend-item')
  .attr('transform', `translate(0, 20)`);

legendItem2.append('rect')
  .attr('width', 15)
  .attr('height', 15)
  .attr('fill', 'rgba(0, 255, 0, 0.5)');

legendItem2.append('text')
  .attr('x', 20)
  .attr('y', 10)
  .text('Context Unfaithful');
  
    function updateCircles() {
      const x1 = circle1.attr('cx');
      const y1 = circle1.attr('cy');
      const x2 = circle2.attr('cx');
      const y2 = circle2.attr('cy');
  
      svg.selectAll('circle')
        .attr('opacity', d => {
          const distance1 = Math.sqrt((x1 - xScale(d.Year)) ** 2 + (y1 - yScale(d.Reviewers)) ** 2);
          const distance2 = Math.sqrt((x2 - xScale(d.Year)) ** 2 + (y2 - yScale(d.Reviewers)) ** 2);
  
          return (distance1 <= 60 && d['Faithful?'] === 'Yes') || (distance2 <= 60 && d['New Time Period?'] === 'No') ? 0.2 : 1;
        });
    }
  
    function updateCircle1() {
      const x = d3.event.x;
      const y = d3.event.y;
  
      circle1.attr('cx', x).attr('cy', y);
  
      updateCircles();
    }
  
    function updateCircle2() {
      const x = d3.event.x;
      const y = d3.event.y;
  
      circle2.attr('cx', x).attr('cy', y);
  
      updateCircles();
    }

    
  });
  
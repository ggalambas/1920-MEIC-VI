var schedule_svg;
var schedule_xscale;
var schedule_yscale;
var days_scale;
var schedule_xaxis;
var schedule_gx;
var schedule_color;
var schedule_margin = {top: 20, right: 0, bottom: 0, left: 30};

function create_schedule_dispatch() {

    function disableAll() {
        d3.selectAll(".square")
            .attr("opacity", 0.4)
            .attr("fill", function(d) { return schedule_color(d.count)} )
    }
    
    function highlightAll() {
        d3.selectAll(".square")
            .attr("opacity", 1)
            .attr("fill", function(d) { return schedule_color(d.count)} )
    }

    function disable(time) {
        d3.select(".square[title=\'" + time.day + "," + time.hour + "\']")
            .attr("opacity", 0.4)
            .attr("fill", function(d) { return schedule_color(d.count)} )
    }

    function highlight(time) {
        d3.select(".square[title=\'" + time.day + "," + time.hour + "\']")
            .attr("opacity", 1)
            .attr("fill", colors.get("highlight"))
    }

    schedule_dispatch = d3.dispatch("squareOver", "squareOut", "squareClick");

    schedule_dispatch.on("squareOver", function(time) {
        if (!selectedTime) disableAll();
        if (selectedTime != time) highlight(time);
    })
    schedule_dispatch.on("squareOut", function(time) {
        if (!selectedTime) highlightAll();
        else if (selectedTime != time) disable(time);
    })
    schedule_dispatch.on("squareClick", function(time) {
        if (selectedTime == time) {
            selectedTime = undefined;
            removeFilter(timeText(time));
            // create_categories_dispatch();
            // dataset = categories_dataset;
        }
        else {
            if (selectedTime) {
                disable(selectedTime);
                removeFilter(timeText(selectedTime));
            }
            selectedTime = time;
            createFilter(timeText(time));
            // categories_dispatch = undefined;
        }
    })
}

function gen_map() {

    schedule_svg = d3.select("#schedule").append("svg");
    var total_w = parseInt(schedule_svg.style("width"));
    var total_h = parseInt(schedule_svg.style("height"));
    var map_w = total_w - schedule_margin.left - schedule_margin.right;
    var map_h = total_h - schedule_margin.top - schedule_margin.bottom;

    var max_value = d3.max(schedule_dataset, function(d) { return d.count; } );
    var days = d3.map(schedule_dataset, function(d) { return d.day; }).keys();
    var hours = d3.map(schedule_dataset, function(d) { return d.hour; }).keys();

    schedule_svg.attr("width", total_w)
                .attr("height", total_h)   

    schedule_xscale = d3.scaleBand()
                        .domain(days)
                        .range([0,map_w])
                        // .padding(0.05);
    
    schedule_yscale = d3.scaleBand()
                        .domain(hours)
                        .range([0,map_h])
                        // .padding(0.05);

    days_scale = d3.scaleBand()
                    .domain(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
                    .range([0,map_w]);
 
    schedule_xaxis = d3.axisBottom()
                  .scale(days_scale)
                  .tickSize(0);
 
    var yaxis = d3.axisRight()
                  .scale(schedule_yscale)
                  .tickSize(0);
    
    schedule_gx = schedule_svg.append("g")
                .attr("class", "axis")
                .attr("pointer-events", "none")
                .attr("transform", "translate(" + schedule_margin.left + "," + 0 + ")")
                .call(schedule_xaxis)
    
    schedule_svg.append("g")
                .attr("class", "axis")
                .attr("pointer-events", "none")
                .attr("transform", "translate(" + 0 + "," + schedule_margin.top + ")")
                .call(yaxis)


    // Square Colors
    // schedule_color = d3.scaleSequential()
    //               .interpolator(d3.interpolateReds)
    //               .domain([0,max_value*1.2])
    schedule_color = d3.scaleLinear()
                .domain([0,max_value])
                .range(["#282828", colors.get("highlight")])

    // Squares
    var squares = schedule_svg.selectAll(".square")
                              .data(schedule_dataset)
                              .enter()
                              .append("g")
                              .attr("transform", "translate(" + schedule_margin.left + "," + schedule_margin.top + ")");    

    squares.append("rect")
           .attr("class", "square")
           .attr("title", function(d) { return d.day + "," + d.hour })
           .attr("y", function(d) { return schedule_yscale(d.hour) })
           .attr("x", function(d) { return schedule_xscale(d.day) })
           .attr("height", schedule_yscale.bandwidth() )
           .attr("width", schedule_xscale.bandwidth() )
           .attr("fill", function(d) { return schedule_color(d.count)} )
           .style("stroke-width", 2)
           .style("stroke", "#282828")
        //    .style("opacity", 0.8)
           .on("mouseover", function(d){ schedule_dispatch.call("squareOver", d, d) })
           .on("mouseout", function(d){ schedule_dispatch.call("squareOut", d, d) })
           .on("click", function(d) { schedule_dispatch.call("squareClick", d, d) });
}

function resize_map() {
    var total_w = parseInt(schedule_svg.style("width"));
    var map_w = total_w - schedule_margin.left - schedule_margin.right;
  
    // Update the range of the scale with new width
    schedule_xscale.range([0,map_w]);
    days_scale.range([0,map_w]);
    schedule_gx.call(schedule_xaxis);

    // Force D3 to recalculate and update the bars width
    schedule_svg.selectAll(".square")
                .attr("x", function(d) { return schedule_xscale(d.day) })
                .attr("width", schedule_xscale.bandwidth() );
};

function timeText(time) {
    var day;
    switch(time.day) {
        case 1: day = "Mon"; break;
        case 2: day = "Tue"; break;
        case 3: day = "Wed"; break;
        case 4: day = "Thu"; break;
        case 5: day = "Fri"; break;
        case 6: day = "Sat"; break;
        case 7: day = "Sun"; break;
    }
    return day + ' ' + time.hour + 'h';
}
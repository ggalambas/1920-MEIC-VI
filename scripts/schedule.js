var schedule_svg;
var schedule_xscale;
var schedule_yscale;
var days_scale;
var schedule_xaxis;
var schedule_gx;
var schedule_color;
var schedule_color_2;
var schedule_margin = {top: 20, right: 0, bottom: 0, left: 30};

function create_schedule_dispatch() {

    function disableAll() {
        d3.selectAll(".square")
            .attr("opacity", 0.4)
            .style("stroke", "#282828")
    }
    
    function highlightAll() {
        d3.selectAll(".square")
            .attr("opacity", 1)
            .style("stroke", "#282828")
    }

    function disable(time) {
        d3.selectAll(".square[title=\'" + time.day + "," + time.hour + "\']")
            .attr("opacity", 0.4)
            .style("stroke", "#282828")
    }

    function highlight(time) {
        d3.selectAll(".square[title=\'" + time.day + "," + time.hour + "\']")
            .attr("opacity", 1)
            .style("stroke", "white")
    }

    schedule_dispatch = d3.dispatch("squareOver", "squareOut", "squareClick");

    schedule_dispatch.on("squareOver", function(time) {
        if (!selectedTime) disableAll();
        if (selectedTime != time) highlight(time);
    })
    schedule_dispatch.on("squareOut", function(time) {
        if (!selectedTime) highlightAll();
        else if (selectedTime && (selectedTime.day != time.day || selectedTime.hour != time.hour)) disable(time);
    })
    schedule_dispatch.on("squareClick", function(time) {
        if (selectedTime == time) {
            selectedTime = undefined;
            removeFilter(timeText(time));
            create_categories_dispatch();
            dataset = categories_dataset;
        }
        else {
            if (selectedTime) {
                disable(selectedTime);
                removeFilter(timeText(selectedTime));
            }
            selectedTime = time;
            createFilter(timeText(time));
            categories_dispatch = undefined;
            // get the category count for the day and hour
            dataset = schedule_bycategory_count_dataset.get(time.day).get(time.hour);
            // create an array with the categories that have that time
            var categories = [];
            dataset.every(function(d) { return categories.push(d.category_title); });
            // add the missing categories with 0 count to the dataset
            categories_full_dataset.forEach(function(d) {
                if (!categories.includes(d.category_title)) {
                    dataset.push({
                        "category_title": d.category_title,
                        "count": 0
                    })
                }
            })
            // sort the dataset
            dataset.sort(function(x, y) { return d3.ascending(x.category_title, y.category_title); });
        }
        update_bars(dataset);
        removeWordFilter_aux(selectedWord.text);
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
    schedule_color = d3.scaleLinear()
                       .domain([0,max_value])
                       .range(["#282828", colors.get("highlight")])

    // Squares
    var squares = schedule_svg.selectAll(".square")
                              .data(schedule_dataset)
                              .enter()
                              .append("g")
                              .attr("class", "square_g")
                              .attr("transform", "translate(" + schedule_margin.left + "," + schedule_margin.top + ")");    

    squares.append("rect")
           .attr("class", "square")
           .attr("title", function(d) { return d.day + "," + d.hour })
           .attr("x", function(d) { return schedule_xscale(d.day) })
           .attr("y", function(d) { return schedule_yscale(d.hour) })
           .attr("width", schedule_xscale.bandwidth() )
           .attr("height", schedule_yscale.bandwidth() )
           .attr("fill", function(d) { return schedule_color(d.count)} )
           .style("stroke-width", 2)
           .style("stroke", "#282828")
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

function update_map() {
    var selected = selectedCategories.length;
    var max_value;

    if (selected == 0) {
        schedule_dataset = schedule_full_dataset;
        max_value = d3.max(schedule_dataset, function(d) { return d.count; } );
        schedule_color.domain([0,max_value]).range(["#282828", colors.get("highlight")]);
    }
    else if (selected == 1) {
        schedule_dataset = schedule_bycategory_dataset.get(selectedCategories[0]);
        max_value = d3.max(schedule_dataset, function(d) { return d.count; } );
        schedule_color.domain([0,max_value]).range(["#282828", colors.get(selectedCategories[0])]);
    }
    else {
        schedule_dataset = undefined;
        schedule_dataset_2 = [schedule_bycategory_dataset.get(selectedCategories[0]),
                              schedule_bycategory_dataset.get(selectedCategories[1])]
        
        max_value = d3.max(schedule_dataset_2[0], function(d) { return d.count; } ); 
        aux = d3.max(schedule_dataset_2[1], function(d) { return d.count; } );
        if (aux > max_value) max_value = aux;
    }

    schedule_svg.selectAll(".square_g").remove();

    if (schedule_dataset)
        schedule_svg.selectAll(".square")
                    .data(schedule_dataset)
                    .enter()
                    .append("g")
                    .attr("class", "square_g")
                    .attr("transform", "translate(" + schedule_margin.left + "," + schedule_margin.top + ")")
                    .append("rect")
                    .attr("class", "square")
                    .attr("title", function(d) { return d.day + "," + d.hour })
                    .attr("x", function(d) { return schedule_xscale(d.day) })
                    .attr("y", function(d) { return schedule_yscale(d.hour) })
                    .attr("width", schedule_xscale.bandwidth() )
                    .attr("height", schedule_yscale.bandwidth() )
                    .attr("fill", function(d) { return schedule_color(d.count)} )
                    .style("stroke-width", 2)
                    .style("stroke", "#282828")
                    .on("mouseover", function(d){ schedule_dispatch.call("squareOver", d, d) })
                    .on("mouseout", function(d){ schedule_dispatch.call("squareOut", d, d) })
                    .on("click", function(d) { schedule_dispatch.call("squareClick", d, d) });
    
    else {
        var squares = schedule_svg.selectAll(".square")
        for (i = 0; i < 2; i++) {
            schedule_color.domain([0,max_value]).range(["#282828", colors.get(selectedCategories[i])]);
            squares.data(schedule_dataset_2[i])
                   .enter()
                   .append("g")
                   .attr("class", "square_g")
                   .attr("transform", "translate(" + schedule_margin.left  + "," + schedule_margin.top + ")")
                   .append("rect")
                   .attr("class", "square i")
                   .attr("title", function(d) { return d.day + "," + d.hour })
                   .attr("x", function(d) { return schedule_xscale(d.day) + schedule_xscale.bandwidth()/2*i })
                   .attr("y", function(d) { return schedule_yscale(d.hour) })
                   .attr("width", schedule_xscale.bandwidth()/2 )
                   .attr("height", schedule_yscale.bandwidth() )
                   .attr("fill", function(d) { return schedule_color(d.count)} )
                   .style("stroke-width", 2)
                   .style("stroke", "#282828")
                   .on("mouseover", function(d){ schedule_dispatch.call("squareOver", d, d) })
                   .on("mouseout", function(d){ schedule_dispatch.call("squareOut", d, d) })
                   .on("click", function(d) { schedule_dispatch.call("squareClick", d, d) })
        }
    }
}

function colorScale(category, count) {
    const highlight = d3.scaleLinear().domain([0,max_value]).range(["#282828", colors.get("highlight")])
}
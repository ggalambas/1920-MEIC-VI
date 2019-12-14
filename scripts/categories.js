var categories_svg;
var categories_xscale;
var categories_yscale;
var categories_margin = {top: 0, right: 50, bottom: 0, left: 0};
var categories_words_w = 150;
var categories_color_space = 7;
    
function create_categories_dispatch() {

    function getBar(title) {
        return d3.select("rect[title=\'" + title + "\']");
    }

    categories_dispatch = d3.dispatch("barOver", "barOut", "barClick");

    categories_dispatch.on("barOver", function(d) {
        var title = d.category_title;
        if (!selectedCategories.includes(title)) {
            getBar(title).attr("fill", colors.get(title));
        }
    })
    categories_dispatch.on("barOut", function(d) {
        var title = d.category_title;
        if (!selectedCategories.includes(title)) {
            getBar(title).attr("fill", colors.get("light2-yt"));
        }
    })
    categories_dispatch.on("barClick", function(d) {
        var title = d.category_title;
        var selectedBar = getBar(title)
        
        if (selectedCategories.includes(title)) {
            selectedBar.attr("fill", colors.get("light2-yt"));
            var i = selectedCategories.indexOf(title);
            selectedCategories.splice(i, 1);
        }
        else {
            if (selectedCategories.length==2) {
                var _title = selectedCategories.pop();
                getBar(_title).attr("fill", colors.get("light2-yt"));
            }
            selectedBar.attr("fill", colors.get(title));
            selectedCategories.push(title);
        }
        update_bars(categories_dataset);
        update_cloud();
        gen_spider();
        gen_stars();
    });
}

function gen_bars() {

    categories_svg = d3.select("#categories").append("svg")
    var total_w = parseInt(categories_svg.style("width"));
    var total_h = parseInt(categories_svg.style("height"));
    var chart_w = total_w - categories_margin.left - categories_margin.right;
    var chart_h = total_h - categories_margin.top - categories_margin.bottom;

    var max_value = d3.max(categories_dataset, function(d) { return d.count; } );
    var bar_space = 5;
    var text_space = 10;

    categories_svg.attr("width", total_w)
                  .attr("height", total_h)
                  .append("g")
                  .attr("transform", "translate(" + categories_margin.left + "," + categories_margin.top + ")");

    categories_xscale = d3.scaleLinear()
                          .domain([0,max_value])
                          .range([categories_words_w,chart_w]);

    categories_yscale = d3.scaleBand()
                          .domain(categories_dataset.map(function(d) { return d.category_title; }))
                          .rangeRound([0,chart_h]);

    // Names
    var yaxis = d3.axisRight()
                  .scale(categories_yscale)
                  .tickSize(0);

    var bars = categories_svg.selectAll(".bar")
                             .data(categories_dataset)
                             .enter()
                             .append("g");

    // Bars
    bars.append("rect")
        .attr("class", "bar")
        .attr("y",function(d) { return categories_yscale(d.category_title); })
        .attr("height", categories_yscale.bandwidth()-bar_space)
        .attr("x", 0)
        .attr("width",function(d) { return categories_xscale(d.count); })
        .attr("title", function(d) { return d.category_title })
        .attr("fill", colors.get("light2-yt"))
        .on("mouseover", function(d){ categories_dispatch.call("barOver", d, d) })
        .on("mouseout", function(d){ categories_dispatch.call("barOut", d, d) })
        .on("click", function(d) { categories_dispatch.call("barClick", d, d) });
    
    // Bar Colors
    bars.append("rect")
        .attr("y",function(d) { return categories_yscale(d.category_title); })
        .attr("height", categories_yscale.bandwidth()-bar_space)
        .attr("x", 0)
        .attr("width", categories_color_space)
        .attr("fill", function(d) { return colors.get(d.category_title) });

    // Values
    bars.append("text")
        .attr("class", "label")
        .attr("y", function(d) { return categories_yscale(d.category_title) + categories_yscale.bandwidth()/2; })
        .attr("x", function(d) { return categories_xscale(d.count) + categories_color_space })
        .text(function(d) { return d.count; });

    var gy = categories_svg.append("g")
                           .attr("class", "axis")
                           .attr("pointer-events", "none")
                           .attr("transform", "translate(" + text_space + ",0)") //TODO
                           .call(yaxis)
}

function resize_bars() {
    var total_w = parseInt(categories_svg.style("width"));
    var chart_w = total_w - categories_margin.left - categories_margin.right;
  
    // Update the range of the scale with new width
    categories_xscale.range([categories_words_w, chart_w]);
  
    // Force D3 to recalculate and update the bars width
    categories_svg.selectAll(".bar")
                  .attr("width", function(d) { return categories_xscale(d.count); });
    
    // Force D3 to recalculate and update the labels x position
    categories_svg.selectAll(".label")
                   .attr("x", function(d) { return categories_xscale(d.count) + categories_color_space });
  };

function update_bars(dataset) {
    var max_value = d3.max(dataset, function(d) { return d.count; } );
    categories_xscale.domain([0,max_value]);
    
    categories_svg.selectAll(".bar")
                  .data(dataset)
                  .attr("width", function(d) { return categories_xscale(d.count); });

    categories_svg.selectAll(".label")
                  .data(dataset)
                  .attr("x", function(d) { return categories_xscale(d.count) + categories_color_space })
                  .text(function(d) { return d.count; });
}
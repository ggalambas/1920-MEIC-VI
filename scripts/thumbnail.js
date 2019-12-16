var original_colors = []
var grouped_colors = [
    {"red": 0},
    {"green": 0},
    {"blue": 0},
    {"cyan": 0},
    {"magenta": 0},
    {"yellow": 0}
]

images.forEach( () => {
    var img = document.createElement('img');
    img.setAttribute('src', 'gaita-bingo.png')

    img.addEventListener('load', function() {
        var vibrant = new Vibrant(img);
        var swatches = vibrant.swatches()
        var swatch = "Vibrant";
        if (swatches.hasOwnProperty(swatch) && swatches[swatch])
            original_colors.push(swatches[swatch].getRgb())
        // for (var swatch in swatches)
        //     if (swatches.hasOwnProperty(swatch) && swatches[swatch])
        //         console.log(swatch, swatches[swatch].getHex())
    })});

original_colors.forEach(color => {
    var color_name
    var dominant = Math.max.apply(null, color)
    var dominant_name, dominant_pos = getRGBName(color, dominant)
    og_color = color
    color.splice(pos, 1) // remove max from the array
    var second = Math.max.apply(null, color) // get the 2nd max
    var second_name, second_pos = getRGBName(og_color, second)
    if( dominant - second < 128 )
        color_name = getCMYName(dominant_name, second_name)
    else
        color_name = dominant_name
    grouped_colors[color_name] += 1
});

function getRGBName(color, value) {
    var name
    var pos = color.indexOf(value)
    switch(pos) {
        case 0:
            name = 'red'
            break
        case 1:
            name = 'green'
            break
        case 2:
            name = 'blue'
            break
    }
    return name, pos
}

function getCMYName(name1, name2) {
    var name = name1
    if( name1 == 'red' )
        if( name2 == 'green' )
            name = 'Yellow'
        else
            name = 'Magenta'
    if( name1 == 'green' )
        if( name2 == 'red' )
            name = 'Yellow'
        else
            name = 'Cyan'
    else
        if( name2 == 'red' )
            name = 'Magenta'
        else
            name = 'Cyan'
    return name
}

// var thumbnail_svg
// var thumbnail_xscale;
// var thumbnail_yscale;
// var thumbnail_margin = {top: 0, right: 0, bottom: 0, left: 0}

// var groups = ['entertainment', 'gaming']
// var subgroups = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta']
// var grouped_colors = [
// 	{
// 	category: "entertainment",
//     red: 12,
//     yellow: 4,
//     green: 1,
//     blue: 13,
//     cyan: 6,
//     magenta: 30
// 	},
// 	{
// 	category: "gaming",
//     red: 6,
//     yellow: 18,
//     green: 6,
//     blue: 33,
//     cyan: 20,
//     magenta: 7
// 	}
// ]

// d3.csv("data_stacked.csv", function(data) {
// 	thumbnail_svg = d3.select("#thumbnail").append("svg")
// 	var total_w = parseInt(thumbnail_svg.style("width"))
// 	var total_h = parseInt(thumbnail_svg.style("height"))

// 	thumbnail_svg.attr("width", total_w)
// 				 .attr("height", total_h)
// 				 .append("g")
// 				 .attr("transform", "translate(" + thumbnail_margin.left + "," + thumbnail_margin.top + ")")

// 	thumbnail_xscale = d3.scaleLinear()
// 						 .domain([0, 100])
// 						 .range([ total_h, 0 ]);

// 	thumbnail_yscale = d3.scaleBand()
// 						 .domain(groups)
// 						 .range([0, total_w])
// 						 .padding([0.2])

//   	var color = d3.scaleOrdinal()
//                   .domain(subgroups)
// 				  .range(subgroups)
				  
// 	var dataIntermediate = subgroups.map(function (c) {
// 		return grouped_colors.map(function (d) {
// 			return {y: d.category, x: d[c]};
// 		});
// 	});

// 	var tot = [0,0]
//     dataIntermediate.forEach(function(d) {
// 		tot[0] += d[0].x
// 		tot[1] += d[1].x
// 	})
// 	dataIntermediate.forEach(function(d) {
// 		d[0].x = d[0].x / tot[0] * 100
// 		d[1].x = d[1].x / tot[1] * 100
// 	})

// 	var stackedData = d3.stack().keys(subgroups)(dataIntermediate)
// 	console.log(stackedData)

// 	thumbnail_svg.append("g")
// 				 .selectAll("g")
// 				 .data(stackedData)
// 				 .enter().append("g")
// 				 		 .attr("fill", function(d) { return d.key; })
// 				 		 .selectAll("rect")
// 				 		 .data(function(d) { return d; })
// 				 		 .enter().append("rect")
// 				 		 		//  .attr("x", function(d) { console.log(d.data); return thumbnail_xscale(d[1]); })
// 						  		//  .attr("y", function(d) { return thumbnail_yscale(d.data.group); })
// 				 		 		//  .attr("width", function(d) { return thumbnail_xscale(d[0]) - thumbnail_xscale(d[1]); })
// 				 		 		//  .attr("height",thumbnail_yscale.bandwidth())
// })
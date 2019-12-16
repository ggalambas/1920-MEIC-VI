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
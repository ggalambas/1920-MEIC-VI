var words_svg;
var words_resize_timer;

function create_words_dispatch() {

    function disableAll() {
        d3.selectAll(".word text").attr("opacity", 0.4);
    }
    
    function highlightAll() {
        d3.selectAll(".word text").attr("opacity", 1);
    }

    function disable(word) {
        if (selectedCategories.length==0)
            d3.select("text[title=\'" + word.text.toString().replace("'", "") + ', ' + word.category + "\']")
              .attr("opacity", 0.4);
        else selectedCategories.forEach(function(category) {
            d3.select("text[title=\'" + word.text.toString().replace("'", "") + ', ' + category + "\']")
              .attr("opacity", 0.4);
        })
    }

    function highlight(word) {
        if (selectedCategories.length==0)
            d3.select("text[title=\'" + word.text.toString().replace("'", "") + ', ' + word.category + "\']")
              .attr("opacity", 1);
        else selectedCategories.forEach(function(category) {
            d3.select("text[title=\'" + word.text.toString().replace("'", "") + ', ' + category + "\']")
              .attr("opacity", 1);
        })
    }

    // function highlight(word) {
    //     if (selectedCategories.length==0)
    //         d3.select("text[title=\'" + word.text.toString().replace("'", "") + ', ' + word.category + "\']")
    //           .attr("fill", colors.get("highlight"));
    //     else selectedCategories.forEach(function(category) {
    //         d3.select("text[title=\'" + word.text.toString().replace("'", "") + ', ' + category + "\']")
    //           .attr("fill", colors.get("highlight"));
    //     })
    // }

    // function resetColor(word) {
    //     if (selectedCategories.length==0)
    //         d3.select("text[title=\'" + word.text.toString().replace("'", "") + ', ' + word.category + "\']")
    //           .attr("fill", colors.get("light-yt"));
    //     else selectedCategories.forEach(function(category) {
    //         d3.select("text[title=\'" + word.text.toString().replace("'", "") + ', ' + category + "\']")
    //           .attr("fill", colors.get(category));
    //     })
    // }

    words_dispatch = d3.dispatch("wordOver", "wordOut", "wordClick");

    words_dispatch.on("wordOver", function(word) {
        // if (selectedWord != word) highlight(word);
        if (!selectedWord) disableAll();
        if (selectedWord != word) highlight(word);
    })

    words_dispatch.on("wordOut", function(word) {
        // if (selectedWord != word) resetColor(word);
        if (!selectedWord) highlightAll();
        else if (selectedWord != word) disable(word);
    })

    words_dispatch.on("wordClick", function(word) {
        var dataset;
        if (selectedWord == word) {
            // resetColor(word);
            selectedWord = undefined;
            removeFilter(word.text);
            create_categories_dispatch();
            dataset = categories_dataset;
        }
        else {
            // if (selectedWord) resetColor(selectedWord);
            // highlight(word);
            if (selectedWord) {
                disable(selectedWord);
                removeFilter(selectedWord.text);
            }
            selectedWord = word;
            createFilter(word.text);
            categories_dispatch = undefined;
            // get the category count for the word
            dataset = words_byword_dataset.get(word.text);
            // create an array with the categories that have that word
            var categories = [];
            dataset.every(function(d) { return categories.push(d.category_title); });
            // add the missing categories with 0 count to the dataset
            categories_full_dataset.forEach(function(d) {
                if (!categories.includes(d.category_title)) {
                    dataset.push({
                        "category_title": d.category_title,
                        "word": word.text,
                        "count": 0
                    })
                }
            })
            // sort the dataset
            dataset.sort(function(x, y) { return d3.ascending(x.category_title, y.category_title); });
        }
        update_bars(dataset);
        gen_spider();
        gen_stars();
    });
}

function gen_cloud() {
                
    function draw(words) {
        words_svg.append("g")
                 .attr("class", "word")
                 .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
                 .selectAll("text")
                 .data(words)
                 .enter()
                 .append("text")
                 .attr("title", function(d) { return d.text.toString().replace("'", "") + ", " + d.category_title; })
                 .attr("font-size", function(d) { return d.size; })
                 .attr("fill", function(d) {
                    if (d.color) return d.color;
                    else return colors.get("light-yt");
                  })
                 .attr("text-anchor", "middle")
                 .attr("font-family", "Impact")
                 .attr("overflow", "visible")
                 .attr("transform", function(d) {
                     return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                  })
                 .text(function(d) { return d.text; })
                 .on("mouseover", function(d) { words_dispatch.call("wordOver", d, d); })
                 .on("mouseout", function(d) { words_dispatch.call("wordOut", d, d); })
                 .on("click", function(d) { words_dispatch.call("wordClick", d, d); });
    }

    words_svg = d3.select("#words").append("svg");
    var w = parseInt(words_svg.style("width"));
    var h = parseInt(words_svg.style("height"));

    var min_value = d3.min(words_dataset, function(d){ return d.count});
    var max_value = d3.max(words_dataset, function(d){ return d.count});

    words_svg.attr("width", w)
             .attr("height", h)
             .append("g")

    var sizeScale = d3.scaleSqrt()
                      .domain([min_value, max_value])
                      .range([14, 72]);

    d3.layout.cloud()
             .size([w, h])
             .words(words_dataset.map(function(d) { return {
                 text: d.word,
                 category_title: d.category_title,
                 size: sizeScale(d.count).toString(),
                 color: colors.get(d.category_title)
              };}))
             .padding(0) //space between words
             .rotate(0)
             .font("Impact")
             .spiral("archimedean")
             .fontSize(function(d) { return d.size; })
             .on("end", draw)
             .start();    
}

function timeout_update_cloud() {
    d3.selectAll("#words > *").remove();
    gen_cloud();
}

function resize_cloud() {
    if (words_resize_timer) clearTimeout(words_resize_timer);
    words_resize_timer = setTimeout(timeout_update_cloud,60);
}

function update_cloud() {
    var selected = selectedCategories.length;

    if (selected == 0) {
        words_dataset = words_full_dataset.slice(0,100);
    }
    else if (selected == 1) {
        words_dataset = words_bycategory_dataset.get(selectedCategories[0]);
    }
    else {
        Promise.all([
            words_bycategory_dataset.get(selectedCategories[0]),
            words_bycategory_dataset.get(selectedCategories[1])
        ]).then(function(allData) {
            words_dataset = d3.merge(allData)
                              .sort(function(x, y) {
                                  return d3.descending(x.count, y.count);
                                })
                              .slice(0,100);
        });
    }
    setTimeout(timeout_update_cloud,30);
}
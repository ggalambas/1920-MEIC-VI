const colors = new Map ([
    ["light-yt", "#AAAAAA"],
    ["light2-yt", "#3E3E3E"],
    ["highlight", "#DB4437"],
    ["Entertainment", "#F4B400"],    
    ["Gaming", "#99EA62"],    
    ["Lifestyle", "#0F9D58"],    
    ["Music", "#47D1DE"],    
    ["Science & Politics", "#4285F4"],    
    ["Sports", "#7753B1"],    
    ["Theater & Animation", "#BE5DE3"]
])

// RESIZE

d3.select(window).on('resize', function() {
    resize_bars();
    resize_cloud();
});

// FILTERS

function createFilter(filter) {
    d3.select("#filter").append("li")
                        .attr("class", "list-inline-item")
                        .attr("title", filter)
                        .attr("onclick", "removeWordFilter(this);")
                        .html("<span>" + filter + "</span>" + " x");
}

function removeFilter(filter) {
    d3.select("#filter").select("li[title=\'" + filter + "\']").remove();
    // d3.selectAll("#filter li")
    //     .filter(function() {
    //         console.log(d3.select("span").text());
    //         return d3.select("span").text() == filter;
    //     })
    //     .remove();
}

// HARDCODED TODO
function removeWordFilter(li) {
    var filter = li.firstChild.innerHTML;
    selectedWord = undefined;
    removeFilter(filter);
    create_categories_dispatch();
    dataset = categories_dataset;
    update_bars(dataset);
    
    d3.selectAll(".word text").attr("opacity", 1);
}

// CATEGORIES - BAR CHART

var categories_full_dataset;
var categories_dataset;
var categories_dispatch;
var selectedCategories = [];

d3.json("../data/USvideo_count.json").then(function (data) {
    data = data.sort(function(a, b) {
                    return d3.ascending(a.category_title, b.category_title);
                });
    categories_full_dataset = d3.nest()
                                .key(function(d) {
                                    return d.category_title;
                                })
                                .rollup(function(leaves) {
                                    return d3.sum(leaves, function(d){ return d.count; });
                                })
                                .entries(data)
                                .map(function(d){
                                    return { category_title: d.key, count: d.value};
                                });
    categories_dataset = categories_full_dataset;
    create_categories_dispatch();
    gen_bars();
});

// TITLES - WORD CLOUD

var words_full_dataset, words_dataset; // word, count
var words_byword_dataset = new Map(); // word, {category_title, count}
var words_bycategory_full_dataset = new Map (); // category_title, {word, count}
var words_bycategory_dataset = new Map ();
var words_dispatch;
var selectedWord;

d3.json("../data/USword_count.json").then(function (data) {
    words_full_dataset = d3.nest()
                           .key(function(d) { return d.word; })
                           .rollup(function(leaves) {
                               return d3.sum(leaves, function(d) { return d.count; });
                             })
                           .entries(data)
                           .map(function(d) { return { word: d.key, count: d.value}; });
    words_dataset = words_full_dataset.slice(0,100);

    words_bycategory_full_dataset = d3.nest()
                                      .key(function(d) { return d.category_title; })
                                      .map(data);
    
    categories_full_dataset.forEach(function(d) {
        words_bycategory_dataset.set(d.category_title, words_bycategory_full_dataset.get(d.category_title).slice(0,100));
    })

    words_byword_dataset = d3.nest()
                                  .key(function(d) { return d.word; })
                                  .map(data);
    
    create_words_dispatch();    
    gen_cloud();
});


/*
remove all words uppercase
remove symbols: & % ( ) [ ] { } ( ) / $ # @ " etc
remove root words: the, and, in, is, at, of, on, for, etc (search who this words are)

*/
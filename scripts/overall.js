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


//////////////////////////////////////////////////////////////
//////////////////////// Set-Up //////////////////////////////
//////////////////////////////////////////////////////////////

var margin = { top: 40, right: 40, bottom: 40, left: 90 },
width = Math.min(700, window.innerWidth / 5.5) - margin.left - margin.right,
height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

//configs

var radarChartOptions_all = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 5000,
    levels: 6,
    roundStrokes: false,
    color: d3.scaleOrdinal().range([colors.get("light-yt")]),
    format: '.0f',
    unit: 'm'
};


// Draw the chart, get a reference the created svg element :


function gen_spider() {
    d3.selectAll(".spider > *").remove();
    var overall_selected_categories = [];
    var overall_selected_word = [];
    var colors_selected_categories = [];
    if ( selectedCategories.length == 0 && selectedWord == undefined){
        radarChartOptions_all.color = d3.scaleOrdinal().range([colors.get("light-yt")]);
        RadarChart(".spider", overall_dataset, radarChartOptions_all);
    }
    else if (selectedCategories.length == 0 && selectedWord != undefined){
        radarChartOptions_all.color = d3.scaleOrdinal().range([colors.get("light-yt")]);
        for (i=0; i< overall_byword_full_dataset.length; i++){
            if (overall_byword_full_dataset[i].name == selectedWord.text){
                overall_selected_word.push(overall_byword_full_dataset[i]);
            }
        }
        RadarChart(".spider", overall_selected_word, radarChartOptions_all);
    }
    else if (selectedCategories.length > 0 && selectedWord == undefined){
        for (i=0; i< overall_bycategory_full_dataset.length; i++){
            if (selectedCategories.includes(overall_bycategory_full_dataset[i].name)){
                overall_selected_categories.push(overall_bycategory_full_dataset[i])
                colors_selected_categories.push(colors.get(overall_bycategory_full_dataset[i].name))
            }
        }
        radarChartOptions_all.color = d3.scaleOrdinal().range(colors_selected_categories);
        RadarChart(".spider", overall_selected_categories, radarChartOptions_all);
    }
    else if (selectedCategories.length > 0 && selectedWord != undefined){
        for (i=0; i< overall_bycategory_byword_full_dataset.length; i++){
            if (selectedCategories.includes(overall_bycategory_byword_full_dataset[i].key)){
                for (j = 0; j < overall_bycategory_byword_full_dataset[i].values.length ; j++){
                    if( selectedWord.text == overall_bycategory_byword_full_dataset[i].values[j].key){
                        overall_selected_word.push({name: overall_bycategory_byword_full_dataset[i].values[j].key, axes: overall_bycategory_byword_full_dataset[i].values[j].value, color: colors.get(overall_bycategory_byword_full_dataset[i].key)});
                        colors_selected_categories.push(colors.get(overall_bycategory_byword_full_dataset[i].key))
                    }
                }
            }
        }
        console.log("overall_selected_word", overall_selected_word);
        RadarChart(".spider", overall_selected_word, radarChartOptions_all);
    }
}
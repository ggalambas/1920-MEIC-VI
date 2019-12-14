function gen_stars(){
    d3.select(".star-1 > *").remove();
    d3.select(".star-2  > *").remove();
    d3.select(".star-3  > *").remove();
    var provisory_dataset = [];
    var provisory_dataset2 = [];
    var provisory_dataset_final = [];
    var found_all_categories = 0;
    if (selectedCategories.length == 0 && selectedWord == undefined){
        d3.select('.star-1')
          .append("text")
          .attr("font-size", "10px")
          .attr("fill", "light-yt")
          .text(channels_bychannel_dataset[0].key)

        d3.select('.star-2')
        .append("text")
        .attr("font-size", "10px")
        .attr("fill", "light-yt")
        .text(channels_bychannel_dataset[1].key)


        d3.select('.star-3')
          .append("text")
          .attr("font-size", "10px")
          .attr("fill", "light-yt")
          .text(channels_bychannel_dataset[2].key)
    }
    else if (selectedCategories.length == 0 && selectedWord != undefined){
        for(i=0 ; i< channels_byword_bychannel_full_dataset.length; i++){
            if(channels_byword_bychannel_full_dataset[i].key == selectedWord.text){
                provisory_dataset = channels_byword_bychannel_full_dataset[i].values;
                provisory_dataset.sort(function(a, b){ return d3.descending(a.value, b.value); })
                d3.select('.star-1')
                .append("text")
                .attr("font-size", "10px")
                .attr("fill", "light-yt")
                .text(provisory_dataset[0].key)

                d3.select('.star-2')
                .append("text")
                .attr("font-size", "10px")
                .attr("fill", "light-yt")
                .text(provisory_dataset[1].key)


                d3.select('.star-3')
                .append("text")
                .attr("font-size", "10px")
                .attr("fill", "light-yt")
                .text(provisory_dataset[2].key)
            }
        }
    }
    else if (selectedCategories.length == 1 && selectedWord == undefined){
        for(i=0 ; i< channels_bycategory_bychannel_full_dataset.length; i++){
            if(selectedCategories.includes(channels_bycategory_bychannel_full_dataset[i].key)){
                console.log("dataaa", channels_bycategory_bychannel_full_dataset[i].values);
                provisory_dataset = channels_bycategory_bychannel_full_dataset[i].values;
                provisory_dataset.sort(function(a, b){ return d3.descending(a.value, b.value); })
                d3.select('.star-1')
                .append("text")
                .attr("font-size", "10px")
                .attr("fill", "light-yt")
                .text(provisory_dataset[0].key)

                d3.select('.star-2')
                .append("text")
                .attr("font-size", "10px")
                .attr("fill", "light-yt")
                .text(provisory_dataset[1].key)


                d3.select('.star-3')
                .append("text")
                .attr("font-size", "10px")
                .attr("fill", "light-yt")
                .text(provisory_dataset[2].key)
            }
        }
    }
    else if (selectedCategories.length == 1 && selectedWord != undefined){
        for(i=0 ; i< channels_bycategory_byword_bychannel_full_dataset.length; i++){
            if(selectedCategories.includes(channels_bycategory_byword_bychannel_full_dataset[i].key)){
                for(j=0 ; j< channels_bycategory_byword_bychannel_full_dataset[i].values.length; j++){
                    if(channels_bycategory_byword_bychannel_full_dataset[i].values[j].key == selectedWord.text){
                            provisory_dataset = channels_bycategory_byword_bychannel_full_dataset[i].values[j].values;
                            provisory_dataset.sort(function(a, b){ return d3.descending(a.value, b.value); });
                            d3.select('.star-1')
                            .append("text")
                            .attr("font-size", "10px")
                            .attr("fill", "light-yt")
                            .text(provisory_dataset[0].key)
        
                            d3.select('.star-2')
                            .append("text")
                            .attr("font-size", "10px")
                            .attr("fill", "light-yt")
                            .text(provisory_dataset[1].key)
        
        
                            d3.select('.star-3')
                            .append("text")
                            .attr("font-size", "10px")
                            .attr("fill", "light-yt")
                            .text(provisory_dataset[2].key)
                            }
                    }
                }
            }
        }
    else if (selectedCategories.length == 2 && selectedWord == undefined){
        for(i=0 ; i< channels_bycategory_bychannel_full_dataset.length; i++){
            if(selectedCategories.includes(channels_bycategory_bychannel_full_dataset[i].key)){
                if( found_all_categories == 0){
                    provisory_dataset = channels_bycategory_bychannel_full_dataset[i].values;
                }
                else{
                    provisory_dataset2 = channels_bycategory_bychannel_full_dataset[i].values;
                }
                found_all_categories += 1;
                if (found_all_categories == 2){
                    provisory_dataset_final = provisory_dataset.concat(provisory_dataset2);
                    provisory_dataset_final.sort(function(a, b){ return d3.descending(a.value, b.value); });
                    d3.select('.star-1')
                    .append("text")
                    .attr("font-size", "10px")
                    .attr("fill", "light-yt")
                    .text(provisory_dataset_final[0].key)

                    d3.select('.star-2')
                    .append("text")
                    .attr("font-size", "10px")
                    .attr("fill", "light-yt")
                    .text(provisory_dataset_final[1].key)


                    d3.select('.star-3')
                    .append("text")
                    .attr("font-size", "10px")
                    .attr("fill", "light-yt")
                    .text(provisory_dataset_final[2].key)
                    }
            }
        }
    }
    else if (selectedCategories.length == 2 && selectedWord != undefined){
        for(i=0 ; i< channels_bycategory_byword_bychannel_full_dataset.length; i++){
            if(selectedCategories.includes(channels_bycategory_byword_bychannel_full_dataset[i].key)){
                found_all_categories += 1;
                for(j=0 ; j< channels_bycategory_byword_bychannel_full_dataset[i].values.length; j++){
                    if(channels_bycategory_byword_bychannel_full_dataset[i].values[j].key == selectedWord.text){
                        if( found_all_categories == 1){
                            provisory_dataset = channels_bycategory_byword_bychannel_full_dataset[i].values[j].values;
                        }
                        else{
                            provisory_dataset2 = channels_bycategory_byword_bychannel_full_dataset[i].values[j].values;
                        }
                        if (found_all_categories == 2){
                            provisory_dataset_final = provisory_dataset.concat(provisory_dataset2);
                            provisory_dataset_final.sort(function(a, b){ return d3.descending(a.value, b.value); });
                            d3.select('.star-1')
                            .append("text")
                            .attr("font-size", "10px")
                            .attr("fill", "light-yt")
                            .text(provisory_dataset_final[0].key)
        
                            d3.select('.star-2')
                            .append("text")
                            .attr("font-size", "10px")
                            .attr("fill", "light-yt")
                            .text(provisory_dataset_final[1].key)
        
        
                            d3.select('.star-3')
                            .append("text")
                            .attr("font-size", "10px")
                            .attr("fill", "light-yt")
                            .text(provisory_dataset_final[2].key)
                            }
                    }
                }
            }
        }
    }
}
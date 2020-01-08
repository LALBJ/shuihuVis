//添加绘制地图的svg
//var h = 2 * window.innerHeight / 3.5;
var h = $(".row2").innerHeight();

var mapsvg = d3.select(".map")
    .append("svg")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("class", "mapSvg");

//Define map projection
var projection = d3.geoMercator()
    .translate([-3300, 1450])
    .scale([1900]);

//Define path generator
var path = d3.geoPath().projection(projection);
//为了避免重复读取csv定义存储数据的数组
var eventData = [];

var peopleLocationData = [];

var peopleTimeData = [];

var eventLocationData = [];

var upDiv = document.querySelector('.hero');

//var rightDiv = document.querySelector('.list');

var timeForTextArray = [];

var dataAll;
//设置清除定时器的变量
var p_timer;
/*
 var z = d3.scaleLinear()
        .range(["white", "steelblue"])
        .domain([0, 13]);*/
//处理得到timeForTextArray的数据
d3.csv("js/people_time.csv", function (data) {
    dataAll = data;
    var tmp = data[0];
    var i = 0;
    for (var x in tmp) {
        timeForTextArray[i++] = x;
    }
    timeForTextArray.shift();
})

//绘制热力图的函数
function drawHeatMap() {

    d3.csv("js/eventYearsHeat.csv", function (data) {
        var heatmap = h337.create({
            container: document.querySelector('.map'),
            maxOpacity: .9,
            radius: 10,
            blur: .90,
        });

        for (var i = 0; i < data.length; i++) {
            var tmp = data[i];
            var location = [tmp['Longitude'], tmp['Latitude']];
            var prolocation = projection(location);
            heatmap.addData({ x: prolocation[0], y: prolocation[1], value: tmp['1117'], radius: 20 });
        }
        //var w = $(".map").innerWidth();
        var left = document.getElementsByClassName("mapSvg")[0].offsetLeft;
        console.log($("canvas"))
        $("canvas").css("left", "15px");
    })

}

//绘制地图的函数
function drawLocation(data) {
    //存放地点的对象
    var heatObject = {};
    d3.csv("js/event_location.csv", function (d) {
        delete d.columns;
        for (var x in d) {
            if (d[x]["地点"] in heatObject) {
                heatObject[d[x]["地点"]] += 1;
            }
            else {
                heatObject[d[x]["地点"]] = 1
            }
        }
        console.log(data)
        for (var i = 0; i < data.length; i++) {
            data[i]["Count"] = heatObject[data[i]["Name"]]
        }
        //z.domain([0, d3.max(data, function(d){ return +d.Count; })]);
        //mapsvg.selectAll("svg+circle").remove();

        mapsvg.selectAll("svg+circle")
            .data(data)
            .enter()
            .append("circle")
            .on('click', function(d){
                var widthOffset = parseInt($(".chapHero").css("width"));
                console.log(widthOffset)
                var heightOffset = parseInt($(".toolbar").css("height"));
                var leftOffset = projection([d.Longitude, d.Latitude])[0] + widthOffset;
                var topOffset = projection([d.Longitude, d.Latitude])[1] + heightOffset;
                $(".eventTip").css({
                    "left": leftOffset,
                    "top": topOffset
                  }).show();
                goPage(1,10);
                console.log(projection([d.Longitude, d.Latitude])[0]);
            })
            .attr("id", "eventCircle")
            .attr("cx", function (d) {
                return projection([d.Longitude, d.Latitude])[0];
            })
            .attr("cy", function (d) {
                return projection([d.Longitude, d.Latitude])[1];
            })
            .attr("r", 3)
            .style("fill", "rgb(188, 61, 88)")
            .append("title")
            
            .text(function (d) {
                return d.Name;
            });
    })

    /*
    //尝试画外环
    mapsvg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("id", "markerC")
    .attr("cx", function(d) {
    return projection([d.Longitude, d.Latitude])[0];
    })
    .attr("cy", function(d) {
    return projection([d.Longitude, d.Latitude])[1];
    })
    .attr("fill-opacity", "0")
    .attr("stroke-width", "1")
    .attr("stroke", "white");*/
};
/*
//设置点的闪烁
var scale = d3.scaleLinear();
scale.domain([0, 1000, 2000])
.range([0, 1, 0]);
var start = Date.now();
d3.timer(function(){
var s1 = scale((Date.now() - start)%2000);

mapsvg.selectAll("circle")
.attr("fill-opacity", s1);
})*/

var mapNew = mapsvg.append("g")
    .attr("id", "map")
    //.attr("stroke", "white")
    .style("height", "600px")
    .style("width", "1150px")
//.attr("stroke-width", 1);

//定义绘制路线组
var mline = mapsvg.append("g")
    .attr("id", "moveto")
    .attr("stroke", "#FFF")
    .attr("stroke-width", 1.5)
    .attr("fill", "#FFF");

//定义不知道是什么的东西
var marker = mapsvg.append("defs")
    .append("marker")
    .attr("id", "pointer")
    .attr("viewBox", "0 0 12 12") // 可见范围
    .attr("markerWidth", "12") // 标记宽度
    .attr("markerHeight", "12") // 标记高度
    .attr("orient", "auto") //
    .attr("markerUnits", "strokeWidth") // 随连接线宽度进行缩放
    .attr("refX", "6") // 连接点坐标
    .attr("refY", "6");
marker.append("circle")
    .attr("cx", "6")
    .attr("cy", "6")
    .attr("r", "3")
    .attr("fill", "white");

marker.append("circle")
    .attr("id", "markerC")
    .attr("cx", "6")
    .attr("cy", "6")
    .attr("r", "5")
    .attr("fill-opacity", "0")
    .attr("stroke-width", "1")
    .attr("stroke", "white");
//绘制英雄行为路线的函数
var moveto = function () {
    //console.log("click")
    //随时间推移进行地图绘制的函数
    p_timer = window.setInterval("timelyFun()", 300);
}

//Load in GeoJSON data
//绘制地图
d3.json("js/china.json", function (json) {
    //Bind data and create one path per GeoJSON feature
    mapNew.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "rgb(208, 207, 212)");

    //为各个省份添加上名称
    mapNew.selectAll("text")
        .data(json.features)
        .enter()
        .append("text")
        //设置各个文本（省份名称）显示的文字
        .attr("transform",function(d,i)
        {
             if(d.properties.id =="20") //河北
            {
                return "translate("+(path.centroid(d)[0]-20)+","+ (path.centroid(d)[1]+20)+")";
            }    			
                return "translate("+(path.centroid(d)[0]-10)+","+ path.centroid(d)[1]+")";    			
        })   
        
         /* 	.attr("x", function(d) { 
                     return (path.centroid(d)[0]-10);
                 
             })
           .attr("y", function(d) { 
           
               if(d.properties.id =="20") //河北
                 {
                     return (path.centroid(d)[1]+30);
                 }
                   return (path.centroid(d)[1]);
           
            })   */
         //显示省名
        .text(function(d)
            {
            return d.properties.name;
            })
        .attr("font-size",12);


    //Load in cities data
    d3.csv("js/event.csv", function (data) {
        eventData = data;
        drawLocation(data);
    });

    d3.csv("js/people_location.csv", function (data) {
        peopleLocationData = data;
        var html = "";
        var size = peopleLocationData.length;
        for (var i = 0; i < size; i++) {
            var title = peopleLocationData[i]["事件"];
            if ((i + 1) % 3 == 0) {
                html += "<div class='col-md-4 heroli'><input type='checkbox' class='peoplecheckbox ' onclick='' value=" + title + ">" +
                    title + "&nbsp</div></div>";
            } else if ((i + 1) % 3 == 1) {
                html += "<div class='row'><div class='col-md-4'><input type='checkbox' class='peoplecheckbox ' onclick='' value=" + title + ">" +
                    title + "&nbsp</div>";
            } else {
                html += "<div class='col-md-4 heroli'><input type='checkbox' class='peoplecheckbox ' onclick='' value=" + title + ">" +
                    title + "&nbsp</div>";
            }
        }
        upDiv.innerHTML = html;

    });

    d3.csv("js/event_location.csv", function (data) {
        eventLocationData = data;
    });
});

function findPeopleLocationData(name) {
    var size = peopleLocationData.length;
    for (var i = 0; i < size; ++i) {
        if (peopleLocationData[i]["事件"] == name) {
            return peopleLocationData[i];
        }
    }
}

function findPeopleTimeData(name) {
    var size = peopleTimeData.length;
    for (var i = 0; i < size; ++i) {
        if (peopleTimeData[i]["renwu"] == name) {
            return peopleTimeData[i];
        }
    }
}

function findLocationFromEvent(event) {
    var size = eventLocationData.length;
    for (var i = 0; i < size; ++i) {
        if (eventLocationData[i]["事件"] == event) {
            return eventLocationData[i]["地点"];
        }
    }
}

//每月发生事件的次数以及出现的人物数
d3.csv("js/people_time.csv", function (data) {

    var columns = data.columns;
    columns.shift();

    var eventArray = new Array();
    for (var i = 0; i < columns.length; i++) {
        eventArray[i] = {};
    }
    for (var i = 0; i < columns.length; i++) {
        eventArray[i]["date"] = columns[i].substring(0, 7);
        eventArray[i]["times"] = 1;
    }

    var peopleArray = new Array();
    for (var i = 0; i < columns.length; i++) {
        peopleArray[i] = {};
    }
    for (var i = 0; i < columns.length; i++) {
        peopleArray[i]["date"] = columns[i].substring(0, 7);
        peopleArray[i]["times"] = 1;
    }

    //对数据进行过滤操作即清楚掉重复数据
    var eventArrayFilter = [];
    var currentDate = 0;
    eventArrayFilter.push(eventArray[0]);
    for (var i = 1; i < columns.length; i++) {
        if (eventArray[i]["date"] == eventArrayFilter[currentDate]["date"]) {
            eventArrayFilter[currentDate]["times"] += 1;
        } else {
            eventArrayFilter.push(eventArray[i]);
            currentDate++;
        }

    }

    //处理得到每月人物出现次数的数据
    //peopleTimes为存放每月人物出现次数数据的对象
    var peopleTimes = {};
    for (var i = 0; i < columns.length; i++) {
        peopleTimes[columns[i].substring(0, 7)] = 0;
    }
    for (var i = 0; i < data.length; i++) {
        for (var x in data[i]) {
            if (data[i][x] != "") { peopleTimes[x.substring(0, 7)] += 1; }
        }
    }
})

//暂停函数
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

//绘制显示时间的文本框
function drawTimeText(neiRong, didian, shijian) {
    // console.log("?????")
    // $("#timeText").show();
    // $(".neiRong").text(neiRong);
    // $(".didian").text(didian);
    // $(".shijian").text(shijian);
    mapsvg.select("#timeTextN")
        .remove();
    mapsvg.append("text")
        .text(neiRong + "\n" + didian + "\n" + shijian)
        .attr("height", 200)
        .attr("size", 200)
        .attr("id", "timeTextN")
        .attr("x", 720)
        .attr("y", 300);
}
var count = 0;
/*
//随时间推移进行的函数
function funcTest(){
//每隔3秒执行一次timelyFun方法
window.setInterval("timelyFun()",300);
}
window.onload = funcTest;*/
var countD = 0;
var arrayForPath = [];
var controlCount = 0;
function timelyFun() {

    var peopleSelect = getPeopleSelect();
    if (count == timeForTextArray.length) {
        return;
    } else {
        var eventDe = dataAll[peopleSelect][timeForTextArray[count++]];
        var LocationDe = "";
        for (var i = 0; i < eventLoaction.length; i++) {
            if (eventDe == "") { }
            else {
                if (eventLoaction[i]["事件"] == eventDe) {
                    LocationDe = eventLoaction[i]["地点"]
                }
            }

        }
        var Lat = "";
        var Lon = "";
        for (var i = 0; i < eventData.length; i++) {
            if (eventData[i]["Name"] == LocationDe) {
                Lat = eventData[i]["Latitude"];
                Lon = eventData[i]["Longitude"];

                arrayForPath[countD] = { Time: "", Lat: "", Lon: "" };
                arrayForPath[countD].Time = timeForTextArray[count];
                arrayForPath[countD].Lat = Lat;
                arrayForPath[countD++].Lon = Lon;
            }
        }
        //绘制起始点
        if (arrayForPath.length == 1 && !controlCount++) {
            var pf = {
                x: projection([arrayForPath[0]["Lon"], arrayForPath[0]["Lat"]])[0],
                y: projection([arrayForPath[0]["Lon"], arrayForPath[0]["Lat"]])[1]
            };
            //绘制起始点
            mline.append("circle")
                .attr("cx", pf.x)
                .attr("cy", pf.y)
                .attr("r", "4");
            mline.append("circle")
                .attr("cx", pf.x)
                .attr("cy", pf.y)
                .attr("r", "8")
                .attr("fill-opacity", "0")
                .attr("stroke-width", "1.5")
                .attr("stroke", "white")
        }
        if (arrayForPath.length >= 2) {
            var pf = {
                x: projection([arrayForPath[0]["Lon"], arrayForPath[0]["Lat"]])[0],
                y: projection([arrayForPath[0]["Lon"], arrayForPath[0]["Lat"]])[1]
            };
            var pt = {
                x: projection([arrayForPath[1]["Lon"], arrayForPath[1]["Lat"]])[0],
                y: projection([arrayForPath[1]["Lon"], arrayForPath[1]["Lat"]])[1]
            };
            var distance = Math.sqrt((pt.x - pf.x) ** 2 + (pt.y - pf.y) ** 2);
            mline.append("line")
                .attr("x1", pf.x)
                .attr("y1", pf.y)
                .attr("x2", pt.x)
                .attr("y2", pt.y)
                .attr("marker-end", "url(#pointer)")
                .style("stroke-dasharray", " " + distance + ", " + distance + " ")
                .transition()
                .duration(distance * 30)
                .styleTween("stroke-dashoffset", function () {
                    return d3.interpolateNumber(distance, 0);
                })

            mline.append("circle")
                .attr("cx", pf.x)
                .attr("cy", pf.y)
                .attr("r", 3)
                .transition()
                .duration(distance * 30)
                .attr("transform", "translate(" + (pt.x - pf.x) + "," + (pt.y - pf.y) + ")")
                .remove();
            arrayForPath.shift();
            countD--;
        }
        drawTimeText(timeForTextArray[count++], eventDe, LocationDe)
    }
    var textKongjian = document.getElementById("timeTextN");
    var varibleT = textKongjian.innerHTML;
    if (varibleT.substring(0, 1) == "u") {
        d3.select("#timeTextN").remove();
        window.clearInterval(p_timer);
    }
}
//获取当前input所传输的选中的人
function getPeopleSelect() {
    var obj = document.getElementsByClassName("peoplecheckbox");
    for (k in obj) {
        if (obj[k].checked) {
            return k;
        }
    }
}
//获取该人物当月的事件
function getPeopleEvent(time, people) {
    return people[time];
}
//查找事件发生的地点
var eventLoaction;
d3.csv("js/event_location.csv", function (data) {
    eventLoaction = data;
})

//为btn添加控制地图的事件
$(".btn-draw").on("click", function () { moveto(); });
$(".btn-on").on("click", function () {
    $(".btn-off").removeClass("active");
    drawHeatMap();

});
$(".btn-off").on("click", function () {
    d3.select(".btn-off").classed("active");
    $(".btn-on").removeClass("active");
    d3.selectAll("canvas")
        .remove();
})
$(".btn-pause").on("click", function () { 
    console.log("clickle");
    window.clearInterval(p_timer); 
});
//为地图上的点添加点击触发相关时间的按钮
$("#eventCircle").on("click", function(){
    console.log(this.innerHTML);
})
//为框上退出图标添加退出事件
$(".fa-window-close").on("click", function(){
    $(".eventTip").css("display", "none");
})
//调用分页算法
function goPage(pno,psize) {
            var itable = document.getElementById("detailData");
            var num = itable.rows.length;//记录所有的行数
            console.log(num);
            var totalPage=0;//总页数
            var pageSize = psize;//每页显示行数
            //总共分几页
            if(num/pageSize>parseInt(num/pageSize)){
                totalPage=parseInt(num/pageSize)+1;
            }else {
                totalPage=parseInt(num/pageSize);
            }
            var currentPage = pno;//当前页数
            var startRow = (currentPage-1) * pageSize+1;
            var endRow = currentPage*pageSize;//结果显示行40
            endRow = (endRow>num)?num:endRow;
            console.log(endRow);
            for(var i=1;i<(num+1);i++){
                var irow = itable.rows[i-1];
                if(i>=startRow && i<=endRow){
                    irow.style.display="block";
                }else {
                    irow.style.display="none";
                }
            }
            var pageEnd = document.getElementById("pageEnd");
            var pageEnd = document.getElementById("pageEnd");
            //var tempStr = "共"+num+"条记录 分"+totalPage+"页 当前第"+currentPage+"页";
            var tempStr = "";
            if(currentPage>1){
                tempStr += "<a href=\"#\" onClick=\"goPage("+(1)+","+psize+")\">首页</a>";
                tempStr += "<a href=\"#\" onClick=\"goPage("+(currentPage-1)+","+psize+")\"><上一页</a>"
            }else{
                tempStr += "首页";
                tempStr += "<上一页";
            }
    

            if(currentPage<totalPage){
                tempStr += "<a href=\"#\" onClick=\"goPage("+(currentPage+1)+","+psize+")\">下一页></a>";
                tempStr += "<a href=\"#\" onClick=\"goPage("+(totalPage)+","+psize+")\">尾页</a>";
            }else{
                tempStr += "下一页>";
                tempStr += "尾页";
            }
            document.getElementById("barcon").innerHTML = tempStr;
        }
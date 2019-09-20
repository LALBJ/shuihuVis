d3.csv("js/timeline/people_time.csv", function (data) {

	var w = window.innerWidth;
	var h = window.innerHeight / 3.5 - 50;
	var padding = 40;

	var columns = data.columns;
	columns.shift();

	var parseDate = d3.timeParse("%b %Y");

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
	for (var i = 0; i < eventArrayFilter.length; i++) {
		var month = eventArrayFilter[i].date.substring(5, 7);
		switch (month) {
			case "01": month = "Jan";
				break;
			case "02": month = "Feb";
				break;
			case "03": month = "Mar";
				break;
			case "04": month = "Apr";
				break;
			case "05": month = "May";
				break;
			case "06": month = "Jun";
				break;
			case "07": month = "Jul";
				break;
			case "08": month = "Aug";
				break;
			case "09": month = "Sep";
				break;
			case "10": month = "Oct";
				break;
			case "11": month = "Nov";
				break;
			case "12": month = "Dec";
				break;
		}
		eventArrayFilter[i]["date"] = parseDate(month + " " + eventArrayFilter[i].date.substring(0, 4));
	}
	//console.log(eventArrayFilter);

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
	//console.log(peopleTimes);
	//绘制每月发生事件的次数
	var xScaleBrush = d3.scaleTime()
		.domain(d3.extent(eventArrayFilter, function (d) { return d.date; }))
		.range([padding, w - padding])
		.clamp(true);

	//console.log(xScaleBrush.domain())

	var yScaleBrush = d3.scaleLinear()
		.domain([0,
			d3.max(eventArrayFilter, function (d) { return d.times; })])
		.range([h - padding, 0]);

	var xAxisBrush = d3.axisBottom(xScaleBrush)
		.tickFormat(d3.timeFormat(parseDate));
	//.scale()

	var yAxisBrush = d3.axisLeft()
		.scale(yScaleBrush);

	var lineEvent = d3.line()
		.defined(function (d) { return d.times > 0; })
		.x(function (d) { return xScaleBrush(d.date) })
		.y(function (d) { return yScaleBrush(d.times) - 10; });

	var svg = d3.select(".timeline")
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	var eventBrush = svg.append("g")
		.attr("class", "chart")
		.selectAll("lineEvent")
		.data([eventArrayFilter]);
	console.log(eventArrayFilter);

	/*.attr('class', 'pointer')
	.attr('transform', d => _point1(d));*/

	//.attr("d", lineEvent);

	var xGroup = svg.append("g")
		.attr("class", "axisBrush")
		.attr("transform", "translate(0," + (h - padding + 10) + ")")
		.call(xAxisBrush);

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",10)")
		.call(yAxisBrush);

	var peopleTimesArray = new Array();
	var numberFor1 = 0;
	for (var x in peopleTimes) {
		peopleTimesArray[numberFor1] = {};
		peopleTimesArray[numberFor1]['date'] = x;
		peopleTimesArray[numberFor1++]['times'] = peopleTimes[x];
	}
	peopleTimesArray.pop();
	//console.log(peopleTimesArray);
	for (var i = 0; i < peopleTimesArray.length; i++) {
		var month = peopleTimesArray[i].date.substring(5, 7);
		switch (month) {
			case "01": month = "Jan";
				break;
			case "02": month = "Feb";
				break;
			case "03": month = "Mar";
				break;
			case "04": month = "Apr";
				break;
			case "05": month = "May";
				break;
			case "06": month = "Jun";
				break;
			case "07": month = "Jul";
				break;
			case "08": month = "Aug";
				break;
			case "09": month = "Sep";
				break;
			case "10": month = "Oct";
				break;
			case "11": month = "Nov";
				break;
			case "12": month = "Dec";
				break;
		}
		peopleTimesArray[i]["date"] = parseDate(month + " " + peopleTimesArray[i].date.substring(0, 4));
	}

	//绘制人物出现次数的y轴
	yScalePeople = d3.scaleLinear()
		.domain([
			d3.min(peopleTimesArray, function (d) { return d.times; }),
			d3.max(peopleTimesArray, function (d) {
				return d.times;
			})
		])
		.range([h - padding, 0]);

	yAxisPeople = d3.axisRight()
		.scale(yScalePeople);

	svg.append("g")
		.attr("class", "axisPeople")
		.attr("transform", "translate(" + (w - padding) + ",10)")
		.call(yAxisPeople);

	//绘制brush的x轴
	var x2 = d3.scaleTime()
		.range([padding, w - padding])
		.domain(xScaleBrush.domain());
	var xAxis2 = d3.axisBottom(x2)
		.tickSize(-50)
		.tickFormat(function () { return null; });

	//绘制人物出现次数与时间的折线图
	var linePeople = d3.line()
		.defined(function (d) { return d.times >= 0; })
		.x(function (d) { return xScaleBrush(d.date) })
		.y(function (d) { return yScalePeople(d.times) - 10; });

	var peopleBrush = svg.append("g")
		.attr("class", "chart")
		.selectAll("linePeople")
		.data([peopleTimesArray]);
	//.attr("d", linePeople);

	//添加brush操作
	var t = d3.transition()
		.duration(500)
		.ease(d3.easeLinear);

	svg.append("clipPath")
		.attr("id", "clip")
		.append("rect")
		.attr("width", w)
		.attr("height", h);

	var enterEvent = eventBrush.enter();
	var enterPeople = peopleBrush.enter();
	var exitEvent = eventBrush.exit();
	var exitPeople = peopleBrush.exit();

	var pathEvent = enterEvent.append("path")
		.attr("clip-path", "url(#clip)")
		.attr("class", "lineEvent")
		.attr("d", lineEvent)
		.transition(t);
	exitEvent.remove();

	var pathPeople = enterPeople.append("path")
		.attr("clip-path", "url(#clip)")
		.attr("class", "linePeople")
		.attr("d", linePeople)
		.transition(t);
	exitPeople.remove();

	var brush = d3.brushX()
		.extent([[40, 0], [w - padding, 135]])
		.on("brush end", brushed);

	/*
var svgB = d3.select("#brush")
  .append("svg")
  .attr("width", w)
  .attr("height", 80)
  .append("g")
	  .attr("transform", "translate(0, 0)");

svgB.append("g")
.attr("class", "axis axis--grid")
.attr("transform", "translate(0,50)")
.call(xAxis2);

svgB.append("g")
.attr("class", "axis axis--x")
.attr("transform", "translate(0, 50)")
.call(d3.axisBottom(x2).tickFormat(d3.timeFormat(parseDate)));*/

	svg.append("g")
		.attr("class", "brush")
		.call(brush);

	//设置动态标签
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function (d) {
			return "<strong>Name</strong>";
		})

	svg.call(tip)


	//绘制点
	svg.selectAll('circleE')
		.data(eventArrayFilter)
		.enter()
		.append('circle')
		.attr('r', '2px')
		.attr('cx', d => xScaleBrush(d.date))
		.attr('cy', d => yScaleBrush(d.times) - 10)
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

		svg.selectAll('circleP')
		.data(peopleTimesArray)
		.enter()
		.append('circle')
		.attr('r', '2px')
		.attr('cx', d => xScaleBrush(d.date))
		.attr('cy', d => yScalePeople(d.times) - 10)
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);


	function brushed() {
		var s = d3.event.selection || xScaleBrush.range();
		xScaleBrush.domain(s.map(x2.invert, x2));
		d3.select(".axisBrush").call(xAxisBrush);
		d3.select(".lineEvent").attr("d", lineEvent);
		d3.select(".linePeople").attr("d", linePeople);
		d3.selectAll('circle')
			.remove();
		svg.selectAll('circleE')
			.data(eventArrayFilter)
			.enter()
			.append('circle')
			.attr('r', '2px')
			.attr('cx', d => {
				if (xScaleBrush(d.date) == padding) {
					return null;
					//continue;
				}

				return xScaleBrush(d.date);
			})
			.attr('cy', d => yScaleBrush(d.times) - 10)
			.on('mouseover', tip.show)
			//可以根据数据渲染内容的一种写法.on('mouseover', d => tip.show("<strong>Name</strong>",this))
			.on('mouseout', tip.hide);
			svg.selectAll('circleP')
			.data(peopleTimesArray)
			.enter()
			.append('circle')
			.attr('r', '2px')
			.attr('cx', d => xScaleBrush(d.date))
			.attr('cy', d => yScalePeople(d.times) - 10)
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);
	}
})
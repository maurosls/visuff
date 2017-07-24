'use strict';

var funcaots = {};
    
funcaots.margins = {top: 50, bottom: 50, left: 50, right: 100};
funcaots.cw = 600;
funcaots.ch = 400;
funcaots.xScale = undefined;
funcaots.yScale = undefined;
funcaots.xAxis  = undefined;
funcaots.yAxis  = undefined;

funcaots.legendWidth = 100;
funcaots.legendHeight = 100;
funcaots.legendGroup = undefined;
funcaots.dominioY = 100;
funcaots.rangeY = 400;


funcaots.appendSvg = function (div) 
{
    var node = d3.select(div).append('svg')
        .attr('width', funcaots.cw + funcaots.margins.left + funcaots.margins.right)
        .attr('height', funcaots.ch + funcaots.margins.top + funcaots.margins.bottom);
    return node;
}
funcaots.appendChartGroup = function (svg)
{
    var g = svg.append('g')
        .attr('width', funcaots.cw)
        .attr('height', funcaots.ch)
        .attr('transform', 'translate('+ funcaots.margins.left +','+ funcaots.margins.top +')' );  
    return g;
}
funcaots.createAxes = function(svg, maxX, maxY, ord, tickts)
{
    if(ord == 1){
        funcaots.xScale = d3.scaleBand().domain(['Jan','Fev','Mar','Apr','May','Jun','Jul','Aug']).range([0,560]);
    }else{
        funcaots.xScale = d3.scaleLinear().domain([0, maxX ]).range([0,funcaots.cw]);
    }
    funcaots.yScale = d3.scaleLinear().domain([maxY ,0]).range([0,funcaots.ch]);
    
    var xAxisGroup = svg.append('g')
        .attr('class', 'xAxis')
        //.attr('ticks',7)
        .attr('transform', 'translate('+ funcaots.margins.left +','+ (funcaots.ch+funcaots.margins.top) +')');
    var yAxisGroup = svg.append('g')
        .attr('class', 'yAxis')
        .attr('transform', 'translate('+ funcaots.margins.left +','+ funcaots.margins.top +')');
    funcaots.xAxis = d3.axisBottom(funcaots.xScale);
    funcaots.yAxis = d3.axisLeft(funcaots.yScale);
    funcaots.xAxis.ticks(tickts);
    xAxisGroup.call(funcaots.xAxis);
    yAxisGroup.call(funcaots.yAxis);
}     

funcaots.appendPoints = function(svg,qtd,cor)
{
    var dataset = funcaots.createPointsData(svg,qtd);
    
    var line = d3.line()
        .x(function(d){return d.x;})
        .y(function(d){return funcaots.yScale(d.y);}) 
        //.interpolate("linear"); 
        .curve(d3.curveBasis);
    
    svg.append("path") 
        .transition()
        .delay(200)
        .attr("d", line(dataset))
        .style("stroke-width", 1)
        .style("stroke", cor)
        .style("fill", "none");
    return line;   
}
funcaots.appendPointsReais = function(svg, dataset, cor)
{
    //var dataset = myApp.createPointsData(svg,qtd);
    var line = d3.line()
        .x(function(d){return d.x;})
        .y(function(d){return funcaots.yScale(d.y);})
        //.interpolate("linear"); 
        .curve(d3.curveBasis);
    
    svg.append("path")
        .attr("d", line(dataset))
        .style("stroke-width", 2)
        .style("stroke", cor)
    .transition()
        .delay(100)
        .style("fill", "none");
    
    return line;   
}
funcaots.createPointsData = function(div, qtd)
{
    var points = []; 
    for(var id = 0; id<qtd ;id++)
        {
            var aux = id*11;
            var y = Math.random();
            var x = aux;
            var c = {'x':aux,'y':y};
            points.push(c);
        }
    return points;
}

funcaots.appendLegendGroup = function(svg)
{
    
    funcaots.legendGroup = svg.append('g')
        .attr('class', 'legendGroup')
        .attr('transform', 'translate('+ (funcaots.margins.left + funcaots.ch + 200)+','+40+')');
}
funcaots.appendLegend = function(dataset)
{
    var elements = [];
    for (var i = 0; i < dataset.length; i++){
        var element = {'x': 10,'y':i*20,'color':dataset[i].cor,'name':dataset[i].nome};
        elements.push(element);
    }
    var rect = funcaots.legendGroup.selectAll('rect').data(elements);
    rect.enter()
        .append('rect')
        .attr('width',10)
        .attr('height',10)
        .attr('x',function(d){return d.x;})
        .attr('y',function(d){return d.y;})
        .attr('fill',function(d){return d.color;})
    
    rect.exit()
        .remove();
    
    var text = funcaots.legendGroup.selectAll('text').data(elements);
    text.enter()
        .append('text')
        .text(function(d){return d.name;})
        .attr('x',function(d){return d.x + 20;})
        .attr('y',function(d){return d.y+10;})
    text.exit()
        .remove();
}

function timeseries(ConfigAxes, dados){
    
    funcaots.ch = ConfigAxes.ch; 
    funcaots.cw = ConfigAxes.cw;
    
    d3.select("svg").remove();
    var svg = funcaots.appendSvg(ConfigAxes.div);
    var g = funcaots.appendChartGroup(svg); 

    if(ConfigAxes.eixo == 1){
        funcaots.createAxes(svg, ConfigAxes.maxX, ConfigAxes.maxY ,ConfigAxes.ord , ConfigAxes.ticks);
    }
    
    if(dados.tipo == 1){
        for(var i = 0; i < dados.dataset.length; i++){ 
            funcaots.appendPoints(g, dados.dataset[i].qtd, dados.dataset[i].cor);  
        }
    }else{
        for(var i = 0 ; i < dados.dataset.length; i++){
            funcaots.appendPointsReais(g, dados.dataset[i].dataset, dados.dataset[i].cor, dados.dataset[i].ordem);         
        }
    }
    if(ConfigAxes.legenda == 1){
        funcaots.appendLegendGroup(svg);
        funcaots.appendLegend(dados.dataset);
    }
};
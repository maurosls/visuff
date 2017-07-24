'use strict';

var funcao = {};
    
funcao.margins = {top: 50, bottom: 50, left: 50, right: 100};
funcao.cw = 600;
funcao.ch = 400;
funcao.xScale = undefined;
funcao.yScale = undefined;
funcao.xAxis  = undefined;
funcao.yAxis  = undefined;

funcao.legendWidth = 100;
funcao.legendHeight = 100;
funcao.legendGroup = undefined;
funcao.dominioY = 100;
funcao.rangeY = 400;
    
        
funcao.appendSvg = function (div) 
{
    var node = d3.select(div).append('svg')
        .attr('width', funcao.cw + funcao.margins.left + funcao.margins.right)
        .attr('height', funcao.ch + funcao.margins.top + funcao.margins.bottom);
    return node;
}
funcao.appendChartGroup = function (svg)
{
    var g = svg.append('g')
        .attr('width', funcao.cw)
        .attr('height', funcao.ch)
        .attr('transform', 'translate('+ funcao.margins.left +','+ funcao.margins.top +')' );  
    return g;
}
funcao.createAxes = function(svg, maxX, maxY, ord , tickts)
{
    if(ord == 1){
        funcao.xScale = d3.scaleBand().domain(['Jan','Fev','Mar','Apr','May','Jun','Jul','Aug']).range([0,560]);
    }else{
        funcao.xScale = d3.scaleLinear().domain([0, maxX ]).range([0,myApp.cw]);
    }
    funcao.yScale = d3.scaleLinear().domain([maxY ,0]).range([0,funcao.ch]);
    
    var xAxisGroup = svg.append('g')
        .attr('class', 'xAxis')
        //.attr('ticks',7)
        .attr('transform', 'translate('+ funcao.margins.left +','+ (funcao.ch+funcao.margins.top) +')');
    var yAxisGroup = svg.append('g')
        .attr('class', 'yAxis')
        .attr('transform', 'translate('+ funcao.margins.left +','+ funcao.margins.top +')');
    funcao.xAxis = d3.axisBottom(funcao.xScale);
    funcao.yAxis = d3.axisLeft(funcao.yScale);
    funcao.xAxis.ticks(tickts);
    xAxisGroup.call(funcao.xAxis);
    yAxisGroup.call(funcao.yAxis);
}  

funcao.createCirclesData = function(n,raio)
{
    var circles = []; 
    for(var id=0; id<n; id++)
    {
        var x = Math.random();
        var y = Math.random();
        var r = raio;
        var c = {'cx': x, 'cy': y, 'r': r};
        circles.push(c);  
    }
    return circles;
}
funcao.appendCircles = function(svg,qtd,cor,raio)
{
    var dataset = funcao.createCirclesData(qtd,raio);        
    var circle = svg.selectAll('.circle')
        .data(dataset)
        .enter()
        .append('circle')
        .transition()
        .delay(100)
        .attr('cx', function(d){ return funcao.xScale(d.cx); })
        .attr('cy', function(d){ return funcao.yScale(d.cy); })
        .attr('r' , function(d){ return d.r;  })
        
        .attr('opacity',0.8)
        .transition()
        .delay(120)
        //.style('fill', 'rgb(150,150,190)');
        .style('fill', cor)
        ;
        
    return circle;
}
funcao.appendCirclesReais = function(div, circles, cor, raio) //mesma função mas pegando o dataSet como parâmetro
{
    var circle = div.selectAll('.circle')
        .data(circles)
        .enter()
        .append('circle')
    .transition()
        .delay(100)
        .attr('cx', function(d){ return funcao.xScale(d.cx); })
        .attr('cy', function(d){ return funcao.yScale(d.cy); })
        .attr('r' , raio )
        .style('fill', cor);
    return circle;
}
 
funcao.appendLegendGroup = function(svg)
{
    
    funcao.legendGroup = svg.append('g')
        .attr('class', 'legendGroup')
        .attr('transform', 'translate('+ (funcao.margins.left + funcao.ch + 200)+','+40+')');
}
funcao.appendLegend = function(dataset)
{
 var elements = [];
    for (var i = 0; i < dataset.length; i++){
        var element = {'x': 10,'y':i*20,'color':dataset[i].cor,'name':dataset[i].nome};
        elements.push(element);
    }
    var rect = funcao.legendGroup.selectAll('rect').data(elements);
    rect.enter()
        .append('rect')
        .attr('width',10)
        .attr('height',10)
        .attr('x',function(d){return d.x;})
        .attr('y',function(d){return d.y;})
        .attr('fill',function(d){return d.color;})
    rect.exit()
        .remove();
    
    var text = funcao.legendGroup.selectAll('text').data(elements);
    text.enter()
        .append('text')
        .text(function(d){return d.name;})
        .attr('x',function(d){return d.x + 20;})
        .attr('y',function(d){return d.y+10;})
    text.exit()
        .remove();
}

    
function scatterplot (ConfigAxes, dados) {
        
    d3.select("svg").remove();
    funcao.ch = ConfigAxes.ch;
    funcao.cw = ConfigAxes.cw;
    var svg = funcao.appendSvg(ConfigAxes.div);
    var g = funcao.appendChartGroup(svg); 
    
    if(ConfigAxes.eixo == 1){
        funcao.createAxes(svg, ConfigAxes.maxX, ConfigAxes.maxY ,ConfigAxes.ord , ConfigAxes.ticks);
    }
    
    if(dados.tipo == 1){
        for(var i = 0; i < dados.dataset.length; i++){
            funcao.appendCircles(g, dados.dataset[i].qtd, dados.dataset[i].cor, dados.dataset[i].r);    
        }
    }else{
        for(var i = 0 ; i < dados.dataset.length; i++){
            funcao.appendCirclesReais(g, dados.dataset[i].dataset, dados.dataset[i].cor, dados.dataset[i].r);        
        }
    }
    if(ConfigAxes.legenda == 1){
        funcao.appendLegendGroup(svg);
        funcao.appendLegend(dados.dataset);

    }
}
    
    

'use strict';

var funcaohis = {};
    
funcaohis.margins = {top: 50, bottom: 50, left: 50, right: 100};
funcaohis.cw = 600;
funcaohis.ch = 400;
funcaohis.xScale = undefined;
funcaohis.yScale = undefined;
funcaohis.xAxis  = undefined;
funcaohis.yAxis  = undefined;

funcaohis.legendWidth = 100;
funcaohis.legendHeight = 100;
funcaohis.legendGroup = undefined;
funcaohis.dominioY = 100;
funcaohis.rangeY = 400;


funcaohis.appendSvg = function (div) 
{
    var node = d3.select(div).append('svg')
        .attr('width', funcaohis.cw + funcaohis.margins.left + funcaohis.margins.right)
        .attr('height', funcaohis.ch + funcaohis.margins.top + funcaohis.margins.bottom);
    return node;
}
funcaohis.appendChartGroup = function (svg)
{
    var g = svg.append('g')
        .attr('width', funcaohis.cw)
        .attr('height', funcaohis.ch)
        .attr('transform', 'translate('+ funcaohis.margins.left +','+ funcaohis.margins.top +')' );  
    return g;
}
funcaohis.createAxes = function(svg, maxX, maxY, ord, tickts)
{
    if(ord == 1){
        funcaohis.xScale = d3.scaleBand().domain(['Jan','Fev','Mar','Apr','May','Jun','Jul','Aug']).range([0,560]);
    }else{
        funcaohis.xScale = d3.scaleLinear().domain([0, maxX ]).range([0,myApp.cw]);
    }
    funcaohis.yScale = d3.scaleLinear().domain([maxY ,0]).range([0,funcaohis.ch]);
    
    var xAxisGroup = svg.append('g')
        .attr('class', 'xAxis')
        //.attr('ticks',7)
        .attr('transform', 'translate('+ funcaohis.margins.left +','+ (funcaohis.ch+funcaohis.margins.top) +')');
    var yAxisGroup = svg.append('g')
        .attr('class', 'yAxis')
        .attr('transform', 'translate('+ funcaohis.margins.left +','+ funcaohis.margins.top +')');
    funcaohis.xAxis = d3.axisBottom(funcaohis.xScale);
    funcaohis.yAxis = d3.axisLeft(funcaohis.yScale);
    funcaohis.xAxis.ticks(tickts);
    xAxisGroup.call(funcaohis.xAxis);
    yAxisGroup.call(funcaohis.yAxis);
}
       
funcaohis.createRectsData = function (qtd ,ordem) 
{
    var rects = []; 
    for (var i = 0; i < qtd ; i++){
        var v = Math.random()*100;
        var v2 = parseInt(v);
        var rect = {'x':i*70 + ordem , 
                    'y': myApp.ch - v2,            
                    'width':20,
                    'height':v2,       
                    'value':v2};
        rects.push(rect);
    
    }
    return rects;
}
funcaohis.appendRects = function(svg ,qtd, cor, ordem)
{
    var dataset = funcaohis.createRectsData(qtd,ordem);
    funcaohis.corrigeY(dataset);
    var rects = svg.selectAll('.rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x',function(d){ return d.x; })
        .attr('y',function(d){ return d.y; })
        .transition()
        .delay(100)
        .attr('width',function(d){ return d.width; })
        .attr('height',function(d){ return d.height; })
        
        .attr('fill',cor);
    
     var texts = svg.selectAll('.text')
        .data(dataset)
        .enter()
        .append('text')
        .attr('x',function(d){ return d.x+4; })
        .attr('font-size', '10px')
        .attr('font-family', 'arial')
        .attr('y',function(d){ return d.y + 10; })
        .text(function(d){ return d.value; })
        .attr('fill','white');
    
    return rects;
    
}
funcaohis.appendRectsReais = function (svg, dataset, cor, ordem)
{
    funcaohis.corrigeY(dataset);
    funcaohis.corrigeX(dataset,ordem);
    
    var rects = svg.selectAll('.rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x',function(d){ return d.x; })
        .attr('y',function(d){ return d.y; })
        .attr('width',20)
        .transition()
        .delay(100)
        .attr('height',function(d){ return d.height; })
        .attr('fill',cor);
    
     var texts = svg.selectAll('.text')
        .data(dataset)
        .enter()
        .append('text')
        .attr('x',function(d){ return d.x+4; })
        .attr('font-size', '10px')
        .attr('font-family', 'arial')
        .attr('y',function(d){ return d.y + 10; })
        .text(function(d){ return d.value; })
        .attr('fill','white');
    
    
    return rects;
    
}

funcaohis.appendLegendGroup = function(svg)
{
    
    funcaohis.legendGroup = svg.append('g')
        .attr('class', 'legendGroup')
        .attr('transform', 'translate('+ (funcaohis.margins.left + funcaohis.ch + 200)+','+40+')');
}
funcaohis.appendLegend = function(dataset)
{
    var elements = [];
    for (var i = 0; i < dataset.length; i++){
        var element = {'x': 10,'y':i*20,'color':dataset[i].cor,'name':dataset[i].nome};
        elements.push(element);
    }
    var rect = funcaohis.legendGroup.selectAll('rect').data(elements);
    rect.enter()
        .append('rect')
        .attr('width',10)
        .attr('height',10)
        .attr('x',function(d){return d.x;})
        .attr('y',function(d){return d.y;})
        .attr('fill',function(d){return d.color;})
    
    rect.exit()
        .remove();
    
    var text = funcaohis.legendGroup.selectAll('text').data(elements);
    text.enter()
        .append('text')
        .text(function(d){return d.name;})
        .attr('x',function(d){return d.x + 20;})
        .attr('y',function(d){return d.y+10;})
    text.exit()
        .remove();
}

funcaohis.corrigeY = function(dataset)
{
    for(var i = 0; i<dataset.length;i++){
        
        dataset[i].height = dataset[i].height * (funcaohis.rangeY / funcaohis.dominioY);
        dataset[i].y = (funcaohis.ch - dataset[i].height);   
    }
}

funcaohis.corrigeX = function(dataset, ordem)
{
    
    for(var i = 0; i < dataset.length ; i++){    
        dataset[i].x = (dataset[i].x * 70) + ordem;
    }
}



function histogram(ConfigAxes, dados){
    
    funcaohis.cw = ConfigAxes.cw;
    funcaohis.ch = ConfigAxes.ch;
    
    d3.select("svg").remove();
    var svg = funcaohis.appendSvg(ConfigAxes.div);
    var g = funcaohis.appendChartGroup(svg); 
    
    if(ConfigAxes.eixo == 1){
        funcaohis.createAxes(svg, ConfigAxes.maxX, ConfigAxes.maxY ,ConfigAxes.ord ,ConfigAxes.ticks);
    }
    if(dados.tipo == 1){
        for(var i = 0; i < dados.dataset.length; i++){ 
            
            funcaohis.appendRects(g, dados.dataset[i].qtd, dados.dataset[i].cor, dados.dataset[i].width*i);  
        }
    }else{
        for(var i = 0 ; i < dados.dataset.length; i++){
            funcaohis.appendRectsReais(g, dados.dataset[i].dataset, dados.dataset[i].cor, dados.dataset[i].width*i);
        }
    }
    if(ConfigAxes.legenda == 1){
        funcaohis.appendLegendGroup(svg);
        funcaohis.appendLegend(dados.dataset);  
    }
}
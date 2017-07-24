'use strict';

var myApp = {};

myApp.margins = {top: 50, bottom: 50, left: 50, right: 100};
myApp.cw = 600;
myApp.ch = 400;
myApp.xScale = undefined;
myApp.yScale = undefined;
myApp.xAxis  = undefined;
myApp.yAxis  = undefined;
myApp.brush  = undefined;
myApp.zoom   = undefined;
myApp.colors =["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499",                      "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];

myApp.legendWidth = 100;
myApp.legendHeight = 100;
myApp.legendGroup = undefined;
myApp.dominioY = 100;
myApp.rangeY = 400;

//CONFIGURAÇÃO DO SVG
myApp.appendSvg = function (div) 
{
    var node = d3.select(div).append('svg')
        .attr('width', myApp.cw + myApp.margins.left + myApp.margins.right)
        .attr('height', myApp.ch + myApp.margins.top + myApp.margins.bottom);
    return node;
}
myApp.appendChartGroup = function (svg)
{
    var g = svg.append('g')
        .attr('width', myApp.cw)
        .attr('height', myApp.ch)
        .attr('transform', 'translate('+ myApp.margins.left +','+ myApp.margins.top +')' );  
    return g;
}

//AUXILIARES
myApp.createAxes = function(svg, maxX, maxY, ord)
{
    if(ord == 1){
        myApp.xScale = d3.scaleBand().domain(['Jan','Fev','Mar','Apr','May','Jun','Jul','Aug']).range([0,560]);
    }else{
        myApp.xScale = d3.scaleLinear().domain([0, maxX ]).range([0,myApp.cw]);
    }
    myApp.yScale = d3.scaleLinear().domain([maxY ,0]).range([0,myApp.ch]);
    
    var xAxisGroup = svg.append('g')
        .attr('class', 'xAxis')
        //.attr('ticks',7)
        .attr('transform', 'translate('+ myApp.margins.left +','+ (myApp.ch+myApp.margins.top) +')');
    var yAxisGroup = svg.append('g')
        .attr('class', 'yAxis')
        .attr('transform', 'translate('+ myApp.margins.left +','+ myApp.margins.top +')');
    myApp.xAxis = d3.axisBottom(myApp.xScale);
    myApp.yAxis = d3.axisLeft(myApp.yScale);
    myApp.xAxis.ticks(7);
    xAxisGroup.call(myApp.xAxis);
    yAxisGroup.call(myApp.yAxis);
}
myApp.addBrush = function(svg,tipo)
{   function brushed()
    {        
        var s = d3.event.selection,
           x0 = s[0][0],
           y0 = s[0][1],
           x1 = s[1][0],
           y1 = s[1][1];
        
        if(tipo==1)
        {   svg.selectAll('circle')
                .style("fill", function (d) 
                {
                    if (myApp.xScale(d.cx) >= x0 && myApp.xScale(d.cx) <= x1 && 
                        myApp.yScale(d.cy) >= y0 && myApp.yScale(d.cy) <= y1)
                    { return "#ec7014"; }
                    else 
                    { return "rgb(150,150,190)"; }
                });        
        }if(tipo ==2){
             svg.selectAll('rect')
                .style("fill", function (d) 
                {
                    if (myApp.xScale(d.cx) >= x0 && myApp.xScale(d.cx) <= x1 && 
                        myApp.yScale(d.cy) >= y0 && myApp.yScale(d.cy) <= y1)
                    { return "#ec7014"; }
                    else 
                    { return "rgb(150,150,190)"; }
                });  
            
        }if(tipo==3){
             svg.selectAll('path')
                .style("fill", function (d) 
                {
                    if (myApp.xScale(d.cx) >= x0 && myApp.xScale(d.cx) <= x1 && 
                        myApp.yScale(d.cy) >= y0 && myApp.yScale(d.cy) <= y1)
                    { return "#ec7014"; }
                    else 
                    { return "rgb(150,150,190)"; }
                });  
        }
        
    };

    myApp.brush = d3.brush()
        .on("start brush", brushed);

    svg.append("g")
        .attr("class", "brush")
        .call(myApp.brush);   

}
myApp.addZoom = function(svg) // não funciona ainda
{
    function zoomed()
    {
        var t = d3.event.transform;
        
        var nScaleX = t.rescaleX(myApp.xScale);
        myApp.xAxis.scale(nScaleX);
                
        var xAxisGroup = svg.select('.xAxis');
        xAxisGroup.call(myApp.xAxis);

        svg.select('.chart-area')
            .selectAll('circle')
            .attr("cx", function(d) { return nScaleX(d.cx); });
    }
    
    myApp.zoom = d3.zoom()
        .on("zoom", zoomed);
    
    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", myApp.cw)
        .attr("height", myApp.margins.bottom)
        .attr('transform', 'translate('+ myApp.margins.left +','+ (myApp.ch+myApp.margins.top) +')')
        .call(myApp.zoom);   
}
myApp.corrigeY = function(dataset)
{
    for(var i = 0; i<dataset.length;i++){
        
        dataset[i].height = dataset[i].height * (myApp.rangeY / myApp.dominioY);
        dataset[i].y = (myApp.ch - dataset[i].height);   
    }
}
myApp.corrigeX = function(dataset, ordem)
{
    
    for(var i = 0; i < dataset.length ; i++){
        
        dataset[i].x = (dataset[i].x * 70) + ordem;
    }
}
myApp.appendLegendGroup = function(svg)
{
    
    myApp.legendGroup = svg.append('g')
        .attr('class', 'legendGroup')
        .attr('transform', 'translate('+ (myApp.margins.left + myApp.ch + 200)+','+40+')');
}
myApp.appendLegend = function(inicio,nomes,qtd)
{
    var elements = [];
    for (var i = 0; i<3;i++){
        var element = {'x': 10,'y':i*20,'color':myApp.colors[(i+inicio)],'name':nomes[i]};
        elements.push(element);
    }
    var rect = myApp.legendGroup.selectAll('rect').data(elements);
    rect.enter()
        .append('rect')
        .attr('width',10)
        .attr('height',10)
        .attr('x',function(d){return d.x;})
        .attr('y',function(d){return d.y;})
        .attr('fill',function(d){return d.color;})
    
    rect.exit()
        .remove();
    
    var text = myApp.legendGroup.selectAll('text').data(elements);
    text.enter()
        .append('text')
        .text(function(d){return d.name;})
        .attr('x',function(d){return d.x + 20;})
        .attr('y',function(d){return d.y+10;})
    text.exit()
        .remove();
}

//LIGAÇÃO AO SVG
myApp.appendCircles = function(svg,qtd,cor,raio)
{
    var dataset = myApp.createCirclesData(qtd,raio);        
    var circle = svg.selectAll('.circle')
        .data(dataset)
        .enter()
        .append('circle')
        .transition()
        .delay(100)
        .attr('cx', function(d){ return myApp.xScale(d.cx); })
        .attr('cy', function(d){ return myApp.yScale(d.cy); })
        .attr('r' , function(d){ return d.r;  })
        
        .attr('opacity',0.8)
        .transition()
        .delay(120)
        //.style('fill', 'rgb(150,150,190)');
        .style('fill', cor)
        ;
        
    return circle;
}
myApp.appendCirclesReais = function(div, circles, cor, raio) //mesma função mas pegando o dataSet como parâmetro
{
    var circle = div.selectAll('.circle')
        .data(circles)
        .enter()
        .append('circle')
    .transition()
        .delay(100)
        .attr('cx', function(d){ return myApp.xScale(d.cx); })
        .attr('cy', function(d){ return myApp.yScale(d.cy); })
        .attr('r' , raio )
        .style('fill', cor);
    return circle;
}

myApp.appendRects = function(svg ,qtd, cor, ordem)
{
    var dataset = myApp.createRectsData(qtd,ordem);
    myApp.corrigeY(dataset);
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
myApp.appendRectsReais = function (svg, dataset, cor, ordem)
{
    myApp.corrigeY(dataset);
    myApp.corrigeX(dataset,ordem);
    
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

myApp.appendPoints = function(svg,qtd,cor)
{
    var dataset = myApp.createPointsData(svg,qtd);
    
    var line = d3.line()
        .x(function(d){return d.x;})
        .y(function(d){return myApp.yScale(d.y);}) 
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
myApp.appendPointsReais = function(svg, dataset, cor)
{
    //var dataset = myApp.createPointsData(svg,qtd);
    var line = d3.line()
        .x(function(d){return d.x;})
        .y(function(d){return myApp.yScale(d.y);})
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


//CRIAÇÃO DOS ELEMENTOS
myApp.createCirclesData = function(n,raio)
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
myApp.createRectsData = function (qtd ,ordem) 
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
myApp.createPointsData = function(div, qtd)
{
    var points = []; 
    for(var id = 0; id<qtd ;id++)
        {
            var aux = id*12;
            var y = Math.random();
            var x = aux;
            var c = {'x':aux,'y':y};
            points.push(c);
            if(y > myApp.maxY) myApp.maxY = y;
            if(x > myApp.maxX) myApp.maxX = x; 
        }
    return points;
}


//"MAIN"
myApp.run = function(tipoVis) 
{        
    
    d3.select("svg").remove();
    var svg = myApp.appendSvg("#mainDiv");
    var g = myApp.appendChartGroup(svg);   
    
    var tipoVis = tipoVis;     
    
    if(tipoVis == 1)
    {
        
        var configAxes = {'maxX': 1,'maxY':1, 'ord':0,'ch':400,'cw':600, 'legenda':1 , 'eixo':1, 'ticks':7, 'div':"#mainDiv"}; 
        
    
        var dataset = [{'qtd':20,'r':3, 'cor':myApp.colors[0] ,'nome':'FRA'},
                       {'qtd':20,'r':6, 'cor':myApp.colors[1] ,'nome':'EUA'},
                       {'qtd':10,'r':9, 'cor':myApp.colors[2] ,'nome':'JAP'},
                       {'qtd':15,'r':7, 'cor':myApp.colors[3] ,'nome':'BRA'},];
        
        var dados = {'tipo':1, 'dataset':dataset};
        
        scatterplot(configAxes, dados);             
    
    }      
    if(tipoVis == 2)
    {
        
        var configAxes = {'maxX': 0 ,'maxY':100, 'ord':1,'ch':400,'cw':600 , 'legenda':1 , 'eixo':0, 'ticks':7, 'div':"#mainDiv2"}; 
        
        var dataset = [{'qtd':8, 'cor':myApp.colors[3],'width':20,'nome':'ARG'},
                       {'qtd':8, 'cor':myApp.colors[4],'width':20,'nome':'BRA'},
                       {'qtd':8, 'cor':myApp.colors[5],'width':20,'nome':'CUB'}];
        
        var dados = {'tipo':1,'dataset':dataset};

        histogram(configAxes, dados);
    }
    if(tipoVis==3)
    {
        
        var configAxes = {'maxX': 0,'maxY':2, 'ord':1 ,'ch':400,'cw':600, 'legenda':0, 'eixo':1, 'ticks':7, 'div':"#mainDiv3"};
        
        var dataset = [{'qtd':50,'cor': myApp.colors[5],'nome':'CAN'},
                       {'qtd':50,'cor': myApp.colors[6],'nome':'RUS'},
                       {'qtd':50,'cor': myApp.colors[7],'nome':'CHI'}];

        var dados = {'tipo':1,'dataset':dataset};

        timeseries(configAxes,dados);
    }   
    if(tipoVis==4)
    {
        
        var configAxes = {'maxX': 100,'maxY':100, 'ord':0 ,'ch':400,'cw':600, 'legenda':1, 'eixo':1, 'ticks':15, 'div':"#mainDiv"}; 
        
        var data1 = [{'cx': 2,'cy': 2},           {'cx': 4, 'cy':4},                 {'cx': 8, 'cy':8 },                 {'cx': 13, 'cy':13 },                 {'cx': 18, 'cy':19 },                 {'cx': 25, 'cy':24 },                 {'cx': 28, 'cy':30 },                 {'cx': 38, 'cy':36 },
                 {'cx': 45, 'cy':43 },                 {'cx': 52, 'cy':57 },                 {'cx': 58, 'cy':68 },                 {'cx': 68, 'cy': 70},
                 {'cx': 75, 'cy': 76},                 {'cx': 82, 'cy': 85},                 {'cx': 91, 'cy': 92},                ];
        var data2 = [{'cx': 2,'cy': 2},                 {'cx': 5, 'cy':5},                 {'cx': 8, 'cy':9 },                 {'cx': 11, 'cy':13 },                 {'cx': 14 ,'cy':17 },                 {'cx': 17, 'cy':22 },                 {'cx': 20, 'cy':27 },                 {'cx': 23, 'cy':32 },
                 {'cx': 26, 'cy':38 },                 {'cx': 29, 'cy':47 },                 {'cx': 32, 'cy':58 },                 {'cx': 35, 'cy': 69},
                 {'cx': 37, 'cy': 79},                 {'cx': 39, 'cy': 90},                 {'cx': 41, 'cy': 99},                ];
        var data3 = [{'cx': 8,'cy':18},                 {'cx': 40, 'cy':30},                 {'cx': 88, 'cy':71 },                 {'cx': 11, 'cy':80 },
                 {'cx': 80, 'cy':11 },                 {'cx': 1, 'cy':90 },                 {'cx': 90, 'cy':4 },                 {'cx': 48, 'cy':32 },
                 {'cx': 45, 'cy':41 },                 {'cx':12, 'cy':58 },                 {'cx': 43, 'cy':68 },                 {'cx': 30, 'cy': 71},
                 {'cx': 80, 'cy': 40},                 {'cx': 70, 'cy': 55},                 {'cx': 20, 'cy': 92},                ];
        
        var dataset = [{'dataset':data1,'cor':myApp.colors[8],'r':5,'nome':'Dolar'},
                       {'dataset':data2,'cor':myApp.colors[9],'r':5,'nome':'Renminbi'},
                       {'dataset':data3,'cor':myApp.colors[11],'r':5,'nome':'Real'}];
        var dados = {'tipo':0 , 'dataset':dataset};
        scatterplot(configAxes, dados); 
    }
    if(tipoVis==5)
    {        
        
        var configAxes = {'maxX': 0,'maxY':100, 'ord':1 ,'ch':400,'cw':600, 'legenda':1, 'eixo':1, 'ticks':7, 'div':"#mainDiv2"};
        
        var data1 = [{ 'x':0 , 'height': 50, 'y':0},{'x':1 , 'height':20 ,'y':0 },{'x':2 , 'height':30 ,'y':0 },{'x':3 , 'height': 35,'y':0 },{'x':4 , 'height':25 ,'y':0 }, {'x':5 , 'height':10 ,'y':0 },{'x': 6, 'height':52 ,'y': 0}, {'x':7 , 'height':80 ,'y':0 }];
        
        var data2 = [{ 'x':0 , 'height': 60, 'y':0},{'x':1 , 'height':35 ,'y':0 },{'x':2 , 'height':32 ,'y':0 },{'x':3 , 'height': 70,'y':0 },{'x':4 , 'height':55 ,'y':0 }, {'x':5 , 'height':12 ,'y':0 },{'x': 6, 'height':34 ,'y': 0}, {'x':7 , 'height':78 ,'y':0 }];
  
        var data3 = [{ 'x':0 , 'height': 20, 'y':0},{'x':1 , 'height':30 ,'y':0 },{'x':2 , 'height':38 ,'y':0 },{'x':3 , 'height': 40,'y':0 },{'x':4 , 'height':29 ,'y':0 }, {'x':5 , 'height':50 ,'y':0 },{'x': 6, 'height':70 ,'y': 0}, {'x':7 , 'height':82 ,'y':0 }];
        
        
        var dataset = [{'dataset':data1,'cor':myApp.colors[12],'width': 20,'nome': 'Dataset 1'},
                       {'dataset':data2,'cor':myApp.colors[13],'width': 20,'nome':'Dataset 2'},
                       {'dataset':data3,'cor':myApp.colors[14],'width': 20,'nome':'Dataset 3'}];

        var dados = {'tipo':0,'dataset':dataset};
      
        histogram(configAxes, dados); 
    }
    if(tipoVis==6)
    {
        
        var configAxes = {'maxX': 0,'maxY':100, 'ord':1 ,'ch':400,'cw':600 , 'legenda':1, 'eixo':1, 'ticks':7, 'div':"#mainDiv3"};
        
        var data1 = [{'x':0 ,'y': 20}, {'x': 20,'y':50 },{'x': 40,'y':40 },{'x':60 ,'y':70 },{'x':80 ,'y':20 },{'x':100 ,'y':40 },{'x':120 ,'y':48 },
                     {'x': 140,'y':10 },{'x':160 ,'y': 24},{'x':180 ,'y':39 },{'x': 200,'y':60 },{'x':220 ,'y':40 },{'x':240 ,'y':31 },{'x':260 ,'y': 70},{'x':280 ,'y':20 },{'x':300 ,'y': 30},{'x': 320,'y':60 },{'x': 340,'y':65 },{'x': 360,'y':21 },{'x': 380,'y':80 } ,{'x': 400,'y':75 },{'x':420 ,'y':20 },{'x':440 ,'y': 5},{'x': 460,'y':1 },{'x': 480,'y':70 },{'x': 500,'y':35 },{'x': 520,'y':40 },{'x':540 ,'y':48 },{'x':560 ,'y': 72}];
        
        var data2 = [{'x':0 ,'y': 30}, {'x': 20,'y':20 },{'x': 40,'y':45 },{'x':60 ,'y':77 },{'x':80 ,'y':12 },{'x':100 ,'y':33 },{'x':120 ,'y':77},
                     {'x': 140,'y':12 },{'x':160 ,'y': 30},{'x':180 ,'y':50 },{'x': 200,'y':80 },{'x':220 ,'y':75 },{'x':240 ,'y':40 },{'x':260 ,'y': 8},{'x':280 ,'y':20 },{'x':300 ,'y': 30},{'x': 320,'y':60 },{'x': 340,'y':65 },{'x': 360,'y':21 },{'x': 380,'y':80 } ,{'x': 400,'y':75 },{'x':420 ,'y':12 },{'x':440 ,'y': 77},{'x': 460,'y':87 },{'x': 480,'y':22 },{'x': 500,'y':16 },{'x': 520,'y':24 },{'x':540 ,'y':30 },{'x':560 ,'y': 28}];
       
        var data3 = [{'x':0 ,'y': 55}, {'x': 20,'y':20 },{'x': 40,'y':10 },{'x':60 ,'y':65 },{'x':80 ,'y':15 },{'x':100 ,'y':50 },{'x':120 ,'y':45 },
                     {'x': 140,'y':24 },{'x':160 ,'y': 28},{'x':180 ,'y':30 },{'x': 200,'y':78 },{'x':220 ,'y':57 },{'x':240 ,'y':51 },{'x':260 ,'y': 20},{'x':280 ,'y':57 },{'x':300 ,'y': 44},{'x': 320,'y':65 },{'x': 340,'y':71 },{'x': 360,'y':68 },{'x': 380,'y':60 } ,{'x': 400,'y':58 },{'x':420 ,'y':20 },{'x':440 ,'y': 5},{'x': 460,'y':2 },{'x': 480,'y':10 },{'x': 500,'y':87 },{'x': 520,'y':55 },{'x':540 ,'y':50 },{'x':560 ,'y': 90}];
        
        
        var dataset = [{'dataset':data1 , 'cor': myApp.colors[11] , 'nome': 'Dado 1'},
                       {'dataset':data2 , 'cor': myApp.colors[12] , 'nome': 'Dado 2'},
                       {'dataset':data3 , 'cor': myApp.colors[13] , 'nome': 'Dado 3'}];
        
        var dados = {'tipo':0,'dataset':dataset};
        timeseries(configAxes, dados);   
    }
   
}

window.onload = myApp.run;
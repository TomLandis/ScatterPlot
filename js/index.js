var getData = new XMLHttpRequest();
var dataSet;

getData.onreadystatechange = function() {
  if(getData.readyState === 4) {
   // console.log(getData);
    if(getData.status === 200) {
      dataSet = getData.responseText;
     dataSet = JSON.parse(dataSet);
     // console.log(dataSet);
      
      
      MakeIt(dataSet);
      
    }else{
      console.log("Error is a " + getData.statusText)
    }
  }
  
}
getData.open('Get', 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json');

getData.send();

function MakeIt(ds) {
  function minBehindFastest (my) {
    return my - 2210;
  }
  var t = d3.transition()
    .duration(750)
    .ease(d3.easeLinear);

    var svgWidth = $(window).width();
  var svgHeight = $(window).height();
  let vPad = 200;
  let hPad = 200
  var w = svgWidth - hPad;
  var h = svgHeight - vPad;
  let height = h;
 // let width = w;
  let padding = 100;
  
  var scaleY = d3.scaleLinear()
    .domain([35, 1])
    .range([h, 0]);
  var hScale = d3.scaleLinear()
  .domain([0, 180])
  .range([w, 1]);
  
   var vScale = d3.scaleLinear()
  .domain([1, 35])
  .range([0, h]);
  
  var vAxis = d3.axisLeft()
  .scale(vScale)
  .ticks(5)
  .tickPadding(5);
  
  var hAxis = d3.axisBottom()
  .scale(hScale)
  .ticks(15)
  .tickPadding(5);

  
  var svg = d3.select("#plot")
  .append("svg")
  .attr("width", w )
  .attr("height", h )
  var axisGroup = svg.append("g")
.attr("class", "ax")
.attr('transform', 'translate(-10 , 0)')
  .call(vAxis);
 var axisBot = svg.append("g")
 .attr("class", "ax")
 .attr('transform', 'translate(0,' + (h  + 10) +')')
 .call(hAxis)

 svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ ((padding/2) - 40) +","+ (height/2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Ranking");
  svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (w/2) +","+(height-(padding/3) + 30)+")")  // centre below axis
            .text("Seconds Behind First Place");
  
  svg.selectAll("circle")
   .data(ds)
   .enter()
   .append("circle")
   .attr("class", function(d) {
 if(d.Doping === "") {
   return "clean"
 } else { return "dirty tooltip"}
  })
  .attr("cy", function(d) {
        return scaleY(d.Place);
   }) 
   .transition(t)
   .attr("cx", function(d) { return hScale(minBehindFastest(d.Seconds)) })
   .attr("r", 10);
  
  
  svg.selectAll('circle')
   .append('g')
  .attr('class', "name")
  .text( function(d) {
    return d.Name})
  
  svg.selectAll('circle')
    .transition(t)
  .attr('r', 6);

  function clearToolTip () {
    //console.log('ctt');
    $('#tt').fadeOut(1000, function(){
      $('#tt').empty();
    });
  }
 
  function hoverEffect(e) {
    let name = e.currentTarget.children[0].firstChild.data;
    let doping = e.currentTarget.children[0].__data__.Doping;
    let place = e.currentTarget.children[0].__data__.Place;
    let year = e.currentTarget.children[0].__data__.Year;
    let time = e.currentTarget.children[0].__data__.Time;
    
    $('#tt').empty();
    
    $('#tt').fadeIn(400).append("# " + place + "<br><strong> " + name + " </strong>" + "<br>  Year: " + year + "<br> Time: " + time +"<br>" + doping)
  
}
  
var times;

  $('.dirty').mouseleave(function(){
   times= window.setTimeout(clearToolTip, 1000);
  });
   $('.clean').mouseleave(function(){
   times= window.setTimeout(clearToolTip, 1000);
  });
$('.dirty').mouseenter(function(e){
  window.clearTimeout(times);
  hoverEffect(e)
});
  $('.clean').mouseenter(function(e){
    window.clearTimeout(times);
  hoverEffect(e)
});
}

var resizeTimer;

$(window).on('resize', function(e) {

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
$("#plot").empty();
    MakeIt(dataSet);
    
    
            
  }, 250);

});

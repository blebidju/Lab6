var FirstCityInfo = "";

var SecondCityInfo = "";

var ThirdCityInfo = "";

var FirstCityInfoOld = "";

var SecondCityInfoOld = "";

var ThirdCityInfoOld = "";

var refresh = 0;

var makeThirdCityActivated = 0;

var LastTableString = "";


//sends the city ID so i can grab it from the API
//load doc is the ajax request
function grabInfo(){
  //london city id
  loadDoc("2643743");
  //Phoenix city id
  loadDoc("4905873");
}


//just the ajax request with some error handling to send a message if there is an error
function loadDoc(id) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      interpretRequest(JSON.parse(this.responseText));
    }
    else if(this.status > 399 && this.status < 500){
      document.getElementById("error").innerHTML = "There was a "+this.status+" error please reload the app";
    }
    else if(this.status > 499 && this.status < 600){
      document.getElementById("error").innerHTML = "There was a "+this.status+" error please reload the app";
    }
  };
  xhttp.open("GET", "http://api.openweathermap.org/data/2.5/weather?id="+id+"&APPID=29e67ba9c14f9f26ee408b825f02a00c", true);
  xhttp.send();
  
}


//just puts the request into objects that i can use because if its london i know its the first city
//phoenix the second and so whatever else has to be the last city
function interpretRequest(request){
  if(request.name == "London"){
    FirstCityInfo = request;
  }
  else if(request.name == "Phoenix"){
    SecondCityInfo = request;
  }
  else{
    ThirdCityInfo = request;
  }

  createTable();
  
}

//just sets the innerHTML of table and takes all the components it needs based on how many cities there are and if refresh has been pressed
//I also choose best weather after so it updates everytime there is a change in the table
function createTable(){

  var ReturnTableString = "";
  if(refresh == 1){
      if(makeThirdCityActivated == 1){
        makeThirdCityActivated = 0;
        document.getElementById("Table").innerHTML = LastTableString + allHTML("ThirdCity");
        chooseBestWeather();
      }
      else if(FirstCityInfo != "" && SecondCityInfo != "" && ThirdCityInfo != ""){
        LastTableString = allHTML("TableHeader") + allHTML("FirstCity") + allHTML("FirstCityOld") + allHTML("SecondCity") + allHTML("SecondCityOld");
        document.getElementById("Table").innerHTML = LastTableString + allHTML("ThirdCity") + allHTML("ThirdCityOld") + '</table>';

        FirstCityInfoOld = "";
        SecondCityInfoOld = "";
        ThirdCityInfoOld = "";
        chooseBestWeather();
        
      }
      else if(FirstCityInfo != "" && SecondCityInfo != "" && ThirdCityInfoOld == ""){
        LastTableString = allHTML("TableHeader") + allHTML("FirstCity") + allHTML("FirstCityOld") + allHTML("SecondCity") + allHTML("SecondCityOld");
        document.getElementById("Table").innerHTML = allHTML("TableHeader") + allHTML("FirstCity") + allHTML("FirstCityOld") + allHTML("SecondCity") + allHTML("SecondCityOld") + '</table>';

        FirstCityInfoOld = "";
        SecondCityInfoOld = "";
        chooseBestWeather();
      }
  }
  else{
      if(FirstCityInfo != "" && SecondCityInfo != "" && ThirdCityInfo != ""){
        LastTableString = allHTML("TableHeader") + allHTML("FirstCity") + allHTML("SecondCity");
        document.getElementById("Table").innerHTML = LastTableString + allHTML("ThirdCity") + '</table>';
        makeThirdCityActivated = 0;
        chooseBestWeather();
      }
      else if(FirstCityInfo != "" && SecondCityInfo != ""){
        LastTableString = allHTML("TableHeader") + allHTML("FirstCity") + allHTML("SecondCity");
        document.getElementById("Table").innerHTML = LastTableString + '</table>';
        chooseBestWeather();
      }
  }
  
}

//Converts From UNIX timestamp to the specified date format (yyyy:mm:dd:hh:mm:ss)
function convertTime(time){

var date = new Date(time*1000);
var dateString = date.getFullYear() + ":" + (date.getMonth()+1) + ":" + date.getDate() + ":" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
return dateString;
}

//this was just so i know if the third city was being made so i could account for it
//i also call load doc to get the value for the third city and input it into the table
function createThirdCity(){

  makeThirdCityActivated = 1;
  loadDoc(document.getElementById("Select City").value);

}

//sets refresh to 1 so i know the user hit the button
//then I set all the current values to old ones
//then I clear the new values and use the same logic in create 
//that if all the info variables are all filled then i can create the table
function refreshPage(){
  refresh = 1;

  FirstCityInfoOld = FirstCityInfo;
  SecondCityInfoOld = SecondCityInfo;
  
  FirstCityInfo = "";
  SecondCityInfo = "";

  //london city id
  loadDoc("2643743");
  //Phoenix city id
  loadDoc("4905873");

  if(ThirdCityInfo == ""){

  }
  else{
    loadDoc(document.getElementById("Select City").value);
    ThirdCityInfoOld = ThirdCityInfo;
    ThirdCityInfo = "";
  }
  


}

//function that handles the averages and best and worst weather
function chooseBestWeather(){
  var AverageHeat = 0;
  var HottestCity = "";
  var AverageHumidity = 0;
  var MostHumidCity = "";
  var CityNicest = "";
  var CityWorst = "";

//case if there are two cities
  if(ThirdCityInfo == ""){
    AverageHeat = ((FirstCityInfo.main.temp-273.15) + (SecondCityInfo.main.temp-273.15))/2;
    if(FirstCityInfo.main.temp < SecondCityInfo.main.temp){
      HottestCity = SecondCityInfo;
    }
    else{
      HottestCity = FirstCityInfo;
    }

    AverageHumidity = (FirstCityInfo.main.humidity+SecondCityInfo.main.humidity)/2
    if(FirstCityInfo.main.humidity < SecondCityInfo.main.humidity){
      MostHumidCity = SecondCityInfo;
    
    }
    else{
      MostHumidCity = FirstCityInfo;
    }
    //had an idea for calculating percieved temperature but couldnt find an equation online for humidity and temp so I just used all the components like he asked in whatever way
    var FirstScore = (FirstCityInfo.main.temp * FirstCityInfo.main.humidity) - (FirstCityInfo.wind.speed*FirstCityInfo.clouds.all);
    var SecondScore = (SecondCityInfo.main.temp * SecondCityInfo.main.humidity) - (SecondCityInfo.wind.speed*SecondCityInfo.clouds.all);

    if(FirstScore > SecondScore){
      CityNicest = FirstCityInfo;
      CityWorst = SecondCityInfo;
    }
    else{
      CityNicest = SecondCityInfo;
      CityWorst = FirstCityInfo;
    }
  }

//case if there are three cities
  else{
    AverageHeat = ((FirstCityInfo.main.temp-273.15) + (SecondCityInfo.main.temp-273.15) + (ThirdCityInfo.main.temp-273.15))/3;
    HottestCity = FirstCityInfo;
    if(SecondCityInfo.main.temp > HottestCity.main.temp){
      HottestCity = SecondCityInfo;
    }
    if(ThirdCityInfo.main.temp > HottestCity.main.temp){
      HottestCity = ThirdCityInfo;
    }
    
    AverageHumidity = (FirstCityInfo.main.humidity+SecondCityInfo.main.humidity+ThirdCityInfo.main.humidity)/3;
    MostHumidCity = FirstCityInfo;
    if(SecondCityInfo.main.humidity > MostHumidCity.main.humidity){
      MostHumidCity = SecondCityInfo;
    }
    
    if(ThirdCityInfo.main.humidity > MostHumidCity.main.humidity){
      MostHumidCity = ThirdCityInfo;
    }
    
    var FirstScore = (FirstCityInfo.main.temp * FirstCityInfo.main.humidity) - (FirstCityInfo.wind.speed*FirstCityInfo.clouds.all);
    var SecondScore = (SecondCityInfo.main.temp * SecondCityInfo.main.humidity) - (SecondCityInfo.wind.speed*SecondCityInfo.clouds.all);
    var ThirdScore = (ThirdCityInfo.main.temp * ThirdCityInfo.main.humidity) - (ThirdCityInfo.wind.speed*ThirdCityInfo.clouds.all);

    if(FirstScore > SecondScore && FirstScore > ThirdScore){
      CityNicest = FirstCityInfo;
    }
    else if(SecondScore > FirstScore && SecondScore > ThirdScore){
      CityNicest = SecondCityInfo;
    }
    else{
      CityNicest = ThirdCityInfo;
    }

    if(FirstScore < SecondScore && FirstScore < ThirdScore){
      CityWorst = FirstCityInfo;
    }
    else if(SecondScore < FirstScore && SecondScore < ThirdScore){
      CityWorst = SecondCityInfo;
    }
    else{
      CityWorst = ThirdCityInfo;
    }



  }


  document.getElementById("AverageWeather").innerHTML = "The average temperature is "+AverageHeat+" and the hottest city is "+HottestCity.name +','+HottestCity.sys.country+"<br/>"+
  "The average humidity is "+AverageHumidity+" and the most humid city is "+MostHumidCity.name +','+MostHumidCity.sys.country+"<br/>"+
  "The city with the nicest weather is "+CityNicest.name +','+CityNicest.sys.country+"<br/>"+
  "The city with the worst weather is "+CityWorst.name +','+CityWorst.sys.country+"";


}

//All the city HTML was super similar so i made a function to create it based on the var I need
function createCityHTML(City){
    return  '  <tr>'+
            '    <td>'+City.name +','+City.sys.country+'</td>'+
            '    <td>'+convertTime(City.dt)+'</td>'+
            '    <td>'+(City.main.temp-273.15)+'</td>'+
            '    <td>'+City.main.humidity+'</td>'+
            '    <td>'+((City.wind.speed/1609.344)*60*60)+'</td>'+
            '    <td>'+City.clouds.all+'</td>'+
            '  </tr>';
}

//he wanted it to be blank if the values didnt change so this just return a blank table entry
function createEmptyTable(){
    return  '  <tr height = 17px>'+
            '    <td> </td>'+
            '    <td> </td>'+
            '    <td> </td>'+
            '    <td> </td>'+
            '    <td> </td>'+
            '    <td> </td>'+
            '  </tr>';
}

//javascript was doing some weird stuff regarding me creating strings so this fixed that issue but it is super weird why I have to
//access data via a function, this was a dumb way to do it anyway next time Ill do this through "real" DOM manipulation
//Also not all HTML were having issues but I through all the snippets in here anyway to maintain consistency in readability so I dont
//have HTML all over the place its centralized here instead
function allHTML(choice){
  var ReturnString = "";
    if(choice == "TableHeader"){
          ReturnString = '<table style="width:100%">'+
          '  <tr>'+
          '    <th>City Name</th>'+
          '    <th>Timestamp<br/>(yyyy:mm:dd:hh:mm:ss)</th> '+
          '    <th>Temperature<br/>in \u00B0C</th>'+
          '    <th>Humidity <br/>in %</th>'+
          '    <th>Wind Speed<br/>in miles per hour</th> '+
          '    <th>Cloudiness<br/>in %</th>'+
          '  </tr>';
    }
    else if(choice == "FirstCity"){
          ReturnString = createCityHTML(FirstCityInfo);
    }
    else if(choice == "SecondCity"){
          ReturnString = createCityHTML(SecondCityInfo);
    }
    else if(choice == "ThirdCity"){
          ReturnString = createCityHTML(ThirdCityInfo);
    }
    else if(choice == "FirstCityOld"){
          if(FirstCityInfo.dt == FirstCityInfoOld.dt){
            ReturnString = createEmptyTable();
          }
          else{
            ReturnString = createCityHTML(FirstCityInfoOld);
          }
             
    }
    else if(choice == "SecondCityOld"){
          if(SecondCityInfo.dt == SecondCityInfoOld.dt){
            ReturnString = createEmptyTable();
          }
          else{
            ReturnString = createCityHTML(SecondCityInfoOld);
          }     
          
    }
    else if(choice == "ThirdCityOld"){
          if(ThirdCityInfo.dt == ThirdCityInfoOld.dt){
            ReturnString = createEmptyTable();
          }
          else{
            ReturnString = createCityHTML(ThirdCityInfoOld);
          }
            
    }
    

    return ReturnString;

}

public with sharing class WeatherAPI {
    
    @AuraEnabled
    public static string getWeather(String city){
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:WeatherAPI/current.json?q=' + city);
        req.setMethod('GET');
        HttpResponse res = http.send(req);
        return res.getBody();
    }

    @AuraEnabled
    public static WeatherWrapper forecastWeather(String city){
        List<WeatherWrapper.Forecast> forecast = new List<WeatherWrapper.Forecast>();
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:WeatherAPI/forecast.json?q=' + city);
        req.setMethod('GET');
        HttpResponse res = http.send(req);
        WeatherWrapper weatherResponse = WeatherWrapper.parse(res.getBody());
        return weatherResponse;
    }
}

public with sharing class WeatherWrapper {
    
    @AuraEnabled
    public Forecast forecast;

    public class Forecast{
        @AuraEnabled
        public List<Forecastday> forecastday;
    }
    
    public class Forecastday {
        @AuraEnabled
        public List<Hour> hour;
    }

    public class Hour {
        @AuraEnabled
        public String time_x;
        @AuraEnabled
        public Condition condition;
        @AuraEnabled
        public Integer humidity;
        @AuraEnabled
        public Double temp_c;
        @AuraEnabled
        public Double wind_mph;
    }

    public class Condition {
        @AuraEnabled
        public String text;
        @AuraEnabled
        public String icon;
    }

    public static WeatherWrapper parse(String json) {
        json = json.replace('"time":', '"time_x":');
        return (WeatherWrapper) System.JSON.deserialize(json, WeatherWrapper.class);
    }
}

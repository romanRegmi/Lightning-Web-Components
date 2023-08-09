import { LightningElement } from 'lwc';
import getWeather from '@salesforce/apex/WeatherAPI.getWeather';
import forecastWeather from '@salesforce/apex/WeatherAPI.forecastWeather';

export default class WeatherAPI extends LightningElement {

    date;
    time;
    cityName;
    temperature;
    wind_mph;
    humidity;
    imageURL;
    condition;

    nextRecords = [];

    cards = 3;

    async handleWeatherFetch() {
        this.cityName = this.refs.cityRef.value ;
        
        try {
            const currentWeatherResponse = await getWeather({ city: this.cityName });
            let currentWeather = JSON.parse(currentWeatherResponse);
            
            this.wind_mph = currentWeather.current.wind_mph;
            this.temperature = currentWeather.current.temp_c;
            this.humidity = currentWeather.current.humidity;
            this.condition = currentWeather.current.condition.text;
            this.imageURL = currentWeather.current.condition.icon;
            
            
            this.date = currentWeather.location.localtime.substring(0, 10);
            const t = new Date(currentWeather.location.localtime);
            this.time = t.toLocaleTimeString();




            const forecastWeatherResponse = await forecastWeather({ city: this.cityName });
            const hourlyWeather = forecastWeatherResponse.forecast.forecastday.at(0).hour;

            // clear the array
            this.nextRecords = [];

            for (let i = 0; i < hourlyWeather.length; i++){
                let nextHr = new Date(hourlyWeather.at(i).time_x);
                if(nextHr > t){
                    this.nextRecords.push(hourlyWeather.at(i))
                }

                if(this.nextRecords.length == this.cards){
                    break;
                }
            }
            
            
        } catch (error) {
            this.condition = 'Error loading data';
            console.error('Error fetching weather data:', error);
        }
    }

    handleCurrentLocation() {
        
    }
}

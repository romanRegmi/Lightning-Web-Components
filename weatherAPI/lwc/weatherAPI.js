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
            let current = currentWeather.current;
            
            this.wind_mph = current.wind_mph;
            this.temperature = current.temp_c;
            this.humidity = current.humidity;
            this.condition = current.condition.text;
            this.imageURL = current.condition.icon;
            
            this.date = currentWeather.location.localtime.substring(0, 10);
            const t = new Date(currentWeather.location.localtime);
            this.time = t.toLocaleTimeString();

            const forecastWeatherResponse = await forecastWeather({ city: this.cityName });
            const hourlyWeather = forecastWeatherResponse.forecast.forecastday.at(0).hour;

            // clear the array
            // otherwise it will hold the previous record.
            this.nextRecords = [];

            for (let i = 0; i < hourlyWeather.length; i++){
                let nextHr = new Date(hourlyWeather.at(i).time_x);
                
                if(this.nextRecords.length == this.cards){
                    break;
                }

                if(nextHr > t){
                    this.nextRecords.push(hourlyWeather.at(i))
                }
            }
            
            
        } catch (error) {
            this.condition = 'Error loading data';
            console.error('Error fetching weather data:', error);
        }
    }

    handleCurrentLocation() {
        // will only change the cityName in UI.
        this.cityName = 'London';
    }
}

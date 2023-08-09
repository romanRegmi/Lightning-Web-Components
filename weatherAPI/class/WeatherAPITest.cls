@isTest
private class WeatherAPITest {

    @isTest
    static void testGetWeather() {
        // Prepare mock response
        String mockResponseBody = '{"condition": {"icon": "//cdn.weatherapi.com/icon.png", "text": "Sunny"}, "humidity": 50, "temp_c": 25.5, "wind_mph": 5.0}';
        HttpMock mock = new HttpMock(mockResponseBody);

        // Set mock in test context
        Test.setMock(HttpCalloutMock.class, mock);

        // Call the method to test
        String result = WeatherAPI.getWeather('CityName');

        // Verify the result or perform assertions
        System.assertEquals(mockResponseBody, result);
    }

    @isTest
    static void testForecastWeather() {
        // Prepare mock response
        String mockResponseBody = '{"forecast": {"forecastday": [{"hour": [{"time_x": "2023-08-10 12:00", "condition": {"icon": "//cdn.weatherapi.com/icon.png", "text": "Sunny"}, "humidity": 50, "temp_c": 25.5, "wind_mph": 5.0}]}]}}';
        HttpMock mock = new HttpMock(mockResponseBody);

        // Set mock in test context
        Test.setMock(HttpCalloutMock.class, mock);

        // Call the method to test
        WeatherWrapper result = WeatherAPI.forecastWeather('CityName');

        // Verify the result or perform assertions
        System.assertNotEquals(null, result);
        System.assertEquals(1, result.forecast.forecastday.size());
        System.assertEquals(1, result.forecast.forecastday[0].hour.size());
    }

    // Mock HTTP response class
    private class HttpMock implements HttpCalloutMock {
        private String responseBody;

        public HttpMock(String responseBody) {
            this.responseBody = responseBody;
        }

        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody(responseBody);
            return res;
        }
    }
}

const rp = require('request-promise');

exports.getWeather = async (req, res) => {
  const countriesPromises = [];
  const weatherPromises = []; 
  const capitalsWeather = [];  
  JSON.parse(req.query.countries).forEach(country => countriesPromises.push(countryInfo(country)));
  const capitals = await Promise.all(countriesPromises);
  const validCapitals = capitals.filter(valid => valid !== null)
  validCapitals.forEach(capital => {
    const capitalName = getCapitalName(capital)
    weatherPromises.push(rp(`http://api.openweathermap.org/data/2.5/weather?q=${capitalName}&APPID=${process.env.TOKEN}`))
  })
  const weather = await Promise.all(weatherPromises);
  weather.forEach(info => {
    const weatherInfo = JSON.parse(info)
    capitalsWeather.push({
      capital: weatherInfo.name,
      weather: weatherInfo.weather
    })
  })
  res.json(capitalsWeather)
};

countryInfo = country => {
  return rp(`https://restcountries.eu/rest/v2/name/${country}?fullText=true&fields=capital`)
    .catch(err => {
      if (err.statusCode === 404) {
        return null;
      }
      next(err);
    })
}

getCapitalName = capital => {
  // We get the capital as str so we need to convert it to JSON -> it will return an arr of obj
  //  so we need the capital but, before returning it we must normalize the value removing
  //  special characters, to avoid problems like bogotá returning the request to the weather as
  //  Tizenháromváros
  return JSON.parse(capital)[0].capital.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}

const CountriesSelect = document.querySelector('.country');
const CitiesSelect = document.querySelector('.cities');
let Title = document.querySelector('h2');
let weatherBlocks = document.querySelector('.Full');

const images = [{
    snow: 'https://uploads-ssl.webflow.com/5d9ba0eb5f6edb77992a99d0/5de7d426e3f495a4fd640f5c_Snowing.gif',
    rain: 'https://i.pinimg.com/originals/c3/60/22/c36022cf0817d29ec22d42a23b14270e.gif',
    sun: 'https://media1.giphy.com/media/fwR54Wq7dYu9VXKiAF/giphy.gif?cid=6c09b952ua43ey561qvkmhi8oay9gxj3ggpkpu8dtidvbbng&ep=v1_stickers_related&rid=giphy.gif&ct=s',
    cloudy:'https://media2.giphy.com/media/fqVKfHAc7QOCnXRmHY/giphy.gif?cid=6c09b952icu8qizxz17ywv6accalteemc169rhi6wqgkukmy&ep=v1_stickers_related&rid=giphy.gif&ct=s', 
    all:'https://media4.giphy.com/media/kg5diJ8Aw8sc3cmJNL/giphy.gif?cid=6c09b9528bwvz2wy02y3cbxuf9ij1yhnop1y9d183fde0628&ep=v1_stickers_related&rid=giphy.gif&ct=s',
    sun_cloud: 'https://cdn.pixabay.com/animation/2023/05/24/09/12/09-12-20-332_512.gif',
    lightning_storm: 'https://media2.giphy.com/media/Y3q0cKmWt3DJLduGAX/giphy.gif',
    rain_storm: 'https://media4.giphy.com/media/VJq6ahBLV6O3lR8SB5/giphy.gif?cid=6c09b952ynn851sdc1w2qwr2pmqgdojwmik9i7mx8q9lyo0e&ep=v1_stickers_related&rid=giphy.gif&ct=s'

}]

CountriesSelect.addEventListener('change', ()=> {
    CitiesSelect.innerHTML = '<option value="" selected disabled>select city</option>';
    Title.innerText = `${CountriesSelect.value} - ${CitiesSelect.value}`;
    weatherBlocks.innerHTML = "";
    fetchUrls('Cities', `https://countriesnow.space/api/v0.1/countries/cities/q?country=${CountriesSelect.value}`);
})

CitiesSelect.addEventListener('change', () => {
    Title.innerText = `${CountriesSelect.value} - ${CitiesSelect.value}`;
    weatherBlocks.innerHTML = "";
    fetchUrls('place_id', `https://nominatim.openstreetmap.org/search.php?city=${CitiesSelect.value}&country=${CountriesSelect.value}&format=jsonv2`);
})

function fetchUrls(res_Type, url)
{
    fetch(url)
    .then(res =>  {return res.json()})
    .then(data => {

        if (res_Type == 'Countries')
        {
            get_select_Country(data);
        }
        else if(res_Type == 'Cities')
        {
            get_select_City(data);
        }
        else if(res_Type == 'place_id')
        {
            const lon = data[0].lon;
            const lat =  data[0].lat;
            fetchUrls('temperature', `https://www.7timer.info/bin/astro.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`);
        }
        else if(res_Type == 'temperature')
        {
            show_weather(data);
        }
    })
    .catch(err => {
        console.log(err);
    });
}

function get_select_Country(CountriesArr)
{
    CountriesArr.data.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
    });
    CountriesArr.data.forEach(Country => {
        if (Country.name != 'Palestinian Territory')
        {
            let Option = document.createElement('option');
            Option.value = Country.name;
            Option.innerText = Country.name;
            CountriesSelect.appendChild(Option);
        }
    });
}

function get_select_City(CitiesArr)
{
    if (CitiesArr.error)
    {
        console.log(CitiesArr.msg)
    }
    else
        CitiesArr.data.sort().forEach(City => {
            console.log(City);
            let Option = document.createElement('option');
            Option.value = City;
            Option.innerText = City;
            CitiesSelect.appendChild(Option);
        });
}

function show_weather(weather){
    const borderWeather = document.querySelector('.Full');
    console.log(weather);
    for(let i = 0; i<24; i++){
        let card = document.createElement('div');
        card.classList.add('card', 'border');
        let hours = (i+1)*3;
        let hours_label = document.createElement('label');
        hours_label.classList.add('center');
        hours_label.innerText = `+${hours}hrs`;
        let image = document.createElement('img');
        image.setAttribute('src', Weather_Type(weather.dataseries[i]));
        image.setAttribute('alt', 'snow');
        image.classList.add('image', 'center');
        let temperature = weather.dataseries[i].temp2m;
        let temp_label = document.createElement('label');
        temp_label.innerText = `${temperature}°`;
        temp_label.classList.add('center');
        temp_label.style.fontSize = '25px';
        card.append(hours_label, image, temp_label);
        borderWeather.appendChild(card);
        console.log(weather.dataseries[i].temp2m);
    }
}

function Weather_Type(weather){
    if (weather.prec_type == "rain" && weather.cloudcover > 5 && weather.cloudcover < 8)
    {
        return images[0].all;
    } 
    else if (weather.prec_type == "rain") 
    {
        return images[0].rain;
    } 
    else if (weather.lifted_index < -5) 
    {
        return images[0].lightning_storm;
    }
    else if (weather.lifted_index < -5 && weather.prec_type == "rain")
    {
        return images[0].rain_storm;
    }
    else if (weather.prec_type == "snow")
    {
        return images[0].snow;
    }
    else if (weather.cloudcover > 7 && weather.prec_type == 'none')
    {
        return images[0].cloudy;
    }
    else if (weather.cloudcover >= 3 && weather.cloudcover <= 7 && weather.prec_type == 'none')
    {
        return images[0].sun_cloud;
    }
    else if (weather.cloudcover < 3 && weather.prec_type == 'none')
    {
        return images[0].sun;
    }
    else
    {
        return images[0].all;
    }
}

fetchUrls('Countries','https://countriesnow.space/api/v0.1/countries/info?returns=flag');

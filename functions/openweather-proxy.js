const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const city = event.queryStringParameters.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!city) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "City parameter is missing." }),
    };
  }

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key is not configured." }),
    };
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )},jp&appid=${apiKey}&units=metric&lang=ja`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`APIエラー: ${errorData.message}`);
    }
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch weather data." }),
    };
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const weatherDiv = document.getElementById("weather");
  const toggleButton = document.getElementById("toggle-theme");
  const refreshButton = document.getElementById("refresh"); // 天気更新ボタン

  // OpenWeatherMapのAPIキー（クライアント側に埋め込む）
  const weatherApiKey = "d16c209e8002f3d569bdace463505fe4"; // ここに取得したAPIキーを入力

  // 天気のAPIエンドポイント
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Okayama,jp&appid=${weatherApiKey}&units=metric&lang=ja`;

  // 天気の状態に応じたアイコンのマッピング（Bootstrap Iconsを使用）
  const weatherIcons = {
    晴れ: "bi-sun-fill",
    曇り: "bi-cloud-fill",
    雨: "bi-cloud-rain-fill",
    雪: "bi-cloud-snow-fill",
    雷雨: "bi-cloud-lightning-fill",
    霧: "bi-cloud-fog-fill",
    // 必要に応じて他の天気状態を追加
  };

  // 天気情報を取得して表示する関数
  const fetchWeather = () => {
    weatherDiv.innerHTML = '<p class="card-text fs-4">読み込み中...</p>';

    fetch(weatherApiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod !== 200) {
          throw new Error(`APIエラー: ${data.message}`);
        }

        const weather = data.weather[0].description;
        const temperature = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        weatherDiv.innerHTML = `
          <p class="card-text fs-4">
            <img src="${icon}" alt="${weather}" width="50" height="50">
            天気: ${weather}
          </p>
          <p class="card-text fs-4">気温: ${temperature}°C</p>
          <p class="card-text fs-4">湿度: ${humidity}%</p>
          <p class="card-text fs-4">風速: ${windSpeed} m/s</p>
        `;
      })
      .catch((error) => {
        console.error("エラー:", error);
        weatherDiv.innerHTML =
          '<p class="card-text fs-4 text-danger">天気情報の取得に失敗しました。</p>';
      });
  };

  // ダークモードの切替
  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    // Bootstrapボタンのスタイルをトグル
    toggleButton.classList.toggle("btn-outline-secondary");
    toggleButton.classList.toggle("btn-outline-light");

    if (document.body.classList.contains("dark-mode")) {
      toggleButton.textContent = "ライトモード";
      toggleButton.classList.replace(
        "btn-outline-secondary",
        "btn-outline-light"
      );
    } else {
      toggleButton.textContent = "ダークモード";
      toggleButton.classList.replace(
        "btn-outline-light",
        "btn-outline-secondary"
      );
    }
  });

  // 天気更新ボタンの設定
  refreshButton.addEventListener("click", fetchWeather);

  // 初回データ取得
  fetchWeather();

  // 5分ごとに天気情報を更新
  setInterval(fetchWeather, 5 * 60 * 1000);
});

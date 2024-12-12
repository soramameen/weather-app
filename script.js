document.addEventListener("DOMContentLoaded", () => {
  const weatherDiv = document.getElementById("weather");
  const toggleButton = document.getElementById("toggle-theme");

  // サーバーサイドプロキシのURL（Netlifyの場合）
  const proxyUrl =
    "https://your-netlify-site.netlify.app/.netlify/functions/proxy?url=";

  // 気象庁の岡山の天気XMLデータのURL
  const jmaUrl = "https://www.jma.go.jp/bosai/forecast/data/forecast/okyo.xml";

  // 天気の状態に応じたアイコンのマッピング（Bootstrap Iconsを使用）
  const weatherIcons = {
    晴れ: "bi-sun-fill",
    曇り: "bi-cloud-fill",
    雨: "bi-cloud-rain-fill",
    雪: "bi-cloud-snow-fill",
    // 他の天気状態を追加
  };

  const fetchWeather = () => {
    weatherDiv.innerHTML = '<p class="card-text fs-4">読み込み中...</p>';

    fetch(`${proxyUrl}${encodeURIComponent(jmaUrl)}`)
      .then((response) => response.text())
      .then((str) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(str, "application/xml");

        const parserError = xml.querySelector("parsererror");
        if (parserError) {
          throw new Error("XMLのパースに失敗しました。");
        }

        const timeSeries = xml.querySelector("timeSeries");
        if (!timeSeries) {
          throw new Error("天気データが見つかりません。");
        }

        const time = timeSeries.querySelector("time");
        if (!time) {
          throw new Error("時間データが見つかりません。");
        }

        const weather = time.querySelector("weather").textContent;
        const temperatureElement = time.querySelector("temperature");
        let temperature = "情報なし";
        if (temperatureElement) {
          temperature = temperatureElement.textContent;
        }

        // アイコンの取得
        const iconClass = weatherIcons[weather] || "bi-question-circle-fill";

        // 表示
        weatherDiv.innerHTML = `
          <p class="card-text fs-4">
            <i class="bi ${iconClass}"></i> 天気: ${weather}
          </p>
          <p class="card-text fs-4">気温: ${temperature}°C</p>
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

  // 初回データ取得
  fetchWeather();

  // 5分ごとにデータを更新
  setInterval(fetchWeather, 5 * 60 * 1000);
});

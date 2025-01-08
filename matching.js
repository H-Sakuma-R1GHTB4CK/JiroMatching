document.addEventListener("DOMContentLoaded", () => {
    // クエリパラメータから店舗リストを取得
    const params = new URLSearchParams(window.location.search);
    const storesParam = params.get("stores");
  
    let storeList = [];
    if (storesParam) {
      try {
        storeList = JSON.parse(decodeURIComponent(storesParam));
      } catch (e) {
        console.error("JSON解析エラー:", e);
      }
    }
  
    // 現在表示中の店舗を指し示すインデックス
    let currentIndex = 0;
  
    // 各店舗に対する評価を格納する (例: { "三田本店": "すき", "仙川店": "ふつう", ... } )
    const preferences = {};
  
    // 要素を取得
    const storeNameEl = document.getElementById("storeName");
    const likeButton = document.getElementById("likeButton");
    const neutralButton = document.getElementById("neutralButton");
    const dislikeButton = document.getElementById("dislikeButton");
    const statusMessage = document.getElementById("statusMessage");
    const backButton = document.getElementById("backButton");
  
    // 店舗を表示する関数
    function showStore(index) {
      if (storeList.length === 0) {
        storeNameEl.textContent = "店舗が選択されていません。";
        hideButtons();
        return;
      }
      if (index < storeList.length) {
        storeNameEl.textContent = storeList[index];
      } else {
        // すべての店舗を評価し終わった場合の表示
        storeNameEl.textContent = "評価が完了しました！";
        hideButtons();
        showBackButton(); // 戻るボタンを表示
        // ここでは結果をコンソールに出力する例を示す
        console.log("=== 評価結果 ===");
        console.table(preferences);
        statusMessage.textContent = "ご協力ありがとうございました！";
        // ---------------------------
        // 2. ★ すべての評価が終わったタイミングでサーバーへ送信する
        // ---------------------------
        sendDataToServer(preferences);
      }
    }
    // ---------------------------
    // 3. サーバーへデータを送信する関数
    // ---------------------------
    function sendDataToServer(data) {
      // EC2上のサーバーURL (例)
      //  - <YOUR_EC2_PUBLIC_IP_OR_DOMAIN> の部分を実際の IP or ドメインに置き換えてください
      //  - ポートは Flask で 5000 にしているなら :5000 を含める
      const serverUrl = "http://57.180.51.248:5000/echo";

      fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // preferences オブジェクトをJSON文字列に変換して送信
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(returnedData => {
          console.log("サーバーからのレスポンス:", returnedData);
          // 例: { status: "OK", receivedData: { … } }
          alert("サーバーからのレスポンス:\n" + JSON.stringify(returnedData, null, 2));
        })
        .catch(error => {
          console.error("サーバー通信エラー:", error);
        });
    }
    // ボタンを隠す関数
    function hideButtons() {
      likeButton.style.display = "none";
      neutralButton.style.display = "none";
      dislikeButton.style.display = "none";
    }
  
    // ボタンを表示する関数
    function showButtons() {
      likeButton.style.display = "inline-block";
      neutralButton.style.display = "inline-block";
      dislikeButton.style.display = "inline-block";
    }
  
    // 戻るボタンを表示する関数
    function showBackButton() {
      backButton.style.display = "inline-block";
    }
  
    // 戻るボタンを非表示にする関数
    function hideBackButton() {
      backButton.style.display = "none";
    }
  
    // ボタンクリック時の処理
    function handlePreference(preference) {
      const currentStore = storeList[currentIndex];
      preferences[currentStore] = preference;
      currentIndex++;
      showStore(currentIndex);
    }
  
    likeButton.addEventListener("click", () => {
      handlePreference("すき");
    });
  
    neutralButton.addEventListener("click", () => {
      handlePreference("ふつう");
    });
  
    dislikeButton.addEventListener("click", () => {
      handlePreference("すきじゃない");
    });
  
    // 「戻る」ボタンの処理
    backButton.addEventListener("click", () => {
      // 選択画面に遷移
      window.location.href = "index.html"; // 適切なパスに変更してください
    });
  
    // 初期表示
    showStore(currentIndex);
  });
  
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
  
    // 各店舗に対する評価を格納する (例: { "mita": 1, "sapporo": 0, ... } )各店舗に対する評価を格納する (例: { "mita": 1, "sapporo": 0, ... } )
    const preferences = {};
    
    // 店舗名から店舗IDへのマッピング
    const storeMapping = {
      "三田本店": "mita",
      "仙川店": "store2_id",
      "札幌店":"sapporo",
      "仙台店":"sendai",
      "会津若松駅前店":"aizu",
      "新潟店":"niigara",
      "ひたちなか店":"hitachi",
      "栃木街道店":"tochigi",
      "前橋千代田町店":"maebashi",
      "千葉店":"chiba",
      "松戸駅前店 Ⅲ":"matsudo",
      "京成大久保店":"ookubo",
      "柏店":"kashiwa",
      "横浜関内店":"kannai",
      "中山駅前店":"nakayama",
      "京急川崎店":"kawasaki",
      "相模大野店":"sagamiono",
      "湘南藤沢店":"fujisawa",
      "生田駅前店":"ikuta",
      "三田本店":"mita",
      "神田神保町店":"jinbocho",
      "池袋東口店":"ikebukuro",
      "新宿歌舞伎町店":"kabuki",
      "新宿小滝橋通り店":"otakibashi",
      "上野毛店":"kaminoge",
      "環七新新代田店":"shindaita",
      "目黒店":"meguro",
      "品川店":"shinagawa",
      "西台駅前店":"nishidai",
      "桜台駅前店":"sakuradai",
      "ひばりヶ丘駅前店":"hibari",
      "千住大橋駅前店":"senjuohashi",
      "亀戸店":"kameido",
      "小岩店":"koiwa",
      "環七一之江店":"ichinoe",
      "荻窪店":"ogikubo",
      "仙川店":"sengawa",
      "府中店":"fuchu",
      "立川店":"tachikawa",
      "八王子野猿街道店2":"yaen"
    };

    function getStoreId(storeName) {
      return storeMapping[storeName] || storeName;
    }

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
        // データをサーバーへ送信する
        sendDataToServer(preferences);
      }
    }
    // サーバーへデータを送信する関数
    async function sendDataToServer(data) {
      try {
        const userIp = await getUserIP();
        const hashedIp = await hashIP(userIp);
  
        const payload = {
          user_id: hashedIp, // ハッシュ化されたIPアドレスをuser_idとして送信
          ratings: data
        };
  
        const serverUrl = "https://api.heilong.jp:5000/echo";
  
        const response = await fetch(serverUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
  
        if (!response.ok) {
          throw new Error(`サーバーエラー: ${response.status} ${response.statusText}`);
        }
  
        const returnedData = await response.json();
        console.log("サーバーからのレスポンス:", returnedData);
        alert("サーバーからのレスポンス:\n" + JSON.stringify(returnedData, null, 2));
      } catch (error) {
        console.error("データ送信エラー:", error);
        alert("データ送信中にエラーが発生しました。");
      }
    }
  
    // ユーザーのIPアドレスを取得する関数（外部サービスを利用）
    async function getUserIP() {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
          throw new Error(`IP取得エラー: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error('IP取得エラー:', error);
        return 'unknown';
      }
    }

    // ユーザーのIPアドレスをSHA-256でハッシュ化する関数
    async function hashIP(ip) {
      const encoder = new TextEncoder();
      const data = encoder.encode(ip);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
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
      const storeId = getStoreId(currentStore); // 店舗IDを取得
      preferences[storeId] = preference;
      currentIndex++;
      showStore(currentIndex);
    }
  
    likeButton.addEventListener("click", () => {
      handlePreference(1);
    });
  
    neutralButton.addEventListener("click", () => {
      handlePreference(0);
    });
  
    dislikeButton.addEventListener("click", () => {
      handlePreference(-1);
    });
  
    // 「戻る」ボタンの処理
    backButton.addEventListener("click", () => {
      // 選択画面に遷移
      window.location.href = "index.html"; // 適切なパスに変更してください
    });
  
    // 初期表示
    showStore(currentIndex);
  });
  
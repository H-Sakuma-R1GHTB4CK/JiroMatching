document.addEventListener("DOMContentLoaded", () => {
    const storeContainer = document.getElementById("store-container");
    const nextButton = document.getElementById("nextButton");
  
    // 選択した店舗を格納する配列
    let selectedStores = [];
  
    // ---------------------------
    // [例] タイルを4件分だけ用意（本来はサーバーから取得等）
    // ---------------------------
    const Stores = [
      "札幌店", "仙台店", "会津若松駅前店", "新潟店", "ひたちなか店", "栃木街道店", "前橋千代田町店", "千葉店",
      "松戸駅前店 Ⅲ", "京成大久保店", "柏店", "横浜関内店", "中山駅前店", "京急川崎店", "相模大野店", "湘南藤沢店",
      "生田駅前店", "三田本店", "神田神保町店", "池袋東口店", "新宿歌舞伎町店", "新宿小滝橋通り店", "上野毛店",
      "環七新新代田店", "目黒店", "品川店", "西台駅前店", "桜台駅前店", "ひばりヶ丘駅前店", "千住大橋駅前店",
      "亀戸店", "小岩店", "環七一之江店", "荻窪店", "仙川店", "府中店", "立川店", "八王子野猿街道店2"
    ];
  
    // タイルを生成してDOMに配置
    Stores.forEach((storeName) => {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.innerText = storeName;
  
      // クリック時の処理
      tile.addEventListener("click", () => {
        // 選択状態の切り替え
        if (tile.classList.contains("selected")) {
          tile.classList.remove("selected");
          // 配列から削除
          selectedStores = selectedStores.filter(name => name !== storeName);
        } else {
          tile.classList.add("selected");
          // 配列に追加
          selectedStores.push(storeName);
        }
      });
  
      // タイルをコンテナに追加
      storeContainer.appendChild(tile);
    });
  
    // ---------------------------
    // Next ボタンを押したら次ページへ遷移
    // ---------------------------
    nextButton.addEventListener("click", () => {
      // 取得した店舗リストをクエリパラメータ（URLに付ける）形にエンコード
      const storeListString = encodeURIComponent(JSON.stringify(selectedStores));
      
      // matching.html にパラメータを付けて遷移
      window.location.href = `matching.html?stores=${storeListString}`;
    });
  });
  
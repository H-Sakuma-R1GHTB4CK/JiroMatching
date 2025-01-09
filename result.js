document.addEventListener("DOMContentLoaded", () => {
    // 要素を取得
    const fetchResultButton = document.getElementById("fetchResultButton");
    const resultContent = document.getElementById("resultContent");
    const referenceDataCount = document.getElementById("referenceDataCount"); // 参考データペア数表示用
    const backToTopButton = document.getElementById("backToTopButton"); // トップに戻るボタン
    // クエリパラメータから user_id を取得
    const params = new URLSearchParams(window.location.search);
    const user_id = params.get("user_id");
    if (!user_id) {
      alert("ユーザーIDが見つかりません。トップページに戻ります。");
      window.location.href = "index.html";
      return;
    }
    // 結果を取得するボタンのクリックイベント
    fetchResultButton.addEventListener("click", async () => {
      try {
        // ボタンを一時的に無効化してユーザーに処理中であることを示す
        fetchResultButton.disabled = true;
        fetchResultButton.textContent = "取得中...";
  
        // GET /result APIを呼び出す
        const response = await fetch("https://api.heilong.jp/result", { // 必要に応じてURLを調整
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user_id })
        });
  
        if (!response.ok) {
          throw new Error(`サーバーエラー: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        // 参考データペア数を表示
        displayReferenceDataCount(data.unique_pairs_count);
        // 結果を表示する
        displayResults(data.data);
  
        // ボタンの状態を元に戻す
        fetchResultButton.disabled = false;
        fetchResultButton.textContent = "結果を取得";
      } catch (error) {
        console.error("結果取得エラー:", error);
        alert("結果の取得中にエラーが発生しました。");
        
        // ボタンの状態を元に戻す
        fetchResultButton.disabled = false;
        fetchResultButton.textContent = "結果を取得";
      }
    });
  
    // トップに戻るボタンのクリックイベント
    backToTopButton.addEventListener("click", () => {
      // index.html に遷移
      window.location.href = "index.html"; // 必要に応じてパスを調整
    });
    // 参考データペア数を表示する関数
    function displayReferenceDataCount(count) {
      if (!referenceDataCount) return;
      referenceDataCount.textContent = `参考にしたデータペア数: ${count}`;
    }
    // 結果を表示する関数
    function displayResults(results) {
      if (!Array.isArray(results) || results.length === 0) {
        resultContent.innerHTML = "<p>評価結果はありません。</p>";
        return;
      }
  
      // テーブル形式で結果を表示
  let tableHTML = `
  <table class="min-w-full bg-white">
    <thead>
      <tr>
        <th class="py-2 px-4 border-b">順位</th>
        <th class="py-2 px-4 border-b">店舗名</th>
        <th class="py-2 px-4 border-b">評価値</th>
      </tr>
    </thead>
    <tbody>
`;

// 結果を順位付きで表示
results.forEach((record, index) => {
  tableHTML += `
    <tr>
      <td class="py-2 px-4 border-b">${index + 1}</td>
      <td class="py-2 px-4 border-b">${escapeHTML(record.store_name)}</td>
      <td class="py-2 px-4 border-b">${escapeHTML(record.predicted_score.toFixed(2))}</td>
    </tr>
  `;
});
      tableHTML += `
          </tbody>
        </table>
      `;
  
      resultContent.innerHTML = tableHTML;
    }
  
    // XSS対策として文字列をエスケープする関数
    function escapeHTML(str) {
      if (typeof str !== 'string') {
        return str;
      }
      return str.replace(/[&<>"'`=\/]/g, function (s) {
        return ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '/': '&#x2F;',
          '`': '&#x60;',
          '=': '&#x3D;'
        })[s];
      });
    }
  });
  
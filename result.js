document.addEventListener("DOMContentLoaded", () => {
    // 要素を取得
    const fetchResultButton = document.getElementById("fetchResultButton");
    const resultContent = document.getElementById("resultContent");
  
    // ボタンがクリックされたときの処理
    fetchResultButton.addEventListener("click", async () => {
      try {
        // ボタンを一時的に無効化してユーザーに処理中であることを示す
        fetchResultButton.disabled = true;
        fetchResultButton.textContent = "取得中...";
  
        // GET /result APIを呼び出す
        const response = await fetch("https://api.heilong.jp/result", { // 必要に応じてURLを調整
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
  
        if (!response.ok) {
          throw new Error(`サーバーエラー: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
  
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
              <th class="py-2 px-4 border-b">ユーザーID</th>
              <th class="py-2 px-4 border-b">店舗ID</th>
              <th class="py-2 px-4 border-b">評価</th>
            </tr>
          </thead>
          <tbody>
      `;
  
      results.forEach(record => {
        tableHTML += `
          <tr>
            <td class="py-2 px-4 border-b">${escapeHTML(record.user_id)}</td>
            <td class="py-2 px-4 border-b">${escapeHTML(record.store_id)}</td>
            <td class="py-2 px-4 border-b">${escapeHTML(record.rating)}</td>
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
  
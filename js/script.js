// 例: script.js の冒頭あたりに記述
const APPS_SCRIPT_API_URL = 'https://script.google.com/macros/s/AKfycbzQn1IKFAbdDYQilVApYvnsKUynzCH1-17I9ztbh9dD8sht4Ae_NrFysKno-GJEJmQrfQ/exec';

document.addEventListener('DOMContentLoaded', () => {
  // DOM要素の取得
  const sections = document.querySelectorAll('.form-section');
  let currentSection = 1; // 現在表示中のセクション番号

  // エラーメッセージ要素を管理するためのマップ
  const errorElements = {
    part: document.getElementById('partError'),
    lastName: document.getElementById('nameError'), // 姓と名の両方に同じエラーメッセージを共有
    firstName: document.getElementById('nameError'),
    email: document.getElementById('emailError'),
    emailFormat: document.getElementById('emailFormatError'),
    memberType: document.getElementById('memberTypeError'),
    familyLastName: document.getElementById('familyNameError'), // 家族姓と名の両方に同じエラーメッセージを共有
    familyFirstName: document.getElementById('familyNameError'),
    ageGroup: document.getElementById('ageGroupError'),
    sTicketFormat: document.getElementById('sTicketFormatError'),
    aTicketFormat: document.getElementById('aTicketFormatError'),
    bTicketFormat: document.getElementById('bTicketFormatError'),
    cTicketFormat: document.getElementById('cTicketFormatError'),
    bTicketLimit: document.getElementById('bTicketLimitError'),
    cTicketLimit: document.getElementById('cTicketLimitError'),
    normaCheck: document.getElementById('normaCheckErrorMessage')
  };

  // エラーメッセージの表示
  function displayError(elementKey, message) {
    const errorEl = errorElements[elementKey];
    if (errorEl) {
      errorEl.innerText = message;
      errorEl.classList.add('show');
      // 親のform-groupにエラークラスを追加してスタイルを適用することも可能
    }
  }

  // エラーメッセージのクリア
  function clearError(elementKey) {
    const errorEl = errorElements[elementKey];
    if (errorEl) {
      errorEl.innerText = '';
      errorEl.classList.remove('show');
    }
  }

  // 全てのエラーメッセージをクリアするヘルパー関数
  function clearAllErrors() {
    for (const key in errorElements) {
      clearError(key);
    }
  }

  // セクション表示を切り替える関数
  function showSection(sectionNumber) {
    clearAllErrors(); // セクション移動時に全てのエラーメッセージをクリア
    sections.forEach((section, index) => {
      if (index + 1 === sectionNumber) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
    currentSection = sectionNumber;
    // 画面の最上部へスクロールする
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // スムーズなスクロールアニメーション
    });
  }
  
  // 次のセクションへ進む関数
  function nextSection(nextNum) {
    showSection(nextNum);
  }

  // 前のセクションへ戻る関数
  function prevSection(prevNum) {
    showSection(prevNum);
  }

  // セクション1のバリデーションと遷移
  function validateSection1AndNext() {
    clearAllErrors();
    let isValid = true;
    let firstInvalidField = null;

    const part = document.getElementById('part');
    const lastName = document.getElementById('lastName');
    const firstName = document.getElementById('firstName');
    const email = document.getElementById('email');

    if (!part.value) {
      displayError('part', '必須入力欄です。');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = part;
    }
    if (!lastName.value) {
      displayError('lastName', '必須入力欄です。');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = lastName;
    }
    if (!firstName.value) {
      displayError('firstName', '必須入力欄です。');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = firstName;
    }
    if (!email.value) {
      displayError('email', '必須入力欄です。');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = email;
    } else {
      // メールアドレスの厳密な正規表現チェック
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email.value)) {
        displayError('emailFormat', '正しい形式でメールアドレスを入力してください。');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = email;
      }
    }
    
    if (isValid) {
      nextSection(2);
    } else if (firstInvalidField) {
      firstInvalidField.focus();
    }
  }

  // セクション2のバリデーションと遷移
  function validateSection2AndNext() {
    clearAllErrors();
    let isValid = true;
    let firstInvalidField = null;

    const memberType = document.getElementById('memberType');
    if (!memberType.value) {
      displayError('memberType', '必須入力欄です。');
      isValid = false;
      if (!firstInvalidField) firstInvalidField = memberType;
    }

    if (memberType.value === '夫婦・家族・兄弟') {
      const familyLastName = document.getElementById('familyLastName');
      const familyFirstName = document.getElementById('familyFirstName');
      const ageGroup = document.getElementById('ageGroup');

      if (!familyLastName.value) {
        displayError('familyLastName', '必須入力欄です。');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = familyLastName;
      }
      if (!familyFirstName.value) {
        displayError('familyFirstName', '必須入力欄です。');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = familyFirstName;
      }
      if (!ageGroup.value) {
        displayError('ageGroup', '必須入力欄です。');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = ageGroup;
      }
    }

    if (isValid) {
      // 団員区分に関わらず、必ずセクション3（チケット種類・枚数）へ遷移
      nextSection(3); 
    } else if (firstInvalidField) {
      firstInvalidField.focus();
    }
  }

  // セクション2の団員区分変更時の家族情報表示制御
  function toggleFamilyInfo() {
    const memberType = document.getElementById('memberType').value;
    const familyInfoGroup = document.getElementById('familyInfoGroup');
    const familyLastName = document.getElementById('familyLastName');
    const familyFirstName = document.getElementById('familyFirstName');
    const ageGroup = document.getElementById('ageGroup');

    if (memberType === '夫婦・家族・兄弟') {
      familyInfoGroup.style.display = 'block';
      familyLastName.setAttribute('required', 'required');
      familyFirstName.setAttribute('required', 'required');
      ageGroup.setAttribute('required', 'required');
    } else {
      familyInfoGroup.style.display = 'none';
      familyLastName.removeAttribute('required');
      familyFirstName.removeAttribute('required');
      ageGroup.removeAttribute('required');
      // 非表示になったら入力値をクリアし、エラーもクリア
      familyLastName.value = '';
      familyFirstName.value = '';
      ageGroup.value = '';
      clearError('familyLastName');
      clearError('ageGroup');
    }
  }

  // チケット枚数入力の半角数字チェックと枚数制限チェック（リアルタイム）
  function validateTicketInput(inputElement) {
    clearError(inputElement.id + 'Format'); // まず形式エラーをクリア
    clearError(inputElement.id + 'Limit'); // まず制限エラーをクリア

    const value = inputElement.value;
    if (value === '') { // 空欄も許容し、0として扱う
        return true;
    }

    if (!/^\d*$/.test(value)) { // 半角数字以外が含まれている場合
      displayError(inputElement.id + 'Format', '半角数字で入力してください。');
      return false; // 数字形式エラーがある場合はそれ以上チェックしない
    }

    const numValue = parseInt(value) || 0; // 数値に変換、空欄は0とする

    // 枚数制限チェック
    if (inputElement.id === 'bTicket' && numValue > 3) {
      displayError('bTicketLimit', '枚数制限をオーバーしています。（最大3枚）');
      return false;
    }
    if (inputElement.id === 'cTicket' && numValue > 2) {
      displayError('cTicketLimit', '枚数制限をオーバーしています。（最大2枚）');
      return false;
    }

    // 全てのチェックをクリアしたら、エラーメッセージを非表示に
    return true;
  }

  // 席のランク変更チェックボックスの排他制御
  function handleRankChangeCheckbox(clickedCheckbox) {
    const rankUp = document.getElementById('rankUp');
    const rankDown = document.getElementById('rankDown');
    const rankNoChange = document.getElementById('rankNoChange');

    if (clickedCheckbox === rankNoChange) {
      if (rankNoChange.checked) {
        rankUp.checked = false;
        rankDown.checked = false;
        rankUp.disabled = true;
        rankDown.disabled = true;
      } else {
        rankUp.disabled = false;
        rankDown.disabled = false;
      }
    } else {
      if (rankUp.checked || rankDown.checked) {
        rankNoChange.checked = false;
        rankNoChange.disabled = true;
      } else {
        rankNoChange.disabled = false;
      }
    }
  }


  // セクション3のバリデーションと確認画面への遷移
  async function validateSection3AndNext() {
    clearAllErrors();
    let isValid = true;
    let firstInvalidField = null;

    // 半角数字、枚数制限のバリデーションを改めて実行
    const sTicketInput = document.getElementById('sTicket');
    const aTicketInput = document.getElementById('aTicket');
    const bTicketInput = document.getElementById('bTicket');
    const cTicketInput = document.getElementById('cTicket');

    if (!validateTicketInput(sTicketInput)) { isValid = false; if (!firstInvalidField) firstInvalidField = sTicketInput; }
    if (!validateTicketInput(aTicketInput)) { isValid = false; if (!firstInvalidField) firstInvalidField = aTicketInput; }
    if (!validateTicketInput(bTicketInput)) { isValid = false; if (!firstInvalidField) firstInvalidField = bTicketInput; }
    if (!validateTicketInput(cTicketInput)) { isValid = false; if (!firstInvalidField) firstInvalidField = cTicketInput; }

    // 半角数字エラーや枚数制限エラーがあればここで終了
    if (document.getElementById('sTicketFormatError').classList.contains('show') ||
        document.getElementById('aTicketFormatError').classList.contains('show') ||
        document.getElementById('bTicketFormatError').classList.contains('show') ||
        document.getElementById('cTicketFormatError').classList.contains('show') ||
        document.getElementById('bTicketLimitError').classList.contains('show') ||
        document.getElementById('cTicketLimitError').classList.contains('show')) {
        isValid = false; 
        if (!firstInvalidField) { // 最初の不正フィールドにフォーカス
            if (document.getElementById('sTicketFormatError').classList.contains('show')) firstInvalidField = sTicketInput;
            else if (document.getElementById('aTicketFormatError').classList.contains('show')) firstInvalidField = aTicketInput;
            else if (document.getElementById('bTicketFormatError').classList.contains('show')) firstInvalidField = bTicketInput;
            else if (document.getElementById('cTicketFormatError').classList.contains('show')) firstInvalidField = cTicketInput;
            else if (document.getElementById('bTicketLimitError').classList.contains('show')) firstInvalidField = bTicketInput;
            else if (document.getElementById('cTicketLimitError').classList.contains('show')) firstInvalidField = cTicketInput;
        }
    }

    if (!isValid) {
      if (firstInvalidField) firstInvalidField.focus();
      return; // 他のバリデーションエラーがあればここで終了
    }

    // 全てのチケット枚数フィールドが空の場合でもバリデーションは通過させる（0として扱うため）
    const sTicketVal = parseInt(sTicketInput.value) || 0;
    const aTicketVal = parseInt(aTicketInput.value) || 0;
    const bTicketVal = parseInt(bTicketInput.value) || 0;
    const cTicketVal = parseInt(cTicketInput.value) || 0;

    showLoadingOverlay('ノルマを計算しています...');

    const memberType = document.getElementById('memberType').value;
    const ageGroup = (memberType === '夫婦・家族・兄弟') ? document.getElementById('ageGroup').value : '';
    const totalTickets = sTicketVal + aTicketVal + bTicketVal + cTicketVal;

// calculateNormaを呼び出していた箇所
// （変更前）
// try {
//     const response = await new Promise((resolve, reject) => {
//         google.script.run
//             .withSuccessHandler(res => {
//                 console.log("GASからノルマチェック結果を受け取りました:", res);
//                 resolve(res);
//             })
//             .withFailureHandler(error => {
//                 console.error("GASからのノルマチェックエラー:", error);
//                 reject(error);
//             })
//             .calculateNorma(memberType, ageGroup, totalTickets); // ここ
//     });
//     // ... responseを使った処理 ...
// } catch (e) {
//     // ... エラー処理 ...
// }


// GASからの応答を待つ部分（前回の回答で提示した fetch API の部分）
try {
    const params = new URLSearchParams({
        action: 'getNormaData', // doGetでこのactionをチェックするようにしたと仮定
        memberType: memberType,
        ageGroup: ageGroup,
        totalTickets: totalTickets
    });

    const fetchResponse = await fetch(`${APPS_SCRIPT_API_URL}?${params.toString()}`, {
        method: 'GET'
    });

    // --- ここからが、あなたが提示してくれたコードと連携する部分の修正 ---

    // HTTPステータスが正常かチェック
    if (!fetchResponse.ok) {
        // HTTPエラー（例: 404, 500など）の場合
        const errorText = await fetchResponse.text(); // エラーの詳細を取得
        console.error("GASからのHTTPエラー応答:", fetchResponse.status, fetchResponse.statusText, errorText);
        displayError('normaCheck', `ノルマチェック中にサーバーエラーが発生しました (${fetchResponse.status})。管理者に連絡してください。`);
        hideLoadingOverlay();
        return; // ここで処理を中断
    }

    // JSONレスポンスをパース
    const response = await fetchResponse.json(); // fetchResponseをresponseに格納

    // あなたが提示してくれた既存のノルマチェック結果処理
    if (!response || typeof response.isNormaMet === 'undefined') {
        // responseがundefinedまたはisNormaMetプロパティがない場合
        console.error("予期せぬGAS応答形式:", response);
        displayError('normaCheck', 'ノルマチェック中に予期せぬエラーが発生しました。管理者に連絡してください。');
        hideLoadingOverlay();
        return;
    }

    if (!response.isNormaMet) {
        // ノルマ未達成の場合
        const errorMessage = response.errorMessage ? response.errorMessage : `ノルマ枚数不足です。申込必要枚数は合計${response.requiredTickets}枚です。`;
        displayError('normaCheck', errorMessage);
        document.getElementById('normaCheckErrorMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });
        hideLoadingOverlay();
        return;
    } else {
        // ノルマ達成の場合、エラーメッセージをクリア
        clearError('normaCheck');
        // 確認画面の生成と表示
        generateSummaryContent();
        nextSection(4); // 確認画面へ
        hideLoadingOverlay();
    }

} catch (error) {
    // ネットワークエラーなど、fetch自体が失敗した場合
    console.error("ノルマチェック中にネットワークエラーが発生しました:", error);
    displayError('normaCheck', 'ノルマチェック中に通信エラーが発生しました。ネットワーク接続を確認してください。');
    hideLoadingOverlay();
}


  // 確認画面の内容を生成する関数
  function generateSummaryContent() {
    const summaryDiv = document.getElementById('summaryContent');
    const values = getFormValues(); // 現在のフォーム値を取得

    let html = '';
    html += `<p><strong>パート：</strong>${values.part}</p>`;
    html += `<p><strong>お名前：</strong>${values.lastName} ${values.firstName}</p>`;
    html += `<p><strong>メールアドレス：</strong>${values.email}</p>`;
    html += `<p><strong>団員区分：：</strong>${values.memberType}</p>`;

    if (values.memberType === '夫婦・家族・兄弟') {
      html += `<p><strong>ご家族のお名前：</strong>${values.familyLastName} ${values.familyFirstName}</p>`;
      html += `<p><strong>あなたの年代：：</strong>${values.ageGroup}</p>`;
    }

    html += `<p><strong>チケット枚数：</strong></p>`;
    html += `<ul>`;
    html += `<li>S券：${values.sTicket}枚</li>`;
    html += `<li>A券：${values.aTicket}枚</li>`;
    html += `<li>B券：${values.bTicket}枚</li>`;
    html += `<li>C券：${values.cTicket}枚</li>`;
    html += `</ul>`;

    // 任意項目の表示制御（項目名は表示し、値がなければ何も表示しない）
    html += `<p><strong>離れた席のアサイン：：</strong>`;
    if (values.separateSeats) {
        html += `OK`;
    } else {
        html += `回答無し`;
    }
    html += `</p>`;


    // 席のランク変更
    let rankChangeText = '';
    if (values.rankNoChange) {
        rankChangeText = 'ランク変更不可';
    } else {
        if (values.rankUp) rankChangeText += '席のランクアップ可';
        if (values.rankDown) {
            if (rankChangeText) rankChangeText += '／';
            rankChangeText += '席のランクダウン可';
        }
    }
    html += `<p><strong>席のランク変更：</strong>${rankChangeText || '回答無し'}</p>`;


    html += `<p><strong>席割り当てのご相談事項・備考：</strong>`;
    if (values.seatPreference) {
      html += `${values.seatPreference.replace(/\n/g, '<br>')}`;
    } else {
      html += `回答無し`;
    }
    html += `</p>`;


    summaryDiv.innerHTML = html;
  }

  // フォームの全入力値を取得してオブジェクトとして返す
  function getFormValues() {
    const form = document.getElementById('ticketForm');
    const values = {};
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        // チェックボックスは個別に処理
        if (input.id === 'separateSeats') {
            values.separateSeats = input.checked; // true/falseで値を格納
        } else if (input.name === '席のランク変更可否' || input.name === '席のランク変更不可') {
            values.rankUp = document.getElementById('rankUp').checked;
            values.rankDown = document.getElementById('rankDown').checked;
            values.rankNoChange = document.getElementById('rankNoChange').checked;
        }
      } else if (input.name) { // name属性があるものだけ取得
        values[input.id || input.name] = input.value;
      }
    });

    // 数値は文字列として取得されるので、数値に変換
    values.sTicket = parseInt(values.sTicket) || 0;
    values.aTicket = parseInt(values.aTicket) || 0;
    values.bTicket = parseInt(values.bTicket) || 0;
    values.cTicket = parseInt(values.cTicket) || 0;

    return values;
  }

  // ローディングオーバーレイ表示関数
  function showLoadingOverlay(message = '処理中です。しばらくお待ちください...') {
    const overlay = document.getElementById('loadingOverlay');
    overlay.querySelector('p').innerText = message;
    overlay.style.display = 'flex';
  }

  // ローディングオーバーレイ非表示関数
  function hideLoadingOverlay() {
    document.getElementById('loadingOverlay').style.display = 'none';
  }

  // フォーム最終送信ボタンのイベントリスナー
  document.getElementById('submitFormButton').addEventListener('click', async function() {
    showLoadingOverlay('お申し込みを送信しています...');
    const formData = getFormValues();

    try {
      console.log("クライアント: submitTicketApplicationを呼び出します。"); // ★追加ログ1★
      const result = await new Promise((resolve, reject) => {
          google.script.run
              .withSuccessHandler(res => {
                  console.log("GASから送信結果を受け取りました:", res);
                  resolve(res);
              })
              .withFailureHandler(error => {
                  console.error("GASからの送信エラー:", error);
                  reject(error);
              })
              .submitTicketApplication(formData);
      });

      console.log("クライアント: GASからの結果を受け取り、処理を開始します。結果:", result); // ★追加ログ2★

      if (result.success) {
        console.log("クライアント: 申し込み成功、完了画面へ遷移します。"); // ★追加ログ3★
        showSection(5); // 完了画面へ
      } else {
        console.log("クライアント: 申し込み失敗、エラーメッセージを表示します。"); // ★追加ログ4★
        alert('お申し込みに失敗しました: ' + result.message);
      }
    } catch (e) {
      console.error("JavaScriptからのGAS呼び出しエラー:", e);
      alert('システムエラーが発生しました。開発者にお問い合わせください。\nエラー詳細: ' + e.message);
    } finally {
      // 成功・失敗どちらの場合でも、最後にオーバーレイを非表示にする
      console.log("クライアント: ローディングオーバーレイを非表示にします。"); // ★追加ログ5★
      hideLoadingOverlay();
    }
  });


    const openModalLink = document.getElementById('openSeatingChartModal');
    const seatingChartModal = document.getElementById('seatingChartModal');
    const closeButton = seatingChartModal.querySelector('.close-button');
    const seatingChartImage = seatingChartModal.querySelector('.seating-chart-image');

    // リンクをクリックでモーダルを開く
    if (openModalLink) {
        openModalLink.addEventListener('click', (event) => {
            event.preventDefault(); // デフォルトのリンク動作をキャンセル
            seatingChartModal.style.display = 'flex'; // flexを使って中央揃えを有効にする
            // ここに画像のURLを設定
            seatingChartImage.src = "https://image.jimcdn.com/app/cms/image/transf/dimension=856x10000:format=png/path/s5bd072393dfe96d6/image/id3d5e66f11c6e827/version/1748520505/%E6%9D%B1%E4%BA%AC%E3%82%A2%E3%82%AB%E3%83%87%E3%83%9F%E3%83%BC%E5%90%88%E5%94%B1%E5%9B%A3%E7%AC%AC%EF%BC%97%EF%BC%90%E5%9B%9E%E5%AE%9A%E6%9C%9F%E6%BC%94%E5%A5%8F%E4%BC%9A%E7%94%A8%E3%82%AA%E3%83%9A%E3%83%A9%E3%82%B7%E3%83%86%E3%82%A3%E5%BA%A7%E5%B8%AD%E8%A1%A8.png";
        });
    }

    // 閉じるボタンをクリックでモーダルを閉じる
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            seatingChartModal.style.display = 'none';
        });
    }

    // 画像自体をクリックでモーダルを閉じる
    if (seatingChartImage) {
        seatingChartImage.addEventListener('click', () => {
            seatingChartModal.style.display = 'none';
        });
    }

    // モーダルの外側をクリックで閉じる
    if (seatingChartModal) {
        window.addEventListener('click', (event) => {
            if (event.target === seatingChartModal) {
                seatingChartModal.style.display = 'none';
            }
        });
    }

    // セクション1の「次へ」ボタンにイベントリスナーを追加
  const nextSection1Button = document.getElementById('nextSection1Button');
  if (nextSection1Button) {
    nextSection1Button.addEventListener('click', validateSection1AndNext);
  }
  // セクション2の「次へ」ボタンにイベントリスナーを追加
  const nextSection2Button = document.getElementById('nextSection2Button');
  if (nextSection2Button) {
    nextSection2Button.addEventListener('click', validateSection2AndNext);
  }
  // セクション3の「確認画面へ」ボタンにイベントリスナーを追加
  const nextSection3Button = document.getElementById('nextSection3Button');
  if (nextSection3Button) {
    nextSection3Button.addEventListener('click', validateSection3AndNext);
  }

  // 戻るボタンのイベントリスナーを追加
  const backSection1Button = document.getElementById('backSection1Button');
  if (backSection1Button) {
    backSection1Button.addEventListener('click', () => prevSection(1));
  }
  const backSection2Button = document.getElementById('backSection2Button');
  if (backSection2Button) {
    backSection2Button.addEventListener('click', () => prevSection(2));
  }
  const backSection3Button = document.getElementById('backSection3Button');
  if (backSection3Button) {
    backSection3Button.addEventListener('click', () => prevSection(3));
  }

  // 団員区分の選択変更時に家族情報の表示を切り替えるイベントリスナー
  const memberTypeSelect = document.getElementById('memberType');
  if (memberTypeSelect) {
    memberTypeSelect.addEventListener('change', toggleFamilyInfo);
  }
  // 初期表示
  showSection(1);
  toggleFamilyInfo(); // 初期ロード時に家族情報グループの表示状態を適切に設定

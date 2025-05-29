const APPS_SCRIPT_API_URL = 'https://script.google.com/macros/s/AKfycbzQn1IKFAbdDYQilVApYvnsKUynzCH1-17I9ztbh9dD8sht4Ae_NrFysKno-GJEJmQrfQ/exec';

document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const sections = document.querySelectorAll('.form-section');
    let currentSection = 1; // 現在表示中のセクション番号

    // エラーメッセージ要素を管理するためのマップ
    const errorElements = {
        part: document.getElementById('partError'),
        lastName: document.getElementById('nameError'),
        firstName: document.getElementById('nameError'),
        email: document.getElementById('emailError'),
        emailFormat: document.getElementById('emailFormatError'),
        memberType: document.getElementById('memberTypeError'),
        familyLastName: document.getElementById('familyNameError'),
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

        if (familyInfoGroup && familyLastName && familyFirstName && ageGroup) {
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
        // 団員区分変更時もノルマチェックを再実行
        checkNorma();
    }

    /**
     * チケット枚数入力のバリデーションと合計枚数の更新を行う関数
     * @param {HTMLInputElement} inputElement - 変更されたチケット入力フィールドの要素
     */
    function validateTicketInput(inputElement) {
        clearError(inputElement.id + 'Format'); // まず形式エラーをクリア
        clearError(inputElement.id + 'Limit'); // まず制限エラーをクリア

        const value = inputElement.value;
        // 半角数字以外が含まれている場合、または空欄の場合の処理
        if (!/^\d*$/.test(value)) { // 半角数字以外が含まれている場合
            displayError(inputElement.id + 'Format', '半角数字で入力してください。');
            updateTotalTickets(); // 不正な値の場合も合計枚数を更新 (0として扱われる)
            return false;
        }

        const numValue = parseInt(value) || 0; // 数値に変換、空欄は0とする

        // 枚数制限チェック
        if (inputElement.id === 'bTicket' && numValue > 3) {
            displayError('bTicketLimit', '枚数制限をオーバーしています。（最大3枚）');
            updateTotalTickets(); // 合計枚数を更新
            return false;
        }
        if (inputElement.id === 'cTicket' && numValue > 2) {
            displayError('cTicketLimit', '枚数制限をオーバーしています。（最大2枚）');
            updateTotalTickets(); // 合計枚数を更新
            return false;
        }

        // 全てのチェックをクリアしたら、エラーメッセージを非表示に
        updateTotalTickets(); // ここで合計枚数を更新
        return true;
    }

    /**
     * S, A, B, C券の合計枚数を計算し、表示を更新する関数
     * ノルマチェックも呼び出す
     */
    function updateTotalTickets() {
        const sTicket = parseInt(document.getElementById('sTicket').value) || 0;
        const aTicket = parseInt(document.getElementById('aTicket').value) || 0;
        const bTicket = parseInt(document.getElementById('bTicket').value) || 0;
        const cTicket = parseInt(document.getElementById('cTicket').value) || 0;
        const total = sTicket + aTicket + bTicket + cTicket;

        const totalTicketsElement = document.getElementById('totalTickets');
        if (totalTicketsElement) {
            totalTicketsElement.textContent = total; // 表示更新
        }
        
        // 合計枚数が変わったのでノルマチェックを再実行
        checkNorma();
    }

    /**
     * Google Apps Scriptを呼び出してノルマチェックを行う関数
     */
    async function checkNorma() {
        const memberTypeSelect = document.getElementById('memberType');
        const ageGroupSelect = document.getElementById('ageGroup');
        const totalTicketsSpan = document.getElementById('totalTickets');
        const normaMessageElement = document.getElementById('normaMessage');
        const confirmButton = document.getElementById('confirmButton'); // 確認ボタンのID

        const memberType = memberTypeSelect ? memberTypeSelect.value : '';
        const ageGroup = ageGroupSelect ? ageGroupSelect.value : '';
        const totalTickets = totalTicketsSpan ? parseInt(totalTicketsSpan.textContent) || 0 : 0;

        // エラーメッセージ要素とボタンが存在することを確認
        if (!normaMessageElement || !confirmButton) {
            console.error("ノルマチェックに必要なDOM要素が見つかりません。");
            return; // 処理を中断
        }
        
        // エラーメッセージをクリア
        clearError('normaCheck'); // NormaCheckErrorMessageをクリアするため

        // 団員区分が選択されていない場合はノルマチェックを行わない
        if (!memberType) {
            normaMessageElement.textContent = '団員区分を選択してください。';
            normaMessageElement.style.color = 'gray';
            confirmButton.disabled = true; // 確認ボタンを無効にする
            return;
        }

        // 「夫婦・家族・兄弟」選択時のみ年代の選択を必須とする
        if (memberType === '夫婦・家族・兄弟' && !ageGroup) {
            normaMessageElement.textContent = '年代を選択してください。';
            normaMessageElement.style.color = 'gray';
            confirmButton.disabled = true; // 確認ボタンを無効にする
            return;
        }

        // APPS_SCRIPT_API_URLが正しく設定されているか最終チェック
        if (typeof APPS_SCRIPT_API_URL === 'undefined' || !APPS_SCRIPT_API_URL || APPS_SCRIPT_API_URL.includes('{APPS_SCRIPT_API_URL}')) {
            normaMessageElement.textContent = 'エラー: スクリプトAPIのURLが設定されていません。管理者に連絡してください。';
            normaMessageElement.style.color = 'red';
            confirmButton.disabled = true;
            console.error('APPS_SCRIPT_API_URL is not set or is incorrect.');
            return;
        }

        const params = new URLSearchParams({
            action: 'getNormaData',
            memberType: memberType,
            ageGroup: ageGroup,
            totalTickets: totalTickets
        });

        try {
            const response = await fetch(`<span class="math-inline">\{APPS\_SCRIPT\_API\_URL\}?</span>{params.toString()}`);
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`GASからのHTTPエラー応答: ${response.status} ${errorText}`);
                normaMessageElement.textContent = `ノルマチェック中にサーバーエラーが発生しました (${response.status})。管理者に連絡してください。`;
                normaMessageElement.style.color = 'red';
                confirmButton.disabled = true;
                return;
            }
            const data = await response.json();
            console.log("ノルマチェック結果:", data);

            if (data.errorMessage) {
                normaMessageElement.textContent = `エラー: ${data.errorMessage}`;
                normaMessageElement.style.color = 'red';
                confirmButton.disabled = true;
            } else {
                if (data.isNormaMet) {
                    normaMessageElement.textContent = `ノルマ (${data.requiredTickets}枚) を達成しています。`;
                    normaMessageElement.style.color = 'green';
                } else {
                    normaMessageElement.textContent = `ノルマ (<span class="math-inline">\{data\.requiredTickets\}枚\) 不足です。申込必要枚数は合計</span>{data.requiredTickets}枚です。`;
                    normaMessageElement.style.color = 'orange';
                }
                // ノルマ不足でも、確認画面への遷移や最終送信はできるようにするため、ボタンは有効にする
                confirmButton.disabled = false;
            }
        } catch (error) {
            console.error("ノルマチェック中にエラーが発生しました:", error);
            normaMessageElement.textContent = `ノルマチェック中に通信エラーが発生しました。ネットワーク接続を確認してください。（エラー詳細: ${error.message}）`;
            normaMessageElement.style.color = 'red';
            confirmButton.disabled = true;
        }
    }


    // 席のランク変更チェックボックスの排他制御
    function handleRankChangeCheckbox(clickedCheckbox) {
        const rankUp = document.getElementById('rankUp');
        const rankDown = document.getElementById('rankDown');
        const rankNoChange = document.getElementById('rankNoChange');

        // nullチェックを追加
        if (!rankUp || !rankDown || !rankNoChange) {
            console.warn("ランク変更チェックボックスのDOM要素が見つかりません。");
            return;
        }

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

        const sTicketInput = document.getElementById('sTicket');
        const aTicketInput = document.getElementById('aTicket');
        const bTicketInput = document.getElementById('bTicket');
        const cTicketInput = document.getElementById('cTicket');

        // 各チケット入力のバリデーションを呼び出し、結果をチェック
        // validateTicketInputは、内部でdisplayErrorを呼び出すため、ここでは戻り値のみ利用
        if (!validateTicketInput(sTicketInput)) { isValid = false; if (!firstInvalidField) firstInvalidField = sTicketInput; }
        if (!validateTicketInput(aTicketInput)) { isValid = false; if (!firstInvalidField) firstInvalidField = aTicketInput; }
        if (!validateTicketInput(bTicketInput)) { isValid = false; if (!firstInvalidField) firstInvalidField = bTicketInput; }
        if (!validateTicketInput(cTicketInput)) { isValid = false; if (!firstInvalidField) firstInvalidField = cTicketInput; }

        // 上記のバリデーションでエラーが表示されているか最終確認
        // エラーが表示されていれば、isValidをfalseに保つ
        if (document.getElementById('sTicketFormatError').classList.contains('show') ||
            document.getElementById('aTicketFormatError').classList.contains('show') ||
            document.getElementById('bTicketFormatError').classList.contains('show') ||
            document.getElementById('cTicketFormatError').classList.contains('show') ||
            document.getElementById('bTicketLimitError').classList.contains('show') ||
            document.getElementById('cTicketLimitError').classList.contains('show')) {
            isValid = false;
            if (!firstInvalidField) { // 最初の不正フィールドにフォーカスを当てるため
                if (document.getElementById('sTicketFormatError').classList.contains('show')) firstInvalidField = sTicketInput;
                else if (document.getElementById('aTicketFormatError').classList.contains('show')) firstInvalidField = aTicketInput;
                else if (document.getElementById('bTicketFormatError').classList.contains('show')) firstInvalidField = bTicketInput;
                else if (document.getElementById('cTicketFormatError').classList.contains('show')) firstInvalidField = cTicketInput;
                else if (document.getElementById('bTicketLimitError').classList.contains('show')) firstInvalidField = bTicketInput;
                else if (document.getElementById('cTicketLimitError').classList.contains('show')) firstInvalidField = cTicketInput;
            }
        }
        
        // ここでisValidがfalseであれば、次に進まず終了
        if (!isValid) {
            if (firstInvalidField) firstInvalidField.focus();
            return;
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

        try {
            const params = new URLSearchParams({
                action: 'getNormaData',
                memberType: memberType,
                ageGroup: ageGroup,
                totalTickets: totalTickets
            });

            const fetchResponse = await fetch(`<span class="math-inline">\{APPS\_SCRIPT\_API\_URL\}?</span>{params.toString()}`, {
                method: 'GET'
            });

            if (!fetchResponse.ok) {
                const errorText = await fetchResponse.text();
                console.error("GASからのHTTPエラー応答:", fetchResponse.status, fetchResponse.statusText, errorText);
                displayError('normaCheck', `ノルマチェック中にサーバーエラーが発生しました (${fetchResponse.status})。管理者に連絡してください。`);
                hideLoadingOverlay();
                return;
            }

            const response = await fetchResponse.json();

            if (!response || typeof response.isNormaMet === 'undefined') {
                console.error("予期せぬGAS応答形式:", response);
                displayError('normaCheck', 'ノルマチェック中に予期せぬエラーが発生しました。管理者に連絡してください。');
                hideLoadingOverlay();
                return;
            }

            if (!response.isNormaMet) {
                // ノルマ不足の場合、エラーメッセージを表示して次に進まない
                const errorMessage = response.errorMessage ? response.errorMessage : `ノルマ枚数不足です。申込必要枚数は合計${response.requiredTickets}枚です。`;
                displayError('normaCheck', errorMessage);
                document.getElementById('normaCheckErrorMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });
                hideLoadingOverlay();
                return; // ここで処理を停止し、次のセクションには進まない
            } else {
                // ノルマ達成の場合、エラーメッセージをクリアして次に進む
                clearError('normaCheck');
                generateSummaryContent();
                nextSection(4); // 確認画面へ
                hideLoadingOverlay();
            }

        } catch (error) {
            console.error("ノルマチェック中にネットワークエラーが発生しました:", error);
            displayError('normaCheck', 'ノルマチェック中に通信エラーが発生しました。ネットワーク接続を確認してください。');
            hideLoadingOverlay();
        }
    }

    // 確認画面の内容を生成する関数
    function generateSummaryContent() {
        const summaryDiv = document.getElementById('summaryContent');
        const values = getFormValues(); // 現在のフォーム値を取得

        let html = '';
        html += `<p><strong>パート：</strong>${values.part}</p>`;
        html += `<p><strong>お名前：</strong>${values.lastName} ${values.firstName}</p>`;
        html += `<p><strong>メールアドレス：</strong>${values.email}</p>`;
        html += `<p><strong>団員区分：</strong>${values.memberType}</p>`;

        if (values.memberType === '夫婦・家族・兄弟') {
            html += `<p><strong>ご家族のお名前：</strong>${values.familyLastName} ${values.familyFirstName}</p>`;
            html += `<p><strong>あなたの年代：</strong>${values.ageGroup}</p>`;
        }

        html += `<p><strong>チケット枚数：</strong></p>`;
        html += `<ul>`;
        html += `<li>S券：${values.sTicket}枚</li>`;
        html += `<li>A券：${values.aTicket}枚</li>`;
        html += `<li>B券：${values.bTicket}枚</li>`;
        html += `<li>C券：${values.cTicket}枚</li>`;
        html += `</ul>`;

        // チケット合計枚数を表示
        html += `<p><strong>合計枚数：</strong>${values.sTicket + values.aTicket + values.bTicket + values.cTicket}枚</p>`;


        // 任意項目の表示制御（項目名は表示し、値がなければ何も表示しない）
        html += `<p><strong>離れた席のアサイン：</strong>`;
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
                    // rankUp, rankDown, rankNoChange はIDで直接取得するため、ここではname属性での分類は不要
                    // getFormValuesが呼ばれる時点では、これらのチェックボックスの最新の状態を取得する必要がある
                    // すでにhandleRankChangeCheckboxで排他処理がされているため、ここで複雑なロジックは不要
                }
            } else if (input.name) { // name属性があるものだけ取得
                values[input.id || input.name] = input.value;
            }
        });

        // ランク変更のチェックボックスの状態を明示的に取得
        values.rankUp = document.getElementById('rankUp') ? document.getElementById('rankUp').checked : false;
        values.rankDown = document.getElementById('rankDown') ? document.getElementById('rankDown').checked : false;
        values.rankNoChange = document.getElementById('rankNoChange') ? document.getElementById('rankNoChange').checked : false;

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
        const loadingMessage = overlay ? overlay.querySelector('p') : null;
        if (overlay && loadingMessage) {
            loadingMessage.innerText = message;
            overlay.style.display = 'flex';
        }
    }

    // ローディングオーバーレイ非表示関数
    function hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // フォーム最終送信ボタンのイベントリスナー
    document.getElementById('submitFormButton').addEventListener('click', async function() {
        showLoadingOverlay('お申し込みを送信しています...');
        const formData = getFormValues();

        try {
            console.log("クライアント: submitTicketApplicationを呼び出します。");
            // POSTリクエストでJSONとして送信
            const fetchResponse = await fetch(APPS_SCRIPT_API_URL, {
                method: 'POST', // doPostを使うのでPOST
                headers: {
                    'Content-Type': 'application/json' // JSON形式であることを伝える
                },
                body: JSON.stringify(formData) // フォームデータをJSON文字列に変換して送信
            });

            if (!fetchResponse.ok) {
                const errorText = await fetchResponse.text();
                console.error("GASからのHTTPエラー応答:", fetchResponse.status, fetchResponse.statusText, errorText);
                throw new Error(`サーバーエラーが発生しました (${fetchResponse.status})。詳細: ${errorText.substring(0, 100)}...`);
            }

            const result = await fetchResponse.json();

            console.log("クライアント: GASからの結果を受け取り、処理を開始します。結果:", result);

            if (result.success) {
                console.log("クライアント: 申し込み成功、完了画面へ遷移します。");
                showSection(5); // 完了画面へ
            } else {
                console.log("クライアント: 申し込み失敗、エラーメッセージを表示します。");
                alert('お申し込みに失敗しました: ' + result.message);
            }
        } catch (e) {
            console.error("JavaScriptからのGAS呼び出しエラー:", e);
            alert('システムエラーが発生しました。開発者にお問い合わせください。\nエラー詳細: ' + e.message);
        } finally {
            console.log("クライアント: ローディングオーバーレイを非表示にします。");
            hideLoadingOverlay();
        }
    });


    const openModalLink = document.getElementById('openSeatingChartModal');
    const seatingChartModal = document.getElementById('seatingChartModal');
    const closeButton = seatingChartModal ? seatingChartModal.querySelector('.close-button') : null;
    const seatingChartImage = seatingChartModal ? seatingChartModal.querySelector('.seating-chart

document.addEventListener('DOMContentLoaded', () => {

    // --- セッション取得 ---
    const sessionData = JSON.parse(localStorage.getItem('user_session'));
    const accessToken = sessionData?.access_token;

    // --- ログイン確認 ---
    if (!accessToken) {
        localStorage.removeItem('user_session');
        window.location.href = '/index.html';
        return;
    }

    // --- メール表示 ---
    document.getElementById('user-email').textContent =
        sessionData.user?.email ?? '';

    // --- ログアウト処理 ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem('user_session');
            window.location.href = '/index.html';
        };
    }

    // --- メモ取得 ---
    const fetchMemos = async () => {
        try {
            const memos = await apiFetch('/api/memos', {}, accessToken);
            renderMemos(memos);
        } catch (error) {
            showError(error.message);
        }
    };

    // --- メモ作成 ---
    const createMemo = async (title, content) => {
        try {
            await apiFetch(
                '/api/memos',
                {
                    method: 'POST',
                    body: JSON.stringify({ title, content })
                },
                accessToken
            );

            await fetchMemos();

        } catch (error) {
            showError(error.message);
        }
    };

    // --- メモ更新 ---
    const updateMemo = async (id, title, content) => {

        if (!confirm('メモを更新しますか？')) return;

        try {
            await apiFetch(
                `/api/memos/${id}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ title, content })
                },
                accessToken
            );

            await fetchMemos();

        } catch (error) {
            showError(error.message);
        }
    };

    // --- メモ削除 ---
    const deleteMemo = async (id) => {

        if (!confirm('メモを削除しますか？')) return;

        try {
            await apiFetch(
                `/api/memos/${id}`,
                { method: 'DELETE' },
                accessToken
            );

            await fetchMemos();

        } catch (error) {
            showError(error.message);
        }
    };

    // --- メモ作成ボタン ---
    document.getElementById('create-memo-btn').onclick = async () => {

        const title = document.getElementById('memo-title').value;
        const content = document.getElementById('memo-content').value;

        await createMemo(title, content);

        document.getElementById('memo-title').value = '';
        document.getElementById('memo-content').value = '';
    };

    // --- メモ一覧表示 ---
    const renderMemos = (memos) => {

        const memoList = document.getElementById('memo-list');
        memoList.innerHTML = '';

        memos.forEach(memo => {

            const li = document.createElement('li');

            // created_at を使用（Invalid Date 修正）
            const createdAtText =
                memo.created_at
                    ? new Date(memo.created_at).toLocaleString()
                    : '';

            li.innerHTML = `
                <small>${createdAtText}</small>

                <input
                    type="text"
                    id="memo-title-${memo.id}"
                    value="${memo.title ?? ''}"
                >

                <textarea
                    id="memo-content-${memo.id}"
                >${memo.content ?? ''}</textarea>

                <button class="btn-update">更新</button>
                <button class="btn-delete">削除</button>
            `;

            li.querySelector('.btn-update').onclick = () => {

                updateMemo(
                    memo.id,
                    li.querySelector(`#memo-title-${memo.id}`).value,
                    li.querySelector(`#memo-content-${memo.id}`).value
                );
            };

            li.querySelector('.btn-delete').onclick = () => {

                deleteMemo(memo.id);
            };

            memoList.appendChild(li);
        });
    };

    // --- 初期ロード ---
    fetchMemos();

});

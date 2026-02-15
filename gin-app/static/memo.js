document.addEventListener('DOMContentLoaded', () => {

    // --- トークン管理 ---
    const sessionData = JSON.parse(localStorage.getItem('user_session'));
    const accessToken = sessionData?.access_token;

    // --- ログイン済の確認 (初期表示時) ---
    (() => {
        if (!accessToken) {
            localStorage.removeItem('user_session');
            window.location.href = '/index.html';
            return;
        }
        document.getElementById('user-email').textContent = sessionData.user?.email;
    })();

});

    // --- メモ一覧表示 ---
    const renderMemos = (memos) => {
        const memoList = document.getElementById('memo-list');
        memoList.innerHTML = '';
        memos.forEach(memo => {
            const li = document.createElement('li');
            li.className = 'memo-item';
            li.innerHTML = `
                <div class="memo-item-header">
								    // ↓↓↓ この1個所のみ修正　created_at にする
                    <small class="">${new Date(memo.created_at).toLocaleString()}</small>
								    // ↑↑↑ この1個所のみ修正
                    <div class="memo-item-actions">
                        <button class="btn-update">更新</button>
                        <button class="btn-delete">削除</button>
                    </div>
                </div>
                <input type="text" id="memo-title-${memo.id}" value="${memo.title}">                
                <textarea id="memo-content-${memo.id}" rows="4">${memo.content}</textarea>
            `;
            li.querySelector('.btn-update').addEventListener('click', () => {
                const newTitle = li.querySelector(`#memo-title-${memo.id}`).value;
                const newContent = li.querySelector(`#memo-content-${memo.id}`).value;
                updateMemo(memo.id, newTitle, newContent);
            });
            li.querySelector('.btn-delete').addEventListener('click', () => deleteMemo(memo.id));
            memoList.appendChild(li);
        });
    };

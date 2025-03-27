// 笔记数据存储
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// DOM 元素
const modal = document.getElementById('noteModal');
const addNoteBtn = document.getElementById('addNoteBtn');
const closeBtn = document.querySelector('.close');
const noteForm = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categories = document.getElementById('categories');

// 当前选中的分类
let currentCategory = 'all';

// 显示笔记列表
function displayNotes(notesToShow = notes) {
    notesList.innerHTML = '';
    notesToShow.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-card';
        noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <span class="category">${getCategoryName(note.category)}</span>
            <div class="content">${note.content}</div>
        `;
        notesList.appendChild(noteElement);
    });
}

// 获取分类名称
function getCategoryName(category) {
    const categoryNames = {
        programming: '编程',
        language: '语言',
        other: '其他'
    };
    return categoryNames[category] || category;
}

// 保存笔记
function saveNote(event) {
    event.preventDefault();
    
    const title = document.getElementById('noteTitle').value;
    const category = document.getElementById('noteCategory').value;
    const content = document.getElementById('noteContent').value;
    
    const newNote = {
        id: Date.now(),
        title,
        category,
        content,
        date: new Date().toISOString()
    };
    
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    
    modal.style.display = 'none';
    noteForm.reset();
    displayNotes();
}

// 搜索笔记
function searchNotes() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm)
    );
    displayNotes(filteredNotes);
}

// 按分类筛选笔记
function filterByCategory(category) {
    currentCategory = category;
    const filteredNotes = category === 'all' 
        ? notes 
        : notes.filter(note => note.category === category);
    displayNotes(filteredNotes);
    
    // 更新分类选中状态
    document.querySelectorAll('#categories li').forEach(li => {
        li.classList.toggle('active', li.dataset.category === category);
    });
}

// 事件监听器
addNoteBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

noteForm.addEventListener('submit', saveNote);

searchBtn.addEventListener('click', searchNotes);
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchNotes();
    }
});

categories.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        filterByCategory(event.target.dataset.category);
    }
});

// 初始化显示
displayNotes(); 
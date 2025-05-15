// DOM elements
const dom = {
    form: document.getElementById('form'),
    input: document.getElementById('searchInput'),
    result: document.getElementById('booksContainer'),
    error: document.getElementById('error')
};

// Component: Create book card
const createBookCard = (book, index) => {
    const card = document.createElement('div');
    card.className = 'book-card';
  card.style.animationDelay = `${index * 0.1}s`;

    const title = book.title || "No title";
    const author = book.author_name ? book.author_name.join(", ") : "Unknown author";
    const year = book.first_publish_year || "N/A";
    const cover = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
    : "https://via.placeholder.com/300x400/34495e/ffffff?text=No+Cover";

    card.innerHTML = `
    <img src="${cover}" alt="${title}">
    <h3>${title}</h3>
    <p>👤 ${author}</p>
    <p>📅 ${year}</p>
    `;

    return card;
};

// API 
const getBooks = async (query) => {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`;

    try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const data = await res.json();
    return data.docs.slice(0, 20);
    } catch (err) {
    console.error(err);
    return null;
    }
};

//  handler
const submitHandler = async (e) => {
    e.preventDefault();
    const query = dom.input.value.trim();
    dom.result.innerHTML = '';
    dom.error.innerText = '';

    if (!query) {
    dom.error.innerText = 'Please enter a book title.';
    dom.error.classList.add('error');
    return;
    }

    const books = await getBooks(query);

    if (!books || books.length === 0) {
    dom.error.innerText = 'No books found for this title.';
    dom.error.classList.add('error');
    return;
    }

    books.forEach((book, index) => {
    const card = createBookCard(book, index);
    dom.result.appendChild(card);
    });
};

// Event listener
dom.form.addEventListener('submit', submitHandler);
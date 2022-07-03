//Book class: reprensts a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI class: handle UI task
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(book => UI.addBook(book));
  }

  static addBook(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');

    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form)

    //clear alert after 2 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 2000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}

//store class: handle storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = []
    }
    else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = this.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = this.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }

}


//event: display book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//event: add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  //preventing default action
  e.preventDefault();

  //get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  if (title === '' || author === '' || isbn === '') {
    UI.showAlert('Please fill all the fields', 'danger')
  }
  else {
    //instantiate book
    const book = new Book(title, author, isbn);

    //add book to list
    UI.addBook(book);

    //add book to store
    Store.addBook(book);
    //show alert
    UI.showAlert('Book added successfully', 'success');

    //clear the form fields
    UI.clearFields();
  }
});

//event: remove a book
document.querySelector('#book-list').addEventListener('click', (e) => {
  //remove book from UI
  UI.deleteBook(e.target);

  //remove book from store
  console.log(e.target.parentElement.previousElementSibling.innerText)
  Store.removeBook(e.target.parentElement.previousElementSibling.innerText)

  //show alert
  UI.showAlert('Book removed successfully', 'info');
})
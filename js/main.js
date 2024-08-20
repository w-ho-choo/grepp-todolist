// window.addEventListener("DOMContentLoaded", () => {
const storage = JSON.parse(localStorage.getItem("todos"));
const todoForm = document.getElementById("todo_form");
const todoInput = document.getElementById("todo_list_input");
const todoWrap = document.getElementById("todo_list_wrap");
const noTodoDiv = document.getElementById("no_todo_list");
const modal = document.getElementById('edit_modal');
const editForm = document.getElementById('edit_form');
let editInput = document.getElementById('todo_list_input');

// 투두 폼 섭밋
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let todoValue = todoInput.value;
  let storageData = JSON.parse(localStorage.getItem("todos"));
  if (todoValue.length > 2) {
    const newTodo = {
      id: Math.floor(Math.random() * 10 ** 10),
      txt: todoValue,
      done: false,
    };
    storageData.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(storageData));

    todoInput.value = "";

    renderTodos(newTodo.txt, newTodo.id, newTodo.done);
  } else {
    alert("최소2글자 이상 작성해주세요");
    return;
  }
});

// 투두 갯수확인
const lengthCheck = () => {
  let storageData = JSON.parse(localStorage.getItem("todos"));
  const $length = document.querySelector(
    ".todo_list_length > .todo_list_length_txt"
  );

  if (!storageData || storageData.length === 0) {
    $length.innerHTML = 0;
  } else {
    $length.innerHTML = storageData.length;
  }
};

// 투두 완료갯수 확인
const comLengthCheck = () => {
  let storageData = JSON.parse(localStorage.getItem("todos"));
  const $length = document.querySelector('.todo_list_done_wr > .todo_list_length_txt');
  const $doneLength = document.querySelector('.todo_list_done_wr > .todo_list_done_length');
  
  const doneTodos = storageData.filter(data => data.done === true).length;

  if (!storageData || storageData.length === 0) {
    $length.innerHTML = 0;
    $doneLength.innerHTML = doneTodos;
  } else {
    $length.innerHTML = storageData.length;
    $doneLength.innerHTML = doneTodos;
  }
}

// 스토리지 체크후 렌더링
const checkStorage = () => {
  if (!storage || storage.length === 0) {
    localStorage.setItem("todos", "[]");
    noTodoDiv.classList.add("on");
  } else {
    todoWrap.classList.add("on");
    storage.map((a, i) => {
      renderTodos(a.txt, a.id, a.done);
    });
  }
  lengthCheck();
  comLengthCheck();
};

// 리스트 렌더링
const renderTodos = (txt, id, done) => {
  const render = `
      <div>
        <input type="checkbox" class="todo_checkbox" data-id="${id}" onchange="completeTodo(event)" ${
    done ? 'value="true"' : 'value="false"'
  }>
        <p class="todo_list_txt">${txt}</p>
        <div class="todo_list_btn_wrap">
          <span class="edit_btn" data-id="${id}" onclick="openModal(event)"><i class="fa-regular fa-pen-to-square"></i></span>
          <span class="delete_btn" data-id="${id}" onclick="delTodo(event)"><i class="fa-regular fa-trash-can"></i></span>
        </div>
      </div>
    `;
  const $li = document.createElement("li");
  $li.classList.add("todo_list_inner");
  $li.innerHTML = render;

  todoWrap.appendChild($li);

  if (JSON.parse(localStorage.getItem("todos")).length !== 0) {
    noTodoDiv.classList.remove("on");
    todoWrap.classList.add("on");
  }

  lengthCheck();
  comLengthCheck();
  isChecked();
};

// 체크됬나 확인
function isChecked() {
  const checkbox = document.querySelectorAll(".todo_checkbox");

  checkbox.forEach((a) => {
    let $parent = a.parentElement.parentElement;

    if (a.value == "true") {
      a.checked = true;
      $parent.classList.add("checked");
    } else {
      a.checked = false;
      $parent.classList.remove("checked");
    }
  });
}

// 투두 리스트 삭제하기
const delTodo = (e) => {
  let clickedId = Number(e.currentTarget.getAttribute("data-id"));
  let storageData = JSON.parse(localStorage.getItem("todos"));
  let matchedTodo = storageData.findIndex(
    (element) => element.id === clickedId
  );

  if (confirm("삭제 하시겠습니까?")) {
    storageData.splice(matchedTodo, 1);

    todoWrap.innerHTML = "";
    storageData.map((a) => renderTodos(a.txt, a.id, a.done));
    localStorage.setItem("todos", JSON.stringify(storageData));
    lengthCheck();
    comLengthCheck();
  } else {
    return;
  }
};

// 투두 리스트 완료하기
const completeTodo = (e) => {
  let clickedId = Number(e.currentTarget.getAttribute("data-id"));
  let storageData = JSON.parse(localStorage.getItem("todos"));
  let matchedTodo = storageData.findIndex(
    (element) => element.id === clickedId
  );
  e.currentTarget.checked
    ? (storageData[matchedTodo].done = true)
    : (storageData[matchedTodo].done = false);

  localStorage.setItem("todos", JSON.stringify(storageData));
  todoWrap.innerHTML = "";
  storageData.map((a) => renderTodos(a.txt, a.id, a.done));
  isChecked();
};

// 모달 열고 수정인풋에 data-id 전달
const openModal = (e) => {
  modal.classList.add('on');
  editInput.setAttribute('data-id', e.currentTarget.getAttribute('data-id'))
}

// 모달 닫고 수정인풋에 data-id 삭제
const closeModal = () => {
  modal.classList.remove('on');
  editInput.removeAttribute('data-id')
}

// edit submit하기
editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let $editInput = document.getElementById('todo_list_input_edit')
  let storageData = JSON.parse(localStorage.getItem('todos'));
  const todoId = Number(editInput.getAttribute('data-id'));
  const matchedTodo = storageData.findIndex(element => element.id === todoId);
  storageData[matchedTodo].txt = $editInput.value;
  $editInput.value = '';

  todoWrap.innerHTML = '';
  storageData.map(a => renderTodos(a.txt, a.id, a.done));
  localStorage.setItem('todos', JSON.stringify(storageData));
  closeModal()
})

checkStorage();
// });

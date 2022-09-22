
// Получаем элемент чата
let chat = document.querySelector("#divMessages")
// Получаем строку ввода сообщения
let input = document.querySelector("#inputMessage")
// Получаем кнопку для ввода сообщения
let btnSubmit = document.querySelector("#btnSend")
const geoBtn = document.querySelector('.j-btn-geo');
const status = document.querySelector('#status');
const mapLink = document.querySelector('#map-link');

// Подключаем WebSocket
const webSocket = new WebSocket('wss://echo-ws-service.herokuapp.com');

// Получаем сообщение от сервера
webSocket.onmessage = function (e) {
   // Парсим полученные данные
   const data = JSON.parse(e.data);
   // Выводим в блог сообщение от сервера
   chat.innerHTML += '<div class="msg">' + data.message + '</div>'
};

// Отслеживаем нажатие мыши
btnSubmit.addEventListener("click", () => {
   // Получаем текст из формы для ввода сообщения
   message = input.value;
   // Отправка сообщения через WS
   webSocket.send(JSON.stringify({
      'message': message
   }));
   // Очищаем поле для ввода текста
   input.value = '';
})

//описываем поведение при определении гео-позиции
// Функция, выводящая текст об ошибке
const error = () => {
   status.textContent = 'Невозможно получить ваше местоположение';
}

// Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
   console.log('position', position);
   const latitude = position.coords.latitude;
   const longitude = position.coords.longitude;

   status.textContent = `Широта: ${latitude} °, Долгота: ${longitude} °`;
   mapLink.href = `https://www.openstreetmap.org/#map=14/${latitude}/${longitude}`;
   mapLink.textContent = 'Ссылка на карту';
}

geoBtn.addEventListener('click', () => {
   mapLink.href = '';
   mapLink.textContent = '';

   if (!navigator.geolocation) {
      status.textContent = 'Geolocation не поддерживается вашим браузером';
   } else {

      status.textContent = 'Определение местоположения…';
      navigator.geolocation.getCurrentPosition(success, error);
   }
});
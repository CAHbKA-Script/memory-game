import { DATA_CARDS } from "./data.js";

function createPage () {
  const body = document.body;

    let header = document.createElement('header');

    let wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');

    let wrapper2 = wrapper.cloneNode(false);

    let buttonNewGame = document.createElement('button');
    buttonNewGame.setAttribute('type', 'button');
    buttonNewGame.textContent = 'новая игра';
    buttonNewGame.setAttribute('id', 'newGame');

    let buttonLeaders = document.createElement('button');
    buttonLeaders.setAttribute('type', 'button');
    buttonLeaders.textContent = 'список лидеров';
    buttonLeaders.setAttribute('id', 'buttonLeaders');
    buttonLeaders.addEventListener('click', createPopup);

    wrapper.append(buttonNewGame, buttonLeaders);

    header.append(wrapper);

    let main = document.createElement('main');

    let section = document.createElement('section');

    let h1 = document.createElement('h1');
    h1.textContent = 'Найди пару';

    let p = document.createElement('p');
    p.classList.add('info-item');

    let cardsContainer = document.createElement('div');
    cardsContainer.classList.add('cards-container');

    section.append(p, cardsContainer);
    wrapper2.append(h1, section);
    main.appendChild(wrapper2);
    body.append(header, main);
}

function compareFunction (a, b) {
  if (a.movesCounter < b.movesCounter) {
    return -1;
  }
  if (a.movesCounter > b.movesCounter) {
    return 1;
  }
  if (a.movesCounter = b.movesCounter) {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  }
}

function getDateString(date) {
  let dateItem = new Date(date);
  let day = String(dateItem.getDate()).padStart(2, '0');
  let month = String(dateItem.getMonth() + 1).padStart(2, '0');
  let year = dateItem.getFullYear();
  return `${day}.${month}.${year}`;
}

function closePopup () {
  const popup = document.querySelector('.popup');
  if (!popup) return;
  document.body.removeChild(popup);
  document.body.classList.remove('no-scroll');
}

function createPopup (event, count, newGameHandler) {
  document.body.classList.add('no-scroll');
  let popupItem = document.createElement('div');
  popupItem.classList.add('popup-item');
  
  let popupContent = document.createElement('div');
  popupContent.classList.add('popup__content');

  if (count) {
    let h2 = document.createElement('h2');
    h2.textContent = 'Ты выиграл!';
    
    let p = document.createElement('p');
    p.textContent = `Всего ходов сделано: ${count}`;
    p.classList.add('popup-item__p');

    let newGame = document.getElementById('newGame').cloneNode(true);
    newGame.addEventListener('click', () => {
      closePopup();
      newGameHandler();
    });

    popupItem.append(p);
    popupContent.append(h2, popupItem, newGame);

  }
  else {
    if (!localStorage.getItem('winners') || localStorage.getItem('winners') == "''" || JSON.parse(localStorage.getItem('winners')).length === 0) {
      let h2 = document.createElement('h2');
      h2.textContent = 'Список лидеров пуст!';
      popupContent.append(h2);
    }
    else {
      let h2 = document.createElement('h2');
      h2.textContent = 'Список лидеров:';
      popupContent.append(h2);

      let winners = JSON.parse(localStorage.getItem('winners'));
      winners = winners.sort(compareFunction);

      let p = document.createElement('p');
      p.textContent = ('№');
      let p2 = document.createElement('p');
      p2.textContent = ('количество шагов');
      let p3 = document.createElement('p');
      p3.textContent = ('дата');
      popupItem.append(p, p2, p3);

      for (let i = 0; i < winners.length && i < 10; i++) {
        let p = document.createElement('p');
        p.textContent = (`${i + 1}.`);
        let p2 = document.createElement('p');
        p2.textContent = (`${winners[i].movesCounter}`);
        let p3 = document.createElement('p');
        p3.textContent = (`${getDateString(winners[i].date)}`);
        popupItem.append(p, p2, p3);
      }

      popupContent.append(popupItem);
    }
  }

  let closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.textContent = 'закрыть';
  closeButton.setAttribute('id', 'close');
  closeButton.addEventListener('click', closePopup);
  
  popupContent.append(closeButton);

  let popup = document.createElement('div');
  popup.classList.add('popup');
  popup.setAttribute('tabindex', -1);
  popup.append(popupContent);
  popup.addEventListener('click', (event) => {
    if (event.target.classList.contains('popup'))
      closePopup();
  });
  popup.addEventListener('keydown', (event) => {
    if (event.key == 'Escape' || event.key == 'Esc')
      closePopup();
  });
  document.body.append(popup);
}

function createGamePage () {
  let movesCounter = 0;
  let foundPairCounter = 0;
  let firstCard;
  let isBlocked = false;
  let timerId;
  let cardsArray = shuffle(DATA_CARDS.concat(DATA_CARDS));
  let newGameButton = document.getElementById('newGame');
  newGameButton.addEventListener('click', startNewGame);

  function shuffle (array) {
    let n = array.length;
    let template, i;

    while (n) {
      i = Math.floor(Math.random() * n--);
      template = array[n];
      array[n] = array[i];
      array[i] = template;
    }

    return array;
  }

  function startNewGame () {
    let cardsContainer = document.querySelector('.cards-container');
    cardsContainer.replaceChildren();
    movesCounter = 0;
    foundPairCounter = 0;
    firstCard = null;
    isBlocked = false;
    cardsArray = shuffle(DATA_CARDS.concat(DATA_CARDS));
    clearTimeout(timerId);
    startGame();
  }

  function startGame () {
    let p = document.querySelector('.info-item');
    let cardsContainer = document.querySelector('.cards-container');

    p.textContent = `Количество ходов: ${movesCounter}. Количество открытых пар: ${foundPairCounter}`;

    cardsArray.forEach(elem => {
      cardsContainer.appendChild(createCard(elem));
    });
  }

  function createCard (data) {
    let image = document.createElement('img');
    image.setAttribute('src', data.url);
    image.setAttribute('alt', data.name + 'icon');
    
    let cardHiding = document.createElement('div');
    cardHiding.classList.add('card-hiding-item');

    let card = document.createElement('div');
    card.classList.add('card-item');
    card.append(image, cardHiding);
    card.dataset.language = data.name;
    card.addEventListener('click', clickCardHandler);

    return card;
  }

  function clickCardHandler (event) {
    if (isBlocked) return;
    if (!firstCard) {
      firstCard = this;
      this.classList.add('card-item--open');
    }
    else if (firstCard === this) {
      return;
    }
    else {
      isBlocked = true;
      this.classList.add('card-item--open');
      let info = document.querySelector('.info-item');

      if (firstCard.dataset.language === this.dataset.language) {
        foundPairCounter++;
        movesCounter++;
        firstCard.removeEventListener('click', clickCardHandler);
        this.removeEventListener('click', clickCardHandler);
        firstCard = null;
        isBlocked = false;
        info.textContent = `Количество ходов: ${movesCounter}. Количество открытых пар: ${foundPairCounter}`;

        if (foundPairCounter === 8) {
          let winners;
          if (!localStorage.getItem('winners') || localStorage.getItem('winners') == "''")
            winners = null;
          else winners = JSON.parse(localStorage.getItem('winners'));
          let newWinners; 
          let date = Date.now();
          let winner = {date, movesCounter};
          winners ? newWinners = Array.from(winners.concat(winner)) : newWinners = [winner];
          localStorage.setItem('winners', JSON.stringify(newWinners));
          createPopup(null, movesCounter, startNewGame);
        }
      }
      else {
        timerId = setTimeout(() => {
          this.classList.remove('card-item--open');
          firstCard.classList.remove('card-item--open');
          movesCounter++;
          firstCard = null;
          isBlocked = false;
          info.textContent = `Количество ходов: ${movesCounter}. Количество открытых пар: ${foundPairCounter}`;
        }, 1500)
      }
    }
  }

  startGame();
}

createPage();
createGamePage();
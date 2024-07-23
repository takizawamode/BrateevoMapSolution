// Метод показа предзагрузочного изображения для разных устройств
document.addEventListener('DOMContentLoaded', function() {
  const logoContainer = document.getElementById('logo-container');
  const logoContainer2 = document.getElementById('logo-container2');

  function setLogoContainerVisibility() {
    const screenWidth = window.innerWidth;

    if (screenWidth > 736) {
      logoContainer.style.display = 'block';      
      logoContainer2.style.display = 'none';     
      animateAndHide(logoContainer);              
    } else {
      logoContainer.style.display = 'none';      
      logoContainer2.style.display = 'block';     
      animateAndHide(logoContainer2);             
    }
  }

  window.addEventListener('resize', setLogoContainerVisibility);
  setLogoContainerVisibility(); 

  function animateAndHide(container) {
    setTimeout(() => {
      container.classList.add('fade-out');

      setTimeout(() => {
        container.style.display = 'none';
      }, 2500); 
    }, 2500); 
  }
});

// Закрытие и открытие главной боковой панели
const closeButton = document.getElementById('close-button');
const mapContainer = document.getElementById('map-container');
const sidebar = document.getElementById('sidebar');
const openButton = document.getElementById('open-button');
    
closeButton.addEventListener('click', function() {
    sidebar.style.display = 'none'; 
});

openButton.addEventListener('click', function() {
        sidebar.style.display = 'block';  
});

// Метод работы перемещения, масштабирования и позиционирования карты
let zoomLevel = 0.1;
let isDragging = false;
let startPosition = { x: 0, y: 0 }; 
let currentTranslate = { x: 0, y: 0 }; 
let previousTranslate = { x: 0, y: 0 }; 

// Получаем ширину экрана
const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

// Устанавливаем начальные координаты в зависимости от устройства
if ('ontouchstart' in window || (screenWidth <= 750)) {
  startPosition = { x: -800, y: 30 }; 
  currentTranslate = { x: -800, y: 30 }; 
  previousTranslate = { x: -800, y: 30 }; 
} else {
  startPosition = { x: -300, y: 30 }; // Изменено для устройств с шириной больше 750
  currentTranslate = { x: -300, y: 30 }; 
  previousTranslate = { x: -300, y: 30 }; 
}

updateMapTransform(); // Обновляем положение карты

if ('ontouchstart' in window) { // Для телефонов
  mapContainer.addEventListener('touchstart', startDrag);
  mapContainer.addEventListener('touchend', endDrag);
  mapContainer.addEventListener('touchmove', dragMap);

} else { // Для ПК
  mapContainer.addEventListener('mousedown', startDrag);
  mapContainer.addEventListener('mouseup', endDrag);
  mapContainer.addEventListener('mousemove', dragMap);
  mapContainer.addEventListener('mouseleave', endDrag);
  mapContainer.addEventListener('wheel', zoomMap);
}

// Перетаскивание карты
function startDrag(event) { 
  if (event.touches && event.touches.length === 1) {
    isDragging = true;
    const touch = event.touches[0];
    startPosition.x = touch.clientX;
    startPosition.y = touch.clientY;
    mapContainer.style.cursor = 'grabbing';
    event.preventDefault();
  } else if (event.button === 0) {
    isDragging = true;
    startPosition.x = event.clientX;
    startPosition.y = event.clientY;
    mapContainer.style.cursor = 'grabbing';
    event.preventDefault();
  }
}

function endDrag(event) {
  if (isDragging) {
    isDragging = false;
    mapContainer.style.cursor = 'grab';
    previousTranslate.x = currentTranslate.x;
    previousTranslate.y = currentTranslate.y;
  }
}

function dragMap(event) {
  if (isDragging) {
    if (event.touches && event.touches.length === 1) {
      const touch = event.touches[0];
      const offsetX = (touch.clientX - startPosition.x) * 0.5;
      const offsetY = (touch.clientY - startPosition.y) * 0.5;
      currentTranslate.x = previousTranslate.x + offsetX;
      currentTranslate.y = previousTranslate.y + offsetY;
      updateMapTransform();
    } else if (event.button === 0) {
      const offsetX = (event.clientX - startPosition.x) * 0.5;
      const offsetY = (event.clientY - startPosition.y) * 0.5;
      currentTranslate.x = previousTranslate.x + offsetX;
      currentTranslate.y = previousTranslate.y + offsetY;
      updateMapTransform();
    }
  }
}

// Масштабирование карты
function zoomMap(event) {
  event.preventDefault();
  const zoomAmount = event.deltaY > 0 ? -0.1 : 0.1;
  if (zoomLevel + zoomAmount >= 0 && zoomLevel + zoomAmount <= 3) {
    zoomLevel += zoomAmount;
    updateMapTransform();
  }
}

function changeZoom(amount) {
  if (zoomLevel + amount >= 0 && zoomLevel + amount <= 3) {
    zoomLevel += amount;
    updateMapTransform();
  }
}

// Обновление позиции карты
function updateMapTransform() {
  mapContainer.style.transform = `scale(${1 + zoomLevel * 1.2}) translate(${currentTranslate.x}px, ${currentTranslate.y}px)`;
}

// Кнопки масштабирования
  const zoomInButton = document.getElementById('zoom-in');
  const zoomOutButton = document.getElementById('zoom-out');

  zoomOutButton.addEventListener('click', () => {
    event.preventDefault();
    changeZoom(-0.5); 
  });

  zoomInButton.addEventListener('click', () => {
    event.preventDefault();
    changeZoom(0.5); 
  });
  
  zoomOutButton.addEventListener('touchstart', () => {
    event.preventDefault();
    changeZoom(-0.5); 
  });

  zoomInButton.addEventListener('touchstart', () => {
    event.preventDefault();
    changeZoom(0.5); 
  });

  mapContainer.addEventListener('gesturestart', handleGestureStart);
mapContainer.addEventListener('gesturechange', handleGestureChange);
mapContainer.addEventListener('gestureend', handleGestureEnd);

function handleGestureStart(event) {
    event.preventDefault();
}

function handleGestureChange(event) {
    event.preventDefault();
    changeZoom(event.scale - 1); 
}

function handleGestureEnd(event) {
    event.preventDefault();
}

// Кнопки прокрутки внутри панелей категорий
  document.querySelectorAll('.scroll-button').forEach(button => {
    button.addEventListener('click', function() {
        let sidebar = this.closest('.sidebar');
        if (sidebar) {
            sidebar.scrollBy({ top: 7000, behavior: 'smooth' });
        }
    });
});

document.querySelectorAll('.scroll-button2').forEach(button => {
  button.addEventListener('click', function() {
      let sidebar = this.closest('.sidebar');
      if (sidebar) {
          sidebar.scrollBy({ top: -7000, behavior: 'smooth' });
      }
  });
});

// Кнопка закрытия панели внутри панелей категорий
document.querySelectorAll('.hide-sidebar-btn').forEach(button => {
  button.addEventListener('click', function() {
    document.querySelectorAll('.sidebar').forEach(sidebar => {
      sidebar.classList.remove('active');
    });
  });

  // Функция поиска по категориям в HTML
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search');
  
  const categories = {
    transport: {
      button: document.querySelector('button[data-category="transport"]'),
      markers: [ // Маркеры
        document.getElementById('tra-marker-button3'), 
        document.getElementById('tra-marker-button2'),
        document.getElementById('tra-marker-button1'),

      ],
      sidebars: [ // Боковые панели категорий
        document.getElementById('transport-sidebar3'),
        document.getElementById('transport-sidebar2'),
        document.getElementById('transport-sidebar1'),

      ],
    },
    education: {
      button: document.querySelector('button[data-category="education"]'),
      markers: [
        document.getElementById('edu-marker-button11'),
        document.getElementById('edu-marker-button10'),
        document.getElementById('edu-marker-button9'),
        document.getElementById('edu-marker-button8'),
        document.getElementById('edu-marker-button7'),
        document.getElementById('edu-marker-button6'),
        document.getElementById('edu-marker-button5'),
        document.getElementById('edu-marker-button4'),
        document.getElementById('edu-marker-button3'),
        document.getElementById('edu-marker-button2'),
        document.getElementById('edu-marker-button1'),

      ],
      sidebars: [
        document.getElementById('education-sidebar11'),
        document.getElementById('education-sidebar10'),
        document.getElementById('education-sidebar9'),
        document.getElementById('education-sidebar8'),
        document.getElementById('education-sidebar7'),
        document.getElementById('education-sidebar6'),
        document.getElementById('education-sidebar5'),
        document.getElementById('education-sidebar4'),
        document.getElementById('education-sidebar3'),
        document.getElementById('education-sidebar2'),
        document.getElementById('education-sidebar1'),

      ],
    },
    park: {
      button: document.querySelector('button[data-category="park"]'),
      markers: [
        document.getElementById('par-marker-button6'),
        document.getElementById('par-marker-button5'),
        document.getElementById('par-marker-button4'),
        document.getElementById('par-marker-button3'),
        document.getElementById('par-marker-button2'),
        document.getElementById('par-marker-button1'),

      ],
      sidebars: [
        document.getElementById('park-sidebar6'),
        document.getElementById('park-sidebar5'),
        document.getElementById('park-sidebar4'),
        document.getElementById('park-sidebar3'),
        document.getElementById('park-sidebar2'),
        document.getElementById('park-sidebar1'),

      ],
    },
    prom: {
      button: document.querySelector('button[data-category="prom"]'),
      markers: [
        document.getElementById('pro-marker-button8'),
        document.getElementById('pro-marker-button7'),

      ],
      sidebars: [
        document.getElementById('prom-sidebar8'),
        document.getElementById('prom-sidebar7'),
 
      ],
    },
    admin: {
      button: document.querySelector('button[data-category="admin"]'),
      markers: [
        document.getElementById('adm-marker-button12'),
        document.getElementById('adm-marker-button11'),
        document.getElementById('adm-marker-button9'),
        document.getElementById('adm-marker-button5'),
        document.getElementById('adm-marker-button2'),
        document.getElementById('adm-marker-button1'),

      ],
      sidebars: [
        document.getElementById('admin-sidebar12'),
        document.getElementById('admin-sidebar11'),
        document.getElementById('admin-sidebar9'),
        document.getElementById('admin-sidebar5'),
        document.getElementById('admin-sidebar2'),
        document.getElementById('admin-sidebar1'),

      ],
    },
    medicine: {
      button: document.querySelector('button[data-category="medicine"]'),
      markers: [
        document.getElementById('med-marker-button17'),
        document.getElementById('med-marker-button16'),
        document.getElementById('med-marker-button15'),
        document.getElementById('med-marker-button14'),
        document.getElementById('med-marker-button13'),
        document.getElementById('med-marker-button12'),
        document.getElementById('med-marker-button11'),
        document.getElementById('med-marker-button10'),
        document.getElementById('med-marker-button9'),
        document.getElementById('med-marker-button8'),
        document.getElementById('med-marker-button7'),
        document.getElementById('med-marker-button6'),
        document.getElementById('med-marker-button5'),
        document.getElementById('med-marker-button3'),
        document.getElementById('med-marker-button2'),
        document.getElementById('med-marker-button1'),

      ],
      sidebars: [
        document.getElementById('medicine-sidebar17'),
        document.getElementById('medicine-sidebar16'),
        document.getElementById('medicine-sidebar15'),
        document.getElementById('medicine-sidebar14'),
        document.getElementById('medicine-sidebar13'),
        document.getElementById('medicine-sidebar12'),
        document.getElementById('medicine-sidebar11'),
        document.getElementById('medicine-sidebar10'),
        document.getElementById('medicine-sidebar9'),
        document.getElementById('medicine-sidebar8'),
        document.getElementById('medicine-sidebar7'),
        document.getElementById('medicine-sidebar6'),
        document.getElementById('medicine-sidebar5'),
        document.getElementById('medicine-sidebar3'),
        document.getElementById('medicine-sidebar2'),
        document.getElementById('medicine-sidebar1'),
 
      ],
    },
    market: {
      button: document.querySelector('button[data-category="market"]'),
      markers: [
        document.getElementById('mar-marker-button29'),
        document.getElementById('mar-marker-button28'),
        document.getElementById('mar-marker-button27'),
        document.getElementById('mar-marker-button26'),
        document.getElementById('mar-marker-button24'),
        document.getElementById('mar-marker-button23'),
        document.getElementById('mar-marker-button22'),
        document.getElementById('mar-marker-button21'),
        document.getElementById('mar-marker-button20'),
        document.getElementById('mar-marker-button18'),
        document.getElementById('mar-marker-button17'),
        document.getElementById('mar-marker-button16'),
        document.getElementById('mar-marker-button14'),
        document.getElementById('mar-marker-button13'),
        document.getElementById('mar-marker-button12'),
        document.getElementById('mar-marker-button9'),
        document.getElementById('mar-marker-button8'),
        document.getElementById('mar-marker-button7'),
        document.getElementById('mar-marker-button5'),
        document.getElementById('mar-marker-button4'),
        document.getElementById('mar-marker-button3'),
        document.getElementById('mar-marker-button2'),
        document.getElementById('mar-marker-button1'),

      ],
      sidebars: [
        document.getElementById('market-sidebar29'),
        document.getElementById('market-sidebar28'),
        document.getElementById('market-sidebar27'),
        document.getElementById('market-sidebar26'),
        document.getElementById('market-sidebar24'),
        document.getElementById('market-sidebar23'),
        document.getElementById('market-sidebar22'),
        document.getElementById('market-sidebar21'),
        document.getElementById('market-sidebar20'),
        document.getElementById('market-sidebar18'),
        document.getElementById('market-sidebar17'),
        document.getElementById('market-sidebar16'),
        document.getElementById('market-sidebar14'),
        document.getElementById('market-sidebar13'),
        document.getElementById('market-sidebar12'),
        document.getElementById('market-sidebar9'),
        document.getElementById('market-sidebar8'),
        document.getElementById('market-sidebar7'),
        document.getElementById('market-sidebar5'),
        document.getElementById('market-sidebar4'),
        document.getElementById('market-sidebar3'),
        document.getElementById('market-sidebar2'),
        document.getElementById('market-sidebar1'),

      ],
    },
    entertainment: {
      button: document.querySelector('button[data-category="entertainment"]'),
      markers: [
        document.getElementById('ent-marker-button8'),
        document.getElementById('ent-marker-button7'),
        document.getElementById('ent-marker-button6'),
        document.getElementById('ent-marker-button5'),
        document.getElementById('ent-marker-button4'),
        document.getElementById('ent-marker-button3'),
        document.getElementById('ent-marker-button2'),

      ],
      sidebars: [
        document.getElementById('entertainment-sidebar8'),
        document.getElementById('entertainment-sidebar7'),
        document.getElementById('entertainment-sidebar6'),
        document.getElementById('entertainment-sidebar5'),
        document.getElementById('entertainment-sidebar4'),
        document.getElementById('entertainment-sidebar3'),
        document.getElementById('entertainment-sidebar2'),

      ],
    },
    restaurant: {
      button: document.querySelector('button[data-category="restaurant"]'),
      markers: [
        document.getElementById('res-marker-button5'),
        document.getElementById('res-marker-button3'),
        document.getElementById('res-marker-button1'),
 
      ],
      sidebars: [
        document.getElementById('restaurant-sidebar5'),
        document.getElementById('restaurant-sidebar3'),
        document.getElementById('restaurant-sidebar1'),

      ],
    },
    service: {
      button: document.querySelector('button[data-category="service"]'),
      markers: [
        document.getElementById('ser-marker-button36'),
        document.getElementById('ser-marker-button34'),
        document.getElementById('ser-marker-button33'),
        document.getElementById('ser-marker-button32'),
        document.getElementById('ser-marker-button31'),,
        document.getElementById('ser-marker-button28'),
        document.getElementById('ser-marker-button27'),
        document.getElementById('ser-marker-button24'),
        document.getElementById('ser-marker-button23'),
        document.getElementById('ser-marker-button21'),
        document.getElementById('ser-marker-button20'),
        document.getElementById('ser-marker-button19'),
        document.getElementById('ser-marker-button14'),
        document.getElementById('ser-marker-button11'),
        document.getElementById('ser-marker-button4'),

      ],
      sidebars: [
        document.getElementById('service-sidebar36'),
        document.getElementById('service-sidebar34'),
        document.getElementById('service-sidebar33'),
        document.getElementById('service-sidebar32'),
        document.getElementById('service-sidebar31'),
        document.getElementById('service-sidebar28'),
        document.getElementById('service-sidebar27'),
        document.getElementById('service-sidebar24'),
        document.getElementById('service-sidebar23'),
        document.getElementById('service-sidebar21'),
        document.getElementById('service-sidebar20'),
        document.getElementById('service-sidebar19'),
        document.getElementById('service-sidebar14'),
        document.getElementById('service-sidebar11'),
        document.getElementById('service-sidebar4'),


      ],
    }
  }

// Начать поиск только после нажатия Enter
function handleSearch(event) {
  if (event.key === "Enter") {
    var searchText = this.value.toLowerCase();
    var found = false;

    Object.keys(categories).forEach(category => {
      categories[category].markers.forEach(marker => {
        marker.style.display = 'none';
      });
    });

    Object.keys(categories).forEach(category => {
      categories[category].sidebars.forEach((sidebar, index) => {
        if (sidebar.textContent.toLowerCase().includes(searchText)) {
          found = true;
          categories[category].markers[index].style.display = 'block';
        }
      });
    });

    if (!found) {
      // 
    }
  }
}

document.getElementById("search").addEventListener("keyup", handleSearch);

// Показ панели категории при нажатии на ее маркер на карте
categories.transport.markers.forEach(function (marker, index) {
  marker.addEventListener('click', function () { // Для ПК
    hideSidebar('transport'); 
    showSidebar('transport', index);
  });

  marker.addEventListener('touchstart', function () { // Для телефонов
    hideSidebar('transport'); 
    showSidebar('transport', index);
  });
});

categories.education.markers.forEach(function (marker, index) {
  marker.addEventListener('click', function () {
    hideSidebar('education'); 
    showSidebar('education', index);
  });
  marker.addEventListener('touchstart', function () {
    hideSidebar('education'); 
    showSidebar('education', index);
  });
});

categories.park.markers.forEach(function (marker, index) {
  marker.addEventListener('click', function () {
    hideSidebar('park'); 
    showSidebar('park', index);
  });
  marker.addEventListener('touchstart', function () {
    hideSidebar('park'); 
    showSidebar('park', index);
  });
});

categories.prom.markers.forEach(function (marker, index) {
  marker.addEventListener('click', function () {
    hideSidebar('prom'); 
    showSidebar('prom', index);
  });
  marker.addEventListener('touchstart', function () {
    hideSidebar('prom'); 
    showSidebar('prom', index);
  });
});

categories.admin.markers.forEach(function (marker, index) {
  marker.addEventListener('click', function () {
    hideSidebar('admin'); 
    showSidebar('admin', index);
  });
  marker.addEventListener('touchstart', function () {
    hideSidebar('admin'); 
    showSidebar('admin', index);
  });
});

  categories.medicine.markers.forEach(function (marker, index) {
  marker.addEventListener('click', function () {
    hideSidebar('medicine'); 
    showSidebar('medicine', index);
  });
  marker.addEventListener('touchstart', function () {
    hideSidebar('medicine'); 
    showSidebar('medicine', index);
  });
});

categories.market.markers.forEach(function (marker, index) {
  marker.addEventListener('click', function () {
    hideSidebar('market'); 
    showSidebar('market', index);
  });
  marker.addEventListener('touchstart', function () {
    hideSidebar('market'); 
    showSidebar('market', index);
  });
});

categories.entertainment.markers.forEach(function (marker, index) {
  marker.addEventListener('click', function () {
    hideSidebar('entertainment'); 
    showSidebar('entertainment', index);
  });
  marker.addEventListener('touchstart', function () {
    hideSidebar('entertainment'); 
    showSidebar('entertainment', index);
  });
});

categories.restaurant.markers.forEach(function (marker, index) {
  marker.addEventListener('click', function () {
    hideSidebar('restaurant'); 
    showSidebar('restaurant', index);
  });
  marker.addEventListener('touchstart', function () {
    hideSidebar('restaurant'); 
    showSidebar('restaurant', index);
  });
});

categories.service.markers.forEach(function (marker, index) {
  marker.addEventListener('click', function () {
    hideSidebar('service'); 
    showSidebar('service', index);
  });
  marker.addEventListener('touchstart', function () {
    hideSidebar('service'); 
    showSidebar('service', index);
  });
});

  function showCategory(category) {
    categories[category].markers.forEach(marker => {
      marker.style.display = 'block';
    });
  }

  function hideCategory(category) {
    categories[category].markers.forEach(marker => {
      marker.style.display = 'none';
    });
  }

  // Скрыть маркеры и категории при нажатии на другую кнопку категории
  function toggleCategory(category) {
    const isActive = categories[category].button.classList.contains('active');
    if (isActive) {
      hideCategory(category);
      hideSidebar(category);
      categories[category].button.classList.remove('active');
      isCarouselActive = true; 
    } else {
      showCategory(category);
      categories[category].button.classList.add('active');
      isCarouselActive = false; 
    }
    Object.keys(categories).forEach(function (key) {
      if (key !== category) {
        hideCategory(key);
        hideSidebar(key);
        categories[key].button.classList.remove('active');
      }
    });
  }

  function showSidebar(category, index) {
    categories[category].sidebars[index].classList.add('active');
  }
  
  function hideSidebar(category) {
    categories[category].sidebars.forEach(sidebar => {
      sidebar.classList.remove('active');
    });
  }

  // Показ маркеров при нажатии на кнопку категории
var isTouchDevice = 'ontouchstart' in document.documentElement;

Object.keys(categories).forEach(function (category) {
  var eventMethod = isTouchDevice ? 'touchstart' : 'click';

  categories[category].button.addEventListener(eventMethod, function () {
    toggleCategory(category);
    
    // Проверяем, является ли устройство мобильным по ширине экрана
    if (window.innerWidth <= 750) {
      // Скрываем боковую панель на мобильных устройствах
      sidebar.style.display = 'none';
    }
  });

  categories[category].markers.forEach(function (marker, index) {
    marker.addEventListener(eventMethod, function () {
      if (categories[category].button.classList.contains('active')) {
        hideSidebar(category);
        showCategory(category);
        showSidebar(category, index);
        categories[category].button.classList.add('active');

        Object.keys(categories).forEach(function (key) {
          if (key !== category) {
            hideCategory(key);
            hideSidebar(key);
            categories[key].button.classList.remove('active');
          }
        });

        // Скрываем боковую панель на мобильных устройствах
        if (window.innerWidth <= 750) {
          sidebar.style.display = 'none';
        }
      }
    });
  });
});

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('sidebar').classList.add('active');
  }, 500);
});
});
});
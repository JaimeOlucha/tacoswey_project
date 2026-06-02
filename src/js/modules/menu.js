export class MenuTabs {
  constructor() {
    this.tabs = document.querySelectorAll('.js-menu-tab');
    this.grids = document.querySelectorAll('.js-menu-grid');
  }

  init() {
    if (this._gridsEmpty()) {
      this._renderContent();
    }
    this._bindTabs();
  }

  _gridsEmpty() {
    return Array.from(this.grids).some((grid) => grid.children.length === 0);
  }

  _renderContent() {
    const menuData = {
      tacos: [
        { name: 'Taco al Pastor', desc: 'Cerdo marinado con achiote, piña asada, cilantro y cebolla', price: '$39', img: 'assets/img_tacoswey_jpg/tacos.jpg', badge: 'Más vendido' },
        { name: 'Taco de Suadero', desc: 'Carne de res confitada lentamente, cebolla y salsa verde', price: '$45', img: 'assets/img_tacoswey_jpg/picantes_tacoswey.jpg' },
        { name: 'Taco de Canasta', desc: 'Guisado tradicional en manteca — papa, chicharrón y frijoles', price: '$29', img: 'assets/img_tacoswey_jpg/tacoslove_tacoswey.jpg' },
        { name: 'Taco de Costra', desc: 'Queso gratinado, pastor y piña caramelizada', price: '$59', img: 'assets/img_tacoswey_jpg/firma-tacoswey.jpg', badge: 'Nuevo' },
        { name: 'Taco de Campechano', desc: 'Mezcla irresistible de suadero, chorizo y longaniza', price: '$49', img: 'assets/img_tacoswey_jpg/tacosllamando_tacoswey.jpeg' },
        { name: 'Taco al Carbón', desc: 'Carne asada al carbón con nopales asados y salsa roja', price: '$55', img: 'assets/img_tacoswey_jpg/comer_tacoswey.jpg' },
      ],
      entrantes: [
        { name: 'Guacamole Tradicional', desc: 'Aguacate fresco con tomate, cebolla, cilantro y limón. Acompañado de totopos', price: '$65', img: 'assets/img_tacoswey_jpg/guacamole.jpg', badge: 'Clásico' },
        { name: 'Nachos Supremos', desc: 'Totopos bañados en queso, frijoles refritos, guacamole y jalapeño', price: '$89', img: 'assets/img_tacoswey_jpg/nachos_tacoswey.jpg', badge: 'Comparte' },
        { name: 'Quesadillas de Hongos', desc: 'Hongos salteados con epazote y queso Oaxaca derretido', price: '$55', img: 'assets/img_tacoswey_jpg/comidallevar_tacoswey.jpeg' },
        { name: 'Tostadas de Ceviche', desc: 'Ceviche de camarón fresco con tostada crujiente y aguacate', price: '$69', img: 'assets/img_tacoswey_jpg/tacoscerveza_tacoswey.jpg' },
        { name: 'Sopes de Picadillo', desc: 'Sopes gruesos de maíz con picadillo, crema, queso y lechuga', price: '$49', img: 'assets/img_tacoswey_jpg/recoger_tacoswey.jpg' },
        { name: 'Elote Callejero', desc: 'Elote asado con mayonesa, queso cotija, chile y limón', price: '$35', img: 'assets/img_tacoswey_jpg/board-tacoswey.jpg' },
      ],
      postres: [
        { name: 'Flan Casero', desc: 'Flan de vainilla con cajeta y nuez caramelizada', price: '$39', img: 'assets/img_tacoswey_jpg/board-tacoswey.jpg', badge: 'Imperdible' },
        { name: 'Churros con Chocolate', desc: 'Churros crujientes bañados en azúcar con chocolate caliente', price: '$45', img: 'assets/img_tacoswey_jpg/tacoslove_tacoswey.jpg' },
        { name: 'Pastel de Tres Leches', desc: 'Bizcocho esponjoso bañado en tres leches con crema batida', price: '$49', img: 'assets/img_tacoswey_jpg/firma-tacoswey.jpg' },
        { name: 'Arroz con Leche', desc: 'Arroz cremoso con canela, pasitas y ralladura de limón', price: '$35', img: 'assets/img_tacoswey_jpg/comer_tacoswey.jpg' },
        { name: 'Tamal de Elote', desc: 'Tamal dulce de elote con crema y fresas', price: '$39', img: 'assets/img_tacoswey_jpg/recoger_tacoswey.jpg' },
        { name: 'Mango con Chile', desc: 'Mango fresco en gajos con chile piquín y limón', price: '$29', img: 'assets/img_tacoswey_jpg/picantes_tacoswey.jpg' },
      ],
      bebidas: [
        { name: 'Agua de Horchata', desc: 'Arroz, canela y vainilla. Refrescante y cremosa', price: '$35', img: 'assets/img_tacoswey_jpg/tacoscerveza_tacoswey.jpg' },
        { name: 'Michelada Clásica', desc: 'Cerveza con limón, sal, chamoy y salsa picante', price: '$59', img: 'assets/img_tacoswey_jpg/vasoconlogo-tacoswey.jpg', badge: 'Popular' },
        { name: 'Jamaica Fresca', desc: 'Flor de jamaica endulzada, servida con hielo y limón', price: '$29', img: 'assets/img_tacoswey_jpg/board-tacoswey.jpg' },
        { name: 'Margarita de la Casa', desc: 'Tequila, triple sec, limón fresco y sal de chapulín', price: '$79', img: 'assets/img_tacoswey_jpg/tacoslove_tacoswey.jpg', badge: 'Premium' },
        { name: 'Agua de Tamarindo', desc: 'Tamarindo natural con piloncillo y chile en polvo', price: '$35', img: 'assets/img_tacoswey_jpg/parallevar_tacoswey.jpg' },
        { name: 'Soda Mexicana', desc: 'Coca de vidrio, Jarritos o Sidral Mundet bien fría', price: '$25', img: 'assets/img_tacoswey_jpg/takeaway_tacoswey.jpg' },
      ],
    };

    this.grids.forEach((grid) => {
      const category = grid.dataset.category;
      const items = menuData[category];
      if (!items) return;

      grid.innerHTML = items.map((item) => `
        <article class="menu__item">
          <img class="menu__item-image" src="${item.img}" alt="${item.name}" loading="lazy">
          ${item.badge ? `<span class="menu__item-badge">${item.badge}</span>` : ''}
          <div class="menu__item-body">
            <div class="menu__item-header">
              <h3 class="menu__item-name">${item.name}</h3>
              <span class="menu__item-price">${item.price}</span>
            </div>
            <p class="menu__item-desc">${item.desc}</p>
          </div>
        </article>
      `).join('');
    });
  }

  _bindTabs() {
    this.tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        this.tabs.forEach((t) => t.classList.remove('menu__tab--active'));
        tab.classList.add('menu__tab--active');
        const target = tab.dataset.tab;
        this.grids.forEach((grid) => {
          grid.classList.toggle('menu__grid--active', grid.dataset.category === target);
        });
      });
    });
  }
}

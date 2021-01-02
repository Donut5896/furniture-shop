// variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItem = document.querySelector('.cart-item');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');



// cart 
let cart = [];



// 1.getting the products
class Products{
 async getProducts(){
    try{
        let result = await fetch('products.json');
        let data = await result.json();

        let products = data.items;
        products  = products.map(item => {
            const {title,price} = item.fields;
            const {id} = item.sys;
            const image = item.fields.image.fields.file.url;
            return {title, price, id, image}
        })
        return products
    }catch(error){
        console.log(error);
    }
  }
}

// 2.display the products
class UI{
    displayProducts(products){
     let result = '';
     products.forEach(product => {
         result += `
          <article class="product">
                <div class="img-container">
                    <img class="product-img" 
                    src="${product.image}" 
                    alt="product1">
                    <button class="bag-btn" data-id="${product.id}">
                        <i class="fa fa-shopping-cart"></i>
                        add to bag
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
          </article> `;
     });
     productsDOM.innerHTML = result;
    }
    //get bag btns
    getBagButtons(){
        //4. add to cart button
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttons.forEach(button => {
            //get data-id of products
            let id = button.dataset.id;
            // find items in the cart and check if item.id matches local.id 
            let inCart = cart.find(item => item.id === id);
        })
    }
}

//3. local storage
class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products)
        );
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI()
    const products = new Products();


    //1,2,3,4. get all products 
    products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products)
    }).then( () => {
    ui.getBagButtons();
    });


});





   
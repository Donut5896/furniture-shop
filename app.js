// variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');



// cart 
let cart = [];
//5.remove buttons in cart
let buttonsDOM = [];

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
        buttonsDOM = buttons;

        buttons.forEach(button => {
            //5.get data-id of products
            let id = button.dataset.id;
            // find items in the cart and check if item.id matches data.id 
            let inCart = cart.find(item => item.id === id);

            // disabled the add to cart button from fire twice
            if(inCart){
                button.innerText = "In Cart";
                button.disabled = true;
            }
            button.addEventListener('click', event => {
                event.target.innerText  = "In Cart";
                event.target.disabled = true;


            //6.get matches product.id from local storage
            let cartItem = {...Storage.getProduct(id), amount:1}; // add amount property
            
             // 7.add product to the cart
            cart = [...cart, cartItem];
            console.log(cart);
             //8.save cart in local storage
             Storage.saveCart(cart)
            //9.set cart value
            this.setCartValues(cart);
            //10.display cart item
            this.addCartItem(cartItem);
            //show the cart lists when adding

            });
            
        });
    
    }
     //9.set cart value
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
        
    }
    //10.display cart item
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
                    <img src=${item.image} alt="product">
                    <div>
                        <h4>${item.title}</h4>
                        <h5>$${item.price}</h5>
                        <span class="remove-item" data-id=${item.id}>remove</span>
                    </div>
                    <div>
                        <i class="fa fa-chevron-up" data-id=${item.id}></i>
                        <p class="item-amount">${item.amount}</p>
                        <i class="fa fa-chevron-down" data-id=${item.id}></i>
                    </div> `;
                     // append to div to html cartContent
                    cartContent.appendChild(div);
                    console.log( cartContent);
    }
}
   

//3. local storage
class Storage{
    static saveProducts(products){
        //change data object to string
        localStorage.setItem("products", JSON.stringify(products)
        );
    }
    static getProduct(id){
        //6. request data from localstorage and change from string to object
        let products = JSON.parse(localStorage.getItem('products'));
        //then find the product.id that matches with the passed id 
        return products.find(product => product.id === id)

    }
    //8.save cart in local storage
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
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





   
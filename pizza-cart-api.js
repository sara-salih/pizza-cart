document.addEventListener('alpine:init', () => {
  //alert("Alpine loaded...")
  Alpine.data('pizzaCartWithAPIWidget', function () {
      return {
          init() {
              //alert('Pizza cart loading...')
              // calling the API to get all the Pizzas
              //set this.pizzas
              axios
                  .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
                  .then((result) => {
                      this.pizzas = result.data.pizzas
                      this.smallPizza = this.pizzas['8'];
                      this.mediumPizza = this.pizzas[7];
                      this.largePizza = this.pizzas[4];
                  })
                  .then(() => {
                      return this.createCart();
                  })
                  .then((result) => {
                      //console.log(result.data);
                      this.cartId = result.data.cart_code;
                  });
          },
          createCart() {
              ///api/pizza-cart/create
              return axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
          },
          showCart() {
              const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;
              axios
                  .get(url)
                  .then((result) => {
                      this.cart = result.data;
                  });
          },
          pizzaImage(pizza) {
              return `/${pizza.size}.png`
          },
          message: '',
          username: 'Sara',
          pizzas: [],
          cartId: '',
          smallPizza: [],
          mediumPizza:[],
          largePizza:[],
        
          cart: { total: 0 },
          payNow: false,
          paymentAmount: 0,
          paymentMessage: '',
          add(pizza) {
              // to be able to add a pizza to the cart i need cart Id.
              const params = {
                  cart_code: this.cartId,
                  pizza_id: pizza.id
              }
              axios
                  .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
                  .then(() => {
                      this.message = "Pizza added to the cart!"
                      this.showCart();
                  })
                 
              //alert(pizza.id)
          },
          remove(pizza){
              // /api/pizza-cart/remove
              const params = {
                cart_code : this.cartId,
                pizza_id : pizza.id
              }
              axios
                .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
                .then(()=>{
                  this.message= "Pizza removed from the cart"
                  this.showCart();
                })
                
            },
            pay(pizza){
              const params = {
                cart_code : this.cartId,
              }
              axios
                .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
                .then(()=>{
                    if(!this.paymentAmount){
                        this.paymentMessage = 'No amount entered!'
                    }
                    else if(this.paymentAmount >= this.cart.total){
                        this.paymentMessage = 'Payment Sucessful!'
                        this.message= this.username  + " Paid!"
                        
                    }else{
                        this.paymentMessage = 'Sorry - that is not enough money!'
                        setTimeout(() => {
                            this.cart.total = ''
                        }, 3000);
                    }
                })
               
            },
      }
  });
})
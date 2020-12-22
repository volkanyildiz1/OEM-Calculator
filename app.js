// Storage Controller 
const StorageController=(function(){


    return{
        addProductToLS:function(newProduct){
            let products;
            if(localStorage.getItem("products")===null){
                let products=[];
                products.push(newProduct);
                localStorage.setItem("products",JSON.stringify(products));             
            }else{
                products=JSON.parse(localStorage.getItem("products"));
                products.push(newProduct);
                localStorage.setItem("products",JSON.stringify(products));
            };
            
        },
        getProducts:function(){
            let products;
            if(localStorage.getItem("products")===null){
                products=[];
            }else{
                products=JSON.parse(localStorage.getItem("products"));
            }
            return products;
        },
        updateProduct:function(updateProduct){
            let products=JSON.parse(localStorage.getItem("products"));
            products.forEach((prd,index) => {
                if(updateProduct.id==prd.id){
                    products.splice(index,1,updateProduct);
                }
            localStorage.setItem("products",JSON.stringify(products));
                
            });

        },
        deleteProduct:function(id){
            let products=JSON.parse(localStorage.getItem("products"));
            products.forEach((prd,index) => {
                if(id==prd.id){
                    products.splice(index,1);
                }
            localStorage.setItem("products",JSON.stringify(products));               
            });
        }   
    }

})();

// Product Controller 
const ProductController=(function(Storagectrl){

//private
    class Product {
      constructor(name,price) {
      this.id = Math.floor(Math.random()*1000);
      this.name = name;
      this.price = price;
    }
  };

  let data={
      products:Storagectrl.getProducts(),
      selectedProduct:null,
      totalPrice:0
  };

//public
return{
    getData:function(){
        return data;
    },
    getProducts:function(){
        return data.products;
    },
    getProductById:function(id){
        let product=null;
        data.products.forEach(prd=>{
            if(prd.id==id){
                product=prd;
            }
        });
        return product;
    },
    getTotalPrice:function(){
        let total=0;
        data.products.forEach(e => {
            total+=e.price;
        });
        data.totalPrice=total;
        return data.totalPrice;
    },
    getSelectedProduct:function(){
        return data.selectedProduct;
    },
    setSelectedProduct:function(product){
        data.selectedProduct=product;
    },
    addProduct:function(name,price){
        let newProduct=new Product(name,price);
        data.products.push(newProduct);
        return newProduct;
    },
    updateProduct:function(name,price){
        let product=null;
        data.products.forEach(prd => {
            if(prd.id==data.selectedProduct.id){
                prd.name=name;
                prd.price=parseFloat(price);
                product=prd;
            } 
        });
        return product;
    },
    deleteProduct:function(product){
        data.products.forEach((prd,index) => {
            if(prd.id==product.id){
                data.products.splice(index,1);
            };
        });

    }
    
}
})(StorageController);

// UI Controller
const UIController=(function(Productctrl){
    let Selectors={
    list:"#list",
    tr:"#list tr",
    PName:"#input_name",
    PPrice:"#input_price",
    btnAdd:"#btn_add",
    btnEdit:"#btn_edit",
    btnDelete:"#btn_delete",
    btnCancel:"#btn_cancel",
    btnSave:"#btn_save",
    cardMiddle:"#card_middle",
    totalEuro:"#total_euro",
    totalDolar:"#total_dolar"
};
    function createHTML(prd){
        let html="";
        html=`
                <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price}</td>
                <td><i class="far fa-edit" id="btn_edit"></i></td>
                </tr>`;
                document.querySelector(Selectors.list).innerHTML+=html;
    };
    return{
        createProductList:function(products){
            document.querySelector(Selectors.cardMiddle).style.display="block";
            products.forEach(prd => {
                createHTML(prd);
            });
        },
        getSelectors:function(){
            return Selectors;
        }, 
        addProductToList:function(product){
            document.querySelector(Selectors.cardMiddle).style.display="block";
            createHTML(product);
        },
        updateProduct:function(prd){
            let updateProduct=null;
            let items=document.querySelectorAll(Selectors.tr);
            items.forEach(item => {
                if(item.classList.contains("warning")){
                    item.children[1].textContent=prd.name;
                    item.children[2].textContent=prd.price;
                    updateProduct=item;
                }
            });
          this.clearWarning();
            return updateProduct;
        },
        deleteProduct:function(){
           let tr= document.querySelectorAll(Selectors.tr);
           tr.forEach(item=> {
               if(item.classList.contains("warning")){
                   item.remove();
               }
           });
           
        },
        clearInputs:function(){
            document.querySelector(Selectors.PName).value="";
            document.querySelector(Selectors.PPrice).value="";
        },
        clearWarning:function(){
            let trs=document.querySelectorAll(Selectors.tr);
            trs.forEach(tr => {
            tr.setAttribute("class","normal");   
           });
        },
        hideCard:function(){
            document.querySelector(Selectors.cardMiddle).style.display="none";
        },
        showTotalPrice:function(totalE){
            document.querySelector(Selectors.totalEuro).textContent=totalE;
            document.querySelector(Selectors.totalDolar).textContent=totalE*1.2;
        },
        addSelectedProductToForm:function(){
            document.querySelector(Selectors.PName).value=Productctrl.getData().selectedProduct.name;
            document.querySelector(Selectors.PPrice).value=Productctrl.getData().selectedProduct.price;
        },
        showAddState:function(){
            this.clearInputs();
            document.querySelector(Selectors.btnAdd).style.display="inline";
            document.querySelector(Selectors.btnSave).style.display="none";
            document.querySelector(Selectors.btnDelete).style.display="none";
            document.querySelector(Selectors.btnCancel).style.display="none";
        },
        showEditState:function(target){
           
            this.clearWarning();
            target.parentNode.parentNode.setAttribute("class","warning");
            document.querySelector(Selectors.btnAdd).style.display="none";
            document.querySelector(Selectors.btnSave).style.display="inline";
            document.querySelector(Selectors.btnDelete).style.display="inline";
            document.querySelector(Selectors.btnCancel).style.display="inline";
        }
    };
})(ProductController);

// App Controller
const App=(function(Productctrl,UIctrl,Storagectrl){
    let UISelectors=UIctrl.getSelectors();

    function loadListeners(){
        document.querySelector(UISelectors.btnAdd).addEventListener("click",addProductSubmit);
        document.querySelector(UISelectors.list).addEventListener("click",editSubmit);
        document.querySelector(UISelectors.btnSave).addEventListener("click",updateProductChanges);
        document.querySelector(UISelectors.btnCancel).addEventListener("click",cancelEditClick);
        document.querySelector(UISelectors.btnDelete).addEventListener("click",deleteProductSubmit);
    };


    function addProductSubmit(e){
        let PName=document.querySelector(UISelectors.PName).value;
        let PPrice=document.querySelector(UISelectors.PPrice).value;
        if(PName==""||PPrice==""){
            alert("Please :)))");
        }else{
            let newProduct=Productctrl.addProduct(PName,parseFloat(PPrice));
            UIctrl.addProductToList(newProduct);
            UIctrl.clearInputs();
            let totalE=Productctrl.getTotalPrice();
            UIctrl.showTotalPrice(totalE);   
            Storagectrl.addProductToLS(newProduct);
        };
        e.preventDefault();
    };

    function editSubmit(e){
        if(e.target.id==="btn_edit"){
        let id=e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        let product=Productctrl.getProductById(id);
        Productctrl.setSelectedProduct(product);
        UIctrl.addSelectedProductToForm();
        UIctrl.showEditState(e.target);
        };


    e.preventDefault();
    };
    function updateProductChanges(e){
        let PName=document.querySelector(UISelectors.PName).value;
        let PPrice=document.querySelector(UISelectors.PPrice).value;
        if(PName==""||PPrice==""){
            alert("Please :)))");
        }else{
           let updateProduct=Productctrl.updateProduct(PName,PPrice);
           UIctrl.updateProduct(updateProduct);
           let totalE=Productctrl.getTotalPrice();
           UIctrl.showTotalPrice(totalE); 
           Storagectrl.updateProduct(updateProduct);
           UIctrl.showAddState();
        }

        e.preventDefault();
    };
    function cancelEditClick(e){
        UIctrl.clearWarning();
        UIctrl.showAddState();
        e.preventDefault();
    };
    function deleteProductSubmit(e){
        let selectedProduct=Productctrl.getSelectedProduct();
        Productctrl.deleteProduct(selectedProduct);
        UIctrl.deleteProduct();
        let totalE=Productctrl.getTotalPrice();
        UIctrl.showTotalPrice(totalE); 
        if(Productctrl.getData().products.length==0){
            UIctrl.hideCard();
        };
        Productctrl.setSelectedProduct(null);
        Storagectrl.deleteProduct(selectedProduct.id);
        UIctrl.showAddState();
        e.preventDefault();
    };

    return{
        init:function(){
            console.log("Starting...");
            UIctrl.showAddState();
            let products=Productctrl.getProducts();
            if(products.length==0){
                UIctrl.hideCard();

            }else{
                UIctrl.createProductList(products);
            };
            loadListeners();
            
        }
    }
})(ProductController,UIController,StorageController);

// start..
App.init();
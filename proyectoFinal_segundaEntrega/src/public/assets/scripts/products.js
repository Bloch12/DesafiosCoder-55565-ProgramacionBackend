const btnsAddToCart = document.querySelectorAll(".btn-add-to-cart");


console.log(btnsAddToCart);
btnsAddToCart.forEach(btn => {
	btn.addEventListener('click',function() {
		const productId = this.getAttribute("data-product-id");
		fetch(`/api/carts/65161728a82873f1775ab981/products/${productId}`, {
			method: 'POST'
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
		})
	})
})
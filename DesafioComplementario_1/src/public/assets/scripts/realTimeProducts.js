const socket = io();

socket.on("products-update",data=>{
    console.log(data.msg);
    const productList = document.getElementById('products');
    productList.innerHTML = "";
	data.products.forEach(product => {
		const productItem = document.createElement('li');
		productItem.innerHTML = `
			<ul>
				<li>ID: ${product.id}</li>
				<li>Nombre: ${product.title}</li>
				<li>Precio: ${product.price}</li>
				<li>Código: ${product.code}</li>
				<li>Categoría: ${product.category}</li>
				<li>Descripción: ${product.description}</li>
				<li>Stock: ${product.stock}</li>
			</ul>
			<br>
		`;
	productList.appendChild(productItem);
    productList.appendChild(productItem);
    });
});

document.getElementById("btt").addEventListener('submit',e=>{
	e.preventDefault();
	console.log('submit');
	const title = document.getElementById('productName').value;
	const price = document.getElementById('price').value;
	const code = document.getElementById('code').value;
	const category = document.getElementById('category').value;
	const description = document.getElementById('description').value;
	const stock = document.getElementById('stock').value;
	const thumbnail = document.getElementById('thumbnail').value;
	const product = {
		title,
		price,
		code,
		category,
		description,
		stock,
		thumbnail
	};
	fetch('localhost:8080/api/products',{
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(product)
	})
	console.log(product);
});


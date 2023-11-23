export const generateProductsErrorInfo = (product) => {
	return `One or more properties were incomplete or not valid.
		List of required properties:
		* title: string - your send ${product.name}
		* price: number - your send ${product.price}
		* description: string - your send ${product.description}
		* category: string - your send ${product.category}
		* stock: number - your send ${product.stock}
		* image: string - your send ${product.image}
		* status: boolean - your send ${product.status}
		`	
}

export const addProductToCartError = (pid,cid) => {
	return `One or more properties were incomplete or not valid.
		List of required properties:
		* pid: string - your send ${pid}
		* cid: string - your send ${cid}
		`	
}


import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code : {
        type: String,
        unique: true
    },
    price : Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnail: [{
        type: String
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollection,productSchema);
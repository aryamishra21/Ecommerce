export interface ProductVariantDTO{
    sku:string;
    attributes: Record<string,string>; // { color: "Black", storage: "128GB" }
    price?:number;
    stock:number;
}
export interface ProductDTO{
    id:string;
    name:string;
    slug:string;
    description:string;
    category:string;
    brand?:string | null;
    tags:string[];
    images:string[];
    basePrice:number;
    discountPrice:number | null;
    variants:ProductVariantDTO[];
    totalStock:number;
    avgRating:number;
    numReviews:number;
    isActive:boolean;
    createdAt:string;
}
export interface CartItemDTO{
    productId:string,
    variantSku:string,
    quantity:number;
}
export interface CartDTO{
    id:string,
    userId:string,
    items:CartItemDTO,
    totalPrice:number,
    totalItems:number
}
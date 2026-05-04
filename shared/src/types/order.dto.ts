export type OrderStatus="pending"|"paid"|"processing"|"shipped"|"delivered"|"cancelled";
export type PaymentMethod="cod"| "razorpay"|"stripe";
export interface OrderItemDTO{
    productId:string,
    name:string,
    image:string,
    variantSku:string,
    attributes:Record<string,string>,
    quantity:number;
    price:number;
}
export interface OrderDTO{
    id:string;
    userId:string;
    items:OrderItemDTO[];
    totalAmount:number;
    shippingCharge:number;
    status:OrderStatus;
    paymentMethod:PaymentMethod;
    paymentStatus:"pending"|"paid"|"failed";
    addressSnapshot:any;
    createdAt:string;
}
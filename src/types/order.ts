export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "out_for_delivery" 
  | "delivered" 
  | "cancelled";

export type OrderType = "product" | "trek";

export interface ProductOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
}

export interface TrekPerson {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  foodPreference: "veg" | "non-veg" ;
  medicalConditions?: string;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderType: OrderType;
  userId: string;
  userEmail: string;
  userName: string;

  // Product order fields
  items?: ProductOrderItem[];
  deliveryAddress?: DeliveryAddress;

  // Trek order fields
  trekId?: string;
  trekName?: string;
  trekDate?: string;
  persons?: TrekPerson[];
  trekSlug?: string;

  totalAmount: number;
  status: OrderStatus;

  // Payment
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  paymentVerified: boolean;

  createdAt: string;
  updatedAt: string;
}
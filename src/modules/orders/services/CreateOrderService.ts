import { CustomerRepository } from '@modules/customers/typeorm/repositories/CustomerRepository';
import { ProductRepository } from '@modules/products/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';
import OrdersRepository from '../typeorm/repositories/OrdersRepository';

interface IProduct {
  product_id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customersRepository = getCustomRepository(CustomerRepository);
    const productsRepository = getCustomRepository(ProductRepository);

    const customerExist = await customersRepository.findById(customer_id);

    if (!customerExist) {
      throw new AppError('There is no customer with this id');
    }

    const existsProducts = await productsRepository.findByIds(products);

    if (!existsProducts.length) {
      throw new AppError('There is no products with the given ids');
    }

    const existsProductsIds = existsProducts.map(product => product.id);

    const checkInexistentsProducts = products.filter(
      product => !existsProductsIds.includes(product.product_id),
    );

    if (checkInexistentsProducts) {
      throw new AppError(
        `Could not find product ${checkInexistentsProducts[0].product_id}`,
      );
    }

    const quantityAvailable = products.filter(
      product =>
        existsProducts.filter(p => p.id === product.product_id)[0].quantity <
        product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity}
         is not available for ${quantityAvailable[0].product_id}.`,
      );
    }

    const serializedProducts = products.map(product => ({
      product_id: product.product_id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.product_id)[0].price,
    }));

    const order = await ordersRepository.createOrder({
      customer: customerExist,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await productsRepository.save(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;

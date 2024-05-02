import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  private cart: string[] = [];

  addToCart(ticketId: string): void {
    // Реализация метода добавления билета в корзину
  }

  removeFromCart(ticketId: string): void {
    // Реализация метода удаления билета из корзины
  }
}

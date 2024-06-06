export enum Errors {
  USER_EXIST = 'Пользователь с таким email или username уже зарегистрирован',
  USER_NOT_FOUND = 'Пользователь не найден',
  WRONG_DATA = 'Не верные данные',
  WISH_PROPOSED = 'Подарок был уже предложен',
  WISH_EDIT_PRICE = 'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
  WISH_EDIT_FORBIDDEN = 'Нельзя редактировать чужой подарок',
  WISH_DELETE_PROPOSED = 'Нелья удалить предложенный подарок',
  WISH_DELETE_FORBIDDEN = 'Нельзя удалить чужой подарок',
  WISH_NOT_FOUND = 'Подарок не найден',
  WISH_OWNER_REWRITE = 'Подарок уже добавлен пользователю',
  WISHLIST_DELETE_FOREIGN = 'Вы не можете удалять чужие списки подарков',
}
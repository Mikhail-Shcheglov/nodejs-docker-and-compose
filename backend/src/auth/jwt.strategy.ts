import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      /* Указываем, что токен будет передаваться в заголовке Authorization в формате Bearer <token> */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      /* Получаем секрет для подписи JWT токенов из конфигурации */
      // TODO проверить можно ли обойтись без this.configService.get - Если использовать this то выдает ошибку типизации.
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Метод validate должен вернуть данные пользователя 
   * В JWT стратегии в качестве параметра метод получает полезную нагрузку из токена
   */
  async validate(jwtPayload: { sub: User }) {
    /* В subject токена будем передавать идентификатор пользователя */
    const user = this.usersService.findOne('id', jwtPayload.sub.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
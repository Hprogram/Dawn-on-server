import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenService } from 'src/auth/token.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'apple',
    });
    this.tokenService = tokenService;
  }
  async validate(payload: any): Promise<CreateUserDto | null> {
    const { user_id } = payload;

    const user = await this.usersService.findOne(user_id);

    if (!user) {
      throw new UnauthorizedException('유효하지 않은 유저입니다.');
    }

    const accessTokenIat = this.tokenService.resolveAccessToken(
      payload.accessToken,
    );

    if (accessTokenIat === null) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    delete user.user_password;
    return user;
  }
}
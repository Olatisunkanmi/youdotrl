import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserSignInDto, UserSignUpDto } from './dto/auth.dto';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CONSTANT } from 'src/common/constants';

@Injectable()
class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async signUp({
    username,
    email,
    password,
  }: UserSignUpDto): Promise<User | void> {
    if (await this.userExists({ username, email })) {
      throw new ConflictException(CONSTANT.USERCONFLICT);
    }

    const passwordHash: string = await hash(password, 10);
    const newUser: User = await this.prisma.user.create({
      data: { email, username, passwordHash },
    });

    delete newUser.passwordHash;
    return newUser;
  }

  async signIn({
    identity,
    password,
  }: UserSignInDto): Promise<{ token: string }> {
    const user = await this.usersService.findOne(identity);
    if (!user || !(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }

  async userExists({ email, username }: { username: string; email: string }) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    return !!user;
  }
}

export default AuthService;

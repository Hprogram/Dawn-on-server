import { ForbiddenException, HttpStatus, Injectable } from "@nestjs/common";
import { Users } from "../entities/Users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { getConnection, Repository } from "typeorm";
import { bcryptConstant } from "../contants";
import { hash } from "bcrypt";
import { config } from "dotenv";

config();

const salt = process.env.SALTORROUNDS;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}
  //   private users: Users[] = []; // 데이터베이스 정보를 넣으면 됌.
  // createUserDto.user.id = req.body.user_id (타입은 컨트롤러에서 명시하였음)
  // 즉 DB안에 user_id와 req요청이 들어온 user_id가 일치하는것을 찾는 과정
  async create(createUserDto: any): Promise<any> {
    const isExistId: Users = await this.usersRepository.findOne({
      user_id: createUserDto.user_id,
    });

    const isExistNick: Users = await this.usersRepository.findOne({
      user_nickname: createUserDto.user_nickname,
    });
    if (isExistId || isExistNick) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: `이미 등록된 사용자입니다.`,
        error: `상태코드:${HttpStatus.FORBIDDEN}`,
      });
    }
    //req.body.user_pawssword(즉 req요청으로 들어온 비밀번호를 해싱하는 과정)
    createUserDto.user_password = await hash(
      createUserDto.user_password,
      Number(salt),
    );

    const { user_password, ...result }: any = await this.usersRepository.save(
      createUserDto,
    );
    return result;
  }

  findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<Users> {
    return this.usersRepository.findOne({ user_id: id });
  }

  findId(id: number): Promise<Users> {
    return this.usersRepository.findOne({ id: id });
  }

  async update(user_PK: number, req: any): Promise<any> {
    // console.log(req.body);
    const {
      user_nickname,
      user_img,
      user_job,
      user_password,
      profile_comment,
    }: any = req.body;
    const newUsers: Users = await this.usersRepository.findOne({
      id: user_PK,
    });
    // console.log("userNick:", user_nickname);

    if (user_nickname !== "") {
      const findNickName: Users[] = await this.usersRepository.find({
        user_nickname: user_nickname,
      });
      //console.log(findNickName);

      if (findNickName !== undefined) {
        newUsers.user_nickname = user_nickname;
      } else {
        return false;
      }
    }

    if (user_img !== "") {
      newUsers.user_img = user_img;
    }
    if (user_job !== "") {
      newUsers.user_job = user_job;
    }

    if (profile_comment !== "") {
      newUsers.profile_comment = profile_comment;
    }
    if (user_password !== "") {
      newUsers.user_password = await hash(user_password, Number(salt));
    }

    const userData: Users = await this.usersRepository.save(newUsers);

    return userData;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}

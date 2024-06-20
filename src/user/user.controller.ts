import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Header,
  HttpCode,
  Redirect,
  HttpRedirectResponse,
  Res, Req, Inject, UseFilters, HttpException, ParseIntPipe, Body, UsePipes, UseInterceptors, UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { Connection } from './connection/connection';
import { MailService } from './mail/mail.service';
import { UserRepository } from './user-repository/user-repository';
import { MemberService } from './member/member.service';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { ValidationFilter } from '../validation/validation.filter';
import { LoginUserRequest, loginUserRequestValidation } from '../model/login-model';
import { ValidationPipe } from '../validation/validation.pipe';
import { TimeInterceptor } from '../time/time.interceptor';
import { Auth } from '../auth/auth.decorator';
import { RoleGuard } from '../role/role.guard';
import { Roles } from '../role/role.decorator';

@Controller('/api/users')
@UseGuards(RoleGuard)
export class UserController {
  constructor(
    private service: UserService,
    private connection: Connection,
    private mailService: MailService,
    private userRepository: UserRepository,
    @Inject('EmailService') private emailService: MailService,
    private memberService: MemberService,
    private configService: ConfigService,
  ) {}

  @Get('/current')
  @Roles(['admin', 'operator'])
  current(@Auth() user: User): any {
    return {
      data: `Hello ${user.first_name}`,
    }
  }

  @Post('/login')
  @UseFilters(ValidationFilter)
  @UsePipes(new ValidationPipe(loginUserRequestValidation))
  @Header('Content-Type', 'application/json')
  @UseInterceptors(TimeInterceptor)
  login(@Query('name') name: string, @Body() request: LoginUserRequest) {
    return {
      data: `Hello ${request.username}`
    };
  }

  @Get("/connection")
  async getConnection(): Promise<string> {
    this.mailService.send();
    this.emailService.send();
    console.log(this.memberService.getConnectionName());
    this.memberService.sendEmail();
    console.log(this.configService.get('APP_NAME'));
    return this.connection.getName();
  }

  @Get("/create")
  async create(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string,
  ): Promise<User> {
    if (!firstName) {
      throw new HttpException({
        code: 400,
        errors: 'firstName is required',
      }, 400);
    }
    return await this.userRepository.save(firstName, lastName);
  }

  @Get("/hello")
  // @UseFilters(ValidationFilter)
  async sayHello(
    @Query('name') name: string
  ): Promise<string> {
    return this.service.sayHello(name);
  }

  @Post()
  post(): string {
    return "POST";
  }

  @Get("/sample")
  get(): string {
    return "GET";
  }

  @Get('/response-json')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  responseJson(): Record<string, string> {
    return {
      data: 'Hello From Response Json!',
    }
  }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: '/api/users/hello?first_name=Aditya&last_name=Ricki',
      statusCode: 200
    };
  }

  @Get('/set-cookie')
  setCookie(@Query('name') name: string, @Res() response: Response) {
    response.cookie('name', name);
    response.status(200).send('Success Set Cookie');
  }

  @Get('/get-cookie')
  getCookie(@Req() request: Request) {
    return request.cookies['name'];
  }

  @Get('/view')
  view(@Query('name') name: string, @Res() response: Response) {
    response.render('index.html', {
      title: 'Template Engine',
      name: name
    });
  }

  @Get("/:id")
  getById(@Param('id', ParseIntPipe) id: number): string {
    return `GET ${id}`;
  }
}

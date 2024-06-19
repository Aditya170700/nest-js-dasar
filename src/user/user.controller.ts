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
  Res, Req, Inject,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import { Connection } from './connection/connection';
import { MailService } from './mail/mail.service';
import { UserRepository } from './user-repository/user-repository';

@Controller('/api/users')
export class UserController {
  constructor(
    private service: UserService,
    private connection: Connection,
    private mailService: MailService,
    private userRepository: UserRepository,
    @Inject('EmailService') private emailService: MailService,
  ) {}

  @Get("/connection")
  async getConnection(): Promise<string> {
    this.mailService.send();
    this.userRepository.save();
    this.emailService.send();
    return this.connection.getName();
  }

  @Get("/hello")
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
  getById(@Param('id') id: string): string {
    return `GET ${id}`;
  }
}

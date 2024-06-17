import { Controller, Get, Param, Post, Query, Header, HttpCode, Redirect, HttpRedirectResponse } from '@nestjs/common';

@Controller('/api/users')
export class UserController {
  @Post()
  post(): string {
    return "POST";
  }

  @Get("/sample")
  get(): string {
    return "GET";
  }

  @Get("/hello")
  async sayHello(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string
  ): Promise<string> {
    return `Hello ${firstName} ${lastName}`;
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

  @Get("/:id")
  getById(@Param('id') id: string): string {
    return `GET ${id}`;
  }
}

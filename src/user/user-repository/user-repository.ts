import { Injectable } from '@nestjs/common';
import { Connection } from '../connection/connection';

export class UserRepository {
  connection: Connection;

  save() {
    console.log(`Save iser with connection ${this.connection.getName()}`);
  }
}

export function createUserRepository(connection: Connection): UserRepository {
  const repository = new UserRepository();
  repository.connection = connection;

  return repository;
}

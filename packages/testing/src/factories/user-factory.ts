import { faker } from '@faker-js/faker';
import type { User, UserRole } from '@alzahra/types';

export class UserFactory {
  static create(overrides?: Partial<User>): User {
    const now = new Date();
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      passwordHash: faker.string.alphanumeric(60),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      role: 'guest' as UserRole,
      avatarUrl: faker.image.avatar(),
      emailVerified: faker.datatype.boolean(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      ...overrides,
    };
  }

  static admin(overrides?: Partial<User>): User {
    return this.create({
      role: 'admin',
      emailVerified: true,
      ...overrides,
    });
  }

  static propertyManager(overrides?: Partial<User>): User {
    return this.create({
      role: 'owner',
      emailVerified: true,
      ...overrides,
    });
  }

  static staff(overrides?: Partial<User>): User {
    return this.create({
      role: 'staff',
      emailVerified: true,
      ...overrides,
    });
  }

  static guest(overrides?: Partial<User>): User {
    return this.create({
      role: 'guest',
      ...overrides,
    });
  }
}

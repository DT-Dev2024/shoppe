import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';
import * as crypto from 'crypto';
describe('HashService', () => {
  let service: HashService;
  const len = Math.floor(Math.random() * 64) + 8;
  const random = crypto.randomBytes(len).toString();
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
  });
  describe('root', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('hash function', () => {
    it('should return hashed string', () => {
      const hashed = service.hash(random);
      expect(typeof hashed).toBe('string');
    });
  });

  describe('check function', () => {
    it('should return truthy status', () => {
      const hashed = service.hash(random);
      expect(service.check(random, hashed)).toBeTruthy();
    });

    it('should return falsy status', () => {
      const hashed = service.hash(random);
      expect(service.check(`_sabotage_chain_${random}`, hashed)).toBeFalsy();
    });
  });
});

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
export const ApiDecorator = createParamDecorator(
  (key: string, context: ExecutionContext): boolean => {
    const request = context.switchToHttp().getRequest();

    return (
      request.headers[key] &&
      request.headers[key] === configService.get('X_API_KEY')
    );
  },
);

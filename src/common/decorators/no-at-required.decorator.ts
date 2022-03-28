import { SetMetadata } from '@nestjs/common';

export const NO_AT_REQUIRED_KEY = 'noAtRequired';

export const NoAtRequired = () => SetMetadata(NO_AT_REQUIRED_KEY, true);

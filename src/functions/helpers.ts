import { extname } from 'node:path';

export const withoutExtension = (_file: string) => {
  const extension = extname(_file);
  const file = _file.slice(0, _file.length - extension.length);

  return {
    file,
    extension,
  };
};

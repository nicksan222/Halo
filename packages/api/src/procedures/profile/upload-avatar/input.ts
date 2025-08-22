import { z } from 'zod';

// tRPC v11 parses multipart/form-data into a FormData instance automatically
export const uploadAvatarInput = z.custom<FormData>((v) => v instanceof FormData, {
  message: 'Expected FormData'
});

export type UploadAvatarInput = FormData;

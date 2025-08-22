import { router } from '../../trpc';
import { uploadAvatarRouter } from './upload-avatar';

export const profileRouter = router({
  uploadAvatar: uploadAvatarRouter
});

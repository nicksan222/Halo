import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './input-otp';

export default {
  title: 'Components/InputOTP',
  component: InputOTP,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <label htmlFor="otp-default" className="text-sm font-medium">
        Enter your verification code
      </label>
      <InputOTP id="otp-default" maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  </div>
);

export const WithSeparator = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <label htmlFor="otp-separator" className="text-sm font-medium">
        Enter your verification code
      </label>
      <InputOTP id="otp-separator" maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSeparator />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  </div>
);

export const FourDigits = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <label htmlFor="otp-four" className="text-sm font-medium">
        Enter 4-digit code
      </label>
      <InputOTP id="otp-four" maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  </div>
);

export const EightDigits = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <label htmlFor="otp-eight" className="text-sm font-medium">
        Enter 8-digit code
      </label>
      <InputOTP id="otp-eight" maxLength={8}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSeparator />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
          <InputOTPSlot index={6} />
          <InputOTPSlot index={7} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  </div>
);

export const Disabled = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <label htmlFor="otp-disabled" className="text-sm font-medium">
        Disabled OTP Input
      </label>
      <InputOTP id="otp-disabled" maxLength={6} disabled>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  </div>
);

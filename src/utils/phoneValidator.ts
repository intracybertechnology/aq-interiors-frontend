export interface PhoneValidationResult {
  isValid: boolean;
  message: string;
  formatted?: string;
}

export const validateUAEPhone = (phone: string): PhoneValidationResult => {
  if (!phone || phone.trim() === '') {
    return {
      isValid: true,
      message: '',
    };
  }
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');

  if (cleaned.startsWith('+971')) {
    const number = cleaned.substring(4);

    if (/^5[0-8][0-9]{7}$/.test(number)) {
      return {
        isValid: true,
        message: 'Valid UAE mobile number',
        formatted: `+971 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`,
      };
    }

    if (/^[2-9][0-9]{6,7}$/.test(number)) {
      return {
        isValid: true,
        message: 'Valid UAE landline number',
        formatted: `+971 ${number.substring(0, 1)} ${number.substring(1)}`,
      };
    }

    return {
      isValid: false,
      message: 'Invalid UAE phone number format',
    };
  }

  if (cleaned.startsWith('0')) {

    if (/^05[0-8][0-9]{7}$/.test(cleaned)) {
      return {
        isValid: true,
        message: 'Valid UAE mobile number',
        formatted: `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`,
      };
    }


    if (/^0[2-9][0-9]{6,7}$/.test(cleaned)) {
      return {
        isValid: true,
        message: 'Valid UAE landline number',
        formatted: `${cleaned.substring(0, 2)} ${cleaned.substring(2)}`,
      };
    }

    return {
      isValid: false,
      message: 'Invalid UAE phone number. Mobile should be 05X XXX XXXX (9 digits), landline should be 0X XXX XXXX',
    };
  }


  if (/^5[0-8][0-9]{7}$/.test(cleaned)) {
    return {
      isValid: true,
      message: 'Valid UAE mobile number',
      formatted: `0${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5)}`,
    };
  }


  if (/^\d+$/.test(cleaned)) {
    return {
      isValid: false,
      message: 'Invalid phone number length. UAE mobile: 9 digits (05X XXX XXXX), landline: 7-8 digits (0X XXX XXXX)',
    };
  }

  return {
    isValid: false,
    message: 'Invalid phone number format. Please use UAE format (e.g., 050 123 4567 or +971 50 123 4567)',
  };
};


export const formatUAEPhone = (phone: string): string => {
  const result = validateUAEPhone(phone);
  return result.formatted || phone;
};


export const getPhoneExample = (): string => {
  return '050 123 4567 or +971 50 123 4567';
};
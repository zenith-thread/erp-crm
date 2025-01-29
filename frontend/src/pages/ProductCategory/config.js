import color from '@/utils/color';

export const fields = {
  name: {
    type: 'stringWithColor',
    required: true,
  },
  description: {
    type: 'textarea',
    required: false,
  },
  color: {
    type: 'color',
    options: [...color],
    required: false,
  },
  enabled: {
    type: 'boolean',
    required: false,
    default: true,
  },
};

import { extend } from 'vee-validate';
import { required, email, min, regex, max } from 'vee-validate/dist/rules';

export default function({ app }) {
  const i18n = app.i18n;

  extend('required', {
    ...required,
    message: i18n.t('app.validation.required')
  });

  extend('email', {
    ...email,
    message: i18n.t('app.validation.email')
  });

  extend('password', {
    params: ['target'],
    validate(value, { target }) {
      return value === target;
    },
    message: i18n.t('app.validation.password_match')
  });

  extend('min', {
    ...min,
    message: i18n.t('app.validation.min')
  });

  extend('max', {
    ...max,
    message: i18n.t('app.validation.max')
  });

  extend('regex', {
    ...regex,
    message: i18n.t('app.validation.url')
  });
}

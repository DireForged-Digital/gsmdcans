export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      1,
      'always',
      [
        'app',
        'schedule',
        'events',
        'results',
        'admin',
        'push',
        'firebase',
        'functions',
        'web',
        'a11y',
        'ci',
        'deps',
        'sdk',
        'docs',
        'claude',
      ],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
  },
};

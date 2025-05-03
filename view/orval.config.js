module.exports = {
  file: {
    input: '../../openapi/openapi.yaml',
    output: {
      target: './src/generated/hooks.ts',
      schemas: './src/generated/model',
      client: 'swr',
      httpClient: 'fetch',
      override: {
        mutator: {
          path: './src/mutator/custom-instance.ts',
          name: 'customFetch',
        },
      },
    },
  },
};

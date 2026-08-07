# Web Template

## How to install and use Tailwindcss

To make the Tailwindcss works with babel configured in the current setup,
we need to have the following packages installed:

```bash
# postcss-loader is trigger by babel
npm install --save-dev @tailwindcss/postcss postcss postcss-loader tailwindcss
```

Add postcss.config.js
```js
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Add the ``postcss-loader`` into webpack:
```js
module: {
  rules = [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    },
  ]
}
```

### To begin with this file you should have this file on root:
```
input-example.json
```
### To start this project you can run:
```
npm run dev
```
#### Or
```
yarn dev
```
### The result will be print out as
```
console.log
```
#### and
```
output.json
```
### Else there's some error on the input-example.json that restricted to
1. Buyer name must be unique
2. Item name must be unique
3. Item price should contain "Regular" price
4. Item price depends on Buyer type (default price change to Regular price whenever Item Price type has no spesific Buyer type)
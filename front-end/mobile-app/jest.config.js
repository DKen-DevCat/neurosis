/* eslint-disable no-useless-escape */
module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!(?:@?react-native|react-native-vector-icons|expo|@expo)/)"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.css$": "<rootDir>/__mocks__/styleMock.js", 
  },
};
/* eslint-enable no-useless-escape */
const dictionary = {
  String: {
    transform: ["str"],
    validation: {
      str: true,
    },
  },
  Int: {
    transform: ["int"],
    validation: {
      number: true,
    },
  },
  BigInt: {
    transform: ["int"],
    validation: {
      number: true,
    },
  },
  Float: {
    transform: ["float"],
    validation: {
      number: true,
    },
  },
  Decimal: {
    transform: [],
    validation: {
      number: true,
    },
  },
  Boolean: {
    transform: [],
    validation: {
      bool: true,
    },
  },
  DateTime: {
    transform: ["dateTime"],
    validation: {
      dateTime: true,
    },
  },
  Bytes: {
    transform: [],
    validation: {},
  },
  Json: { transform: [], validation: {} },
};

export default dictionary;

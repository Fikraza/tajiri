const header = require("../header");

function getRequest({ modelName, item }) {
  let getById = {
    name: `ById ${modelName}`,
    request: {
      method: "GET",
      header,
      url: {
        raw: `{{local}}/scheme/${modelName}`,
        host: `{{local}}`,
        path: ["scheme", modelName],
        params: {
          id: "",
        },
      },
    },
  };

  item.push(getById);
}

module.exports = getRequest;
